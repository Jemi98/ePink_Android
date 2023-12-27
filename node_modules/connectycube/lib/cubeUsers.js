const config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

class UsersService {
  constructor(proxy) {
    this.proxy = proxy
  }

  get(params) {
    let data = Utils.cloneObject(params)
    let url, item
    const filters = []

    if (data.order) {
      data.order = generateOrder(data.order)
    }

    if (data && data.filter) {
      if (Utils.isArray(data.filter)) {
        data.filter.forEach(function (el) {
          item = generateFilter(el)
          filters.push(item)
        })
      } else {
        item = generateFilter(data.filter)
        filters.push(item)
      }
      data.filter = filters
    }

    if (typeof data === 'number') {
      url = data
      data = {}
    } else {
      if (data.login) {
        url = 'by_login'
      } else if (data.full_name) {
        url = 'by_full_name'
      } else if (data.facebook_id) {
        url = 'by_facebook_id'
      } else if (data.twitter_id) {
        url = 'by_twitter_id'
      } else if (data.phone) {
        url = 'phone'
      } else if (data.email) {
        url = 'by_email'
      } else if (data.tags) {
        url = 'by_tags'
      } else if (data.external) {
        url = 'external/' + data.external
        data = {}
      }
    }

    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.users, url),
      data: data
    }

    return this.proxy.ajax(ajaxParams)
  }

  signup(params) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(config.urls.users),
      data: {
        user: params
      }
    }

    return this.proxy.ajax(ajaxParams)
  }

  update(params) {
    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(config.urls.users, this.proxy.getCurrentUserId()),
      data: {
        user: params
      }
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete() {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(config.urls.users, this.proxy.getCurrentUserId()),
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }

  resetPassword(email) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.users + '/password/reset'),
      data: {
        email: email
      },
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = UsersService

const DATE_FIELDS = ['created_at', 'updated_at', 'last_request_at']
const NUMBER_FIELDS = ['id', 'external_user_id']

function generateFilter(filter) {
  const obj = Utils.cloneObject(filter)
  let type = DATE_FIELDS.includes(obj.field) ? 'date' : typeof obj.value

  if (Utils.isArray(obj.value)) {
    if (type === 'object') {
      type = typeof obj.value[0]
    }
    obj.value = obj.value.toString()
  }

  return [type, obj.field, obj.param, obj.value].join(' ')
}

function generateOrder(obj) {
  const type =
    obj.field in DATE_FIELDS
      ? 'date'
      : obj.field in NUMBER_FIELDS
        ? 'number'
        : 'string'
  return [obj.sort, type, obj.field].join(' ')
}
