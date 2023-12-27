const Utils = require('./cubeInternalUtils')
const config = require('./cubeConfig')

class AddressBookService {
  constructor (proxy) {
    this.proxy = proxy
  }

  uploadAddressBook (list, opts) {
    if (!Utils.isArray(list)) {
      new Error('First parameter must be an Array.')
      return
    }

    const data = { contacts: list }

    if (opts) {
      if (opts.force) {
        data.force = opts.force
      }

      if (opts.udid) {
        data.udid = opts.udid
      }
    }

    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(config.urls.addressbook),
      data: data
    }

    return this.proxy.ajax(ajaxParams)
  }

  get (udid) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.addressbook)
    }
    if (udid) {
      ajaxParams.data = { udid: udid }
    }

    return this.proxy.ajax(ajaxParams)
  }

  getRegisteredUsers (isCompact) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.addressbookRegistered)
    }
    if (isCompact) {
      ajaxParams.data = { compact: 1 }
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = AddressBookService
