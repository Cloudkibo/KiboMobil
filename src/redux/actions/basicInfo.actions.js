import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import {AsyncStorage} from 'react-native'

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
export function updatePicture (data, callback) {
  return (dispatch) => {
    callApi('updatePicture', 'post', data, 'accounts')
      .then(res => {
        console.log('response from updatePicture', res)
        if (res.status === 'success') {
          dispatch(getuserdetails())
          if (callback) {
            callback(res.payload)
          }
        }
      })
  }
}
