const config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

class PushNotificationsService {
  constructor (proxy) {
    this.proxy = proxy

    this.subscriptions = new SubscriptionsService(proxy)
    this.events = new EventsService(proxy)

    this.base64Encode = function (str) {
      return Utils.toBase64(str)
    }
  }
}

class SubscriptionsService {
  constructor (proxy) {
    this.proxy = proxy
  }

  create (params) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(config.urls.subscriptions),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  list () {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.subscriptions)
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete (id) {
    const ajaxParams = {
      type: 'DELETE',
      dataType: 'text',
      url: Utils.getUrl(config.urls.subscriptions, id)
    }

    return this.proxy.ajax(ajaxParams)
  }
}

class EventsService {
  constructor (proxy) {
    this.proxy = proxy
  }

  create (params) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(config.urls.events),
      data: {
        event: params
      }
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = PushNotificationsService
