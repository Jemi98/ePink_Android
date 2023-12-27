const Config = require('./cubeConfig')
const Utils = require('./cubeInternalUtils')

const MEETINGS_API_URL = Config.urls.meetings

class MeetingService {
  constructor (proxy) {
    this.proxy = proxy
  }

  get(params = {}) {
    const ajaxParams = {
      type: 'GET',
      url: Utils.getUrl(MEETINGS_API_URL),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  create(params = {}) {
    const MINUTE = 60;
    const startTimestamp = Math.ceil(Date.now() / 1000);
    const endTimestamp = startTimestamp + 60 * MINUTE;    
    const defaultName = new Date(startTimestamp).toLocaleString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    const defaultParams = {
			name: defaultName,
			start_date: startTimestamp,
			end_date: endTimestamp,
			attendees: [],
			record: false,
			chat: false
    };
    const ajaxParams = {
      type: 'POST',
      url: Utils.getUrl(MEETINGS_API_URL),
      data: {...defaultParams, ...params}
    }

    return this.proxy.ajax(ajaxParams)
  }

  update(id, params) {
    const ajaxParams = {
      type: 'PUT',
      url: Utils.getUrl(MEETINGS_API_URL, id),
      data: params
    }

    return this.proxy.ajax(ajaxParams)
  }

  delete(id) {
    const ajaxParams = {
      type: 'DELETE',
      url: Utils.getUrl(MEETINGS_API_URL, id),
      dataType: 'text'
    }

    return this.proxy.ajax(ajaxParams)
  }
}

module.exports = MeetingService