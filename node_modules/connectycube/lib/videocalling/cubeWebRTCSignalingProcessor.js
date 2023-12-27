const SignalingConstants = require('./cubeWebRTCConstants').SignalingConstants;
const ChatHelpers = require('../messaging/cubeChatInternalUtils');

class WebRTCSignalingProcessor {

    constructor(delegate) {
        this.delegate = delegate;
    }

    _onMessage(userId, extraParams) {
        const extension = this._getExtension(extraParams);
        const sessionId = extension.sessionID;
        const signalType = extension.signalType;

        /** cleanup */
        delete extension.moduleIdentifier;
        delete extension.sessionID;
        delete extension.signalType;

        switch (signalType) {
            case SignalingConstants.SignalingType.CALL:
                this.delegate._onCallListener(userId, sessionId, extension);
                break;

            case SignalingConstants.SignalingType.ACCEPT:
                this.delegate._onAcceptListener(userId, sessionId, extension);
                break;

            case SignalingConstants.SignalingType.REJECT:
                this.delegate._onRejectListener(userId, sessionId, extension);
                break;

            case SignalingConstants.SignalingType.STOP:
                this.delegate._onStopListener(userId, sessionId, extension);
                break;

            case SignalingConstants.SignalingType.CANDIDATE:
                this.delegate._onIceCandidatesListener(userId, sessionId, extension);
                break;
        }
    }

    // TODO: refactor it
    _getExtension(extraParams) {
        if (!extraParams) {
            return null;
        }

        let extension = {}, iceCandidates = [], opponents = [],
            candidate, opponent, childrenNodes;

        let extraParamsChildNodes = extraParams.childNodes || extraParams.children;

        for (let i = 0, len = extraParamsChildNodes.length; i < len; i++) {
            const items = extraParamsChildNodes[i].childNodes || extraParamsChildNodes[i].children;
            const itemTagName = extraParamsChildNodes[i].tagName || extraParamsChildNodes[i].name;

            if (itemTagName === 'iceCandidates') {
                for (let j = 0, len2 = items.length; j < len2; j++) {
                    candidate = {};
                    childrenNodes = items[j].childNodes || items[j].children;

                    for (let k = 0, len3 = childrenNodes.length; k < len3; k++) {
                        const childName = childrenNodes[k].tagName || childrenNodes[k].name;
                        const childValue = childrenNodes[k].textContent || childrenNodes[k].children[0];
                        candidate[childName] = childName === 'sdpMLineIndex' ? parseInt(childValue) : childValue;
                    }

                    iceCandidates.push(candidate);
                }

            } else if (itemTagName === 'opponentsIDs') {
                for (let v = 0, len2v = items.length; v < len2v; v++) {
                    opponent = items[v].textContent || items[v].children[0];
                    opponents.push(parseInt(opponent));
                }
            } else {
                if (items.length > 1) {
                    let nodeTextContentSize = (extraParamsChildNodes[i].textContent || extraParamsChildNodes[i].children[0]).length;

                    if (nodeTextContentSize > 4096) {
                        let wholeNodeContent = "";

                        for (let t = 0; t < items.length; ++t) {
                            wholeNodeContent += (items.textContent || items.children[0]);
                        }
                        extension[itemTagName] = wholeNodeContent;
                    } else {
                        extension = ChatHelpers._XMLtoJS(extension, itemTagName, extraParamsChildNodes[i]);
                    }
                } else {
                    if (itemTagName === 'userInfo') {
                        extension = ChatHelpers._XMLtoJS(extension, itemTagName, extraParamsChildNodes[i]);
                    } else {
                        extension[itemTagName] = extraParamsChildNodes[i].textContent || extraParamsChildNodes[i].children[0];
                    }
                }
            }
        }
        if (iceCandidates.length > 0) {
            extension.iceCandidates = iceCandidates;
        }
        if (opponents.length > 0) {
            extension.opponentsIDs = opponents;
        }

        return extension;
    }
}

module.exports = WebRTCSignalingProcessor;
