const config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

class ConnectyCube {

  constructor() {
    // React Native RTCView
    if (Utils.getEnv().reactnative && Utils.isWebRTCAvailble()) {
      this.RTCView = require('./cubeDependencies').RTCView
    }
  }

  init(credentials, configMap) {
    if (configMap && typeof configMap === 'object') {
      config.set(configMap)
    }

    const Proxy = require('./cubeProxy')
    const Auth = require('./cubeAuth')
    const Users = require('./cubeUsers')
    const Storage = require('./cubeStorage')
    const PushNotifications = require('./cubePushNotifications')
    const Data = require('./cubeData')
    const AddressBook = require('./cubeAddressBook')
    const Chat = require('./messaging/cubeChat')
    const DialogProxy = require('./messaging/cubeDialog')
    const MessageProxy = require('./messaging/cubeMessage')
    const Meeting = require('./cubeMeeting')
    const Whiteboard = require('./cubeWhiteboard')

    this.service = new Proxy()
    this.auth = new Auth(this.service)
    this.users = new Users(this.service)
    this.storage = new Storage(this.service)
    this.pushnotifications = new PushNotifications(this.service)
    this.data = new Data(this.service)
    this.addressbook = new AddressBook(this.service)
    this.chat = new Chat(this.service)
    this.chat.dialog = new DialogProxy(this.service)
    this.chat.message = new MessageProxy(this.service)
    this.meeting = new Meeting(this.service)
    this.whiteboard = new Whiteboard(this.service)
    this.utils = Utils

    // add WebRTC API if API is avaible
    if (Utils.isWebRTCAvailble()) {
      // p2p calls client
      const WebRTCClient = require('./videocalling/cubeWebRTCClient')
      // conf calls client
      const ConferenceClient = require('./videocalling_conference/cubeConferenceClient')

      this.videochat = new WebRTCClient(this.chat.xmppClient, this.service)
      this.videochatconference = new ConferenceClient(this.service)
      this.chat.webrtcSignalingProcessor = this.videochat.signalingProcessor
    } else {
      this.videochat = null
      this.videochatconference = null
    }

    // Initialization by outside token
    if (credentials.token) {
      config.creds.appId = credentials.appId
      this.service.setSession({ token: credentials.token })
    } else {
      config.creds.appId = credentials.appId
      config.creds.authKey = credentials.authKey
      config.creds.authSecret = credentials.authSecret
    }
  }

  setSession(session) {
    this.auth.setSession(session)
  }

  getSession() {
    return this.auth.getSession()
  }

  createSession(params) {
    return this.auth.createSession(params)
  }

  destroySession() {
    return this.auth.destroySession()
  }

  createWebSession(params) {
    return this.auth.createWebSession(params)
  }

  checkWebSessionUntilUpgrade(callback) {
    return this.auth.checkWebSessionUntilUpgrade(callback)
  }

  upgradeWebSession(webToken) {
    return this.auth.upgradeWebSession(webToken)
  }

  login(params) {
    return this.auth.login(params)
  }

  logout() {
    return this.auth.logout()
  }
}

const CB = new ConnectyCube()
CB.ConnectyCube = ConnectyCube
module.exports = CB
