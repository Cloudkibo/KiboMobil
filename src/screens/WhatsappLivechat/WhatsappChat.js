import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions } from 'react-native'
import { Block } from 'galio-framework'
import * as Notifications from 'expo-notifications'

import CHAT from '../../components/LiveChat/Chat/index'
import {
  sendChatMessage,
  uploadAttachment,
  sendAttachment,
  deletefile,
  markRead,
  fetchUserChats,
  fetchTeamAgentsWhatsApp,
  changeStatus,
  assignToTeam,
  assignToAgent,
  sendNotifications,
  uploadRecording,
  updateLiveChatInfo
} from '../../redux/actions/whatsAppChat.actions'
import {getZoomIntegrations, createZoomMeeting, loadcannedResponses} from '../../redux/actions/settings.action'
import { clearSocketDataWhatsapp } from '../../redux/actions/socket.actions'
import { loadTeamsList } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
const { width } = Dimensions.get('screen')

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      fetchingChat: false,
      loadingChat: true,
      teamAgents: [],
      userChat: [],
      smpStatus: [],
      height: 0,
      activeSession: props.route.params.activeSession,
      sessions: props.route.params.sessions,
      tabValue: props.route.params.tabValue,
      cannedResponses: []
    }
    this.setMessageData = this.setMessageData.bind(this)
    this.performAction = this.performAction.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.updateState = this.updateState.bind(this)
    this.getPushNotificationsAsync = this.getPushNotificationsAsync.bind(this)
    this.props.loadcannedResponses()
    this.props.fetchUserChats(props.route.params.activeSession._id, { page: 'first', number: 25 })
    props.getZoomIntegrations()
    // if (props.route.params.activeSession.unreadCount && props.route.params.activeSession.unreadCount > 0) {
    //   this.props.markRead(props.route.params.activeSession._id)
    // }
    if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
      props.loadMembersList()
      props.loadTeamsList({ platform: 'whatsapp' })
    }
  }

  updateState (state, callback) {
    if (state.reducer) {
      const data = {
        chat: state.userChat,
        openSessions: this.state.tabValue === 'open' ? state.sessions : this.props.openSessions,
        closeSessions: this.state.tabValue === 'close' ? state.sessions : this.props.closeSessions
      }
      this.props.updateLiveChatInfo(data)
    } else {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  getPushNotificationsAsync = async (sessionId) => {
    let notifications = await Notifications.getPresentedNotificationsAsync()
    // // let data = JSON.parse(notification[0])
    for (let notification of notifications) {
       if(notification.request.content.data._id === sessionId) {
         let removeNotification = await Notifications.dismissNotificationAsync(notification.request.identifier)
       }
    }
    // console.log('notification[0].identifier', notification[0].request.identifier)
    // let removeNotification = await Notifications.dismissNotificationAsync(notification[0].request.identifier)
    // // console.log('notification in Live chat', data)
    // console.log('remove_notidication', removeNotification)

  }
  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
  if (nextProps.openSessions && !this.state.sessions) {
    this.setState({sessions:nextProps.openSessions})
  }
    let state = {}
    if (nextProps.cannedResponses !== this.props.cannedResponses) {
      this.setState({cannedResponses: nextProps.cannedResponses})
    }
    if (nextProps.userChat) {
      if (nextProps.userChat.length > 0) {
        this.getPushNotificationsAsync(this.state.activeSession._id)
        state.userChat = nextProps.userChat
        state.loadingChat = false
      } else if (nextProps.userChat.length === 0) {
        state.loadingChat = false
      }
      // if (this.state.activeSession.unreadCount && this.state.activeSession.unreadCount > 0) {
      //   console.log('in markread')
      //   this.props.markRead(this.state.activeSession._id)
      // }
    }

    this.setState({
      ...state
    })

    // if (nextProps.socketData) {
    //   handleSocketEvent(
    //     nextProps.socketData,
    //     this.state,
    //     this.props,
    //     this.props.updateLiveChatInfo,
    //     this.props.user,
    //     this.props.clearSocketData
    //   )
    // }
  }

  performAction (errorMsg, session) {
    let isAllowed = true
    if (session.is_assigned) {
      if (session.assigned_to.type === 'agent' && session.assigned_to.id !== this.props.user._id) {
        isAllowed = false
        errorMsg = `Only assigned agent can ${errorMsg}`
      } else if (session.assigned_to.type === 'team') {
        this.fetchTeamAgents(session._id, (teamAgents) => {
          const agentIds = teamAgents.map((agent) => agent.agentId._id)
          if (!agentIds.includes(this.props.user._id)) {
            isAllowed = false
            errorMsg = `Only agents who are part of assigned team can ${errorMsg}`
          }
        })
      }
    }
    errorMsg = `You can not perform this action. ${errorMsg}`
    return {isAllowed, errorMsg}
  }

  fetchTeamAgents (id) {
    this.props.fetchTeamAgentsWhatsApp(id, this.handleAgents)
  }

  handleAgents (teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId)
      }
    }
    // if (agentIds.length > 0) {
    //   let notificationsData = {
    //     message: `Session of subscriber ${this.state.activeSession.firstName + ' ' + this.state.activeSession.lastName} has been assigned to your team.`,
    //     category: { type: 'chat_session', id: this.state.activeSession._id },
    //     agentIds: agentIds,
    //     companyId: this.state.activeSession.companyId
    //   }
    //   this.props.sendNotifications(notificationsData)
    // }
  }

  setMessageData (session, payload, urlMeta) {
    const data = {
      senderNumber: this.props.automated_options.whatsApp.businessNumber,
      recipientNumber: this.state.activeSession.number,
      contactId: session._id,
      payload,
      datetime: new Date().toString(),
      repliedBy: {
        id: this.props.user._id,
        name: this.props.user.name,
        type: 'agent'
      },
      url_meta: urlMeta
    }
    return data
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  componentDidMount () {
  }

  render () {
    return (
      <Block flex style={styles.block}>
        <Block shadow flex>
          <CHAT
            cannedResponses={this.state.cannedResponses}
            userChat={this.state.userChat}
            chatCount={this.props.chatCount}
            sessions={this.state.sessions}
            activeSession={this.state.activeSession}
            changeStatus={this.changeStatus}
            updateState={this.updateState}
            getChatPreview={this.getChatPreview}
            handlePendingResponse={this.handlePendingResponse}
            showSearch={this.showSearch}
            performAction={this.performAction}
            alertMsg={this.alertMsg}
            user={this.props.user}
            isWhatspModule
            sendChatMessage={this.props.sendChatMessage}
            uploadAttachment={this.props.uploadAttachment}
            sendAttachment={this.props.sendAttachment}
            loadingChat={this.state.loadingChat}
            fetchUserChats={this.props.fetchUserChats}
            markRead={this.props.markRead}
            deletefile={this.props.deletefile}
            fetchUrlMeta={this.props.urlMetaData}
            isSMPApproved={false}
            showUploadAttachment
            showRecordAudio
            showSticker
            showEmoji
            showGif
            showThumbsUp
            setMessageData={this.setMessageData}
            filesAccepted={'image/*, audio/*, video/*, application/*, text/*'}
            showZoom={(this.props.zoomIntegrations.length && this.props.zoomIntegrations.length === 0 ? (this.props.user.role === 'admin' || this.props.user.role === 'buyer') ? true : false : true)}
            zoomIntegrations={this.props.zoomIntegrations}
            createZoomMeeting={this.props.createZoomMeeting}
          />
        </Block>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    userChat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount),
    // members: (state.membersInfo.members),
    // teams: (state.teamsInfo.teams),
    socketData: (state.socketInfo.socketDataWhatsapp),
    openSessions: (state.whatsAppChatInfo.openSessions),
    openCount: (state.whatsAppChatInfo.openCount),
    closeCount: (state.whatsAppChatInfo.closeCount),
    closeSessions: (state.whatsAppChatInfo.closeSessions),
    user: (state.basicInfo.user),
    cannedResponses: state.settingsInfo.cannedResponses,
    zoomIntegrations: (state.settingsInfo.zoomIntegrations),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchTeamAgentsWhatsApp,
    assignToTeam,
    changeStatus,
    loadTeamsList,
    sendNotifications,
    loadMembersList,
    assignToAgent,
    sendChatMessage,
    uploadAttachment,
    sendAttachment,
    uploadRecording,
    fetchUserChats,
    markRead,
    clearSocketDataWhatsapp,
    updateLiveChatInfo,
    // urlMetaData,
    deletefile,
    loadcannedResponses,
    getZoomIntegrations,
    createZoomMeeting
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
const styles = StyleSheet.create({
  block: {
    width: width
  }
})
