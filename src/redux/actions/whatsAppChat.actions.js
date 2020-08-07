
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { AsyncStorage } from 'react-native'

export function showOpenSessions (data) {
    let openSessions = data.openSessions.map((s) => {
      let name = s.name.split(' ')
      s.firstName = name[0]
      s.lastName = name[1]
      s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
      return s
    })
    return {
      type: ActionTypes.FETCH_WHATSAPP_OPEN_SESSIONS,
      openSessions,
      openCount: data.count
    }
  }
  export function showCloseChatSessions (data) {
    let closeSessions = data.closedSessions.map((s) => {
      let name = s.name.split(' ')
      s.firstName = name[0]
      s.lastName = name[1]
      s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
      return s
    })
    return {
      type: ActionTypes.FETCH_WHATSAPP_CLOSE_SESSIONS,
      closeSessions,
      closeCount: data.count
    }
  }
  export function UpdateUnreadCount (data) {
    return {
      type: ActionTypes.UPDATE_UNREAD_COUNT_WHATSAPP,
      data
    }
  }
export function fetchOpenSessions (data) {
    return (dispatch) => {
      callApi('whatsAppSessions/getOpenSessions', 'post', data)
        .then(res => {
          dispatch(showOpenSessions(res.payload))
        })
    }
  }
  export function fetchCloseSessions (data) {
    return (dispatch) => {
      callApi('whatsAppSessions/getClosedSessions', 'post', data)
        .then(res => {
          dispatch(showCloseChatSessions(res.payload, data.first_page))
        })
    }
  }

  export function markRead (sessionid) {
    return (dispatch) => {
      callApi(`whatsAppSessions/markread/${sessionid}`).then(res => {
        dispatch(UpdateUnreadCount(sessionid))
      })
    }
  }
