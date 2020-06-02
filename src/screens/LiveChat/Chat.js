import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator, Image,
ScrollView,
KeyboardAvoidingView } from 'react-native'
import { Block, Text, theme, Input } from 'galio-framework'
import Icon from '../../components/Icon'
import { materialTheme } from '../../constants/'
import SessionsListItem from '../../components/LiveChat/SessionsListItem'
import Tabs from '../../components/Tabs'
import CHAT from '../../components/LiveChat/Chat/index'

import {
  fetchOpenSessions,
  fetchCloseSessions,
  fetchUserChats,
  fetchTeamAgents,
  changeStatus,
  unSubscribe,
  getCustomers,
  appendSubscriber,
  assignToTeam,
  assignToAgent,
  sendNotifications,
  updatePendingResponse,
  sendChatMessage,
  uploadAttachment,
  sendAttachment,
  uploadRecording,
  searchChat,
  markRead,
  updateLiveChatInfo,
  deletefile,
  clearSearchResult,
  getSMPStatus,
  updateSessionProfilePicture
} from '../../redux/actions/liveChat.actions'

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

    this.props.fetchUserChats(props.route.params.activeSession._id, { page: 'first', number: 10 })
    props.getSMPStatus(this.handleSMPStatus)
    if (props.route.params.activeSession.unreadCount && props.route.params.activeSession.unreadCount > 0) {
      this.props.markRead(props.route.params.activeSession._id)
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
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.state.activeSession.firstName + ' ' + this.state.activeSession.lastName} has been assigned to your team.`,
        category: { type: 'chat_session', id: this.state.activeSession._id },
        agentIds: agentIds,
        companyId: this.state.activeSession.companyId
      }
      // this.props.sendNotifications(notificationsData)
    }
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
    user: (state.basicInfo.user)
    // members: (state.membersInfo.members),
    // teams: (state.teamsInfo.teams),
    // socketData: (state.socketInfo.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    unSubscribe,
    fetchOpenSessions,
    fetchCloseSessions,
    // updatePicture,
    fetchTeamAgents,
    assignToTeam,
    changeStatus,
    getCustomers,
    appendSubscriber,
    // loadTeamsList,
    sendNotifications,
    // loadMembersList,
    assignToAgent,
    // getSubscriberTags,
    // loadTags,
    // assignTags,
    // createTag,
    // unassignTags,
    updatePendingResponse,
    // loadCustomFields,
    // getCustomFieldValue,
    // setCustomFieldValue,
    sendChatMessage,
    uploadAttachment,
    sendAttachment,
    uploadRecording,
    searchChat,
    fetchUserChats,
    markRead,
    // clearSocketData,
    updateLiveChatInfo,
    deletefile,
    clearSearchResult,
    // urlMetaData,
    getSMPStatus,
    updateSessionProfilePicture
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
const styles = StyleSheet.create({
  block: {
    width: width
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 15
  },
  pages: {
    width: width,
    borderWidth: 0,
    marginHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 0.1
  },
  empty: {
    marginHorizontal: 16,
    marginVertical: 20
  },
  container: {

  },
  messageFormContainer: {
    height: 96,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  input: {
    width: width * 0.78,
    height: theme.SIZES.BASE * 3,
    backgroundColor: theme.COLORS.WHITE,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  messagesWrapper: {
    flexGrow: 1,
    top: 0,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 16,
    paddingBottom: 68
  },
  messageCardWrapper: {
    maxWidth: '85%',
    marginLeft: 8,
    marginBottom: 32,
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 20,
    shadowOpacity: 1
  },
  time: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 8,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  }
})
