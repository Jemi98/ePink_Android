const Config = require('../cubeConfig'),
  Utils = require('../cubeInternalUtils'),
  ChatUtils = require('./cubeChatInternalUtils'),
  ChatHelpers = require('./cubeChatHelpers'),
  StreamManagement = require('./cubeStreamManagement'),
  ContactListProxy = require('./cubeContactList'),
  PrivacyListProxy = require('./cubePrivacyList'),
  MucProxy = require('./cubeMultiUserChat'),
  XMPPClient = require('../cubeDependencies').XMPPClient;

class ChatService {
  constructor(proxy) {
    this.proxy = proxy

    this.xmppClient = XMPPClient.client({
      service: Config.chatProtocol.websocket,
      credentials: (auth, mechanism) => {
        const crds = {
          username: this.xmppClient.options.username,
          password: this.xmppClient.options.password
        };
        return auth(crds);
      }
    });

    this.webrtcSignalingProcessor = null;

    this.stanzasCallbacks = {};
    this.earlyIncomingMessagesQueue = [];

    this.isConnected = false;
    this._isConnecting = false;
    this._isLogout = false;
    this._isReconnect = false;
    
    this._checkPingTimer = undefined;

    this.helpers = new ChatHelpers();

    this.xmppClientListeners = [];

    this.connectPromise = null;

    // Chat additional modules
    var options = {
      xmppClient: this.xmppClient,
      helpers: this.helpers,
      stanzasCallbacks: this.stanzasCallbacks
    };

    this.contactList = new ContactListProxy(options);
    this.privacylist = new PrivacyListProxy(options);
    this.muc = new MucProxy(options);

    if (Config.chat.streamManagement.enable) {
      if (Config.chatProtocol.active === 2) {
        this.streamManagement = new StreamManagement();
        this._sentMessageCallback = (messageLost, messageSent) => {
          if (typeof this.onSentMessageCallback === 'function') {
            if (messageSent) {
              this.onSentMessageCallback(null, messageSent);
            } else {
              this.onSentMessageCallback(messageLost);
            }
          }
        };
      }
    }

    if (Config.chat.reconnect.enable || Config.chat.reconnectionTimeInterval > 0) {
      this.xmppClient.reconnect.delay = Config.chat.reconnect.timeInterval * 1000 ||
        Config.chat.reconnectionTimeInterval * 1000 ||
        5000;
    }
  }

  get connectionStatus() {
    return this.xmppClient.status;
  }

  connect(params) {
    this.connectPromise = new Promise((resolve, reject) => {
      Utils.DLog('[Chat]', 'Connect with parameter:', params);

      if (this._isConnecting) {
        Utils.DLog('[Chat]', 'Warning! Already in CONNECTING state');
        resolve();
        return;
      }

      if (this.isConnected) {
        Utils.DLog('[Chat]', 'Warning! Chat is already connected!');
        resolve();
        return;
      }

      this._isConnecting = true;
      this._isLogout = false;

      // remove all old listeners
      this.xmppClientListeners.forEach((listener) => {
        this.xmppClient.removeListener(listener.name, listener.callback);
      });

      const callbackConnect = () => {
        Utils.DLog('[Chat]', this._isReconnect ? 'RECONNECTING' : 'CONNECTING');
      };

      this.xmppClient.on('connect', callbackConnect);
      this.xmppClientListeners.push({ name: 'connect', callback: callbackConnect });

      const callbackOnline = (jid) => {
        Utils.DLog('[Chat]', 'ONLINE');
        this.startPingTimer();
        this._postConnectActions();
        resolve();
        this.connectPromise = null;
      };
      this.xmppClient.on('online', callbackOnline);
      this.xmppClientListeners.push({ name: 'online', callback: callbackOnline });

      const callbackOffline = () => {
        Utils.DLog('[Chat]', 'OFFLINE');
      };
      this.xmppClient.on('offline', callbackOffline);
      this.xmppClientListeners.push({ name: 'offline', callback: callbackOffline });

      const callbackDisconnect = () => {
        Utils.DLog('[Chat]', 'DISCONNECTED');

        if (typeof this.onDisconnectedListener === 'function') {
          Utils.safeCallbackCall(this.onDisconnectedListener);
        }

        if (Config.chat.reconnect.enable) {
          this.isConnected = false;
          this._isConnecting = false;
        } else {
          this.disconnect();
        }

        this.stopPingTimer();
      };
      this.xmppClient.on('disconnect', callbackDisconnect);
      this.xmppClientListeners.push({ name: 'disconnect', callback: callbackDisconnect });

      const callbackStatus = (status, value) => {
        Utils.DLog('[Chat]', `status - ${status}`, typeof value === 'object' ? JSON.stringify(value) : '');

        if (typeof this.onChatStatusListener === 'function') {
          /* 
           * "online" - indicates that xmpp is authenticated and addressable
           * "offline" - indicates that xmpp disconnected and no automatic attempt to reconnect will happen (after calling xmpp.stop())
           * "connecting" - socket is connecting
           * "connect" - socket is connected
           * "opening" - stream is opening
           * "open" - stream is open
           * "closing" - stream is closing
           * "close" - stream is closed
           * "disconnecting" - socket is disconnecting
           * "disconnect" - socket is disconnected
           */
          Utils.safeCallbackCall(this.onChatStatusListener, status);
        }
      };
      this.xmppClient.on('status', callbackStatus);
      this.xmppClientListeners.push({ name: 'status', callback: callbackStatus });

      const callbackStanza = stanza => {
        // it can be a case,
        // when message came after xmpp auth but before resource bindging,
        // and it can cause some crashes, e.g.
        // https://github.com/ConnectyCube/connectycube-js-sdk-releases/issues/28
        if (stanza.is('message') && !this.isConnected) {
          this.earlyIncomingMessagesQueue.push(stanza);
          Utils.DLog('[Chat]', "on 'stanza': enqueue incoming stanza (isConnected=false)");
          return;
        }

        // console.log('stanza', stanza.toString())
        // after 'input' and 'element' (only if stanza, not nonza)
        if (stanza.is('presence')) {
          this._onPresence(stanza);
        } else if (stanza.is('iq')) {
          this._onIQ(stanza);
        } else if (stanza.is('message')) {
          if (stanza.attrs.type === 'headline') {
            this._onSystemMessageListener(stanza);
          } else if (stanza.attrs.type === 'error') {
            this._onMessageErrorListener(stanza);
          } else {
            this._onMessage(stanza);
          }
        }
      };
      this.xmppClient.on('stanza', callbackStanza);
      this.xmppClientListeners.push({ name: 'stanza', callback: callbackStanza });

      const callbackError = err => {
        Utils.DLog('[Chat]', 'ERROR:', err, {_isReconnect: this._isReconnect, connectPromise: !!this.connectPromise});

        if (this.connectPromise) {
          if (!this._isReconnect) {
            if (err.name == 'SASLError') {
              err = err.condition;
            }
            reject(err);
            this.connectPromise = null;
          }
        } else {
          if (typeof this.onConnectionErrorListener === 'function') {
            Utils.safeCallbackCall(this.onConnectionErrorListener, err);
          }
        }
      };
      this.xmppClient.on('error', callbackError);
      this.xmppClientListeners.push({ name: 'error', callback: callbackError });

      const callbackOutput = str => {
        Utils.callTrafficUsageCallback('xmppDataWrite', { body: str })
        Utils.DLog('[Chat]', 'SENT:', str);
      };
      this.xmppClient.on('output', callbackOutput);
      this.xmppClientListeners.push({ name: 'output', callback: callbackOutput });

      const callbackInput = str => {
        Utils.callTrafficUsageCallback('xmppDataRead', { body: str })
        Utils.DLog('[Chat]', 'RECV:', str);
      };
      this.xmppClient.on('input', callbackInput);
      this.xmppClientListeners.push({ name: 'input', callback: callbackInput });

      // save user connection data so they will be used when authenticate (above)
      this.xmppClient.options.username = ChatUtils.buildUserJidLocalPart(params.userId);
      this.xmppClient.options.password = params.password;
      // start connect
      this.xmppClient.start().catch(err => {
        console.error("[Chat] xmppClient.start error", err);
        if (this.connectPromise) {
          reject(err);
          this.connectPromise = null;
        } else {
          if (typeof this.onConnectionErrorListener === 'function') {
            Utils.safeCallbackCall(this.onConnectionErrorListener, err);
          }  
        }
      })
    });

    return this.connectPromise;
  }

  /**
   * @deprecated since version 2.0
   */
  getContacts() {
    return new Promise((resolve, reject) => {
      this.contactList.get().then(contacts => {
        this.contactList.contacts = contacts;
        resolve(contacts);
      }).catch(error => {
        reject(reject);
      });
    });
  }

  ping() {
    return new Promise((resolve, reject) => {
      const iqParams = {
        id: ChatUtils.getUniqueId('ping'),
        to: Config.endpoints.chat,
        type: 'get'
      };

      const iqStanza = ChatUtils.createIqStanza(iqParams);

      iqStanza
        .c('ping', {
          xmlns: 'urn:xmpp:ping'
        });

      this.stanzasCallbacks[iqParams.id] = stanza => {
        const error = ChatUtils.getElement(stanza, 'error');
        if (error) {
          reject(ChatUtils.buildErrorFromXMPPErrorStanza(error));
        } else {
          resolve();
        }
      };

      this.xmppClient.send(iqStanza);
    });
  }

  startPingTimer() {
    this.stopPingTimer();
    
    if (Config.chat.ping.enable) {
      // Min time interval between pings is 30 seconds.
      const validTime = Config.chat.ping.timeInterval < 30 ? 30 : Config.chat.ping.timeInterval;

      this._checkPingTimer = setInterval(() => {
        this.ping();
      }, validTime * 1000);
    }
  };

  stopPingTimer() {
    if (this._checkPingTimer) {
      clearInterval(this._checkPingTimer);
      this._checkPingTimer = null;
    }
  };

  send(jidOrUserId, message) {
    const stanzaParams = {
      from: this.helpers.getUserCurrentJid(),
      to: this.helpers.jidOrUserId(jidOrUserId),
      type: message.type ? message.type : this.helpers.typeChat(jidOrUserId),
      id: message.id ? message.id : Utils.getBsonObjectId()
    };

    let messageStanza = ChatUtils.createMessageStanza(stanzaParams);

    if (message.body) {
      messageStanza
        .c('body')
        .t(message.body)
        .up();
    }

    if (message.markable) {
      messageStanza
        .c('markable', {
          xmlns: 'urn:xmpp:chat-markers:0'
        })
        .up();
    }

    if (message.extension) {
      messageStanza.c('extraParams', {
        xmlns: 'jabber:client'
      });

      messageStanza = ChatUtils.filledExtraParams(messageStanza, message.extension);
    }

    if (Config.chat.streamManagement.enable) {
      message.id = stanzaParams.id;
      this.xmppClient.send(messageStanza, message);
    } else {
      this.xmppClient.send(messageStanza);
    }

    return stanzaParams.id;
  }

  sendSystemMessage(jidOrUserId, message) {
    const stanzaParams = {
      type: 'headline',
      id: message.id ? message.id : Utils.getBsonObjectId(),
      to: this.helpers.jidOrUserId(jidOrUserId)
    };

    let messageStanza = ChatUtils.createMessageStanza(stanzaParams);

    if (message.body) {
      messageStanza
        .c('body')
        .t(message.body)
        .up();
    }

    // custom parameters
    if (message.extension) {
      messageStanza
        .c('extraParams', {
          xmlns: 'jabber:client'
        })
        .c('moduleIdentifier')
        .t('SystemNotifications')
        .up();

      messageStanza = ChatUtils.filledExtraParams(messageStanza, message.extension);
    }

    this.xmppClient.send(messageStanza);

    return stanzaParams.id;
  }

  sendIsTypingStatus(jidOrUserId) {
    const stanzaParams = {
      from: this.helpers.getUserCurrentJid(),
      to: this.helpers.jidOrUserId(jidOrUserId),
      type: this.helpers.typeChat(jidOrUserId)
    };

    const messageStanza = ChatUtils.createMessageStanza(stanzaParams);

    messageStanza.c('composing', {
      xmlns: 'http://jabber.org/protocol/chatstates'
    });

    this.xmppClient.send(messageStanza);
  }

  sendIsStopTypingStatus(jidOrUserId) {
    const stanzaParams = {
      from: this.helpers.getUserCurrentJid(),
      to: this.helpers.jidOrUserId(jidOrUserId),
      type: this.helpers.typeChat(jidOrUserId)
    };

    const messageStanza = ChatUtils.createMessageStanza(stanzaParams);

    messageStanza.c('paused', {
      xmlns: 'http://jabber.org/protocol/chatstates'
    });

    this.xmppClient.send(messageStanza);
  }

  sendDeliveredStatus(params) {
    const stanzaParams = {
      type: 'chat',
      from: this.helpers.getUserCurrentJid(),
      id: Utils.getBsonObjectId(),
      to: this.helpers.jidOrUserId(params.userId)
    };

    const messageStanza = ChatUtils.createMessageStanza(stanzaParams);
    messageStanza
      .c('received', {
        xmlns: 'urn:xmpp:chat-markers:0',
        id: params.messageId
      })
      .up();
    messageStanza
      .c('extraParams', {
        xmlns: 'jabber:client'
      })
      .c('dialog_id')
      .t(params.dialogId);

    this.xmppClient.send(messageStanza);
  }

  sendReadStatus(params) {
    const stanzaParams = {
      type: 'chat',
      from: this.helpers.getUserCurrentJid(),
      to: this.helpers.jidOrUserId(params.userId),
      id: Utils.getBsonObjectId()
    };

    const messageStanza = ChatUtils.createMessageStanza(stanzaParams);
    messageStanza
      .c('displayed', {
        xmlns: 'urn:xmpp:chat-markers:0',
        id: params.messageId
      })
      .up();
    messageStanza
      .c('extraParams', {
        xmlns: 'jabber:client'
      })
      .c('dialog_id')
      .t(params.dialogId);

    this.xmppClient.send(messageStanza);
  }

  // params:
  // - to (user id OR dialog id)
  // - dialogId
  // - body
  // - originMessageId
  // - last?
  editMessage(params) {
    const stanzaParams = {
      from: this.helpers.getUserCurrentJid(),
      to: this.helpers.jidOrUserId(params.to),
      type: this.helpers.typeChat(params.to),
      id: Utils.getBsonObjectId()
    };

    let messageStanza = ChatUtils.createMessageStanza(stanzaParams);

    messageStanza
      .c('body')
      .t(params.body)
      .up();

    messageStanza
      .c('replace', {
        xmlns: 'urn:xmpp:message-correct:0',
        id: params.originMessageId,
        last: params.last ? "true" : "false"
      })
      .up();

    messageStanza
      .c('extraParams', {
        xmlns: 'jabber:client'
      })
      .c('dialog_id')
      .t(params.dialogId);

    if (params.extension) {
      messageStanza = ChatUtils.filledExtraParams(messageStanza, params.extension);
    }

    this.xmppClient.send(messageStanza);
  }

  // params:
  // - to (user id OR dialog id)
  // - dialogId
  // - messageId
  deleteMessage(params) {
    const stanzaParams = {
      from: this.helpers.getUserCurrentJid(),
      to: this.helpers.jidOrUserId(params.to),
      type: this.helpers.typeChat(params.to),
      id: Utils.getBsonObjectId()
    };

    const messageStanza = ChatUtils.createMessageStanza(stanzaParams);

    messageStanza
      .c('remove', {
        xmlns: 'urn:xmpp:message-delete:0',
        id: params.messageId
      })
      .up();

    messageStanza
      .c('extraParams', {
        xmlns: 'jabber:client'
      })
      .c('dialog_id')
      .t(params.dialogId);

    this.xmppClient.send(messageStanza);
  }

  getLastUserActivity(jidOrUserId) {
    return new Promise((resolve, reject) => {
      const iqParams = {
        from: this.helpers.getUserCurrentJid(),
        id: ChatUtils.getUniqueId('lastActivity'),
        to: this.helpers.jidOrUserId(jidOrUserId),
        type: 'get'
      };
      const iqStanza = ChatUtils.createIqStanza(iqParams);

      iqStanza.c('query', { xmlns: 'jabber:iq:last' });

      this.stanzasCallbacks[iqParams.id] = stanza => {
        const error = ChatUtils.getElement(stanza, 'error');
        const { userId, seconds } = this._onLastActivityStanza(stanza)
        if (error) {
          reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza));
        } else {
          resolve({ userId, seconds });
        }
      }

      this.xmppClient.send(iqStanza);
    });
  }

  _onLastActivityStanza = stanza => {
    const from = ChatUtils.getAttr(stanza, 'from');
    const userId = this.helpers.getUserIdFromJID(from);
    const query = ChatUtils.getElement(stanza, 'query');
    const seconds = +ChatUtils.getAttr(query, 'seconds');

    // trigger onLastUserActivityListener callback
    Utils.safeCallbackCall(this.onLastUserActivityListener, userId, seconds);

    return { userId, seconds }
  }

  markActive() {
    const iqParams = {
      id: this.helpers.getUniqueId('markActive'),
      type: 'set'
    };

    const iqStanza = ChatUtils.createIqStanza(iqParams);
    iqStanza.c('mobile', {
      xmlns: "http://tigase.org/protocol/mobile#v2",
      enable: "false"
    });

    this.xmppClient.send(iqStanza);
  }

  markInactive() {
    const iqParams = {
      id: this.helpers.getUniqueId('markActive'),
      type: 'set'
    };

    const iqStanza = ChatUtils.createIqStanza(iqParams);
    iqStanza.c('mobile', {
      xmlns: "http://tigase.org/protocol/mobile#v2",
      enable: "true"
    });

    this.xmppClient.send(iqStanza);
  }

  disconnect() {
    Utils.DLog('[Chat]', 'disconnect');

    if (this._isLogout) {
      Utils.DLog('[Chat]', 'Warning! Chat is already disconnected!');
      return;
    }

    this.muc.joinedRooms = {};
    this.isConnected = false;
    this._isConnecting = false;
    this._isLogout = true;
    this._isReconnect = false;
    this.helpers.setUserCurrentJid('');

    this.streamManagement._removeElementHandler();
    return this.xmppClient.stop();
  }

  search(params) {
    let query = Object.assign({}, params)

    if (query.start_date) {
      query.start_date = new Date(query.start_date).toISOString()
    }

    if (query.end_date) {
      query.end_date = new Date(query.end_date).toISOString()
    }

    if (Utils.isArray(query.chat_dialog_ids)) {
      query.chat_dialog_ids = query.chat_dialog_ids.join(',')
    }

    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(`${Config.urls.chat}/search`),
      data: query
    };

    return this.proxy.ajax(ajaxParams);
  }


  /// PRIVATE ///

  _onMessage(rawStanza) {
    const forwardedStanza = ChatUtils.getElementTreePath(rawStanza, ['sent', 'forwarded', 'message']),
      stanza = forwardedStanza || rawStanza,
      from = ChatUtils.getAttr(stanza, 'from'),
      type = ChatUtils.getAttr(stanza, 'type'),
      messageId = ChatUtils.getAttr(stanza, 'id'),
      markable = ChatUtils.getElement(stanza, 'markable'),
      delivered = ChatUtils.getElement(stanza, 'received'),
      read = ChatUtils.getElement(stanza, 'displayed'),
      replaceSubElement = ChatUtils.getElement(stanza, 'replace'),
      reactionsSubElement = ChatUtils.getElement(stanza, 'reactions'),
      removeSubElement = ChatUtils.getElement(stanza, 'remove'),
      composing = ChatUtils.getElement(stanza, 'composing'),
      paused = ChatUtils.getElement(stanza, 'paused'),
      invite = ChatUtils.getElement(stanza, 'invite'),
      delay = ChatUtils.getElement(stanza, 'delay'),
      extraParams = ChatUtils.getElement(stanza, 'extraParams'),
      bodyContent = ChatUtils.getElementText(stanza, 'body'),
      isForwarded = !!forwardedStanza,
      resource = this.xmppClient.jid && this.xmppClient.jid._resource || '';

    // ignore private message from the same resource
    if (type === 'chat' && from.indexOf(resource) !== -1) {
      return true;
    }

    let extraParamsParsed,
      recipientId,
      recipient;

    recipient = type === 'chat' ? ChatUtils.getAttr(stanza, 'to') : null
    recipientId = recipient ? this.helpers.getUserIdFromJID(recipient) : null;

    let dialogId = type === 'groupchat' ? this.helpers.getDialogIdFromJID(from) : null,
      userId = type === 'groupchat' ? this.helpers.getIdFromResource(from) : this.helpers.getUserIdFromJID(from),
      marker = delivered || read || null;

    // ignore invite messages from MUC
    if (invite) return true;

    if (extraParams) {
      extraParamsParsed = ChatUtils.parseExtraParams(extraParams);

      if (extraParamsParsed.dialogId) {
        dialogId = extraParamsParsed.dialogId;
      }
    }

    // typing statuses
    if (composing || paused) {
      if (
        typeof this.onMessageTypingListener === 'function' &&
        (type === 'chat' || type === 'groupchat' || !delay)) {
        Utils.safeCallbackCall(this.onMessageTypingListener, !!composing, userId, dialogId);
      }

      return true;
    }

    // edit message
    if (replaceSubElement) {
      if (typeof this.onMessageUpdateListener === 'function') {
        Utils.safeCallbackCall(
          this.onMessageUpdateListener,
          ChatUtils.getAttr(replaceSubElement, 'id'),
          ChatUtils.getAttr(replaceSubElement, 'last') === "true",
          bodyContent,
          dialogId,
          userId,
          extraParamsParsed ? extraParamsParsed.extension : null
        );
      }
      return true;
    }

    // reactions
    if (reactionsSubElement) {
      if (isForwarded && type === 'groupchat') {
        return true;
      }
      
      if (typeof this.onMessageReactionsListener === 'function') {
        const messageId = ChatUtils.getAttr(reactionsSubElement, 'message_id')
        const userId = +ChatUtils.getAttr(reactionsSubElement, 'user_id')
        const {add, remove} = ChatUtils.parseReactions(reactionsSubElement)
        const {dialogId} = extraParamsParsed

        Utils.safeCallbackCall(
          this.onMessageReactionsListener,
          messageId,
          userId,
          dialogId,
          add,
          remove,
        );
      }
      return true;
    }

    // delete message
    if (removeSubElement) {
      if (typeof this.onMessageDeleteListener === 'function') {
        Utils.safeCallbackCall(this.onMessageDeleteListener, ChatUtils.getAttr(removeSubElement, 'id'), dialogId, userId);
      }
      return true;
    }

    // delivered / read statuses
    if (marker) {
      if (delivered) {
        if (typeof this.onDeliveredStatusListener === 'function' && type === 'chat') {
          Utils.safeCallbackCall(
            this.onDeliveredStatusListener,
            ChatUtils.getAttr(delivered, 'id'),
            dialogId,
            userId
          );
        }
      } else {
        if (typeof this.onReadStatusListener === 'function' && type === 'chat') {
          Utils.safeCallbackCall(this.onReadStatusListener, ChatUtils.getAttr(read, 'id'), dialogId, userId);
        }
      }

      return;
    }

    // autosend 'received' status (ignore messages from yourself)
    if (markable && userId != this.helpers.getUserIdFromJID(this.helpers.userCurrentJid(this.xmppClient))) {
      const autoSendReceiveStatusParams = {
        messageId: messageId,
        userId: userId,
        dialogId: dialogId
      };

      this.sendDeliveredStatus(autoSendReceiveStatusParams);
    }

    const message = {
      id: messageId,
      dialog_id: dialogId,
      recipient_id: recipientId,
      is_forwarded: isForwarded,
      type: type,
      body: bodyContent,
      extension: extraParamsParsed ? extraParamsParsed.extension : null,
      delay: delay
    };

    if (markable) {
      message.markable = 1;
    }

    if (typeof this.onMessageListener === 'function' && (type === 'chat' || type === 'groupchat')) {
      Utils.safeCallbackCall(this.onMessageListener, userId, message);
    }
  }

  _onPresence(stanza) {
    const from = ChatUtils.getAttr(stanza, 'from'),
      id = ChatUtils.getAttr(stanza, 'id'),
      type = ChatUtils.getAttr(stanza, 'type'),
      currentUserId = this.helpers.getUserIdFromJID(this.helpers.userCurrentJid(this.xmppClient)),
      x = ChatUtils.getElement(stanza, 'x');

    let xXMLNS,
      status,
      statusCode;

    if (x) {
      xXMLNS = ChatUtils.getAttr(x, 'xmlns');
      status = ChatUtils.getElement(x, 'status');
      if (status) {
        statusCode = ChatUtils.getAttr(status, 'code');
      }
    }

    // MUC presences
    if (xXMLNS && xXMLNS.startsWith('http://jabber.org/protocol/muc')) {

      // Error
      if (type === 'error') {
        // JOIN to dialog error
        if (id.endsWith(':join')) {
          if (typeof this.stanzasCallbacks[id] === 'function') {
            this.stanzasCallbacks[id](stanza);
          }
        }
        return;
      }

      const dialogId = this.helpers.getDialogIdFromJID(from);
      const userId = this.helpers.getUserIdFromRoomJid(from);


      // self presence
      if (status) {
        // KICK from dialog event
        if (statusCode == '301') {
          if (typeof this.onKickOccupant === 'function') {
            var actorElement = ChatUtils.getElement(ChatUtils.getElement(x, 'item'), 'actor');
            var initiatorUserJid = ChatUtils.getAttr(actorElement, 'jid');
            Utils.safeCallbackCall(this.onKickOccupant, dialogId, this.helpers.getUserIdFromJID(initiatorUserJid));
          }

          delete this.muc.joinedRooms[this.helpers.getRoomJidFromRoomFullJid(from)];
          return;

        } else {
          if (type === 'unavailable') {
            // LEAVE response
            if (status && statusCode == '110') {
              if (typeof this.stanzasCallbacks['muc:leave'] === 'function') {
                Utils.safeCallbackCall(this.stanzasCallbacks['muc:leave'], null);
              }
            }
            return;
          }

          // JOIN response
          if (id.endsWith(':join') && status && statusCode == '110') {
            if (typeof this.stanzasCallbacks[id] === 'function') {
              this.stanzasCallbacks[id](stanza);
            }
            return;
          }
        }

        // Occupants JOIN/LEAVE events
      } else {
        if (userId != currentUserId) {
          // Leave
          if (type === 'unavailable') {
            if (typeof this.onLeaveOccupant === 'function') {
              Utils.safeCallbackCall(this.onLeaveOccupant, dialogId, parseInt(userId));
            }
            return;
            // Join
          } else {
            if (typeof this.onJoinOccupant === 'function') {
              Utils.safeCallbackCall(this.onJoinOccupant, dialogId, parseInt(userId));
            }
            return;
          }
        }
      }
    }

    // ROSTER presences
    const userId = this.helpers.getUserIdFromJID(from);
    let contact = this.contactList.contacts[userId];

    if (!type) {
      if (typeof this.onContactListListener === 'function' && contact && contact.subscription !== 'none') {
        Utils.safeCallbackCall(this.onContactListListener, userId);
      }
    } else {
      switch (type) {
        case 'subscribe':
          if (contact && contact.subscription === 'to') {
            contact ? (contact.ask = null) : (contact = { ask: null });
            contact.subscription = 'both';

            this.contactList._sendSubscriptionPresence({
              jid: from,
              type: 'subscribed'
            });
          } else {
            if (typeof this.onSubscribeListener === 'function') {
              Utils.safeCallbackCall(this.onSubscribeListener, userId);
            }
          }
          break;
        case 'subscribed':
          if (contact && contact.subscription === 'from') {
            contact ? (contact.ask = null) : (contact = { ask: null });
            contact.subscription = 'both';
          } else {
            contact ? (contact.ask = null) : (contact = { ask: null });
            contact.subscription = 'to';

            if (typeof this.onConfirmSubscribeListener === 'function') {
              Utils.safeCallbackCall(this.onConfirmSubscribeListener, userId);
            }
          }
          break;
        case 'unsubscribed':
          contact ? (contact.ask = null) : (contact = { ask: null });
          contact.subscription = 'none';

          if (typeof this.onRejectSubscribeListener === 'function') {
            Utils.safeCallbackCall(this.onRejectSubscribeListener, userId);
          }

          break;
        case 'unsubscribe':
          contact ? (contact.ask = null) : (contact = { ask: null });
          contact.subscription = 'to';

          break;
        case 'unavailable':
          if (
            typeof this.onContactListListener === 'function' &&
            contact &&
            contact.subscription !== 'none'
          ) {
            Utils.safeCallbackCall(this.onContactListListener, userId, type);
          }

          // send initial presence if one of client (instance) goes offline
          if (userId === currentUserId) {
            this.xmppClient.send(ChatUtils.createPresenceStanza());
          }

          break;
      }
    }
  }

  _onIQ(stanza) {
    const stanzaId = ChatUtils.getAttr(stanza, 'id');
    if (this.stanzasCallbacks[stanzaId]) {
      Utils.safeCallbackCall(this.stanzasCallbacks[stanzaId], stanza);
      delete this.stanzasCallbacks[stanzaId];
    } else {
      const from = ChatUtils.getAttr(stanza, 'from');
      const query = ChatUtils.getElement(stanza, 'query');
      if (!from || !query) {
        return
      }
      this._onLastActivityStanza(stanza)
    }
  }

  _onSystemMessageListener(rawStanza) {
    const forwardedStanza = ChatUtils.getElementTreePath(rawStanza, ['sent', 'forwarded', 'message']),
      stanza = forwardedStanza || rawStanza,
      from = ChatUtils.getAttr(stanza, 'from'),
      messageId = ChatUtils.getAttr(stanza, 'id'),
      extraParams = ChatUtils.getElement(stanza, 'extraParams'),
      userId = this.helpers.getUserIdFromJID(from),
      delay = ChatUtils.getElement(stanza, 'delay'),
      moduleIdentifier = ChatUtils.getElementText(extraParams, 'moduleIdentifier'),
      bodyContent = ChatUtils.getElementText(stanza, 'body'),
      extraParamsParsed = ChatUtils.parseExtraParams(extraParams);

    if (moduleIdentifier === 'SystemNotifications' && typeof this.onSystemMessageListener === 'function') {
      const message = {
        id: messageId,
        userId: userId,
        body: bodyContent,
        extension: extraParamsParsed.extension
      };

      Utils.safeCallbackCall(this.onSystemMessageListener, message);
    } else if (this.webrtcSignalingProcessor && !delay && moduleIdentifier === 'WebRTCVideoChat') {
      this.webrtcSignalingProcessor._onMessage(userId, extraParams);
    }
  }

  _onMessageErrorListener(stanza) {
    // <error code="503" type="cancel">
    //   <service-unavailable xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/>
    //   <text xmlns="urn:ietf:params:xml:ns:xmpp-stanzas" xml:lang="en">Service not available.</text>
    // </error>

    const messageId = ChatUtils.getAttr(stanza, 'id');
    //
    const error = ChatUtils.buildErrorFromXMPPErrorStanza(stanza);

    if (typeof this.onMessageErrorListener === 'function') {
      Utils.safeCallbackCall(this.onMessageErrorListener, messageId, error);
    }
  }

  _postConnectActions() {
    Utils.DLog('[Chat]', this._isReconnect ? 'RECONNECTED' : 'CONNECTED');

    const presence = ChatUtils.createPresenceStanza();

    if (Config.chat.streamManagement.enable && Config.chatProtocol.active === 2) {
      this.streamManagement.enable(this.xmppClient);
      this.streamManagement.sentMessageCallback = this._sentMessageCallback;
    }

    this.helpers.setUserCurrentJid(this.helpers.userCurrentJid(this.xmppClient));

    this.isConnected = true;
    this._isConnecting = false;

    this._enableCarbons();

    this.xmppClient.send(presence); // initial presence

    if (this._isReconnect) {
      // reconnect
      if (typeof this.onReconnectListener === 'function') {
        Utils.safeCallbackCall(this.onReconnectListener);
      }
    } else {
      this._isReconnect = true;
    }

    if (this.earlyIncomingMessagesQueue.length > 0) {
      Utils.DLog('[Chat]', `Flush 'earlyIncomingMessagesQueue' (length=${this.earlyIncomingMessagesQueue.length})`);

      const stanzasCallback = this.xmppClientListeners.filter(listener => listener.name === 'stanza')[0].callback;
      this.earlyIncomingMessagesQueue.forEach(stanza => {
        stanzasCallback(stanza);
      });
      this.earlyIncomingMessagesQueue = [];
    }
  }

  _enableCarbons() {
    const carbonParams = {
      type: 'set',
      from: this.helpers.getUserCurrentJid(),
      id: ChatUtils.getUniqueId('enableCarbons')
    };

    const iqStanza = ChatUtils.createIqStanza(carbonParams);
    iqStanza.c('enable', {
      xmlns: 'urn:xmpp:carbons:2'
    });

    this.xmppClient.send(iqStanza);
  }

  _setSubscriptionToUserLastActivity(jidOrUserId, _isEnable) {
    var iqParams = {
      id: this.helpers.getUniqueId('statusStreaming'),
      type: 'set'
    };

    var iqStanza = ChatUtils.createIqStanza(iqParams);

    iqStanza.c('subscribe', {
      xmlns: 'https://connectycube.com/protocol/status_streaming',
      user_jid: this.helpers.jidOrUserId(jidOrUserId),
      enable: _isEnable
    });

    this.xmppClient.send(iqStanza);
  }

  subscribeToUserLastActivityStatus(jidOrUserId) {
    this._setSubscriptionToUserLastActivity(jidOrUserId, true)
  }

  unsubscribeFromUserLastActivityStatus(jidOrUserId) {
    this._setSubscriptionToUserLastActivity(jidOrUserId, false)
  }

}

module.exports = ChatService;