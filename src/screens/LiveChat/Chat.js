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
import {fetchUserChats} from '../../redux/actions/liveChat.actions'
const { width } = Dimensions.get('screen')
import Images from "../../constants/Images";
import { LinearGradient } from 'expo-linear-gradient';

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      fetchingChat: false,
      loadingChat: true,
      activeSession: {},
      teamAgents: [],
      userChat: [],
      smpStatus: [],
      height: 0
    }
    this.loadMore = this.loadMore.bind(this)
    this._renderSearchResultsFooter = this._renderSearchResultsFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)
    // console.log('props.scene', props)
    this.props.fetchUserChats(props.route.params.activeSession._id, { page: 'first', number: 25 })
  }
  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    let state = {}
    if (nextProps.userChat) {
      if (nextProps.userChat.length > 0 && nextProps.userChat[0].subscriber_id === this.state.activeSession._id) {
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

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }



  render () {
    return (
      <Block flex center style={styles.block}>
        <Block shadow flex>
          {/*<CHAT
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
            showUploadAttachment={true}
            showRecordAudio={true}
            showSticker={true}
            showEmoji={true}
            showGif={true}
            showThumbsUp={true}
            setMessageData={this.setMessageData}
            filesAccepted={'image/*, audio/*, video/*, application/*, text/*'}
          />
          */}
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
    fetchUserChats
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
