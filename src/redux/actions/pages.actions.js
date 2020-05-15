import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePages (data) {
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  }
}

export function updateConnectedPages (data) {
  return {
    type: ActionTypes.FETCH_CONNECTED_PAGES_LIST,
    data
  }
}

export function fetchPages () {
  return (dispatch) => {
    callApi(`pages/addpages/`).then(res => {
      dispatch(updatePages(res.payload))
    })
  }
}
export function disconnectPage (page) {
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
      .then(res => {
        dispatch(fetchPages())
      })
  }
}
export function connectPage (page, showErrorDialog) {
  return (dispatch) => {
    callApi(`pages/enable/`, 'post', page)
      .then(res => {
        if (res.type === 'invalid_permissions') {
          showErrorDialog('Looks like you have not granted permissions for this page. Permissions must be granted to connect this page.')
        } else if (res.status === 'failed') {
          showErrorDialog(res.description)
        } else if (res.payload && res.payload.msg) {
          showErrorDialog(res.payload.msg)
        } else {
          dispatch(fetchPages())
        }
      })
  }
}

export function fetchConnectedPages (callback) {
  return (dispatch) => {
    callApi(`pages/allpages`).then(res => {
      dispatch(updateConnectedPages(res.payload))
      callback(res.payload)
    })
  }
}
