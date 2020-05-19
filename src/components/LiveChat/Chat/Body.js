import React from 'react'
import PropTypes from 'prop-types'

// components
import LEFTCHATITEM from './leftChatItem'
import RIGHTCHATITEM from './rightChatItem'

class Body extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      shouldScrollToBottom: true,
      scrollEventAdded: false
    }
    this.getSeen = this.getSeen.bind(this)
    this.allowedType = this.allowedType.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
    this.shoudLoadMore = this.shoudLoadMore.bind(this)
    this.addScrollEvent = this.addScrollEvent.bind(this)
    this.markRead = this.markRead.bind(this)

    this.previousScrollHeight = undefined
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

  loadMoreMessage() {
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
    if (this.props.userChat && this.props.userChat.length > 0) {
      this.scrollToBottom(this.props.userChat)
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.state.scrollEventAdded && this.refs.chatScroll) {
      this.addScrollEvent()
      if (this.refs.chatScroll.scrollHeight <= this.refs.chatScroll.clientHeight) {
        this.markRead()
      }
    }
    if (prevProps.userChat.length !== this.props.userChat.length) {
      if (this.props.activeSession._id !== prevProps.activeSession._id) {
        // this.scrollToBottom(this.props.userChat)
      } else if (this.props.newMessage) {
        this.scrollToBottom(this.props.userChat)
        this.props.updateNewMessage(false)
      } else {
        setTimeout(() => {this.updateScrollTop()}, 100)
      }
    }
    if (
      !this.props.loadingChat &&
      this.props.userChat &&
      this.props.userChat.length > 0 &&
      this.state.shouldScrollToBottom
    ) {
      this.setState({shouldScrollToBottom: false}, () => {this.scrollToBottom(this.props.userChat)})
    }
    if (this.props.activeSession._id !== prevProps.activeSession._id) {
      this.setState({shouldScrollToBottom: true})
    }
  }

  render () {
    return (
    )
  }
}

Body.propTypes = {
  'chatAreaHieght': PropTypes.string.isRequired,
  'userChat': PropTypes.array.isRequired,
  'chatCount': PropTypes.number,
  'showDate': PropTypes.func.isRequired,
  'displayDate': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'loadingChat': PropTypes.bool.isRequired,
  'user': PropTypes.object.isRequired,
  'fetchUserChats': PropTypes.func.isRequired,
  'markRead': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'newMessage': PropTypes.bool.isRequired,
  'updateNewMessage': PropTypes.func.isRequired
}

export default Body
