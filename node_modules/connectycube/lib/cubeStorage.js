const config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

class StorageService {
  constructor(proxy) {
    this.proxy = proxy
  }

  list(params) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.blobs),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  create(params) {
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(config.urls.blobs),
      data: { blob: params }
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete(id) {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(config.urls.blobs, id),
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }

  createAndUpload(params) {
    const file = params.file
    const isPublic = params.public
    const name = params.name || file.name
    const size = params.size || file.size
    const content_type = params.type || file.type
    const abort_id = params.abort_id
    const createParams = { name, content_type, public: isPublic }
    let blob;

    return this.create(createParams)
      .then(({ blob: blb }) => {
        blob = blb;
        const uri = parseUri(blob.blob_object_access.params)
        const uploadUrl = `${uri.protocol}://${uri.authority}${uri.path}`
        const ajaxParams = { url: uploadUrl, data: {} }

        if (abort_id) {
          ajaxParams.abort_id = abort_id;
        }

        Object.keys(uri.queryKey).forEach(key => {
          ajaxParams.data[key] = decodeURIComponent(uri.queryKey[key])
        })

        ajaxParams.data.file = file

        return this.upload(ajaxParams).then(() => blob)
      })
      .then(blob => this.markUploaded({ id: blob.id, size }).then(() => blob))
      .then(blob => ({ ...blob, size }))
      .catch((err) => {
        if (blob) {
          return { ...blob, size };
        }
      })
  }

  upload(params) {
    const ajaxParams = {
      ...params,
      type: 'POST',
      dataType: 'text',
      contentType: false,
    }

    return this.proxy.ajax(ajaxParams)
  }

  markUploaded(params) {
    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(config.urls.blobs, params.id, 'complete'),
      data: {
        size: params.size
      },
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }

  getInfo(id) {
    const ajaxParams = {
      url: Utils.getUrl(config.urls.blobs, id)
    }

    return this.proxy.ajax(ajaxParams)
  }

  getFile(uid) {
    const ajaxParams = {
      url: Utils.getUrl(config.urls.blobs, uid)
    }

    return this.proxy.ajax(ajaxParams)
  }

  getFileObject(uid, params) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(config.urls.blobs, uid, 'object'),
      data: params,
    }

    return this.proxy.ajax(ajaxParams)
  }

  update(params) {
    const data = {}
    data.blob = {}
    if (typeof params.name !== 'undefined') {
      data.blob.name = params.name
    }

    const ajaxParams = {
      url: Utils.getUrl(config.urls.blobs, params.id),
      data: data
    }

    return this.proxy.ajax(ajaxParams)
  }

  privateUrl(fileUID) {
    return (
      'https://' +
      config.endpoints.api +
      '/blobs/' +
      fileUID +
      '?token=' +
      this.proxy.getSession().token
    )
  }

  publicUrl(fileUID) {
    return 'https://' + config.endpoints.api + '/blobs/' + fileUID
  }
}

module.exports = StorageService

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// http://blog.stevenlevithan.com/archives/parseuri
function parseUri(str) {
  const o = parseUri.options
  const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str)

  const uri = {}
  let i = 14

  while (i--) {
    uri[o.key[i]] = m[i] || ''
  }

  uri[o.q.name] = {}
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2
    }
  })

  return uri
}

parseUri.options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
}
