const ChatUtils = require('./cubeChatInternalUtils');

class GroupChatService {
  constructor (options) {
    this.helpers = options.helpers;
    this.xmppClient = options.xmppClient;
    this.stanzasCallbacks = options.stanzasCallbacks;
    //
    this.joinedRooms = {};

    this.xmlns = "http://jabber.org/protocol/muc";
  }

  join (dialogIdOrJid) {
    return new Promise((resolve, reject) => {
      const id = ChatUtils.getUniqueId('join'),
        dialogJid = this.helpers.getDialogJid(dialogIdOrJid),
        presenceParams = {
          id: id,
          from: this.helpers.getUserCurrentJid(),
          to: this.helpers.getRoomJid(dialogJid)
        }

      let presenceStanza = ChatUtils.createPresenceStanza(presenceParams);
      presenceStanza.c('x', {
        xmlns: this.xmlns
      }).c('history', { maxstanzas: 0 });

      this.stanzasCallbacks[id] = stanza => {
        const from = ChatUtils.getAttr(stanza, 'from'),
          dialogId = this.helpers.getDialogIdFromJID(from),
          x = ChatUtils.getElement(stanza, 'x'),
          xXMLNS = ChatUtils.getAttr(x, 'xmlns'),
          status = ChatUtils.getElement(x, 'status'),
          statusCode = ChatUtils.getAttr(status, 'code');

        if (status && statusCode == '110') {
          this.joinedRooms[dialogJid] = true;
          resolve();
        } else {
          const type = ChatUtils.getAttr(stanza, 'type');

          if (type && type === 'error' && xXMLNS === this.xmlns && id.endsWith(':join')) {
            const errorEl = ChatUtils.getElement(stanza, 'error'),
              code = ChatUtils.getAttr(errorEl, 'code'),
              errorMessage = ChatUtils.getElementText(errorEl, 'text');

            const errorResponse = {
              code: code || 500,
              message: errorMessage || 'Unknown issue'
            }

            reject(errorResponse);
          }
        }
      };

      this.xmppClient.send(presenceStanza);
    });
  }

  leave (dialogIdOrJid) {
    return new Promise((resolve, reject) => {
      const dialogJid = this.helpers.getDialogJid(dialogIdOrJid);
      const presenceParams = {
        type: 'unavailable',
        from: this.helpers.getUserCurrentJid(),
        to: this.helpers.getRoomJid(dialogJid)
      };

      const presenceStanza = ChatUtils.createPresenceStanza(presenceParams);

      delete this.joinedRooms[dialogJid];

      this.stanzasCallbacks['muc:leave'] = (stanza) => {
        resolve();
      };

      this.xmppClient.send(presenceStanza);
    });
  }

  listOnlineUsers (dialogIdOrJid) {
    return new Promise((resolve, reject) => {
      const dialogJid = this.helpers.getDialogJid(dialogIdOrJid);
      const iqParams = {
        type: 'get',
        to: dialogJid,
        from: this.helpers.getUserCurrentJid(),
        id: ChatUtils.getUniqueId('muc_disco_items'),
      };

      let iqStanza = ChatUtils.createIqStanza(iqParams);
      iqStanza.c('query', {
          xmlns: 'http://jabber.org/protocol/disco#items'
      });

      this.stanzasCallbacks[iqParams.id] = (stanza) => {
        var stanzaId = stanza.attrs.id;

        if (this.stanzasCallbacks[stanzaId]) {
          const items = stanza.getChild('query').getChildElements('item');

          let users = [];
          for (var i = 0, len = items.length; i < len; i++) {
            let userId = this.helpers.getUserIdFromRoomJid(items[i].attrs.jid);
            users.push(parseInt(userId));
          }

          resolve(users);
        }
      };

      this.xmppClient.send(iqStanza);

    });
  }
}

module.exports = GroupChatService;
