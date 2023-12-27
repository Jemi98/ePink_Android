const config = require('../cubeConfig');
const Helpers = require('./cubeWebRTCHelpers');
const SessionConnectionState = require('./cubeWebRTCConstants').SessionConnectionState;
const RTCPeerConnection = require('../cubeDependencies').RTCPeerConnection;
const RTCSessionDescription = require('../cubeDependencies').RTCSessionDescription;
const RTCIceCandidate = require('../cubeDependencies').RTCIceCandidate;
const MediaStream = require('../cubeDependencies').MediaStream;
const PeerConnectionState = require('./cubeWebRTCConstants').PeerConnectionState;

RTCPeerConnection.prototype._init = function (delegate, userID, sessionID, type) {
    Helpers.trace('RTCPeerConnection init. userID: ' + userID + ', sessionID: ' + sessionID + ', type: ' + type);

    this.delegate = delegate;

    this.sessionID = sessionID;
    this.userID = userID;
    this.type = type;
    this.remoteSDP = null;

    this.state = PeerConnectionState.NEW;

    this.remoteStream = new MediaStream();
    this.ontrack = this.onAddRemoteMediaCallback.bind(this);
    this.onicecandidate = this.onIceCandidateCallback.bind(this);
    this.onsignalingstatechange = this.onSignalingStateCallback.bind(this);
    this.oniceconnectionstatechange = this.onIceConnectionStateCallback.bind(this);

    this.onStatusClosedChecker = undefined;

    /** We use this timer interval to dial a user - produce the call requests each N seconds. */
    this.dialingTimer = null;
    this.answerTimeInterval = 0;
    this.statsReportTimer = null;

    this.iceCandidates = [];

    this.released = false;
};

RTCPeerConnection.prototype.release = function () {
    this._clearDialingTimer();
    this._clearStatsReportTimer();

    this.close();

    // TODO: 'closed' state doesn't fires on Safari 11 (do it manually)
    if (Helpers.getVersionSafari() >= 11) {
        this.onIceConnectionStateCallback();
    }

    this.released = true;
};

RTCPeerConnection.prototype.updateRemoteSDP = function (newSDP) {
    if (!newSDP) {
        throw new Error("sdp string can't be empty.");
    } else {
        this.remoteSDP = newSDP;
    }
};

RTCPeerConnection.prototype.getRemoteSDP = function () {
    return this.remoteSDP;
};

RTCPeerConnection.prototype.setRemoteSessionDescription = function (type, remoteSDP) {
    const desc = new RTCSessionDescription({
        sdp: remoteSDP,
        type: type
    });

    return this.setRemoteDescription(desc);
};

RTCPeerConnection.prototype.getAndSetLocalSessionDescription = function (maxBandwidth) {
    return new Promise((resolve, reject) => {
        this.state = PeerConnectionState.CONNECTING;

        if (this.type === 'offer') {
            this.createOffer()
                .then(offer => {
                    this.setLocalDescription(offer)
                        .then(result => {
                            /*  caller sets maxBandwidth to RTCRtpSender parameters' encodings */
                            this.setRTCRtpSenderMaxBandwidth(maxBandwidth);
                            resolve(result);
                        }).catch(reject);
                }).catch(reject);
        } else {
            this.createAnswer()
                .then(answer => {
                    this.setLocalDescription(answer)
                        .then(result => {
                            /* callee sets maxBandwidth (bitrate) to RTCRtpSender parameters' encodings */
                            this.setRTCRtpSenderMaxBandwidth(maxBandwidth);
                            resolve(result);
                        })
                        .catch(reject);
                }).catch(reject);
        }
    });
};

RTCPeerConnection.prototype.setRTCRtpSenderMaxBandwidth = function (maxBandwidth) {
    const senders = this.getSenders() || [];

    senders.forEach(sender => {
        if (sender.track.kind === 'video') {
            const params = sender.getParameters();

            if (!params.encodings) {
                params.encodings = [];
            }
            
            if (!maxBandwidth) {
                delete params.encodings[0]?.maxBitrate;
            } else {
                params.encodings[0].maxBitrate = maxBandwidth * 1000;
            }

            sender.setParameters(params)
                .then(() => {
                    Helpers.trace("Set maxBandwidth success [" + this.userID + "]: " + maxBandwidth + " kbps")
                })
                .catch(err => {
                    Helpers.trace("Set maxBandwidth error [" + this.userID + "]: " + err)
                });
        }
    });
}

RTCPeerConnection.prototype.addCandidates = function (iceCandidates) {
    for (let i = 0, len = iceCandidates.length; i < len; i++) {
        const candidate = {
            sdpMLineIndex: iceCandidates[i].sdpMLineIndex,
            sdpMid: iceCandidates[i].sdpMid,
            candidate: iceCandidates[i].candidate
        };

        if (!candidate.candidate) {
            continue;
        }

        this.addIceCandidate(
            new RTCIceCandidate(candidate),
            () => { },
            error => {
                Helpers.traceError("Error on 'addIceCandidate': " + error);
            }
        );
    }
};

RTCPeerConnection.prototype.toString = function () {
    return 'sessionID: ' + this.sessionID + ', userID:  ' + this.userID + ', type: ' + this.type + ', state: ' + this.state;
};

/// CALLBACKS

RTCPeerConnection.prototype.onSignalingStateCallback = function () {
    Helpers.trace("onSignalingStateCallback: " + this.signalingState);

    if (this.signalingState === 'stable' && this.iceCandidates.length > 0) {
        this.delegate._processIceCandidates(this, this.iceCandidates);
        this.iceCandidates.length = 0;
    }
};

RTCPeerConnection.prototype.onIceCandidateCallback = function (event) {
    const candidate = event.candidate;

    if (candidate) {
        const iceCandidateData = {
            sdpMLineIndex: candidate.sdpMLineIndex,
            sdpMid: candidate.sdpMid,
            candidate: candidate.candidate
        };

        if (this.signalingState === 'stable') {
            this.delegate._processIceCandidates(this, [iceCandidateData]);
        } else {
            this.iceCandidates.push(iceCandidateData);
        }
    }
};

/** handler of remote media stream */
RTCPeerConnection.prototype.onAddRemoteMediaCallback = function (event) {
    if (typeof this.delegate._onRemoteStreamListener === 'function') {
        this.remoteStream.addTrack(event.track);

        if (((this.delegate.callType == 1) && this.remoteStream.getVideoTracks().length) ||
            ((this.delegate.callType == 2) && this.remoteStream.getAudioTracks().length)) {
            this.delegate._onRemoteStreamListener(this.userID, this.remoteStream);
        }

        this._getStatsWrap();
    }
};

RTCPeerConnection.prototype.onIceConnectionStateCallback = function () {
    Helpers.trace("onIceConnectionStateCallback: " + this.iceConnectionState);

    if (typeof this.delegate._onSessionConnectionStateChangedListener === 'function') {
        let conState = null;

        if (Helpers.getVersionSafari() >= 11) {
            clearTimeout(this.onStatusClosedChecker);
        }

        switch (this.iceConnectionState) {
            case 'checking':
                this.state = PeerConnectionState.CHECKING;
                conState = SessionConnectionState.CONNECTING;
                break;

            case 'connected':
                this._clearWaitingReconnectTimer();
                this.state = PeerConnectionState.CONNECTED;
                conState = SessionConnectionState.CONNECTED;
                break;

            case 'completed':
                this._clearWaitingReconnectTimer();
                this.state = PeerConnectionState.COMPLETED;
                conState = SessionConnectionState.COMPLETED;
                break;

            case 'failed':
                this.state = PeerConnectionState.FAILED;
                conState = SessionConnectionState.FAILED;
                break;

            case 'disconnected':
                this._startWaitingReconnectTimer();
                this.state = PeerConnectionState.DISCONNECTED;
                conState = SessionConnectionState.DISCONNECTED;

                // repeat to call onIceConnectionStateCallback to get status "closed"
                if (Helpers.getVersionSafari() >= 11) {
                    this.onStatusClosedChecker = setTimeout(() => {
                        this.onIceConnectionStateCallback();
                    }, 500);
                }
                break;

            // TODO: this state doesn't fires on Safari 11
            case 'closed':
                this._clearWaitingReconnectTimer();
                this.state = PeerConnectionState.CLOSED;
                conState = SessionConnectionState.CLOSED;
                break;

            default:
                break;
        }

        if (conState) {
            this.delegate._onSessionConnectionStateChangedListener(this.userID, conState);
        }
    }
};


/// PRIVATE

RTCPeerConnection.prototype._clearStatsReportTimer = function () {
    if (this.statsReportTimer) {
        clearInterval(this.statsReportTimer);
        this.statsReportTimer = null;
    }
};

RTCPeerConnection.prototype._getStatsWrap = function () {
    let statsReportInterval;
    let lastResult;

    if (config.videochat && config.videochat.statsReportTimeInterval) {
        if (isNaN(+config.videochat.statsReportTimeInterval)) {
            Helpers.traceError('statsReportTimeInterval (' + config.videochat.statsReportTimeInterval + ') must be integer.');
            return;
        }
        statsReportInterval = config.videochat.statsReportTimeInterval * 1000;

        const _statsReportCallback = () => {
            _getStats(this, lastResult, (results, lastResults) => {
                lastResult = lastResults;
                this.delegate._onCallStatsReport(this.userID, results, null);
            }, err => {
                Helpers.traceError('_getStats error. ' + err.name + ': ' + err.message);
                this.delegate._onCallStatsReport(this.userID, null, err);
            });
        };

        Helpers.trace('Stats tracker has been started.');
        this.statsReportTimer = setInterval(_statsReportCallback, statsReportInterval);
    }
};

RTCPeerConnection.prototype._clearWaitingReconnectTimer = function () {
    if (this.waitingReconnectTimeoutCallback) {
        Helpers.trace('_clearWaitingReconnectTimer');
        clearTimeout(this.waitingReconnectTimeoutCallback);
        this.waitingReconnectTimeoutCallback = null;
    }
};

RTCPeerConnection.prototype._startWaitingReconnectTimer = function () {
    const timeout = config.videochat.disconnectTimeInterval * 1000;
    const waitingReconnectTimeoutCallback = () => {
        Helpers.trace('waitingReconnectTimeoutCallback');

        clearTimeout(this.waitingReconnectTimeoutCallback);

        this.release();

        this.delegate._closeSessionIfAllConnectionsClosed();
    };

    Helpers.trace('_startWaitingReconnectTimer, timeout: ' + timeout);

    this.waitingReconnectTimeoutCallback = setTimeout(waitingReconnectTimeoutCallback, timeout);
};

RTCPeerConnection.prototype._clearDialingTimer = function () {
    if (this.dialingTimer) {
        Helpers.trace('_clearDialingTimer');

        clearInterval(this.dialingTimer);
        this.dialingTimer = null;
        this.answerTimeInterval = 0;
    }
};

RTCPeerConnection.prototype._startDialingTimer = function (extension, withOnNotAnswerCallback) {
    const dialingTimeInterval = config.videochat.dialingTimeInterval * 1000;

    Helpers.trace('_startDialingTimer, dialingTimeInterval: ' + dialingTimeInterval);

    const _dialingCallback = (extension, withOnNotAnswerCallback, skipIncrement) => {
        if (!skipIncrement) {
            this.answerTimeInterval += config.videochat.dialingTimeInterval * 1000;
        }

        Helpers.trace('_dialingCallback, answerTimeInterval: ' + this.answerTimeInterval);

        if (this.answerTimeInterval >= config.videochat.answerTimeInterval * 1000) {
            this._clearDialingTimer();

            if (withOnNotAnswerCallback) {
                this.delegate._processOnNotAnswer(this);
            }
        } else {
            this.delegate._processCall(this, extension);
        }
    };

    this.dialingTimer = setInterval(_dialingCallback, dialingTimeInterval, extension, withOnNotAnswerCallback, false);

    // call for the 1st time
    _dialingCallback(extension, withOnNotAnswerCallback, true);
};

/**
 * PRIVATE
 */
function _getStats(peer, lastResults, successCallback, errorCallback) {
    let statistic = {
        'local': {
            'audio': {},
            'video': {},
            'candidate': {}
        },
        'remote': {
            'audio': {},
            'video': {},
            'candidate': {}
        }
    };

    if (Helpers.getVersionFirefox()) {
        let localStream = peer.getLocalStreams().length ? peer.getLocalStreams()[0] : peer.delegate.localStream,
            localVideoSettings = localStream.getVideoTracks().length ? localStream.getVideoTracks()[0].getSettings() : null;

        statistic.local.video.frameHeight = localVideoSettings && localVideoSettings.height;
        statistic.local.video.frameWidth = localVideoSettings && localVideoSettings.width;
    }

    peer.getStats(null).then(results => {
        results.forEach(result => {
            let item;

            if (result.bytesReceived && result.type === 'inbound-rtp') {
                item = statistic.remote[result.mediaType];
                item.bitrate = _getBitratePerSecond(result, lastResults, false);
                item.bytesReceived = result.bytesReceived;
                item.packetsReceived = result.packetsReceived;
                item.timestamp = result.timestamp;
                if (result.mediaType === 'video' && result.framerateMean) {
                    item.framesPerSecond = Math.round(result.framerateMean * 10) / 10;
                }
            } else if (result.bytesSent && result.type === 'outbound-rtp') {
                item = statistic.local[result.mediaType];
                item.bitrate = _getBitratePerSecond(result, lastResults, true);
                item.bytesSent = result.bytesSent;
                item.packetsSent = result.packetsSent;
                item.timestamp = result.timestamp;
                if (result.mediaType === 'video' && result.framerateMean) {
                    item.framesPerSecond = Math.round(result.framerateMean * 10) / 10;
                }
            } else if (result.type === 'local-candidate') {
                item = statistic.local.candidate;
                if (result.candidateType === 'host' && result.mozLocalTransport === 'udp' && result.transport === 'udp') {
                    item.protocol = result.transport;
                    item.ip = result.ipAddress;
                    item.port = result.portNumber;
                } else if (!Helpers.getVersionFirefox()) {
                    item.protocol = result.protocol;
                    item.ip = result.ip;
                    item.port = result.port;
                }
            } else if (result.type === 'remote-candidate') {
                item = statistic.remote.candidate;
                item.protocol = result.protocol || result.transport;
                item.ip = result.ip || result.ipAddress;
                item.port = result.port || result.portNumber;
            } else if (result.type === 'track' && result.kind === 'video' && !Helpers.getVersionFirefox()) {
                if (result.remoteSource) {
                    item = statistic.remote.video;
                    item.frameHeight = result.frameHeight;
                    item.frameWidth = result.frameWidth;
                    item.framesPerSecond = _getFramesPerSecond(result, lastResults, false);
                } else {
                    item = statistic.local.video;
                    item.frameHeight = result.frameHeight;
                    item.frameWidth = result.frameWidth;
                    item.framesPerSecond = _getFramesPerSecond(result, lastResults, true);
                }
            }
        });
        successCallback(statistic, results);
    }, errorCallback);

    const _getBitratePerSecond = (result, lastResults, isLocal) => {
        let lastResult = lastResults && lastResults.get(result.id),
            seconds = lastResult ? ((result.timestamp - lastResult.timestamp) / 1000) : 5,
            kilo = 1024,
            bit = 8,
            bitrate;

        if (!lastResult) {
            bitrate = 0;
        } else if (isLocal) {
            bitrate = bit * (result.bytesSent - lastResult.bytesSent) / (kilo * seconds);
        } else {
            bitrate = bit * (result.bytesReceived - lastResult.bytesReceived) / (kilo * seconds);
        }

        return Math.round(bitrate);
    }

    const _getFramesPerSecond = (result, lastResults, isLocal) => {
        let lastResult = lastResults && lastResults.get(result.id),
            seconds = lastResult ? ((result.timestamp - lastResult.timestamp) / 1000) : 5,
            framesPerSecond;

        if (!lastResult) {
            framesPerSecond = 0;
        } else if (isLocal) {
            framesPerSecond = (result.framesSent - lastResult.framesSent) / seconds;
        } else {
            framesPerSecond = (result.framesReceived - lastResult.framesReceived) / seconds;
        }

        return Math.round(framesPerSecond * 10) / 10;
    }
}

function updateVideoBandwidthRestriction(sdp, maxBandwidth) {
    if (!maxBandwidth || typeof maxBandwidth === 'number' && maxBandwidth <= 0) {
        return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '');
    }

    const isFirefox = !!Helpers.getVersionFirefox();
    const modifier = isFirefox ? 'TIAS' : 'AS';
    const bandwidth = isFirefox ? maxBandwidth * 1000 : maxBandwidth;
    const lines = sdp.split('\n');

    let line = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('m=video') === 0) {
            line = i;
            break;
        }
    }

    if (line === -1) {
        return sdp;
    }

    line++;

    while (lines[line].indexOf('i=') === 0 || lines[line].indexOf('c=') === 0) {
        line++;
    }

    if (lines[line].indexOf('b') === 0) {
        lines[line] = `b=${modifier}:${bandwidth}`;
        return lines.join('\n');
    }

    let newLines = lines.slice(0, line);

    newLines.push(`b=${modifier}:${bandwidth}`);
    newLines = newLines.concat(lines.slice(line, lines.length));

    return newLines.join('\n');
}

module.exports = RTCPeerConnection;
