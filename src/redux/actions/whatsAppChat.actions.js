
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { AsyncStorage } from 'react-native'
export const API_URL = 'https://kibochat.cloudkibo.com/api'


export function updateWhatspSessions (data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPP_OPEN_SESSION,
    data
  }
}
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
  export function createNewContact (data, callback) {
    return (dispatch) => {
      callApi(`whatsAppContacts/create`, 'post', data).then(res => {
        console.log('response from create whatsapp contact', res)
        if (callback) {
          callback(res)
        }
      })
    }
  }

  export function sendChatMessage (data, callback) {
    console.log('data for sendChatMessage', data)
    return (dispatch) => {
      callApi('whatsAppChat', 'post', data)
        .then(res => {
          if (callback) {
            callback(res)
          }
      })
    }
  }

  export function deletefile (data, handleRemove) {
    return (dispatch) => {
      callApi(`broadcasts/delete/${data}`)
        .then(res => {
          if (handleRemove) {
            handleRemove(res)
          }
        })
    }
  }

  export function sendAttachment (data, handleSendAttachment) {
    return (dispatch) => {
      callApi('whatsAppChat', 'post', data).then(res => {
        handleSendAttachment(res)
        let fetchData = {
          filter_criteria: {
            pendingResponse: false,
            search_value: '',
            sort_value: -1,
            unreadCount: false,
          },
          first_page: true,
          last_id: 'none',
          number_of_records: 10,
        }
        dispatch(fetchOpenSessions(fetchData))
        // dispatch(fetchUserChats(data.contactId, {page: 'first', number: 25}))
      })
    }
  }

  export function uploadAttachment (fileData, handleUpload) {
    return (dispatch) => {
      // eslint-disable-next-line no-undef
      AsyncStorage.getItem('token')
        .then(token => {
          fetch(`${API_URL}/broadcasts/upload`, {
            method: 'post',
            body: fileData,
            // eslint-disable-next-line no-undef
            headers: new Headers({
              'Authorization': `Bearer ${token}`
            })
          }).then((res) => res.json()).then((res) => res).then(res => {
            handleUpload(res)
          })
            .catch((err) => {
              console.log('failed to upload file', err)
            })
        })
        .catch((err) => {
          console.log('failed to fetch token', err)
        })
    }
  }
