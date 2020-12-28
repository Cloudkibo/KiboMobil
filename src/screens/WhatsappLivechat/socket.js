export function handleSocketEvent (data, state, props, updateLiveChatInfo, user, clearSocketData) {
  switch (data.action) {
    case 'new_chat_whatsapp':
      handleIncomingMessage(data.payload, state, props, updateLiveChatInfo, clearSocketData)
      break
    case 'agent_replied_whatsapp':
      handleAgentReply(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'session_pending_response_whatsapp':
      handlePendingResponse(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'unsubscribe_whatsapp':
      handleUnsubscribe(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'session_status_whatsapp':
      handleStatus(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'new_session_created_whatsapp':
      handleNewSessionCreated(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'message_delivered_whatsApp':
      handleMessageStatus(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'message_seen_whatsApp':
      handleMessageStatus(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'mark_read_whatsapp':
      markReadMessages(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'session_assign_whatsapp':
      handleAssignment(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    default:
  }
}

const markReadMessages = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  console.log('markReadMessages function called')
  let openSessions = props.openSessions
  let closeSessions = props.closeSessions
  const openIndex = props.openSessions.findIndex((s) => s._id === payload.session_id)
  const closeIndex = props.closeSessions.findIndex((s) => s._id === payload.session_id)
  if (openIndex > -1) {
    openSessions[openIndex].unreadCount = 0
  }
  if (closeIndex > -1) {
    closeSessions[closeIndex].unreadCount = 0
  }
  const data = {
    openSessions: openSessions,
    closeSessions: closeSessions
  }
  updateLiveChatInfo(data)
  clearSocketData()
}

const handleIncomingMessage = (payload, state, props, updateLiveChatInfo, clearSocketData) => {
  let sessions = state.sessions
  let session = payload.subscriber
  session.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
  session.firstName = payload.subscriber.name
  let data = {}
  const index = sessions.findIndex((s) => s._id === payload.subscriber._id)
  if (index === -1 && state.tabValue === 'open') {
    let allChatMessages = props.allChatMessages
    if (allChatMessages[payload.subscriber._id]) {
      allChatMessages[payload.subscriber._id] = [...allChatMessages[payload.subscriber._id], payload.message]
    }
    let userChat = props.userChat || []
    if (state.activeSession._id === payload.subscriber._id) {
      userChat.push(payload.message)
    }
    let closeSessions = props.closeSessions
    let closeCount = props.closeCount
    if (closeSessions) {
      let sessionIndex = closeSessions.findIndex((s) => s._id === session._id)
      if (sessionIndex > -1) {
        closeSessions.splice(sessionIndex, 1)
        closeCount -= 1
      }
    }
    session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.lastMessagedAt = new Date()
    session.pendingResponse = true
    session.status = 'new'
    sessions = [session, ...sessions]
    data = {
      userChat,
      allChatMessages,
      chatCount: (props.chatCount ? props.chatCount : 0) + 1,
      openSessions: sessions,
      closeSessions,
      closeCount,
      openCount: props.openCount ? props.openCount + 1 : 1
    }
  } else if (state.activeSession._id === payload.subscriber._id) {
    let userChat = props.userChat
    userChat.push(payload.message)
    let allChatMessages = props.allChatMessages
    allChatMessages[payload.subscriber._id] = userChat
    session = sessions.splice(index, 1)[0]
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.lastMessagedAt = new Date()
    session.pendingResponse = true
    if (state.tabValue === 'open') {
      sessions = [session, ...sessions]
    } else {
      session.status = 'new'
    }
    props.markRead(session._id)
    data = {
      userChat,
      allChatMessages,
      chatCount: props.chatCount + 1,
      openSessions: state.tabValue === 'open' ? sessions : [session, ...props.openSessions],
      openCount: state.tabValue === 'close' ? props.openCount + 1 : props.openCount,
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
      closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
    }
  } else if (index >= 0) {
    let allChatMessages = props.allChatMessages
    if (allChatMessages[payload.subscriber._id]) {
      allChatMessages[payload.subscriber._id] = [...allChatMessages[payload.subscriber._id], payload.message]
    }
    session = sessions.splice(index, 1)[0]
    session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.lastMessagedAt = new Date()
    session.pendingResponse = true
    session.status = 'new'
    data = {
      allChatMessages,
      openSessions: state.tabValue === 'open' ? [session, ...sessions] : [session, ...props.openSessions],
      openCount: state.tabValue === 'close' ? props.openCount + 1 : props.openCount,
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
      closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
    }
  }
  updateLiveChatInfo(data)
  clearSocketData()
}

const handleAgentReply = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  let ChatMessages = props.allChatMessages
  let chatUser = ChatMessages[payload.subscriber_id]
  let sessions = state.sessions
  const index = sessions.findIndex((s) => s._id === payload.subscriber_id)
  if (chatUser && ((chatUser.length > 0 && chatUser[chatUser.length - 1]._id !== payload.message._id) || chatUser.length === 0)) {
    let data = {}
    let session = sessions.find((s) => s._id === payload.subscriber_id)
    if (state.activeSession._id === payload.subscriber_id) {
      let userChat = props.userChat
      payload.message.format = 'convos'
      userChat.push(payload.message)
      let allChatMessages = props.allChatMessages
      allChatMessages[payload.subscriber_id] = userChat
      session = sessions.splice(index, 1)[0]
      session.lastPayload = payload.message.payload
      session.last_activity_time = new Date()
      session.pendingResponse = false
      session.lastRepliedBy = payload.message.repliedBy
      if (state.tabValue === 'open') sessions = [session, ...sessions]
      data = {
        userChat,
        chatCount: props.chatCount + 1,
        openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
        closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
        closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
      }
      updateLiveChatInfo(data)
      clearSocketData()
    } else if (index >= 0) {
      payload.message.format = 'convos'
      let allChatMessages = props.allChatMessages
      if (allChatMessages[payload.subscriber_id]) {
        allChatMessages[payload.subscriber_id] = [...allChatMessages[payload.subscriber_id], payload.message]
      }
      session = sessions.splice(index, 1)[0]
      session.lastPayload = payload.message.payload
      session.last_activity_time = new Date()
      session.pendingResponse = false
      session.lastRepliedBy = payload.message.repliedBy
      if (state.tabValue === 'open') sessions = [session, ...sessions]
      data = {
        allChatMessages,
        openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
        closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
        closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
      }
      updateLiveChatInfo(data)
      clearSocketData()
    } else {
      clearSocketData()
    }
  } else if (index >= 0 && !chatUser) {
    let session = sessions.splice(index, 1)[0]
    payload.message.format = 'convos'
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.pendingResponse = false
    let data = {
      openSessions: state.tabValue === 'open' ? [session, ...sessions] : [session, ...props.openSessions],
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions
    }
    updateLiveChatInfo(data)
    clearSocketData()
  } else {
    clearSocketData()
  }
}

const handleUnsubscribe = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  let data = {}
  let sessions = state.sessions
  const index = sessions.findIndex((s) => s._id === payload.subscriber_id)
  if (index >= 0) {
    sessions.splice(index, 1)
    data = {
      openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
      openCount: state.tabValue === 'open' ? props.openCount - 1 : props.openCount,
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
      closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
    }
    updateLiveChatInfo(data)
  }
  clearSocketData()
}

const handlePendingResponse = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  if (user._id !== payload.user_id) {
    let openSessions = props.openSessions
    let closeSessions = props.closeSessions
    const openIndex = props.openSessions.findIndex((s) => s._id === payload.session_id)
    const closeIndex = props.closeSessions.findIndex((s) => s._id === payload.session_id)
    if (openIndex > -1) {
      openSessions[openIndex].pendingResponse = payload.pendingResponse
    }
    if (closeIndex > -1) {
      closeSessions[closeIndex].pendingResponse = payload.pendingResponse
    }
    const data = {
      openSessions: openSessions,
      closeSessions: closeSessions
    }
    updateLiveChatInfo(data)
    clearSocketData()
  } else {
    clearSocketData()
  }
}

const handleAssignment = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  console.log('in handleAssignment', payload)
  let openSessions = JSON.parse(JSON.stringify(props.openSessions))
  let closeSessions = JSON.parse(JSON.stringify(props.closeSessions))
  let data = {}
  const openIndex = openSessions.findIndex((s) => s._id === payload.data.subscriberId)
  const closeIndex = closeSessions.findIndex((s) => s._id === payload.data.subscriberId)
  if (openIndex >= 0) {
    console.log('openIndex', openIndex)
    openSessions[openIndex].is_assigned = payload.data.isAssigned
    openSessions[openIndex].assigned_to = {
      type: payload.data.teamId ? 'team' : 'agent',
      id: payload.data.teamId ? payload.data.teamId : payload.data.agentId,
      name: payload.data.teamName ? payload.data.teamName : payload.data.agentName
    }
  }
  if (closeIndex >= 0) {
    closeSessions[closeIndex].is_assigned = payload.data.isAssigned
    closeSessions[closeIndex].assigned_to = {
      type: payload.data.teamId ? 'team' : 'agent',
      id: payload.data.teamId ? payload.data.teamId : payload.data.agentId,
      name: payload.data.teamName ? payload.data.teamName : payload.data.agentName
    }
  }
  openSessions = openSessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })
  closeSessions = closeSessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })
  data = {
    openSessions: openSessions,
    closeSessions: closeSessions
  }
  updateLiveChatInfo(data)
  clearSocketData()
}

const handleStatus = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  let openCount = props.openCount
  let closeCount = props.closeCount
  let openSessions = props.openSessions
  let closeSessions = props.closeSessions
  let session
  if (payload.status === 'resolved') {
    console.log('one')
    session = openSessions.find(session => session._id === payload.session_id)
    session.status = 'resolved'
    session.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    session.firstName = payload.session.name
  } else {
    console.log('2')
    session = closeSessions.find(session => session._id === payload.session_id)
    session.status = 'new'
    session.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    session.firstName = payload.session.name
  }
  let data = {}
  const openIndex = openSessions.findIndex((s) => s._id === session._id)
  const closeIndex = closeSessions.findIndex((s) => s._id === session._id)
  if (payload.status === 'new') {
    if (openIndex === -1) {
      console.log('3')
      openSessions = [session, ...openSessions]
      openCount = openCount + 1
    }
    if (closeIndex > -1) {
      console.log('4')
      closeSessions.splice(closeIndex, 1)
      closeCount = closeCount - 1
    }
  } else if (payload.status === 'resolved') {
    if (openIndex > -1) {
      console.log('5')
      openSessions.splice(openIndex, 1)
      openCount = openCount - 1
    }
    if (closeIndex === -1) {
      console.log('6')
      closeSessions = [session, ...closeSessions]
      closeCount = closeCount + 1
    }
  }

  openSessions = openSessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })
  closeSessions = closeSessions.sort(function (a, b) {
    return new Date(b.last_activity_time) - new Date(a.last_activity_time)
  })

  data = {
    openSessions: openSessions,
    closeSessions: closeSessions,
    openCount: openCount,
    closeCount: closeCount
  }
  updateLiveChatInfo(data)
  clearSocketData()
}

const handleNewSessionCreated = (payload, state, props, updateLiveChatInfo, clearSocketData) => {
  let newSession = payload
  newSession.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
  newSession.firstName = payload.name
  let sessions = state.sessions
  sessions = [newSession, ...sessions]
  let data = {
    openSessions: sessions,
    openCount: props.openCount ? props.openCount + 1 : 1
  }
  updateLiveChatInfo(data)
  clearSocketData()
}

const handleMessageStatus = (payload, state, props, updateLiveChatInfo, clearSocketData) => {
  let userChat = props.userChat
  if (state.activeSession._id === payload.message.contactId) {
    for (let i = props.userChat.length - 1; i >= 0; i--) {
      if (userChat[i].format === 'convos' && payload.message.action === 'message_delivered_whatsApp' && !userChat[i].delivered) {
        userChat[i].delivered = payload.message.delivered
      } else if (userChat[i].format === 'convos' && payload.message.action === 'message_seen_whatsApp' && !userChat[i].seen) {
        userChat[i].seen = payload.message.seen
      }
    }
  }
  let data = {
    userChat
  }
  updateLiveChatInfo(data)
  clearSocketData()
}
