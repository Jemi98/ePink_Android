const Utils = require('../cubeInternalUtils'),
  Config = require('../cubeConfig'),
  XMPP = require('../cubeDependencies').XMPPClient;

class ChatInternalUtils {
  static buildUserJid(params) {
    let jid;

    if ('userId' in params) {
      jid = params.userId + '-' + Config.creds.appId + '@' + Config.endpoints.chat;

      if ('resource' in params) {
        jid = jid + '/' + params.resource;
      }
    } else if ('jid' in params) {
      jid = params.jid;
    }

    return jid;
  }

  static buildUserJidLocalPart(userId) {
    return userId + '-' + Config.creds.appId;
  }

  static createMessageStanza(params) {
    return XMPP.xml('message', params);
  }

  static createIqStanza(params) {
    return XMPP.xml('iq', params);
  }

  static createPresenceStanza(params) {
    return XMPP.xml('presence', params);
  }

  static createNonza(elementName, params) {
    return XMPP.xml(elementName, params);
  }

  static getAttr(el, attrName) {
    if (!el) {
      return null;
    }

    let attr;
    if (typeof el.getAttribute === 'function') {
      attr = el.getAttribute(attrName);
    } else if (el.attrs) {
      attr = el.attrs[attrName];
    }

    return attr;
  }

  static getElement(stanza, elName) {
    let el;

    if (typeof stanza.querySelector === 'function') {
      el = stanza.querySelector(elName);
    } else if (typeof stanza.getChild === 'function') {
      el = stanza.getChild(elName);
    }

    return el;
  }

  static isErrorStanza(stanza) {
    return !!stanza.getChild('error');
  }

  static getAllElements(stanza, elName) {
    let el;
    if (typeof stanza.querySelectorAll === 'function') {
      el = stanza.querySelectorAll(elName);
    } else if (typeof stanza.getChild === 'function') {
      el = stanza.getChild(elName);
    }

    return el;
  }

  static getElementText(stanza, elName) {
    let el, txt;

    if (typeof stanza.querySelector === 'function') {
      el = stanza.querySelector(elName);
      txt = el ? el.textContent : null;
    } else if (typeof stanza.getChildText === 'function') {
      txt = stanza.getChildText(elName);
    }

    return txt;
  }

  static getElementTreePath(stanza, elementsPath) {
    return elementsPath.reduce((prevStanza, elem) => prevStanza ? this.getElement(prevStanza, elem) : prevStanza, stanza)
  }


  static _JStoXML(title, obj, msg) {
    msg = msg.c(title);

    Object.keys(obj).forEach(field => {
      if (typeof obj[field] === 'object') {
        this._JStoXML(field, obj[field], msg);
      } else {
        msg = msg.c(field).t(obj[field]).up();
      }
    });

    msg = msg.up();
  }

  static _XMLtoJS(extension, title, obj) {
    extension[title] = {};

    let objChildNodes = obj.childNodes || obj.children;

    for (let i = 0; i < objChildNodes.length; i++) {
      let subNode = objChildNodes[i];
      if (typeof subNode === 'string') {
        extension[title] = subNode;
        continue
      }
      let subNodeChildNodes = subNode.childNodes || subNode.children;
      let subNodeTagName = subNode.tagName || subNode.name;
      let subNodeTextContent = subNode.textContent || subNode.children[0];

      if (subNodeChildNodes.length >= 1) {
        extension[title] = this._XMLtoJS(extension[title], subNodeTagName, subNode);
      } else {
        extension[title][subNodeTagName] = subNodeTextContent;
      }
    }
    return extension;
  }

  static filledExtraParams(stanza, extension) {
    Object.keys(extension).forEach(field => {
      if (field === 'attachments') {
        extension[field].forEach(attach => {
          stanza
            .getChild('extraParams')
            .c('attachment', attach)
            .up();

        });
      } else if (typeof extension[field] === 'object') {
        this._JStoXML(field, extension[field], stanza.getChild('extraParams'));
      } else {
        stanza
          .getChild('extraParams')
          .c(field)
          .t(extension[field])
          .up();

      }
    });

    stanza.up();

    return stanza;
  }

  static parseExtraParams(extraParams) {
    if (!extraParams) {
      return null;
    }

    let extension = {};

    let dialogId, attach, attributes;

    let attachments = [];

    for (let c = 0, length = extraParams.children.length; c < length; c++) {
      if (extraParams.children[c].name === 'attachment') {
        attach = {};
        attributes = extraParams.children[c].attrs;

        let attrKeys = Object.keys(attributes);

        for (let l = 0; l < attrKeys.length; l++) {
          if (attrKeys[l] === 'size') {
            attach.size = parseInt(attributes.size);
          } else {
            attach[attrKeys[l]] = attributes[attrKeys[l]];
          }
        }

        attachments.push(attach);
      } else if (extraParams.children[c].name === 'dialog_id') {
        dialogId = extraParams.getChildText('dialog_id');
        extension.dialog_id = dialogId;
      }

      if (extraParams.children[c].children.length) {
        let child = extraParams.children[c];
        extension = this._XMLtoJS(extension, child.name, child)
      }
    }

    if (attachments.length > 0) {
      extension.attachments = attachments;
    }

    if (extension.moduleIdentifier) {
      delete extension.moduleIdentifier;
    }

    return {
      extension: extension,
      dialogId: dialogId
    };
  }

  static buildErrorFromXMPPErrorStanza(errorStanza) {
    const errorElement = this.getElement(errorStanza, 'error');
    const code = parseInt(this.getAttr(errorElement, 'code'));
    const info = this.getElementText(errorElement, 'text');
    return { code: code, info: info };
  }

  static getUniqueId(suffix) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    if (typeof suffix == 'string' || typeof suffix == 'number') {
      return uuid + ':' + suffix;
    } else {
      return uuid + '';
    }
  }

  static parseReactions(reactionsEl) {
    let reactions = reactionsEl.children
    reactions = reactions.map(reactionEl => ({ 
      add: this.getAttr(reactionEl, 'add') === 'true',
      remove: this.getAttr(reactionEl, 'remove') === 'true',
      reaction: this.getAttr(reactionEl, 'type') 
    }))
    return reactions.reduce((acc, parsedReaction) => {
      if (parsedReaction.add) {
        acc['add'] = parsedReaction.reaction
      }
      if (parsedReaction.remove) {
        acc['remove'] = parsedReaction.reaction
      }
      return acc
    }, {})
  }
}

module.exports = ChatInternalUtils;
