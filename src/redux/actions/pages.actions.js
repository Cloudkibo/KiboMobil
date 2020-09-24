import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePages (data) {
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  }
}

export function connectFbPage (data) {
  return {
    type: ActionTypes.CONNECT_FB_PAGE_EVENT,
    data
  }
}

export function disConnectFbPage (data) {
  return {
    type: ActionTypes.DISCONNECT_FB_PAGE_EVENT,
    data
  }
}

export function updateConnectedPages (data) {
  return {
    type: ActionTypes.FETCH_CONNECTED_PAGES_LIST,
    data
  }
}

export function fetchPages (callback) {
  return (dispatch) => {
    callApi(dispatch, `pages/addpages/`).then(res => {
      dispatch(updatePages(res.payload))
      if (callback) callback()
    })
  }
}
export function disconnectPage (page, showSucessMessage) {
  return (dispatch) => {
    callApi(dispatch, 'pages/disable', 'post', page)
      .then(res => {
        showSucessMessage('Disconnected Sucessfully')
        dispatch(fetchPages())
      })
  }
}
export function connectPage (page, showErrorDialog, showSucessMessage) {
  return (dispatch) => {
    callApi(dispatch, `pages/enable/`, 'post', page)
      .then(res => {
        if (res.type === 'invalid_permissions') {
          showErrorDialog('Looks like you have not granted permissions for this page. Permissions must be granted to connect this page.')
        } else if (res.status === 'failed') {
          showErrorDialog(res.description)
        } else if (res.payload && res.payload.msg) {
          showErrorDialog(res.payload.msg)
        } else {
          showSucessMessage('Connected Sucessfully')
          dispatch(fetchPages())
        }
      })
  }
}

export function fetchConnectedPages (callback) {
  return (dispatch) => {
    callApi(dispatch, `pages/allpages`).then(res => {
      dispatch(updateConnectedPages(res.payload))
      callback(res.payload)
    })
  }
}


