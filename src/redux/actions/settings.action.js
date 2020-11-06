import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateWhatsAppMessageTemplates (data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPP_MESSAGE_TEMPLATES,
    data
  }
}
export function showcannedResponses (data) {
  return {
    type: ActionTypes.GET_CANNED_RESPONSES,
    data
  }
}

export function updateZoomIntegrations (data) {
  return {
    type: ActionTypes.UPDATE_ZOOM_INTEGRATIONS,
    data
  }
}

export function loadcannedResponses () {
  return (dispatch) => {
    callApi(dispatch, 'cannedResponses')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showcannedResponses(res.payload))
        } else {
        }
      })
  }
}

export function getZoomIntegrations () {
  return (dispatch) => {
    callApi(dispatch, 'zoom/users')
      .then(res => {
        dispatch(updateZoomIntegrations(res.payload ? res.payload : []))
      })
  }
}

export function createZoomMeeting (data, callback) {
  return (dispatch) => {
    callApi(dispatch, 'zoom/meetings', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export function getWhatsAppMessageTemplates () {
  return (dispatch) => {
    callApi(dispatch, 'company/getWhatsAppMessageTemplates')
      .then(res => {
        dispatch(updateWhatsAppMessageTemplates(res.payload))
      })
  }
}
