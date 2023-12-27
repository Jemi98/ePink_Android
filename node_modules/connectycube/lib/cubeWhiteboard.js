const Config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

const WHITEBOARDS_API_URL = Config.urls.whiteboards
const WHITEBOARDS_SERVER = Config.whiteboard.server

class WhiteboardService {
  constructor (proxy) {
    this.proxy = proxy
  }

  getURL({id, title, username}) {
    return `${WHITEBOARDS_SERVER}?whiteboardid=${id}&username=${username}&title=${title}`
  }

  get(paramsOrId) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(WHITEBOARDS_API_URL),
      data: typeof paramsOrId === 'string' ? {chat_dialog_id: paramsOrId} : paramsOrId
    }

    return this.proxy.ajax(ajaxParams)
  }

  create(params = {}) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(WHITEBOARDS_API_URL),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  update(id, params = {}) {
    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(WHITEBOARDS_API_URL, id),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete(id) {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(WHITEBOARDS_API_URL, id),
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = WhiteboardService