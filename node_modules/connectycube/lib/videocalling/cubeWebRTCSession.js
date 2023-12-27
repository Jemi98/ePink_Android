const config = require('../cubeConfig');
const RTCPeerConnection = require('./cubeRTCPeerConnection');
const Utils = require('../cubeInternalUtils');
const Helpers = require('./cubeWebRTCHelpers');
const SignalingConstants = require('./cubeWebRTCConstants').SignalingConstants;
const SessionState = require('./cubeWebRTCConstants').SessionState;
const PeerConnectionState = require('./cubeWebRTCConstants').PeerConnectionState;
const MediaDevicesImpl = require('../cubeDependencies').mediaDevices;

class WebRTCSession {
    constructor(params) {
        this.ID = params.sessionID ? params.sessionID : generateUUID();
        this.state = SessionState.NEW;

        this.initiatorID = parseInt(params.initiatorID);
        this.opponentsIDs = params.opIDs;
        this.callType = parseInt(params.callType);

        this.peerConnections = {};

        this.localStream = null;

        this.mediaParams = null;

        this.signalingProvider = params.signalingProvider;

        this.currentUserID = params.currentUserID;

        this.maxBandwidth = params.maxBandwidth;

        this.answerTimer = null;

        this.startCallTime = 0;
        this.acceptCallTime = 0;
    }

    getDisplayMedia(params, isUpdateCurrentStream = false) {
        if (!MediaDevicesImpl.getDisplayMedia) {
            throw new Error("Your browser/environment does not support 'getDisplayMedia' API")
        }

        if (isUpdateCurrentStream) {
            this.stopLocalStreamTracks(true)
        }

        return new Promise((resolve, reject) => {
            MediaDevicesImpl.getDisplayMedia(params).then(stream => {
                this.updateStream(
                    stream,
                    params,
                    isUpdateCurrentStream
                )
                resolve(stream);
            }).catch(reject);
        });
    }


    getUserMedia(params, isUpdateCurrentStream = false) {
        if (isUpdateCurrentStream) {
            this.stopLocalStreamTracks()
        }

        return new Promise((resolve, reject) => {
            MediaDevicesImpl.getUserMedia(params).then(stream => {
                this.updateStream(
                    stream,
                    params,
                    isUpdateCurrentStream
                )
                resolve(stream);
            }).catch(reject);
        });
    }

    updateStream(stream, params, isUpdateCurrentStream) {
        this.mediaParams = params;
        const newStreamTracks = stream.getTracks();

        if (isUpdateCurrentStream) {
            newStreamTracks.forEach(track => {
                this.localStream.addTrack(track);
            })
            this._replaceTracks(stream);
        } else {
            this.localStream = stream;
        }

        if (params.elementId && !isUpdateCurrentStream) {
            this.attachMediaStream(params.elementId, stream, params.options);
        }
    }

    _replaceTracks(stream) {
        const peers = this.peerConnections;
        const elementId = this.mediaParams.elementId;
        const ops = this.mediaParams.options;
        const newStreamTracks = stream.getTracks();

        this.detachMediaStream(elementId, ops);
        this.attachMediaStream(elementId, stream, ops);

        for (let userId in peers) {
            const peer = peers[userId];

            peer.getSenders().map(sender => {
                const track = newStreamTracks.find(track => {
                    return track.kind === sender.track.kind;
                })

                if (track) {
                    sender.replaceTrack(track);
                }
            });
        }
    }

    setMaxBandwidth(maxBandwidth) {
        const peers = this.peerConnections || [];

        if (peers.length < 1) {
            Helpers.trace("No 'RTCPeerConnection' to set 'maxBandwidth'");

            return;
        }
        
        for (let userId in peers) {
            const peer = peers[userId];

            peer.setRTCRtpSenderMaxBandwidth(maxBandwidth);
        }
    }

    stopLocalStreamTracks(isIgnoreAudioTrack = false) {
        this.localStream.getTracks().forEach(track => {
            if (isIgnoreAudioTrack && track.kind === 'audio') {
                return
            } else {
                track.stop()
            }
        })
    }

    connectionStateForUser(userID) {
        const peerConnection = this.peerConnections[userID];

        if (peerConnection) {
            return peerConnection.state;
        }

        return null;
    }

    attachMediaStream(id, stream, options) {
        const elem = document.getElementById(id);

        if (elem) {
            if (typeof elem.srcObject === 'object') {
                elem.srcObject = stream;
            } else {
                elem.src = window.URL.createObjectURL(stream);
            }

            if (options && options.muted) {
                elem.muted = true;
            }

            if (options && options.mirror) {
                elem.style.webkitTransform = 'scaleX(-1)';
                elem.style.transform = 'scaleX(-1)';
            }

            elem.onloadedmetadata = function (e) {
                elem.play();
            };
        } else {
            throw new Error('Unable to attach media stream, element ' + id + ' is undefined');
        }
    }

    detachMediaStream(id, options) {
        const elem = document.getElementById(id);

        if (elem) {
            elem.pause();

            if (typeof elem.srcObject === 'object') {
                elem.srcObject = null;
            } else {
                elem.src = '';
            }

            if (options && !options.mirror) {
                elem.style.webkitTransform = '';
                elem.style.transform = '';
            }

        } else {
            throw new Error('Unable to attach media stream, element ' + id + ' is undefined');
        }
    }

    switchMediaTracks(deviceIds) {
        console.warn("switchMediaTracks(deviceIds)", { deviceIds });

        return new Promise((resolve, reject) => {
            if (deviceIds && deviceIds.audio) {
                if (typeof (this.mediaParams.audio) === "boolean") {
                    this.mediaParams.audio = {};
                }
                this.mediaParams.audio.deviceId = deviceIds.audio;
            }

            if (deviceIds && deviceIds.video) {
                if (typeof (this.mediaParams.video) === "boolean") {
                    this.mediaParams.video = {};
                }
                this.mediaParams.video.deviceId = deviceIds.video;
            }

            this.localStream.getTracks().forEach(track => {
                track.stop();
            });

            MediaDevicesImpl.getUserMedia({
                audio: this.mediaParams.audio || false,
                video: this.mediaParams.video || false
            }).then(stream => {
                this._replaceTracks(stream);
                resolve(stream);
            }).catch(error => {
                reject(error);
            });
        });
    }

    call(extension) {
        const ext = _prepareExtension(extension);

        Helpers.trace('Call, extension: ' + JSON.stringify(ext));

        this.state = SessionState.ACTIVE;
        this.maxBandwidth = +ext.userInfo.maxBandwidth || 0;

        this.opponentsIDs.forEach((userID, i, arr) => {
            this._callInternal(userID, ext, true);
        });
    }

    _callInternal(userID, extension, withOnNotAnswerCallback) {
        const peer = this._createPeer(userID, 'offer');

        this.localStream.getTracks().forEach(track => {
            peer.addTrack(track, this.localStream);
        });

        this.peerConnections[userID] = peer;

        peer.getAndSetLocalSessionDescription(this.maxBandwidth)
            .then(() => {
                Helpers.trace("getAndSetLocalSessionDescription success");
                /* let's send call requests to user */
                peer._startDialingTimer(extension, withOnNotAnswerCallback);
            }).catch(err => {
                Helpers.trace("getAndSetLocalSessionDescription error: " + err);
            });
    }

    accept(extension) {
        const ext = _prepareExtension(extension);

        Helpers.trace('Accept, extension: ' + JSON.stringify(ext.userInfo));

        if (this.state === SessionState.ACTIVE) {
            Helpers.traceError("Can't accept, the session is already active, return.");
            return;
        }

        if (this.state === SessionState.CLOSED) {
            Helpers.traceError("Can't accept, the session is already closed, return.");
            this.stop({});
            return;
        }

        this.state = SessionState.ACTIVE;

        this.acceptCallTime = new Date();

        this._clearAnswerTimer();

        this._acceptInternal(this.initiatorID, ext);

        // group call
        const oppIDs = this._uniqueOpponentsIDsWithoutInitiator();
        if (oppIDs.length > 0) {
            const offerTime = (this.acceptCallTime - this.startCallTime) / 1000;
            this._startWaitingOfferOrAnswerTimer(offerTime);

            oppIDs.forEach(opID => {
                if (this.currentUserID > opID) {
                    this._callInternal(opID, {}, true);
                }
            });
        }
    }

    _acceptInternal(userID, extension) {
        const peerConnection = this.peerConnections[userID];

        if (peerConnection) {
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream);
            });

            peerConnection
                .setRemoteSessionDescription('offer', peerConnection.getRemoteSDP())
                .then(() => {
                    Helpers.trace("'setRemoteSessionDescription' success");
                    peerConnection
                        .getAndSetLocalSessionDescription(this.maxBandwidth)
                        .then(() => {
                            Helpers.trace("'getAndSetLocalSessionDescription' success");
                            extension.sessionID = this.ID;
                            extension.callType = this.callType;
                            extension.callerID = this.initiatorID;
                            extension.opponentsIDs = this.opponentsIDs;
                            extension.sdp = peerConnection.localDescription.sdp;

                            this.signalingProvider.sendMessage(userID, extension, SignalingConstants.SignalingType.ACCEPT);
                        })
                        .catch(err => {
                            Helpers.trace("'getAndSetLocalSessionDescription' error: " + err);
                        });
                })
                .catch(error => {
                    Helpers.traceError("'setRemoteSessionDescription' error: " + error);
                });
        } else {
            Helpers.traceError("Can't accept the call, there is no information about peer connection by some reason.");
        }
    }

    reject(extension) {
        const ext = _prepareExtension(extension);

        Helpers.trace('Reject, extension: ' + JSON.stringify(ext.userInfo));

        this.state = SessionState.REJECTED;

        this._clearAnswerTimer();

        ext.sessionID = this.ID;
        ext.callType = this.callType;
        ext.callerID = this.initiatorID;
        ext.opponentsIDs = this.opponentsIDs;

        Object.keys(this.peerConnections).forEach(key => {
            const peerConnection = this.peerConnections[key];
            this.signalingProvider.sendMessage(peerConnection.userID, ext, SignalingConstants.SignalingType.REJECT);
        });

        this._close();
    }

    stop(extension) {
        const ext = _prepareExtension(extension);

        Helpers.trace('Stop, extension: ' + JSON.stringify(ext.userInfo));

        this.state = SessionState.HUNGUP;

        if (this.answerTimer) {
            this._clearAnswerTimer();
        }

        ext.sessionID = this.ID;
        ext.callType = this.callType;
        ext.callerID = this.initiatorID;
        ext.opponentsIDs = this.opponentsIDs;

        Object.keys(this.peerConnections).forEach(key => {
            const peerConnection = this.peerConnections[key];
            this.signalingProvider.sendMessage(peerConnection.userID, ext, SignalingConstants.SignalingType.STOP);
        });

        this._close();
    }

    mute(type) {
        this._muteStream(0, type);
    }

    unmute(type) {
        this._muteStream(1, type);
    }


    _processOnCall(callerID, extension) {
        const oppIDs = this._uniqueOpponentsIDs();

        oppIDs.forEach(opID => {
            const pConn = this.peerConnections[opID];

            if (pConn) {
                if (opID == callerID) {
                    pConn.updateRemoteSDP(extension.sdp);

                    /** The group call logic starts here */
                    if (callerID != this.initiatorID && this.state === SessionState.ACTIVE) {
                        this._acceptInternal(callerID, {});
                    }
                }
            } else {
                /** create peer connections for each opponent */
                let peerConnection;
                if (opID != callerID && this.currentUserID > opID) {
                    peerConnection = this._createPeer(opID, 'offer');
                } else {
                    peerConnection = this._createPeer(opID, 'answer');
                }

                this.peerConnections[opID] = peerConnection;

                if (opID == callerID) {
                    peerConnection.updateRemoteSDP(extension.sdp);
                    this._startAnswerTimer();
                }
            }
        });
    }

    _processOnAccept(userID, extension) {
        const peerConnection = this.peerConnections[userID];

        if (peerConnection) {
            peerConnection._clearDialingTimer();

            peerConnection
                .setRemoteSessionDescription('answer', extension.sdp)
                .then(() => {
                    Helpers.trace("'setRemoteSessionDescription' success");
                })
                .catch(error => {
                    Helpers.traceError("'setRemoteSessionDescription' error: " + error);
                });
        } else {
            Helpers.traceWarning("Ignore 'OnAccept', there is no information about peer connection by some reason.");
        }
    }

    _processOnReject(userID, extension) {
        const peerConnection = this.peerConnections[userID];

        this._clearWaitingOfferOrAnswerTimer();

        if (peerConnection) {
            peerConnection.release();
        } else {
            Helpers.traceWarning("Ignore 'OnReject', there is no information about peer connection by some reason.");
        }

        this._closeSessionIfAllConnectionsClosed();
    }

    _processOnStop(userID, extension) {
        this._clearAnswerTimer();

        /** drop the call if the initiator did it */
        if (userID === this.initiatorID) {
            const pcKeys = Object.keys(this.peerConnections);
            if (pcKeys.length > 0) {
                pcKeys.forEach(key => {
                    this.peerConnections[key].release();
                });
            } else {
                Helpers.traceWarning("Ignore 'OnStop', there is no information about peer connections by some reason.");
            }
        } else {
            const pc = this.peerConnections[userID];
            if (pc) {
                pc.release();
            } else {
                Helpers.traceWarning("Ignore 'OnStop', there is no information about peer connection by some reason.");
            }
        }

        this._closeSessionIfAllConnectionsClosed();
    }

    _processOnIceCandidates(userID, extension) {
        const peerConnection = this.peerConnections[userID];
        if (peerConnection) {
            peerConnection.addCandidates(extension.iceCandidates);
        } else {
            Helpers.traceWarning("Ignore 'OnIceCandidates', there is no information about peer connection by some reason.");
        }
    }

    _processCall(peerConnection, ext) {
        const extension = ext || {};

        extension.sessionID = this.ID;
        extension.callType = this.callType;
        extension.callerID = this.initiatorID;
        extension.opponentsIDs = this.opponentsIDs;
        extension.sdp = peerConnection.localDescription.sdp;
        extension.userInfo = ext.userInfo || {};

        this.signalingProvider.sendMessage(peerConnection.userID, extension, SignalingConstants.SignalingType.CALL);
    }

    _processIceCandidates(peerConnection, iceCandidates) {
        const extension = {};

        extension.sessionID = this.ID;
        extension.callType = this.callType;
        extension.callerID = this.initiatorID;
        extension.opponentsIDs = this.opponentsIDs;

        this.signalingProvider.sendCandidate(peerConnection.userID, iceCandidates, extension);
    }

    _processOnNotAnswer(peerConnection) {
        Helpers.trace("Answer timeout callback for session " + this.ID + " for user " + peerConnection.userID);

        this._clearWaitingOfferOrAnswerTimer();

        peerConnection.release();

        Utils.safeCallbackCall(this.onUserNotAnswerListener, this, peerConnection.userID);

        this._closeSessionIfAllConnectionsClosed();
    }

    _onRemoteStreamListener(userID, stream) {
        Utils.safeCallbackCall(this.onRemoteStreamListener, this, userID, stream);
    }

    _onCallStatsReport(userId, stats, error) {
        Utils.safeCallbackCall(this.onCallStatsReport, this, userId, stats, error);
    }

    _onSessionConnectionStateChangedListener(userID, connectionState) {
        Utils.safeCallbackCall(this.onSessionConnectionStateChangedListener, this, userID, connectionState);
    }


    _createPeer(userID, peerConnectionType) {
        this.startCallTime = new Date();

        const pcConfig = {
            iceServers: _prepareIceServers(config.videochat.iceServers)
        };

        if (config.videochat.alwaysRelayCalls) {
            pcConfig.iceTransportPolicy = "relay";
        }

        Helpers.trace("_createPeer, iceServers: " + JSON.stringify(pcConfig));

        const peer = new RTCPeerConnection(pcConfig);
        peer._init(this, userID, this.ID, peerConnectionType);

        return peer;
    }

    _close() {
        Helpers.trace('_close');

        Object.keys(this.peerConnections).forEach(key => {
            const peer = this.peerConnections[key];
            try {
                peer.release();
            } catch (e) {
                console.warn('Peer close error:', e);
            }
        });

        this._closeLocalMediaStream();

        this.state = SessionState.CLOSED;

        Utils.safeCallbackCall(this.onSessionCloseListener, this);
    }

    _closeSessionIfAllConnectionsClosed() {
        let isAllConnectionsClosed = true;

        Object.keys(this.peerConnections).forEach(key => {
            const peerCon = this.peerConnections[key];
            let peerState;

            try {
                /*
                TODO:
                Uses RTCPeerConnection.signalingState instead RTCPeerConnection.iceConnectionState,
                because state 'closed' comes after few time from Safari, but signaling state comes instantly
                */
                peerState = peerCon.iceConnectionState === 'closed' ? 'closed' :
                    peerCon.signalingState === 'closed' ? 'closed' :
                        peerCon.released ? 'closed' : null;
            } catch (err) {
                Helpers.traceError(err);
                // need to set peerState to 'closed' on error. FF will crashed without this part.
                peerState = 'closed';
            }

            if (peerState !== 'closed') {
                isAllConnectionsClosed = false;
            }
        });

        Helpers.trace("All peer connections closed: " + isAllConnectionsClosed);

        if (isAllConnectionsClosed) {
            this._closeLocalMediaStream();

            Utils.safeCallbackCall(this.onSessionCloseListener, this);

            this.state = SessionState.CLOSED;
        }
    }

    _closeLocalMediaStream() {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(audioTrack => {
                audioTrack.stop();
            });

            this.localStream.getVideoTracks().forEach(videoTrack => {
                videoTrack.stop();
            });

            this.localStream = null;
        }
    }

    _muteStream(enabled, type) {
        if (type === 'audio' && this.localStream.getAudioTracks().length > 0) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = !!enabled;
            });
            return;
        }

        if (type === 'video' && this.localStream.getVideoTracks().length > 0) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = !!enabled;
            });
            return;
        }
    }

    _clearAnswerTimer() {
        if (this.answerTimer) {
            Helpers.trace("_clearAnswerTimer");
            clearTimeout(this.answerTimer);
            this.answerTimer = null;
        }
    }

    _startAnswerTimer() {
        Helpers.trace("_startAnswerTimer");

        const answerTimeoutCallback = () => {
            Helpers.trace("_answerTimeoutCallback");

            if (typeof this.onSessionCloseListener === 'function') {
                this._close();
            }

            this.answerTimer = null;
        };

        const answerTimeInterval = config.videochat.answerTimeInterval * 1000;
        this.answerTimer = setTimeout(answerTimeoutCallback, answerTimeInterval);
    }

    _clearWaitingOfferOrAnswerTimer() {
        if (this.waitingOfferOrAnswerTimer) {
            Helpers.trace("_clearWaitingOfferOrAnswerTimer");
            clearTimeout(this.waitingOfferOrAnswerTimer);
            this.waitingOfferOrAnswerTimer = null;
        }
    }

    _startWaitingOfferOrAnswerTimer(time) {
        const timeout = (config.videochat.answerTimeInterval - time) < 0 ? 1 : config.videochat.answerTimeInterval - time;

        const waitingOfferOrAnswerTimeoutCallback = () => {
            Helpers.trace("waitingOfferOrAnswerTimeoutCallback");

            Object.keys(this.peerConnections).forEach(key => {
                const peerConnection = this.peerConnections[key];
                if (peerConnection.state === PeerConnectionState.CONNECTING || peerConnection.state === PeerConnectionState.NEW) {
                    this._processOnNotAnswer(peerConnection);
                }
            });

            this.waitingOfferOrAnswerTimer = null;
        };

        Helpers.trace("_startWaitingOfferOrAnswerTimer, timeout: " + timeout);

        this.waitingOfferOrAnswerTimer = setTimeout(waitingOfferOrAnswerTimeoutCallback, timeout * 1000);
    }

    _uniqueOpponentsIDs() {
        const opponents = [];

        if (this.initiatorID !== this.currentUserID) {
            opponents.push(this.initiatorID);
        }

        this.opponentsIDs.forEach(userID => {
            if (userID != this.currentUserID) {
                opponents.push(parseInt(userID));
            }
        });

        return opponents;
    }

    _uniqueOpponentsIDsWithoutInitiator() {
        const opponents = [];

        this.opponentsIDs.forEach(userID => {
            if (userID != this.currentUserID) {
                opponents.push(parseInt(userID));
            }
        });

        return opponents;
    }

    toString() {
        return 'ID: ' + this.ID + ', initiatorID:  ' + this.initiatorID + ', opponentsIDs: ' + this.opponentsIDs + ', state: ' + this.state + ', callType: ' + this.callType;
    }
}

function generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function _prepareExtension(extension = {}) {
    const ext = {userInfo: extension};

    try {
        if (Utils.isObject(extension)) {
            ext.userInfo = Utils.cloneObject(extension, true)
        } else {
            Helpers.traceWarning("Ignore 'extension', must be an object.");
        }
    } catch (err) {
        Helpers.traceWarning(err.message);
    }

    return ext;
}

function _prepareIceServers(iceServers) {
    const iceServersCopy = Utils.cloneObject(iceServers);

    Object.keys(iceServersCopy).forEach((c, i, a) => {
        if (iceServersCopy[i].hasOwnProperty('url')) {
            iceServersCopy[i].urls = iceServersCopy[i].url;
        } else {
            iceServersCopy[i].url = iceServersCopy[i].urls;
        }
    });

    return iceServersCopy;
}

module.exports = WebRTCSession;
