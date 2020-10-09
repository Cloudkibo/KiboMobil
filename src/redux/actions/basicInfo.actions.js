import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function setSocketStatus (data) {
  return {
    type: ActionTypes.SET_SOCKET_STATUS,
    data
  }
}

export function showAutomatedOptions (data) {
  return {
    type: ActionTypes.GET_AUTOMATED_OPTIONS,
    data
  }
}

export function showuserdetails (data) {
  return {
    type: ActionTypes.LOAD_USER_DETAILS,
    data
  }
}

export function getuserdetails (callback, joinRoomKibochat, joinRoomKiboEngage) {
  return (dispatch) => {
    callApi(dispatch, 'users').then(res => {
      if (res.status === 'success') {
        if (joinRoomKibochat) {
          joinRoomKibochat(res.payload.user.companyId)
        }
        if(joinRoomKiboEngage) {
          joinRoomKiboEngage(res.payload.user.companyId)
        }
        if (callback) callback(res)
        dispatch(showuserdetails(res.payload.user))
      }
    })
  }
}

export function saveNotificationToken (user, logOut) {
  return (dispatch) => {
    callApi(dispatch, `companyUsers/update/${user._id}`, 'post', {expoListToken: user.expoListToken}).then(res => {
      if (res.status === 'success') {
        if (logOut) {
          logOut()
        }
        dispatch(showuserdetails(user))
      }
    })
  }
}
export function updatePicture (data, callback) {
  return (dispatch) => {
    callApi(dispatch, 'updatePicture', 'post', data, 'accounts')
      .then(res => {
        if (res.status === 'success') {
          dispatch(getuserdetails())
          if (callback) {
            callback(res.payload)
          }
        }
      })
  }
}

export function updatePlatform (user, data, cb) {
  return (dispatch) => {
    callApi(dispatch, 'users/updatePlatform', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(showuserdetails(user))
        if (cb) cb()
      }
    })
  }
}

export function getAutomatedOptions (cb) {
  return (dispatch) => {
    callApi(dispatch, 'company/getAutomatedOptions').then(res => {
      dispatch(showAutomatedOptions(res.payload))
      if (cb) cb(res)
    })
  }
}
