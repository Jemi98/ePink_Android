const Utils = require('../cubeInternalUtils'),
  ChatUtils = require('./cubeChatInternalUtils');

class StreamManagementService {
  constructor() {
    this._NS = 'urn:xmpp:sm:3';

    this._isStreamManagementEnabled = false;

    // Counter of the incoming stanzas
    this._clientProcessedStanzasCounter = 0;
    // The client send stanza counter.
    this._clientSentStanzasCounter = 0;

    this.sentMessageCallback = null;

    this._lastAck = 0;

    // connection
    this._xmppClient = null;

    // Original connection.send method
    this._originalSend = null;

    // In progress stanzas queue
    this._unackedQueue = [];

    this._incomingStanzaHandler = (stanza) => {
      let tagName = stanza.name || stanza.tagName || stanza.nodeTree.tagName;
  
      if (tagName === 'enabled') {
        this._isStreamManagementEnabled = true;
        return;
      }
  
      if (ChatUtils.getAttr(stanza, 'xmlns') !== this._NS) {
        this._increaseReceivedStanzasCounter();
      }
  
      if (tagName === 'r') {
        let params = {
          xmlns: this._NS,
          h: this._clientProcessedStanzasCounter
        },
          answerStanza = ChatUtils.createNonza('a', params);
  
        this._originalSend.call(this._xmppClient, answerStanza);
        return;
      }
  
      if (tagName === 'a') {
        const h = parseInt(ChatUtils.getAttr(stanza, 'h'));
        this._checkCounterOnIncomeStanza(h);
      }
    }
  }

  enable(connection) {
    let enableParams = {
      xmlns: this._NS
    };

    if (!this._isStreamManagementEnabled) {
      this._xmppClient = connection;
      this._originalSend = this._xmppClient.send;
      this._xmppClient.send = this.send.bind(this);
    }

    this._clientProcessedStanzasCounter = 0;
    this._clientSentStanzasCounter = 0;
    this._lastAck = 0;

    this._removeElementHandler();
    this._addElementHandler();

    const stanza = ChatUtils.createNonza('enable', enableParams);

    this._xmppClient.send(stanza);
  }

  _removeElementHandler() {
    this._xmppClient.removeListener('element', this._incomingStanzaHandler);
  }

  _addElementHandler() {
    this._xmppClient.on('element', this._incomingStanzaHandler);
  }

  send(stanza, message) {
    let tagName = stanza.name || stanza.tagName || stanza.nodeTree.tagName,
      type = ChatUtils.getAttr(stanza, 'type'),
      bodyContent = ChatUtils.getElementText(stanza, 'body') || '',
      attachments = ChatUtils.getAllElements(stanza, 'attachment') || '';

    this._originalSend.call(this._xmppClient, stanza);

    if (tagName === 'message' && (type === 'chat' || type === 'groupchat') && (bodyContent || attachments.length)) {
      this._sendStanzasRequest({
        message: message,
        expect: this._clientSentStanzasCounter
      });
    }

    ++this._clientSentStanzasCounter;
  }

  _sendStanzasRequest(data) {
    if (this._isStreamManagementEnabled) {
      this._unackedQueue.push(data);

      const stanza = ChatUtils.createNonza('r', { xmlns: this._NS });

      this._originalSend.call(this._xmppClient, stanza);
    }
  }

  getClientSentStanzasCounter() {
    return this._clientSentStanzasCounter;
  }

  _checkCounterOnIncomeStanza(h) {
    const numAcked = h - this._lastAck;

    Utils.DLog('[Chat][SM][_checkCounterOnIncomeStanza]', numAcked, h, this._lastAck);

    for (let i = 0; i < numAcked && this._unackedQueue.length > 0; i++) {
      this.sentMessageCallback(null, this._unackedQueue.shift().message);
    }

    this._lastAck = h;
  }

  _increaseReceivedStanzasCounter() {
    ++this._clientProcessedStanzasCounter;
  }
}

module.exports = StreamManagementService;
