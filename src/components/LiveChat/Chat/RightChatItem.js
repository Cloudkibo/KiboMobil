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
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Input, Block, Text, Button, theme } from 'galio-framework';
import { Icon } from '../../../components/';

import Images from "../../../constants/Images";
import materialTheme from '../../../constants/Theme';

// components
import TEXTCOMPONENT from '../Messages/Text'
import IMAGECOMPONENT from '../Messages/Image'
import AUDIO from '../Messages/Audio'
import VIDEO from '../Messages/Video'
import FILE from '../Messages/File'
import POLL from '../Messages/Poll'
import SURVEY from '../Messages/Survey'
import CARD from '../Messages/Card'
import GALLERY from '../Messages/Gallery'

const { width } = Dimensions.get('screen')

class RightChatItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      repliedBy: this.props.message.replied_by || this.props.message.repliedBy
    }
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.getMessage = this.getMessage.bind(this)
  }
  getRepliedByMsg () {
    if (
      !this.state.repliedBy ||
      this.state.repliedBy.id === this.props.user._id
    ) {
      return null
    } else {
      return (
        <Text color='white' style={{marginBottom: 10}}>{this.state.repliedBy.name} replied:</Text>
      )
    }
  }

  getMessage () {
    const message = this.props.message.payload
    const type = message.componentType
    if (['text', 'template'].includes(type)) {
      return (
        <TEXTCOMPONENT
          text={message}
          linkColor='white'
          textColor='white'
          urlMeta={this.props.message.url_meta}
        />
      )
    } else if (['image', 'sticker', 'gif', 'thumbsUp'].includes(type)) {
      return (
        <IMAGECOMPONENT
          image={message}
        />
      )
    } else if (type === 'audio') {
      return (
        <AUDIO
          audio={message}
        />
      )
    } else if (type === 'video') {
      return (
        <VIDEO
          video={message}
        />
      )
    } else if (type === 'file') {
      return (
        <FILE
          textColor='white'
          file={message}
        />
      )
    } else if (type === 'poll' || type === 'polls') {
      return (
        <POLL
          poll={message}
          textColor='white'
        />
      )
    } else if (type === 'survey') {
      return (
        <SURVEY
          survey={message}
          textColor='white'
        />
      )
    } else if (type === 'card') {
      return (
        <CARD
          card={message}
        />
      )
    } else if (type === 'gallery') {
      return (
        <GALLERY
          gallery={message}
        />
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <Block key={this.props.message._id}>
        {this.props.index === 0
          ? <Block row middle>
            <Text style={styles.time}>{this.props.displayDate(this.props.message.datetime)}</Text>
          </Block>
          : this.props.index > 0 && this.props.showDate(this.props.previousMessage.datetime, this.props.message.datetime) &&
          <Block row middle>
            <Text style={styles.time}>{this.props.displayDate(this.props.message.datetime)}</Text>
          </Block>
        }
        <Block row space='between'>
          <Block style={[styles.avatar, styles.shadow]} />
          <Block style={styles.messageCardWrapper}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#6C24AA', '#AC2688']}
              style={[styles.messageCard, styles.shadow]}>
              {this.getRepliedByMsg()}
              {this.getMessage()}
            </LinearGradient>
          </Block>
        </Block>
      </Block>
    )
  }
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
    marginBottom: 20,
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 10,
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
    marginBottom: 10
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
});

export default RightChatItem
