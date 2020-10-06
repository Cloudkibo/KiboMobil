import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native'
import { Block } from 'galio-framework'
import LEFTCHATITEM from './LeftChatItem'
import RIGHTCHATITEM from './RightChatItem'

class Body extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.getSeen = this.getSeen.bind(this)
    this.allowedType = this.allowedType.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this._renderListHeader = this._renderListHeader.bind(this)
    this._loadMoreData = this._loadMoreData.bind(this)
    this._onMomentumScrollBegin = this._onMomentumScrollBegin.bind(this)
  }

  loadMore () {
    this.setState({
      onEndReachedCalledDuringMomentum: false
    })
    this.props.fetchUserChats(
      this.props.activeSession._id,
      { page: 'next', number: 25, last_id: this.props.userChat[0]._id },
      this.props.activeSession.messagesCount,
      this.handleLoadMoreResponse
    )
  }

  _onMomentumScrollBegin () {
    this.setState({ onEndReachedCalledDuringMomentum: false })
  }

  _renderListHeader () {
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

  getSeen (message, chat) {
    if (message.seen || message.delivered) {
      return (
        <Block style={{marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Image
            source={{ uri: message.seen ? 'https://cdn.cloudkibo.com/public/img/double-ticks-blue.png' : 'https://cdn.cloudkibo.com/public/img/double-ticks-white.png' }}
            style={{height: 18, width: 18}}
          />
        </Block>
      )
    } else {
      return null
    }
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

  render () {
    const userChat = JSON.parse(JSON.stringify(this.props.userChat))
    if (this.props.loadingChat) {
      return (
        <Block flex middle><ActivityIndicator size='large' /></Block>
      )
    } else {
      return (
        <FlatList
          inverted
          data={userChat.reverse()}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.messagesWrapper]}
          renderItem={({ item, index }) => this.renderMessage(item, index)}
          ref={ref => { this.flatList = ref }}
          bounces={false}
          onEndReached={() => this._loadMoreData()}
          onEndReachedThreshold={0.01}
          ListFooterComponent={this._renderListHeader}
          onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
        />
      )
    }
  }
}

Body.propTypes = {
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

const styles = StyleSheet.create({
  messagesWrapper: {
    flexGrow: 1,
    top: 0,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 16,
    paddingBottom: 68
  }
})

export default Body
