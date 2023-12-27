const Config = require('../cubeConfig')
const Utils = require('../cubeInternalUtils')

const DIALOGS_API_URL = Config.urls.chat + '/Dialog'

class ChatDialogsService {
  constructor (proxy) {
    this.proxy = proxy
  }

  list (params) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(DIALOGS_API_URL),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  create (params) {
    const data = Utils.cloneObject(params)

    if (data && data.occupants_ids && Utils.isArray(data.occupants_ids)) {
      data.occupants_ids = data.occupants_ids.join(', ')
    }

    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(DIALOGS_API_URL),
      data: data
    }

    return this.proxy.ajax(ajaxParams)
  }

  update (id, params) {
    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(DIALOGS_API_URL, id),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete (idOrIds, params) {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(DIALOGS_API_URL, idOrIds),
    }

    if (typeof idOrIds === 'string' || (Utils.isArray(idOrIds) && idOrIds.length === 1)) {
      ajaxParams.dataType = 'text'
    }

    if (params) {
      ajaxParams.data = params
    }

    return this.proxy.ajax(ajaxParams)
  }

  addAdmins (id, admins_ids) {
    const params = {
      push_all: {
        admins_ids: admins_ids
      }
    }

    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'admins'),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  removeAdmins (id, admins_ids) {
    const params = {
      pull_all: {
        admins_ids: admins_ids
      }
    }

    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'admins'),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  subscribe (id) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'subscribe')
    }

    return this.proxy.ajax(ajaxParams)
  }

  unsubscribe (id) {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'subscribe'),
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }

  subscribeToPublic (id) {
    return this.subscribe(id)
  }

  unsubscribeFromPublic (id) {
    return this.unsubscribe(id)
  }

  updateNotificationsSettings (id, enabled) {
    const settings = {
      enabled: enabled ? 1 : 0
    }

    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'notifications'),
      data: settings
    }

    return this.proxy.ajax(ajaxParams)
  }

  getNotificationsSettings (id) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'notifications')
    }

    return this.proxy.ajax(ajaxParams)
  }

  getPublicOccupants (id, params) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(DIALOGS_API_URL, id, 'occupants'),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  clearHistory (id) {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(DIALOGS_API_URL, 'clearHistory', id),
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = ChatDialogsService
