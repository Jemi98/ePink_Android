const ChatUtils = require('./cubeChatInternalUtils'),
    Utils = require('../cubeInternalUtils'),
    Config = require('../cubeConfig');

class ContactListService {
  constructor (options) {
    this.helpers = options.helpers;
    this.xmppClient = options.xmppClient;
    this.stanzasCallbacks = options.stanzasCallbacks;
    //
    this.contacts = {};

    this.xmlns = "jabber:iq:roster"
  }

  get() {
    return new Promise((resolve, reject) => {
      const stanzaId = ChatUtils.getUniqueId('getRoster');

      let contacts = {},
        iqStanza = ChatUtils.createIqStanza({
            type: 'get',
            from: this.helpers.getUserCurrentJid(),
            id: stanzaId
        });

      iqStanza.c('query', {
        xmlns: this.xmlns
      });

      this.stanzasCallbacks[stanzaId] = stanza => {
        const items = stanza.getChild('query').children;

        for (let i = 0, len = items.length; i < len; i++) {
          const userId = this.helpers.getUserIdFromJID(ChatUtils.getAttr(items[i], 'jid')),
            ask = ChatUtils.getAttr(items[i], 'ask'),
            subscription = ChatUtils.getAttr(items[i], 'subscription'),
            name = ChatUtils.getAttr(items[i], 'name'),
            isUniqName = userId + '-' + Config.creds.appId !== name;

          contacts[userId] = {
            subscription: subscription,
            ask: ask || null,
            name: isUniqName ? name : null
          };
        }

        resolve(contacts);
      };

      this.xmppClient.send(iqStanza);
    });
  }

  add(params) {
    return new Promise((resolve, reject) => {
      const userId = params.userId || params,
        userJid = this.helpers.jidOrUserId(userId),
        stanzaId = ChatUtils.getUniqueId('addContactInRoster');

      let iqStanza = ChatUtils.createIqStanza({
        type: 'set',
        from: this.helpers.getUserCurrentJid(),
        id: stanzaId
      });

      this.contacts[userId] = {
        subscription: 'none',
        ask: 'subscribe',
        name: params.name || null
      };

      iqStanza
        .c('query', {
            xmlns: this.xmlns
        })
        .c('item', {
            jid: userJid,
            name: params.name || null
        });


      this.stanzasCallbacks[stanzaId] = () => {
        this._sendSubscriptionPresence({
          jid: userJid,
          type: 'subscribe'
        });

        resolve();
      };

      this.xmppClient.send(iqStanza);
    });
  }

  confirm(params) {
    return new Promise((resolve, reject) => {
      const userId = params.userId || params,
          userJid = this.helpers.jidOrUserId(userId);

      this._sendSubscriptionPresence({
        jid: userJid,
        type: 'subscribed'
      });

      if (Config.chat.contactList.subscriptionMode.mutual) {
        this.add(params, function() {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  reject(userId) {
    return new Promise((resolve, reject) => {
      const userJid = this.helpers.jidOrUserId(userId);

      this.contacts[userId] = {
        subscription: 'none',
        ask: null
      };

      this._sendSubscriptionPresence({
        jid: userJid,
        type: 'unsubscribed'
      });

      resolve();
    });
  }

  updateName(params) {
    return new Promise((resolve, reject) => {
      const userJid = this.helpers.jidOrUserId(params.userId),
          stanzaId = ChatUtils.getUniqueId('updateContactInRoster');

      let contact = this.contacts[params.userId];

      if (Utils.isObject(contact)) {
        contact.name = params.name || null;
      } else {
        reject('No contact exists with provided user id');
        return;
      }

      let iqStanza = ChatUtils.createIqStanza({
        type: 'set',
        from: this.helpers.getUserCurrentJid(),
        id: stanzaId
      });

      iqStanza
        .c('query', {
            xmlns: this.xmlns
        })
        .c('item', {
            jid: userJid,
            name: params.name || null
        });

      this.stanzasCallbacks[stanzaId] = res => {
        res.attrs.type === "result" ? resolve() : reject(res)
      };

      this.xmppClient.send(iqStanza);
    });
  }

  remove(userId) {
    return new Promise((resolve, reject) => {
      const userJid = this.helpers.jidOrUserId(userId),
        stanzaId = ChatUtils.getUniqueId('removeConactInRoster');

      let iqStanza = ChatUtils.createIqStanza({
        type: 'set',
        from: this.helpers.getUserCurrentJid(),
        id: stanzaId
      });

      iqStanza
        .c('query', {
            xmlns: this.xmlns
        })
        .c('item', {
            jid: userJid,
            subscription: 'remove'
        });


      this.stanzasCallbacks[stanzaId] = () => {
        delete this.contacts[userId];
        resolve();
      };

      this.xmppClient.send(iqStanza);
    });
  }

  _sendSubscriptionPresence(params) {
    const presenceParams = {
      to: params.jid,
      type: params.type
    };

    const presenceStanza = ChatUtils.createPresenceStanza(presenceParams);

    this.xmppClient.send(presenceStanza);
  }
}

module.exports = ContactListService;
