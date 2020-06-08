import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions } from 'react-native'
import { Block } from 'galio-framework'

import CHAT from '../../components/LiveChat/Chat/index'
import {
  fetchUserChats,
  fetchTeamAgents,
  changeStatus,
  assignToTeam,
  assignToAgent,
  sendNotifications,
  sendChatMessage,
  uploadAttachment,
  sendAttachment,
  uploadRecording,
  markRead,
  updateLiveChatInfo,
  getSMPStatus,
  updateSessionProfilePicture,
  deletefile
} from '../../redux/actions/liveChat.actions'
import { handleSocketEvent } from './socket'
import { clearSocketData } from '../../redux/actions/socket.actions'
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
      activeSession: props.route.params.activeSession
    }

    this.isSMPApproved = this.isSMPApproved.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.performAction = this.performAction.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleSMPStatus = this.handleSMPStatus.bind(this)

    this.props.fetchUserChats(props.route.params.activeSession._id, { page: 'first', number: 25 })
    props.getSMPStatus(this.handleSMPStatus)
    // if (props.route.params.activeSession.unreadCount && props.route.params.activeSession.unreadCount > 0) {
    //   this.props.markRead(props.route.params.activeSession._id)
    // }
    if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
      props.loadMembersList()
      props.loadTeamsList({pageId: props.route.params.activeSession.pageId._id})
    }
  }

  updateState (state, callback) {
    if (state.reducer) {
      const data = {
        userChat: state.userChat
      }
      this.props.updateLiveChatInfo(data)
    } else {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  handleSMPStatus (res) {
    if (res.status === 'success') {
      this.setState({smpStatus: res.payload})
    }
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    let state = {}
    if (nextProps.userChat) {
      if (nextProps.userChat.length > 0) {
        state.userChat = nextProps.userChat
        state.loadingChat = false
      } else if (nextProps.userChat.length === 0) {
        state.loadingChat = false
      }
      if (this.state.activeSession.unreadCount && this.state.activeSession.unreadCount > 0) {
        this.props.markRead(this.state.activeSession._id)
      }
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

  isSMPApproved () {
    const page = this.state.smpStatus.find((item) => item.pageId === this.state.activeSession.pageId._id)
    if (page && page.smpStatus === 'approved') {
      return true
    } else {
      return false
    }
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
    this.props.fetchTeamAgents(id, this.handleAgents)
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

  setMessageData (session, payload) {
    const data = {
      sender_id: session.pageId._id,
      recipient_id: session._id,
      sender_fb_id: session.pageId.pageId,
      recipient_fb_id: session.senderId,
      subscriber_id: session._id,
      company_id: session.companyId,
      payload: payload,
      url_meta: this.state.urlmeta,
      datetime: new Date().toString(),
      status: 'unseen',
      replied_by: {
        type: 'agent',
        id: this.props.user._id,
        name: this.props.user.name
      }
    }
    return data
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  render () {
    return (
      <Block flex style={styles.block}>
        <Block shadow flex>
          <CHAT
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
            sendChatMessage={this.props.sendChatMessage}
            uploadAttachment={this.props.uploadAttachment}
            sendAttachment={this.props.sendAttachment}
            uploadRecording={this.props.uploadRecording}
            loadingChat={this.state.loadingChat}
            fetchUserChats={this.props.fetchUserChats}
            markRead={this.props.markRead}
            deletefile={this.props.deletefile}
            fetchUrlMeta={this.props.urlMetaData}
            isSMPApproved={this.isSMPApproved()}
            showUploadAttachment
            showRecordAudio
            showSticker
            showEmoji
            showGif
            showThumbsUp
            setMessageData={this.setMessageData}
            filesAccepted={'image/*, audio/*, video/*, application/*, text/*'}
          />
        </Block>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    userChat: (state.liveChat.userChat),
    chatCount: (state.liveChat.chatCount),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    // members: (state.membersInfo.members),
    // teams: (state.teamsInfo.teams),
    socketData: (state.socketInfo.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    // updatePicture,
    fetchTeamAgents,
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
    clearSocketData,
    updateLiveChatInfo,
    // urlMetaData,
    getSMPStatus,
    updateSessionProfilePicture,
    deletefile
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
const styles = StyleSheet.create({
  block: {
    width: width
  }
})
