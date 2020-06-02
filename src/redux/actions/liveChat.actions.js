
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { AsyncStorage } from 'react-native'

export const API_URL = 'https://kibochat.cloudkibo.com/api'

// import { clearSubscriberTags } from '../../redux/actions/tags.actions'
// import { clearCustomFieldValues } from '../../redux/actions/customFields.actions'

export function updateSessionProfilePicture (subscriber, profilePic) {
  return {
    type: ActionTypes.UPDATE_SESSION_PROFILE_PICTURE,
    subscriber,
    profilePic
  }
}

export function clearUserChat () {
  return {
    type: ActionTypes.CLEAR_USER_CHAT
  }
}

export function handleCustomers (customers) {
  return {
    type: ActionTypes.SHOW_CUSTOMERS,
    data: customers
  }
}

export function updateLiveChatInfo (data) {
  return {
    type: ActionTypes.UPDATE_LIVECHAT_INFO,
    data
  }
}

export function updateSessions (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS,
    data
  }
}

export function updateSessionsData (session, customerId) {
  if (session.status === 'new') {
    return {
      type: ActionTypes.UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID,
      data: session,
      customerId
    }
  } else {
    return {
      type: ActionTypes.UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID,
      data: session,
      customerId
    }
  }
}

export function showChatSessions (sessions) {
  var subscribers = sessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  var sorted = subscribers.sort(function (a, b) {
    return new Date(b.lastDateTime) - new Date(a.lastDateTime)
  })
  return {
    type: ActionTypes.SHOW_CHAT_SESSIONS,
    sessions: sorted
  }
}

export function updateUserChat (message) {
  return {
    type: ActionTypes.UPDATE_USER_CHAT,
    chat: message
  }
}

export function showOpenChatSessions (sessions, data) {
  var subscribers = sessions.openSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  // var sorted = subscribers.sort(function (a, b) {
  //   return new Date(b.lastDateTime) - new Date(a.lastDateTime)
  // })
  if (data.first_page && (data.page_value !== '' || data.search_value !== '')) {
    return {
      type: ActionTypes.SHOW_OPEN_CHAT_SESSIONS_OVERWRITE,
      openSessions: subscribers,
      count: sessions.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_OPEN_CHAT_SESSIONS,
      openSessions: subscribers,
      count: sessions.count
    }
  }
}

export function showCloseChatSessions (sessions, firstPage) {
  var subscribers = sessions.closedSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    return s
  })
  // var sorted = subscribers.sort(function (a, b) {
  //   return new Date(b.lastDateTime) - new Date(a.lastDateTime)
  // })
  if (firstPage) {
    return {
      type: ActionTypes.SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE,
      closeSessions: subscribers,
      count: sessions.count
    }
  }
  return {
    type: ActionTypes.SHOW_CLOSE_CHAT_SESSIONS,
    closeSessions: subscribers,
    count: sessions.count
  }
}
export function updateChatSessions (session, appendDeleteInfo) {
  session.name = `${session.firstName} ${session.lastName}`
  return {
    type: ActionTypes.UPDATE_CHAT_SESSIONS,
    session,
    appendDeleteInfo
  }
}

export function socketUpdate (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE,
    data
  }
}

export function socketUpdateSeen (data) {
  return {
    type: ActionTypes.SOCKET_UPDATE_SEEN,
    data
  }
}

export function setActiveSession (sessionId) {
  return {
    type: ActionTypes.SET_ACTIVE_SESSION,
    activeSession: sessionId
  }
}

export function clearSearchResult () {
  return {
    type: ActionTypes.CLEAR_SEARCH_RESULT
  }
}

export function showUserChats (payload, originalData) {
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.SHOW_USER_CHAT_OVERWRITE,
      userChat: payload.chat,
      chatCount: payload.count
    }
  } else {
    return {
      type: ActionTypes.SHOW_USER_CHAT,
      userChat: payload.chat,
      chatCount: payload.count
    }
  }
}

export function resetSocket () {
  return {
    type: ActionTypes.RESET_SOCKET
  }
}

export function resetActiveSession () {
  return {
    type: ActionTypes.RESET_ACTIVE_SESSION
  }
}

export function resetUnreadSession () {
  return {
    type: ActionTypes.RESET_UNREAD_SESSION
  }
}

export function loadingUrlMeta (url) {
  return {
    type: ActionTypes.LOADING_URL_META,
    urlValue: url,
    loadingUrl: true
  }
}

export function urlMetaReceived (meta) {
  return {
    type: ActionTypes.GET_URL_META,
    urlMeta: meta,
    loadingUrl: false
  }
}

export function showChangeStatus (data) {
  return {
    type: ActionTypes.CHANGE_STATUS,
    data
  }
}

export function showSearchChat (data) {
  return {
    type: ActionTypes.SHOW_SEARCH_CHAT,
    data
  }
}

export function emptySocketData () {
  return {
    type: ActionTypes.EMPTY_SOCKET_DATA
  }
}

// export function fetchSessions () {
//   return (dispatch) => {
//     callApi('sessions')
//       .then(res => {
//         console.log('fetchSessions response', res)
//         dispatch(showChatSessions(res.payload))
//       })
//   }
// }

export function clearData () {
  return (dispatch) => {
    dispatch(clearUserChat())
    // dispatch(clearCustomFieldValues())
    dispatch(clearSearchResult())
    // dispatch(clearSubscriberTags())
  }
}

export function fetchOpenSessions (data) {
  return (dispatch) => {
    callApi('sessions/getOpenSessions', 'post', data)
      .then(res => {
        dispatch(showOpenChatSessions(res.payload, data))
      })
  }
}

export function fetchCloseSessions (data) {
  return (dispatch) => {
    callApi('sessions/getClosedSessions', 'post', data)
      .then(res => {
        dispatch(showCloseChatSessions(res.payload, data.first_page))
      })
  }
}

export function fetchSingleSession (sessionid, appendDeleteInfo) {
  return (dispatch) => {
    callApi(`sessions/${sessionid}`)
      .then(res => {
        dispatch(updateChatSessions(res.payload, appendDeleteInfo))
      })
  }
}

export function fetchUserChats (sessionid, data, handleFunction) {
  return (dispatch) => {
    callApi(`livechat/${sessionid}`, 'post', data)
      .then(res => {
        dispatch(showUserChats(res.payload, data))
        if (handleFunction) {
          handleFunction(data.messageId)
        }
      })
  }
}
export function uploadRecording (fileData, handleUpload) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    console.log('in upload attachment', `${API_URL}/broadcasts/upload`)
    AsyncStorage.getItem('token')
      .then(token => {
        fetch(`${API_URL}/broadcasts/uploadRecording`, {
          method: 'post',
          body: fileData,
          // eslint-disable-next-line no-undef
          headers: new Headers({
            'Authorization': `Bearer ${token}`
          })
        }).then((res) => res.json()).then((res) => res).then(res => {
          console.log('respone', res)
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

export function uploadAttachment (fileData, handleUpload) {
  return (dispatch) => {
    // eslint-disable-next-line no-undef
    console.log('in upload attachment', `${API_URL}/broadcasts/upload`)
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
          console.log('respone', res)
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
    callApi('livechat/', 'post', data).then(res => {
      handleSendAttachment(res)
    })
  }
}

export function searchChat (data) {
  return (dispatch) => {
    callApi('livechat/search', 'post', data).then(res => {
      if (res.status === 'success') {
        dispatch(showSearchChat(res.payload))
      } else {
      }
    })
  }
}

export function sendChatMessage (data, fetchOpenSessions) {
  return (dispatch) => {
    callApi('livechat/', 'post', data).then(res => {
      // dispatch(fetchSessions())
      //  fetchOpenSessions({first_page: true, last_id: 'none', number_of_records: 10, filter: false, filter_criteria: {sort_value: -1, page_value: '', search_value: ''}})
    })
  }
}

export function getSMPStatus (callback) {
  return (dispatch) => {
    callApi('livechat/SMPStatus').then(res => {
      callback(res)
    })
  }
}

export function fetchUrlMeta (url) {
  return (dispatch) => {
    dispatch(loadingUrlMeta(url))
    callApi('livechat/geturlmeta', 'post', {url: url}).then(res => {
      if (res.status === 'success') {
        dispatch(urlMetaReceived(res.payload))
      } else {
        dispatch(urlMetaReceived({}))
      }
    })
  }
}

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(`sessions/markread/${sessionid}`).then(res => {
    })
  }
}

export function changeStatus (data, handleActiveSession) {
  return (dispatch) => {
    callApi('sessions/changeStatus', 'post', data).then(res => {
      handleActiveSession()
    })
  }
}

export function assignToAgent (data, handleResponse) {
  return (dispatch) => {
    callApi('sessions/assignAgent', 'post', data).then(res => {
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}

export function sendNotifications (data) {
  return (dispatch) => {
    callApi('notifications/create', 'post', data).then(res => {})
  }
}

export function assignToTeam (data, handleResponse) {
  return (dispatch) => {
    callApi('sessions/assignTeam', 'post', data).then(res => {
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}

export function fetchTeamAgents (id, handleAgents) {
  return (dispatch) => {
    callApi(`teams/fetchAgents/${id}`)
      .then(res => {
        if (res.status === 'success') {
          handleAgents(res.payload)
        }
      })
  }
}