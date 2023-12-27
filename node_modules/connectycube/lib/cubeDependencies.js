const Utils = require('./cubeInternalUtils')

let fetchImpl, formDataImpl

let RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
  mediaDevices;

let XMPPClient = require('@xmpp/client/react-native'); // https://github.com/xmppjs/xmpp.js/issues/807

if (Utils.getEnv().browser) {
  fetchImpl = fetch
  formDataImpl = FormData

  RTCPeerConnection = window.RTCPeerConnection
  RTCSessionDescription = window.RTCSessionDescription
  RTCIceCandidate = window.RTCIceCandidate
  MediaStream = window.MediaStream
  mediaDevices = navigator.mediaDevices
} else if (Utils.getEnv().nativescript) {
  fetchImpl = fetch
  formDataImpl = FormData
} else if (Utils.getEnv().node) {
  fetchImpl = require('node-fetch')
  formDataImpl = require('form-data')
} else if (Utils.getEnv().reactnative) {
  fetchImpl = fetch
  formDataImpl = FormData
}

module.exports = {
  fetchImpl: fetchImpl,
  formDataImpl: formDataImpl,
  XMPPClient: XMPPClient,
  RTCPeerConnection: RTCPeerConnection,
  RTCSessionDescription: RTCSessionDescription,
  RTCIceCandidate: RTCIceCandidate,
  MediaStream: MediaStream,
  mediaDevices: mediaDevices
}
