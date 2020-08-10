import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import {AsyncStorage} from 'react-native'

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
    callApi('users').then(res => {
      if (res.status === 'Unauthorized') {
        AsyncStorage.removeItem('token')
      } else {
        if (joinRoom) joinRoom(res.payload.companyId)
        if (callback) callback(res)
        dispatch(showuserdetails(res.payload))
      }
    })
  }
}

export function saveNotificationToken(user, logOut) {
  return (dispatch) => {
    callApi(`companyUsers/update/${user._id}`, 'post', {expoListToken: user.expoListToken}).then(res => {
      if (res.status === 'success') {
        if(logOut){
          logOut()
        }
        dispatch(showuserdetails(user))
      }
    })
  }
}
export function updatePicture (data, callback) {
  return (dispatch) => {
    callApi('updatePicture', 'post', data, 'accounts')
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

export function updatePlatform (data) {
  return (dispatch) => {
    callApi('users/updatePlatform', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(getuserdetails())
      } else {
      }
    })
  }
}

export function getAutomatedOptions () {
  return (dispatch) => {
    callApi('company/getAutomatedOptions').then(res => dispatch(showAutomatedOptions(res.payload)))
  }
}
