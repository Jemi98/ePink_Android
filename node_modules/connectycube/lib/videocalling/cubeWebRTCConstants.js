module.exports = {
    SignalingConstants: {
        MODULE_ID: "WebRTCVideoChat",
        SignalingType: {
            CALL: 'call',
            ACCEPT: 'accept',
            REJECT: 'reject',
            STOP: 'hangUp',
            CANDIDATE: 'iceCandidates'
        }
    },
    SessionConnectionState: {
        UNDEFINED: 0,
        CONNECTING: 1,
        CONNECTED: 2,
        FAILED: 3,
        DISCONNECTED: 4,
        CLOSED: 5,
        COMPLETED: 6
    },
    SessionState: {
        NEW: 1,
        ACTIVE: 2,
        HUNGUP: 3,
        REJECTED: 4,
        CLOSED: 5
    },
    PeerConnectionState: {
        NEW: 1,
        CONNECTING: 2,
        CHECKING: 3,
        CONNECTED: 4,
        DISCONNECTED: 5,
        FAILED: 6,
        CLOSED: 7,
        COMPLETED: 8
    },
    CallType: {
        VIDEO: 1,
        AUDIO: 2
    }
};
