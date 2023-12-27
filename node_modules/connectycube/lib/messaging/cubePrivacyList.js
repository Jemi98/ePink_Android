const ChatUtils = require('./cubeChatInternalUtils'),
    Utils = require('../cubeInternalUtils');

class PrivacyListService {
  constructor (options) {
    this.helpers = options.helpers;
    this.xmppClient = options.xmppClient;
    this.stanzasCallbacks = options.stanzasCallbacks;

    this.xmlns = "jabber:iq:privacy"
  }

  create(list) {
    return new Promise((resolve, reject) => {
      let userId,
          userJid,
          userMuc,
          userAction,
          mutualBlock,
          listPrivacy = {},
          listUserId = [];

      for (let i = list.items.length - 1; i >= 0; i--) {
        const user = list.items[i];

        listPrivacy[user.user_id] = {
          action: user.action,
          mutualBlock: user.mutualBlock === true ? true : false
        };
      }

      listUserId = Object.keys(listPrivacy);

      const iqParams = {
        type: 'set',
        from: this.helpers.getUserCurrentJid(),
        id: ChatUtils.getUniqueId('edit')
      };

      let iq = ChatUtils.createIqStanza(iqParams);

      iq.c('query', {
        xmlns: this.xmlns
      }).c('list', {
        name: list.name
      });

      function createPrivacyItem(iq, params) {
        let list = iq.getChild('query').getChild('list');

        list.c('item', {
          type: 'jid',
          value: params.jidOrMuc,
          action: params.userAction,
          order: params.order
        }).c('message', {})
          .up().c('presence-in', {})
          .up().c('presence-out', {})
          .up().c('iq', {})
          .up().up();

        return iq;
      }

      function createPrivacyItemMutal(iq, params) {
        let list = iq.getChild('query').getChild('list');

        list.c('item', {
          type: 'jid',
          value: params.jidOrMuc,
          action: params.userAction,
          order: params.order
        }).up();

        return iq;
      }

      for (let index = 0, j = 0, len = listUserId.length; index < len; index++ , j = j + 2) {
        userId = listUserId[index];
        mutualBlock = listPrivacy[userId].mutualBlock;

        userAction = listPrivacy[userId].action;
        userJid = this.helpers.jidOrUserId(parseInt(userId, 10));
        userMuc = this.helpers.getUserNickWithMucDomain(userId);

        if (mutualBlock && userAction === 'deny') {
          iq = createPrivacyItemMutal(iq, {
            order: j + 1,
            jidOrMuc: userJid,
            userAction: userAction
          });
          iq = createPrivacyItemMutal(iq, {
            order: j + 2,
            jidOrMuc: userMuc,
            userAction: userAction
          }).up().up();
        } else {
          iq = createPrivacyItem(iq, {
            order: j + 1,
            jidOrMuc: userJid,
            userAction: userAction
          });
          iq = createPrivacyItem(iq, {
            order: j + 2,
            jidOrMuc: userMuc,
            userAction: userAction
          });
        }
      }

      this.stanzasCallbacks[iqParams.id] = stanza => {
        ChatUtils.isErrorStanza(stanza) ? reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza)) : resolve();
      };

      this.xmppClient.send(iq);
    });
  }

  getList(name) {
    return new Promise((resolve, reject) => {
      let items,
          userJid,
          userId,
          usersList = [],
          list = {};

      const iqParams = {
        type: 'get',
        from: this.helpers.getUserCurrentJid(),
        id: ChatUtils.getUniqueId('getlist')
      };

      let iq = ChatUtils.createIqStanza(iqParams);

      iq.c('query', {
        xmlns: this.xmlns
      }).c('list', {
        name: name
      });

      this.stanzasCallbacks[iqParams.id] = stanza => {
        const stanzaQuery = stanza.getChild('query');

        list = stanzaQuery ? stanzaQuery.getChild('list') : null;
        items = list ? list.getChildElements('item') : null;

        for (let i = 0, len = items.length; i < len; i = i + 2) {
          userJid = items[i].attrs.value;
          userId = this.helpers.getUserIdFromJID(userJid);
          usersList.push({
            user_id: userId,
            action: items[i].attrs.action
          });
        }

        list = {
          name: list.attrs.name,
          items: usersList
        };

        resolve(list);

        delete this.stanzasCallbacks[iqParams.id];
      };

      this.xmppClient.send(iq);
    });
  }

  update(listWithUpdates) {
    return new Promise((resolve, reject) => {
      this.getList(listWithUpdates.name).then((existentList) => {
        const updatedList = {
          items: Utils.mergeArrays(existentList.items, listWithUpdates.items),
          name: listWithUpdates.name
        };
        this.create(updatedList).then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  getNames() {
    return new Promise((resolve, reject) => {
      const iqParams = {
        'type': 'get',
        'from': this.helpers.getUserCurrentJid(),
        'id': ChatUtils.getUniqueId('getNames')
      };

      let iq = ChatUtils.createIqStanza(iqParams);

      iq.c('query', {
        xmlns: this.xmlns
      });

      this.stanzasCallbacks[iq.attrs.id] = stanza => {
        if (!ChatUtils.isErrorStanza(stanza)) {
          const query = stanza.getChild('query'),
            defaultList = query.getChild('default'),
            activeList = query.getChild('active'),
            allLists = query.getChildElements('list');

          let defaultName = defaultList ? defaultList.attrs.name : null,
            activeName = activeList ? activeList.attrs.name : null;

          let allNames = [];

          for (let i = 0, len = allLists.length; i < len; i++) {
            allNames.push(allLists[i].attrs.name);
          }

          const namesList = {
            default: defaultName,
            active: activeName,
            names: allNames
          };

          resolve(namesList);
        } else {
          reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza));
        }
      };

      this.xmppClient.send(iq);
    });
  }

  delete(name) {
    return new Promise((resolve, reject) => {
      const iqParams = {
        from: this.xmppClient.jid || this.xmppClient.jid.user,
        type: 'set',
        id: ChatUtils.getUniqueId('remove')
      };

      let iq = ChatUtils.createIqStanza(iqParams);

      iq.c('query', {
        xmlns: this.xmlns
      }).c('list', {
        name: name ? name : ''
      });

      this.stanzasCallbacks[iq.attrs.id] = stanza => {
        ChatUtils.isErrorStanza(stanza) ? reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza)) : resolve();
      };

      this.xmppClient.send(iq);
    });
  }

  setAsDefault (name) {
    return new Promise((resolve, reject) => {
      const iqParams = {
        from: this.xmppClient.jid || this.xmppClient.jid.user,
        type: 'set',
        id: ChatUtils.getUniqueId('default')
      };

      let iq = ChatUtils.createIqStanza(iqParams);

      iq.c('query', {
        xmlns: this.xmlns
      }).c('default', name && name.length > 0 ? { name: name } : {});

      this.stanzasCallbacks[iq.attrs.id] = stanza => {
        ChatUtils.isErrorStanza(stanza) ? reject(ChatUtils.buildErrorFromXMPPErrorStanza(stanza)) : resolve();
      };

      this.xmppClient.send(iq);
    });
  }
}

module.exports = PrivacyListService;
