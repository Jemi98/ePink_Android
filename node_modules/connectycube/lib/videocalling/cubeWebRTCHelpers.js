const config = require('../cubeConfig');

class WebRTCHelpers {
    static getUserJid(id, appId) {
        return id + '-' + appId + '@' + config.endpoints.chat;
    }

    static getUserIdFromJID(jid) {
        if (jid.indexOf('@') < 0) return null;
        return parseInt(jid.split('@')[0].split('-')[0]);
    }

    static userCurrentJid(client) {
        return client.jid._local + '@' + client.jid._domain + '/' + client.jid._resource;
    }

    static trace(text) {
        if (config.debug) {
            console.log('[VideoChat]:', text);
        }
    }

    static traceWarning(text) {
        if (config.debug) {
            console.warn('[VideoChat]:', text);
        }
    }

    static traceError(text) {
        if (config.debug) {
            console.error('[VideoChat]:', text);
        }
    }

    static getVersionFirefox() {
        const ua = navigator ? navigator.userAgent : false;
        let version;
        if (ua) {
            const ffInfo = ua.match(/(?:firefox)[ \/](\d+)/i) || [];
            version = ffInfo[1] ? + ffInfo[1] : null;
        }
        return version;
    }

    static getVersionSafari() {
        const ua = navigator ? navigator.userAgent : false;
        let version;
        if (ua) {
            const sInfo = ua.match(/(?:safari)[ \/](\d+)/i) || [];
            if (sInfo.length) {
                const sVer = ua.match(/(?:version)[ \/](\d+)/i) || [];
                if (sVer) {
                    version = sVer[1] ? + sVer[1] : null;
                } else {
                    version = null;
                }
            } else {
                version = null;
            }
        }

        return version;
    }
};

module.exports = WebRTCHelpers;
