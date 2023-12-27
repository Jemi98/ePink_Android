const Utils = require('../cubeInternalUtils');
const { mediaDevices } = require('../cubeDependencies')
const { Client: ClientJanusConf } = require('./cubeVideoCallingConference')
const { CALL_TYPES } = require('./cubeConferenceConstansts')

class ConferenceSession {

  constructor(janusConfig) {
    this.id = `${Math.random()}`
    this._clientConf = new ClientJanusConf(janusConfig)
    this._setOnParticipantJoinListener()
    this._setOnParticipantLeftListener()
    this._setOnRemoveStreamListener()
    this._setOnErrorListener()

    this.currentUserDisplayName

    this.localStream
  
    this.onParticipantJoinedListener
    this.onParticipantLeftListener
    this.onErrorListener
  
    this.onSlowLinkListener
    this.onRemoteStreamListener
    this.onRemoteConnectionStateChangedListener
    this.onSessionConnectionStateChangedListener
  
    this.activeVideoDeviceId
    this.activeAudioDeviceId
  }

  get currentRoomId() {
    return this._clientConf.currentDialogId
  }

  set currentRoomId(roomId) {
    return this._clientConf.currentDialogId = roomId
  }

  get currentPublisherPC() {
    return this._clientConf.videoRoomPlugin.webrtcStuff.pc
  }

  _createSession() {
    let isResolved = false;
  
    return new Promise((resolve, reject) => {
      this._clientConf.createSession({
        success: () => {
          isResolved = true;
          resolve();
        },
        error: (err) => {
          if (isResolved) {
            this._onError(err);
          } else {
            reject(err);
          }
        }
      })
    })
  }

  // joinAsPublisher+Listener
  async join(roomId, user_id, userDisplayName) {
    this.currentUserDisplayName = userDisplayName
    await this._createSession()
    this.currentRoomId = roomId

    await this._createHandler(false, user_id)
    await this._join(this.currentRoomId, user_id)
  }

  async joinAsListener(roomId, user_id, userDisplayName) {
    this.currentUserDisplayName = userDisplayName
    await this._createSession()
    this.currentRoomId = roomId

    await this._createHandler(false, user_id, true)
    await this._join(this.currentRoomId, user_id)
  }

  sendKeyframeRequest(roomId) {
    return new Promise((resolve, reject) => {
      this._clientConf.sendKeyframeRequest(roomId, {
        success: resolve,
        error: reject
      })
    })
  }

  async _createListener(user_id) {
    await this._createHandler(true, user_id)
  }

  _createHandler(isRemote, user_id, skipMedia = false) {
    return new Promise((resolve, reject) => {
      this._clientConf.attachVideoConferencingPlugin(isRemote, user_id, skipMedia, {
        success: resolve,
        error: reject,
        iceState: isRemote ? this._onRemoteIceStateChanged.bind(this, user_id) : this._onLocalIceStateChanged.bind(this),
        slowLink: isRemote ? this._onSlowLink.bind(this, user_id) : this._onSlowLink.bind(this, void 0),
        localStream: this.localStream,
        displayName: this.currentUserDisplayName
      })
    })
  }

  _join(roomId, user_id) {
    return new Promise((resolve, reject) => {
      this._clientConf.join(roomId, user_id, false, {
        success: resolve,
        error: reject,
        displayName: this.currentUserDisplayName
      })
    })
  }

  _setOnParticipantJoinListener() {
    this._clientConf.on('participantjoined', this._onParticipantJoined.bind(this))
  }

  _setOnParticipantLeftListener() {
    this._clientConf.on('participantleft', this._onParticipantLeft.bind(this))
  }

  _setOnRemoveStreamListener() {
    this._clientConf.on('remotestream', this._onRemoteStream.bind(this))
  }

  _setOnErrorListener() {
    this._clientConf.on('error', this._onError.bind(this))
  }

  _onParticipantJoined(user_id, userDisplayName, isExistingParticipant) {
    this._createListener(user_id)
    Utils.safeCallbackCall(this.onParticipantJoinedListener, this, user_id, userDisplayName, isExistingParticipant)
  }

  _onParticipantLeft(user_id, userDisplayName) {
    Utils.safeCallbackCall(this.onParticipantLeftListener, this, user_id, userDisplayName)
  }

  _onError(error) {
    Utils.safeCallbackCall(this.onErrorListener, this, error)
  }

  _onLocalIceStateChanged(iceState) {
    Utils.safeCallbackCall(this.onSessionConnectionStateChangedListener, this, iceState)
  }

  _onRemoteIceStateChanged(user_id, iceState) {
    Utils.safeCallbackCall(this.onRemoteConnectionStateChangedListener, this, user_id, iceState)
  }

  _onRemoteStream(stream, user_id) {
    Utils.safeCallbackCall(this.onRemoteStreamListener, this, user_id, stream)
  }

  _onSlowLink(user_id, uplink, nacks) {
    Utils.safeCallbackCall(this.onSlowLinkListener, this, user_id, uplink, nacks)
  }

  listOfOnlineParticipants() {
    return new Promise((resolve, reject) => {
      this._clientConf.listOnlineParticipants(this.currentRoomId, {
        success: resolve,
        error: reject
      })
    })
  }

  async leave() {
    await this._leaveGroup()
    this.currentRoomId = void 0
    this.currentUserDisplayName = void 0
    await this._detachVideoConferencingPlugin()
    await this._destroy()
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = void 0
    }
  }

  _leaveGroup() {
    return new Promise((resolve, reject) => {
      this._clientConf.leave({
        success: resolve,
        error: reject
      })
    })
  }

  _destroy() {
    return new Promise((resolve, reject) => {
      this._clientConf.destroySession({
        success: resolve,
        error: reject
      })
    })
  }

  _detachVideoConferencingPlugin() {
    return new Promise((resolve, reject) => {
      this._clientConf.detachVideoConferencingPlugin({
        success: resolve,
        error: reject
      })
    })
  }

  stopLocalStreamTracks(isIgnoreAudioTrack = false) {
    this.localStream.getTracks().forEach(track => {
      if (isIgnoreAudioTrack && track.kind === CALL_TYPES.AUDIO) {
        return
      } else {
        track.stop()
      }
    })
  }

  getDisplayMedia(mediaParams, isUpdateCurrentStream = false) {
    if (!mediaDevices.getDisplayMedia) {
      throw new Error("Your browser/environment does not support 'getDisplayMedia' API")
    }

    const elementId = mediaParams.elementId
    const attachStreamOptions = mediaParams.options
    
    delete mediaParams.elementId
    delete mediaParams.options

    let prevAudioMuteState, prevVideoMuteState;

    if (isUpdateCurrentStream) {
      prevAudioMuteState = this.isAudioMuted()
      prevVideoMuteState = this.isVideoMuted()
      this.stopLocalStreamTracks(true)
    }

    return mediaDevices.getDisplayMedia(mediaParams)
      .then(stream => {
        return this.updateStream(
          stream,
          mediaParams,
          isUpdateCurrentStream,
          elementId,
          attachStreamOptions,
          prevAudioMuteState,
          prevVideoMuteState,
          true
        )
      })
      .catch(error => {
        throw new Error(error)
      });
  }

  getUserMedia(mediaParams, isUpdateCurrentStream = false) {
    const elementId = mediaParams.elementId
    const attachStreamOptions = mediaParams.options

    delete mediaParams.elementId
    delete mediaParams.options

    let prevAudioMuteState, prevVideoMuteState;

    if (isUpdateCurrentStream) {
      prevAudioMuteState = this.isAudioMuted()
      prevVideoMuteState = this.isVideoMuted()
      this.stopLocalStreamTracks()
    }

    return mediaDevices.getUserMedia(mediaParams).then(stream => {
      return this.updateStream(
        stream,
        mediaParams,
        isUpdateCurrentStream,
        elementId,
        attachStreamOptions,
        prevAudioMuteState,
        prevVideoMuteState,
        false,
      )
    })
  }

  updateStream(
    newStream,
    mediaParams,
    updateCurrentStream,
    elementId,
    attachStreamOptions,
    prevAudioMuteState,
    prevVideoMuteState,
    isNotUpdateAudioTrack,
  ) {
    if (!updateCurrentStream) {
      this.localStream = newStream
    } else {
      this.localStream.getTracks().forEach(track => {
        if (track.kind === CALL_TYPES.AUDIO && isNotUpdateAudioTrack) {
          return
        } else {
          this.localStream.removeTrack(track)
        }
      })
    }

    this.activeAudioDeviceId = this.activeVideoDeviceId = void 0

    newStream.getTracks().forEach(track => {
      const trackSetting = !track.getSettings ? null : track.getSettings()

      if (track.kind === CALL_TYPES.AUDIO && !isNotUpdateAudioTrack) {
        this.activeAudioDeviceId = trackSetting && trackSetting.deviceId
        
        if (updateCurrentStream) {
          track.enabled = !prevAudioMuteState
        }
      } else {
        this.activeVideoDeviceId = trackSetting && trackSetting.deviceId

        if (updateCurrentStream) {
          track.enabled = !prevVideoMuteState
        }
      }

      if (updateCurrentStream) {
        const pcSenders = this.currentPublisherPC.getSenders()
        const sender = pcSenders.find(sender => track.kind === sender.track.kind)
        //update remote stream
        sender.replaceTrack(track)
        //update local stream
        this.localStream.addTrack(track)
      }
    })

    if (elementId) {
      this.attachMediaStream(mediaParams.elementId, this.localStream, attachStreamOptions);
    }

    return this.localStream
  }

  switchMediaTracks(constraints) {
    if (constraints[CALL_TYPES.VIDEO]) {
      return this._switchVideo(constraints[CALL_TYPES.VIDEO])
    } else if (constraints[CALL_TYPES.AUDIO]) {
      return this._switchAudio(constraints[CALL_TYPES.AUDIO])
    }
    return Promise.reject()
  }

  _switchVideo(mediaDeviceId) {
    return this._switchMediaTracks({
      audio: true,
      video: { deviceId: mediaDeviceId }
    })
  }

  _switchAudio(mediaDeviceId) {
    return this._switchMediaTracks({
      audio: { deviceId: mediaDeviceId },
      video: true
    })
  }

  _switchMediaTracks(mediaParams) {
    return this.getUserMedia(mediaParams, true).then(newLocalStream => {
      const newStreamTracks = newLocalStream.getTracks()
      const pcSenders = this.currentPublisherPC.getSenders()
      newStreamTracks.forEach(track => {
        const sender = pcSenders.find(sender => track.kind === sender.track.kind)
        sender.replaceTrack(track)
      })
      return this.localStream
    })
  }

  muteVideo() {
    if (!this.isVideoMuted()) {
      this._clientConf.toggleVideoMute()
    }
  }

  unmuteVideo() {
    if (this.isVideoMuted()) {
      this._clientConf.toggleVideoMute()
    }
  }

  muteAudio() {
    if (!this.isAudioMuted()) {
      this._clientConf.toggleAudioMute()
    }
  }

  unmuteAudio() {
    if (this.isAudioMuted()) {
      this._clientConf.toggleAudioMute()
    }
  }

  isVideoMuted() {
    return this._clientConf.isVideoMuted()
  }

  isAudioMuted() {
    return this._clientConf.isAudioMuted()
  }

  getRemoteUserBitrate(userId) {
    return this._clientConf.getUserBitrate(userId)
  }

  getRemoteUserVolume(userId) {
    return this._clientConf.getUserVolume(userId)
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
        elem.style.transform = 'scaleX(-1)';
      }

      elem.onloadedmetadata = function (e) {
        elem.play();
      };
    } else {
      throw new Error('Unable to attach media stream, element ' + id + ' is undefined');
    }
  }
}

module.exports = ConferenceSession
