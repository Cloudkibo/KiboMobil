
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { AsyncStorage } from 'react-native'
export const API_URL = 'https://kibochat.cloudkibo.com/api'

export function updateLiveChatInfo (data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPPCHAT_INFO,
    data
  }
}

export function updateAgents (data) {
  return {
    type: ActionTypes.UPDATE_TEAM_AGENTS,
    data
  }
}

export function updateSessions (data) {
  return {
    type: ActionTypes.UPDATE_SESSIONS_WHATSAPP,
    data
  }
}

export function showChat (data, originalData) {
  if (originalData.page === 'first') {
    return {
      type: ActionTypes.FETCH_WHATSAPP_CHAT_OVERWRITE,
      chat: data.chat,
      count: data.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_WHATSAPP_CHAT,
      chat: data.chat,
      count: data.count
    }
  }
}

export function updateWhatspSessions (data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPP_OPEN_SESSION,
    data
  }
}
export function showOpenSessions (sessions, data) {
  console.log('data', data)
  let openSessions = sessions.openSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    return s
  })

  if (data.first_page) {
    return {
      type: ActionTypes.SHOW_OPEN_WHATSAPP_SESSIONS_OVERWRITE,
      openSessions,
      openCount: sessions.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_WHATSAPP_OPEN_SESSIONS,
      openSessions,
      openCount: sessions.count
    }
  }
}
export function showCloseChatSessions (sessions,data) {
  let closeSessions = sessions.closedSessions.map((s) => {
    let name = s.name.split(' ')
    s.firstName = name[0]
    s.lastName = name[1]
    s.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    return s
  })

  if (data.first_page) {
    return {
      type: ActionTypes.SHOW_CLOSE_WHATSAPP_SESSIONS_OVERWRITE,
      closeSessions,
      closeCount: sessions.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_WHATSAPP_CLOSE_SESSIONS,
      closeSessions,
      closeCount: sessions.count
    }
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
    callApi(dispatch, 'whatsAppSessions/getOpenSessions', 'post', data)
      .then(res => {
        dispatch(showOpenSessions(res.payload, data))
      })
  }
}
export function fetchCloseSessions (data) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppSessions/getClosedSessions', 'post', data)
      .then(res => {
        dispatch(showCloseChatSessions(res.payload, data))
      })
  }
}

export function markRead (sessionid) {
  return (dispatch) => {
    callApi(dispatch, `whatsAppSessions/markread/${sessionid}`).then(res => {
      dispatch(UpdateUnreadCount(sessionid))
    })
  }
}
export function createNewContact (data, callback) {
  return (dispatch) => {
    callApi(dispatch, `whatsAppContacts/create`, 'post', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export function sendChatMessage (data, callback) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppChat', 'post', data)
      .then(res => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export function deletefile (data, handleRemove) {
  return (dispatch) => {
    callApi(dispatch, `broadcasts/delete/${data}`)
      .then(res => {
        if (handleRemove) {
          handleRemove(res)
        }
      })
  }
}

export function sendAttachment (data, handleSendAttachment) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppChat', 'post', data).then(res => {
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
export function fetchUserChats (sessionid, data, count, handleFunction) {
  return (dispatch) => {
    callApi(dispatch, `whatsAppChat/getChat/${sessionid}`, 'post', data)
      .then(res => {
        dispatch(showChat(res.payload, data))
        if (handleFunction) {
          handleFunction(data.messageId)
        }
      })
  }
}
export function fetchTeamAgentsWhatsApp (id, handleAgents) {
  return (dispatch) => {
    callApi(dispatch, `teams/fetchAgents/${id}`)
      .then(res => {
        if (res.status === 'success' && handleAgents) {
          handleAgents(res.payload)
        }
        dispatch(updateAgents(res.payload))
      })
  }
}

export function changeStatusWhatsApp (data, handleActiveSession) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppSessions/changeStatus', 'post', data).then(res => {
      handleActiveSession()
    })
  }
}

export function assignToTeamWhatsApp (data, handleResponse) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppSessions/assignTeam', 'post', data).then(res => {
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}

export function assignToAgentWhatsApp (data, handleResponse) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppSessions/assignAgent', 'post', data).then(res => {
      dispatch(updateSessions(data))
      if (handleResponse) {
        handleResponse(res)
      }
    })
  }
}
