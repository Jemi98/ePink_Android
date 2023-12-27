const config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

class AuthService {
  constructor(proxy) {
    this.proxy = proxy
    this.webSessionCheckInterval = null
  }

  setSession(session) {
    this.proxy.setSession(session)
  }

  getSession() {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.session)
    }

    return new Promise((resolve, reject) => {
      this.proxy
        .ajax(ajaxParams)
        .then(res => {
          resolve(res.session)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  createSession(params) {
    if (config.creds.appId === '' ||
      config.creds.authKey === '' ||
      config.creds.authSecret === '') {
      throw new Error(
        'Cannot create a new session without app credentials (app ID, auth key and auth secret)'
      )
    }

    const route = params && params.hasOwnProperty('long') ? config.urls.webSession : config.urls.session

    const sessionParams = Utils.generateCreateSessionParams(params)
    sessionParams.signature = Utils.signParams(sessionParams, config.creds.authSecret)

    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(route),
      data: sessionParams
    }

    return new Promise((resolve, reject) => {
      this.proxy
        .ajax(ajaxParams)
        .then(res => {
          const response = res.qr_code ? res.qr_code : res.session
          this.proxy.setSession(res.session)
          this.proxy.setCurrentUserId(res.session.user_id)
          resolve(response)
        })
        .catch(error => {
          console.log("error", error);
          reject(error)
        })
    })
  }

  destroySession() {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(config.urls.session),
      dataType: 'text'
    }

    return new Promise((resolve, reject) => {
      this.proxy
        .ajax(ajaxParams)
        .then(res => {
          this.proxy.setSession(null)
          this.proxy.setCurrentUserId(null)

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  createWebSession(params) {
    if (!params) {
      params = {
        long: 0
      }
    }

    return this.createSession(params)
  }

  checkWebSessionUntilUpgrade(callback) {
    const interval = config.webSession.getSessionTimeInterval
    const timeoutError = new Error(
      'The web session check interval was stopped (timeout)'
    )

    let timeleft = config.webSession.getSessionTimeout

    const _clearWebSessionCheckTimer = () => {
      this.webSessionCheckInterval &&
        clearInterval(this.webSessionCheckInterval)
    }

    _clearWebSessionCheckTimer()

    this.webSessionCheckInterval = setInterval(() => {
      this.getSession()
        .then(session => {
          if (session.user_id !== 0) {
            _clearWebSessionCheckTimer()
            this.proxy.setCurrentUserId(session.user_id)
            this.proxy.setSession(session)
            callback(null, session)
          } else {
            if (timeleft > interval) {
              timeleft -= interval
            } else {
              _clearWebSessionCheckTimer()
              callback(timeoutError, null)
            }
          }
        })
        .catch(error => {
          _clearWebSessionCheckTimer()
          callback(error, null)
        })
    }, interval * 1000)

    return this.webSessionCheckInterval
  }

  upgradeWebSession(webToken) {
    const ajaxParams = {
      type: 'PATCH',
      url: Utils.getUrl(config.urls.webSession),
      dataType: 'text',
      data: {
        web_token: webToken
      }
    }

    return this.proxy.ajax(ajaxParams)
  }

  login(params) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(config.urls.login),
      data: params
    }

    return new Promise((resolve, reject) => {
      this.proxy
        .ajax(ajaxParams)
        .then(res => {
          this.proxy.setCurrentUserId(res.user.id)
          resolve(res.user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  logout() {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(config.urls.login),
      dataType: 'text'
    }

    this.proxy.setCurrentUserId(null)

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = AuthService
