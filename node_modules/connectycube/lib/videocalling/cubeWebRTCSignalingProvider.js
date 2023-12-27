const Helpers = require('./cubeWebRTCHelpers');
const SignalingConstants = require('./cubeWebRTCConstants').SignalingConstants;
const Utils = require('../cubeInternalUtils');
const config = require('../cubeConfig');
const ChatHelpers = require('../messaging/cubeChatInternalUtils');

class WebRTCSignalingProvider {
  constructor(signalingConnection) {
    this.signalingConnection = signalingConnection;
  }

  sendCandidate(userId, iceCandidates, ext) {
    const extension = ext || {};
    extension.iceCandidates = iceCandidates;

    this.sendMessage(userId, extension, SignalingConstants.SignalingType.CANDIDATE);
  }

  sendMessage(userId, ext, signalingType) {
    const extension = ext || {};
    /** basic parameters */
    extension.moduleIdentifier = SignalingConstants.MODULE_ID;
    extension.signalType = signalingType;
    /** extension.sessionID */
    /** extension.callType */
    extension.platform = 'web';
    /** extension.callerID */
    /** extension.opponentsIDs */
    /** extension.sdp */

    if (extension.userInfo) {
      if (!Object.keys(extension.userInfo).length) {
        delete extension.userInfo;
      } else if (extension.userInfo.maxBandwidth === 0) {
        delete extension.userInfo.maxBandwidth;
      }
    }

    const params = {
      to: Helpers.getUserJid(userId, config.creds.appId),
      type: 'headline',
      id: Utils.getBsonObjectId()
    };

    let msg = ChatHelpers.createMessageStanza(params).c('extraParams', {
      xmlns: 'jabber:client'
    });

    Object.keys(extension).forEach(field => {
      if (field === 'iceCandidates') {
        msg = msg.c('iceCandidates');
        extension[field].forEach(candidate => {
          msg = msg.c('iceCandidate');
          Object.keys(candidate).forEach(key => {
            msg = msg.c(key).t(candidate[key]).up();
          });
          msg = msg.up();
        });
        msg = msg.up();
      } else if (field === 'opponentsIDs') {
        msg = msg.c('opponentsIDs');
        extension[field].forEach(opponentId => {
          msg = msg.c('opponentID').t(opponentId).up();
        });
        msg = msg.up();
      } else if (typeof extension[field] === 'object') {
        ChatHelpers._JStoXML(field, extension[field], msg);
      } else {
        msg = msg.c(field).t(extension[field]).up();
      }
    });
    msg = msg.up();

    this.signalingConnection.send(msg);
  }
}

module.exports = WebRTCSignalingProvider;
