import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

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
    callApi('cannedResponses')
      .then(res => {
        if (res.status === 'success') {
          dispatch(showcannedResponses(res.payload))
        } else {
          console.log('failed to fetch canned messages')
        }
      })
  }
}

export function getZoomIntegrations () {
  return (dispatch) => {
    callApi('zoom/users')
      .then(res => {
        dispatch(updateZoomIntegrations(res.payload ? res.payload : []))
      })
  }
}

export function createZoomMeeting (data, callback) {
  return (dispatch) => {
    callApi('zoom/meetings', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
      })
  }
}
