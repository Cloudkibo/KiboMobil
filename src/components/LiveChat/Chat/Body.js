import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Input, Block, Text, Button, theme } from 'galio-framework';
import { Icon } from '../../../components/';

import Images from "../../../constants/Images";
import materialTheme from '../../../constants/Theme';

const { width } = Dimensions.get('screen');
// components
import LEFTCHATITEM from './LeftChatItem'
import RIGHTCHATITEM from './RightChatItem'

class Body extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      shouldScrollToBottom: true,
      scrollEventAdded: false,
      height: 0,
      loading: false
    }
    this.getSeen = this.getSeen.bind(this)
    this.allowedType = this.allowedType.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
    this.shoudLoadMore = this.shoudLoadMore.bind(this)
    this.addScrollEvent = this.addScrollEvent.bind(this)
    this.markRead = this.markRead.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this._renderListFooter = this._renderListFooter.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
    this.updateLoading = this.updateLoading.bind(this)
    this.itemLayout = this.itemLayout.bind(this)
    this.onContentSizeChange = this.onContentSizeChange.bind(this)

    this.messagesScroll = React.createRef()
    this.previousScrollHeight = undefined
  }

  updateLoading () {
    this.setState({loading: false})
  }

  loadMore () {
    this.setState({
      onEndReachedCalledDuringMomentum: false
    })
    this.props.fetchUserChats(
      this.props.activeSession._id,
      { page: 'next', number: 25, last_id: this.props.userChat[0]._id }
    )
  }

  _onMomentumScrollBegin () {
    this.setState({ onEndReachedCalledDuringMomentum: false })
  }

  _renderListFooter () {
    return (this.props.userChat && this.props.userChat.length < this.props.chatCount
      ? <View style={{flex: 1, alignItems: 'center'}}><ActivityIndicator size='large' /></View>
      : null
    )
  }

  _loadMoreData () {
    if (!this.state.onEndReachedCalledDuringMomentum && this.props.userChat.length < this.props.chatCount) {
      this.setState({ onEndReachedCalledDuringMomentum: true }, () => {
        setTimeout(() => {
          this.loadMore()
        }, 1500)
      })
    }
  }

  scrollToBottom (chat) {
    console.log('scrollToBottom called')
    const lastMessage = document.getElementById(chat[chat.length - 1]._id)
    if (lastMessage) {
      lastMessage.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  }

  allowedType (chat) {
    let isAllowed = true
    if (
      chat.payload.attachments &&
      chat.payload.attachments.length > 0 &&
      ['template', 'fallback'].includes(chat.payload.attachments[0].type)
    ) {
      isAllowed = false
    }
    return isAllowed
  }

  getSeen (message, index) {
    if (index === (this.props.userChat.length - 1) && message.seen) {
      return (
        <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
          <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{this.props.displayDate(message.seenDateTime)}
        </div>
      )
    } else {
      return <div />
    }
  }

  loadMoreMessage () {
    this.props.fetchUserChats(
      this.props.activeSession._id,
      { page: 'next', number: 25, last_id: this.props.userChat[0]._id }
    )
  }

  updateScrollTop() {
    if (this.previousScrollHeight && this.refs.chatScroll && this.previousScrollHeight !== this.refs.chatScroll.scrollHeight) {
      this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight - this.previousScrollHeight
    }
  }

  shoudLoadMore () {
    return (this.props.chatCount > this.props.userChat.length)
  }

  markRead () {
    let session = this.props.activeSession
    session.unreadCount = 0
    this.props.markRead(session._id)
    this.props.updateState({activeSession: session})
  }

  addScrollEvent () {
    this.refs.chatScroll.addEventListener('scroll', (event) => {
      let element = event.target
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      if (this.refs.chatScroll.scrollTop === 0) {
        if (this.shoudLoadMore()) {
          this.loadMoreMessage()
        }
      } else if (
        (element.scrollHeight - element.scrollTop - 100) <= element.clientHeight  &&
        this.props.activeSession.unreadCount > 0
      ) {
        console.log('scrolled')
        this.markRead()
      }
    })
    this.setState({scrollEventAdded: true})
  }

  componentDidMount () {
    // if (this.props.userChat && this.props.userChat.length > 0) {
    //   this.scrollToBottom(this.props.userChat)
    // }
  }

  componentDidUpdate (prevProps) {
    // if (!this.state.scrollEventAdded && this.refs.chatScroll) {
    //   this.addScrollEvent()
    //   if (this.refs.chatScroll.scrollHeight <= this.refs.chatScroll.clientHeight) {
    //     this.markRead()
    //   }
    // }
    // if (prevProps.userChat.length !== this.props.userChat.length) {
    //   if (this.props.activeSession._id !== prevProps.activeSession._id) {
    //     // this.scrollToBottom(this.props.userChat)
    //   } else if (this.props.newMessage) {
    //     this.scrollToBottom(this.props.userChat)
    //     this.props.updateNewMessage(false)
    //   } else {
    //     setTimeout(() => {this.updateScrollTop()}, 100)
    //   }
    // }
    // if (
    //   !this.props.loadingChat &&
    //   this.props.userChat &&
    //   this.props.userChat.length > 0 &&
    //   this.state.shouldScrollToBottom
    // ) {
    //   this.setState({shouldScrollToBottom: false}, () => {this.scrollToBottom(this.props.userChat)})
    // }
    // if (this.props.activeSession._id !== prevProps.activeSession._id) {
    //   this.setState({shouldScrollToBottom: true})
    // }
  }

  renderMessage (chat, index) {
    return (
      chat.format === 'convos'
        ? <RIGHTCHATITEM
          key={index}
          message={chat}
          index={index}
          showDate={this.props.showDate}
          displayDate={this.props.displayDate}
          activeSession={this.props.activeSession}
          previousMessage={this.props.userChat[index - 1]}
          user={this.props.user}
          seenElement={this.getSeen(chat, index)} />
        : this.allowedType(chat) &&
          <LEFTCHATITEM
            key={index}
            message={chat}
            index={index}
            showDate={this.props.showDate}
            displayDate={this.props.displayDate}
            activeSession={this.props.activeSession}
            previousMessage={this.props.userChat[index - 1]}
          />
    )
  }

  itemLayout (data, index) {
    return { length: (this.props.userChat.length - 1), offset: 32 * index, index }
  }

  onContentSizeChange (width, height) {
    this.setState({
      height
    })
  }

  render () {
    if (this.props.loadingChat) {
      return (
        <Block flex middle><ActivityIndicator size='large' /></Block>
      )
    } else {
      return (
        <FlatList
          // inverted
          // ref={this.messagesScroll}
          ref={ref => this.flatList = ref}
          data={this.props.userChat}
          keyExtractor={item => `${item._id}`}
          showsVerticalScrollIndicator={false}
          getItemLayout={this.itemLayout}
          contentContainerStyle={[styles.messagesWrapper]}
          renderItem={({ item, index }) => this.renderMessage(item, index)}
          // onContentSizeChange={this.onContentSizeChange}
          // initialScrollIndex={this.props.userChat.length - 1}
          // bounces={false}
          // onContentSizeChange={() => this.flatList.scrollToEnd({animated: true)}
          // onLayout={() => this.flatList.scrollToEnd({animated: true, item: this.props.userChat[this.props.userChat.length - 1]})}
          // onEndReached={() => this._loadMoreData()}
          // onEndReachedThreshold={0.01}
          // ListFooterComponent={this._renderListFooter}
          // onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
        />
      )
    }
  }
}

Body.propTypes = {
  // 'chatAreaHieght': PropTypes.string.isRequired,
  // 'userChat': PropTypes.array.isRequired,
  // 'chatCount': PropTypes.number,
  // 'showDate': PropTypes.func.isRequired,
  // 'displayDate': PropTypes.func.isRequired,
  // 'activeSession': PropTypes.object.isRequired,
  // 'loadingChat': PropTypes.bool.isRequired,
  // 'user': PropTypes.object.isRequired,
  // 'fetchUserChats': PropTypes.func.isRequired,
  // 'markRead': PropTypes.func.isRequired,
  // 'updateState': PropTypes.func.isRequired,
  // 'newMessage': PropTypes.bool.isRequired,
  // 'updateNewMessage': PropTypes.func.isRequired
}

const styles = StyleSheet.create({
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
  },
});

export default Body
