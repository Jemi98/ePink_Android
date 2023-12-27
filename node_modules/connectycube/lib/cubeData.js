const config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

class DataService {
  constructor(proxy) {
    this.proxy = proxy
  }

  create(className, data) {
    const ajaxParams = { type: 'POST' }

    if (Utils.isArray(data)) {
      ajaxParams.url = Utils.getUrl(config.urls.data, `${className}/multi`)
      ajaxParams.data = { record: {} }

      data.forEach((item, index) => ajaxParams.data.record[index] = item);
    } else {
      ajaxParams.url = Utils.getUrl(config.urls.data, className)
      ajaxParams.data = data
    }

    return this.proxy.ajax(ajaxParams)
  }

  list(className, filters) {
    const ajaxParams = {
      url: Utils.getUrl(config.urls.data, className),
      data: filters
    }

    return this.proxy.ajax(ajaxParams)
  }

  update(className, data = {}) {
    const ajaxParams = { type: 'PUT' }

    if (Utils.isArray(data)) {
      ajaxParams.url = Utils.getUrl(config.urls.data, `${className}/multi`)
      ajaxParams.data = { record: {} }

      data.forEach((item, index) => ajaxParams.data.record[index + 1] = item);
    } else {
      ajaxParams.url = Utils.getUrl(config.urls.data, `${className}/${data._id || data.id}`)
      ajaxParams.data = data
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete(className, requestedData) {
    const typesData = {
      id: 1,
      ids: 2,
      criteria: 3
    }

    const ajaxParams = {
      type: 'DELETE'
    }

    /** Define what type of data passed by client */
    let requestedTypeOf
    if (typeof requestedData === 'string') {
      requestedTypeOf = typesData.id
    } else if (Utils.isArray(requestedData)) {
      requestedTypeOf = requestedData.length > 1 ? typesData.ids : typesData.id
    } else if (Utils.isObject(requestedData)) {
      requestedTypeOf = typesData.criteria
    }

    if (requestedTypeOf === typesData.id) {
      ajaxParams.url = Utils.getUrl(
        config.urls.data,
        className + '/' + requestedData
      )
      ajaxParams.dataType = 'text';
    } else if (requestedTypeOf === typesData.ids) {
      ajaxParams.url = Utils.getUrl(
        config.urls.data,
        className + '/' + requestedData.toString()
      )
    } else if (requestedTypeOf === typesData.criteria) {
      ajaxParams.url = Utils.getUrl(
        config.urls.data,
        className + '/by_criteria'
      )
      ajaxParams.data = requestedData
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = DataService
