const Utils = require('../cubeInternalUtils'),
	Config = require('../cubeConfig'),
	ChatUtils = require('./cubeChatInternalUtils');

class ChatHelpers {
	constructor() {
		this._userCurrentJid = null;
	}

	getUniqueId(suffix) {
		return ChatUtils.getUniqueId(suffix);
	}

	isNumeric(value) {
    return /^-?\d+$/.test(value) || /^\d+\.\d+$/.test(value);
	}

	jidOrUserId(jidOrUserId) {
		let jid;
		if (typeof jidOrUserId === 'string') { // jid
			jid = this.isNumeric(jidOrUserId)
				? this.getUserJid(jidOrUserId)
				: jidOrUserId.includes('@')
					? jidOrUserId
					: this.getRoomJidFromDialogId(jidOrUserId);
		} else { // user id
			jid = this.getUserJid(jidOrUserId);
		}
		return jid;
	}

	typeChat(jidOrUserId) {
		let chatType;
		if (typeof jidOrUserId === 'string') {
			chatType = this.isNumeric(jidOrUserId)
				? 'chat'
				: jidOrUserId.includes('@')
					? jidOrUserId.includes('muc')
						? 'groupchat'
						: 'chat'
					:'groupchat';
		} else if (typeof jidOrUserId === 'number') {
			chatType = 'chat';
		} else {
			throw new Error('Unsupported chat type');
		}
		return chatType;
	}

	getUserJid(userId, appId) {
		if (!appId) {
			return userId + '-' + Config.creds.appId + '@' + Config.endpoints.chat;
		}
		return userId + '-' + appId + '@' + Config.endpoints.chat;
	}

	getUserNickWithMucDomain(userId) {
		return Config.endpoints.muc + '/' + userId;
	}

	getUserIdFromJID(jid) {
		return jid.indexOf('@') < 0 ? null : parseInt(jid.split('@')[0].split('-')[0]);
	}

	getDialogIdFromJID(jid) {
		if (jid.indexOf('@') < 0) return null;
		return jid.split('@')[0].split('_')[1];
	}

	getRoomJidFromDialogId(dialogId) {
		return Config.creds.appId + '_' + dialogId + '@' + Config.endpoints.muc;
	}

	getRoomJid(jid) {
		return jid + '/' + this.getUserIdFromJID(this._userCurrentJid);
	}

	getIdFromResource(jid) {
		let s = jid.split('/');
		if (s.length < 2) return null;
		s.splice(0, 1);
		return parseInt(s.join('/'));
	}

	getRoomJidFromRoomFullJid(jid) {
		let s = jid.split('/');
		if (s.length < 2) return null;
		return s[0];
	}

	getBsonObjectId() {
		return Utils.getBsonObjectId();
	}

	getUserIdFromRoomJid(jid) {
		let arrayElements = jid.toString().split('/');
		if (arrayElements.length === 0) {
			return null;
		}
		return arrayElements[arrayElements.length - 1];
	}

	userCurrentJid(client) {
		return client.jid._local + '@' + client.jid._domain + '/' + client.jid._resource;
	}

	getUserCurrentJid() {
		return this._userCurrentJid;
	}

	setUserCurrentJid(jid) {
		this._userCurrentJid = jid;
	}

	getDialogJid(identifier) {
		return identifier.indexOf('@') > 0 ? identifier : this.getRoomJidFromDialogId(identifier);
	}
}

module.exports = ChatHelpers;
