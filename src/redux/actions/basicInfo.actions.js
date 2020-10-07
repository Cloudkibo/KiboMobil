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
  // NOTE: don't remove following auth method call
  // auth.putUserId(data._id)
  return {
    type: ActionTypes.LOAD_USER_DETAILS,
    data
  }
}

export function getuserdetails (callback, joinRoom) {
  return (dispatch) => {
    callApi(dispatch, 'users').then(res => {
      if (res.status === 'Unauthorized' || res.status === 'failed' || res.message === 'Unauthorized') {
        // AsyncStorage.removeItem('token')
        // if (callback) callback(res)
      } else {
        if (joinRoom) joinRoom(res.payload.user.companyId)
        if (callback) callback(res)
        dispatch(showuserdetails(res.payload.user))
      }
    })
  }
}

export function saveNotificationToken(user, logOut) {
  return (dispatch) => {
    callApi(dispatch, `companyUsers/update/${user._id}`, 'post', {expoListToken: user.expoListToken}).then(res => {
      if (res.status === 'success') {
        dispatch(showuserdetails(user))
      }
    })
    if(logOut){
      logOut()
    }
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

export function updatePlatform (data, cb) {
  return (dispatch) => {
    callApi(dispatch, 'users/updatePlatform', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(getuserdetails())
        if(cb) {
          cb(false)
        }
      } else {
      }
    })
  }
}

export function getAutomatedOptions () {
  return (dispatch) => {
    callApi(dispatch, 'company/getAutomatedOptions').then(res => dispatch(showAutomatedOptions(res.payload)))
  }
}
