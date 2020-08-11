import React, { PureComponent } from 'react'
import {StyleSheet} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { Block, Text, theme } from 'galio-framework'

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

class RightChatItem extends PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      repliedBy: this.props.message.replied_by || this.props.message.repliedBy
    }
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.getMessage = this.getMessage.bind(this)
  }
  getRepliedByMsg () {
    let repliedBy = this.props.message.replied_by || this.props.message.repliedBy
    if (
      !repliedBy ||
      repliedBy.id === this.props.user._id
    ) {
      return null
    } else {
      return (
        <Text color='white' style={{marginBottom: 10}}>{repliedBy.name} replied:</Text>
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
          urlMeta={this.props.message.url_meta !== '' ? this.props.message.url_meta : null}
        />
      )
    } else if (['image', 'sticker', 'gif', 'thumbsUp'].includes(type)) {
      return (
        <Block>
          <IMAGECOMPONENT
            image={message}
          />
          {message.caption &&
            <Block style={{marginTop: 10}}>
              <TEXTCOMPONENT
                text={{text: message.caption}}
                textColor='white'
              />
            </Block>
          }
        </Block>
      )
    } else if (type === 'audio') {
      return (
        <AUDIO
          audio={message}
        />
      )
    } else if (type === 'video') {
      return (
        <Block>
          <VIDEO
            video={message}
          />
          {message.caption &&
            <Block style={{marginTop: 10}}>
              <TEXTCOMPONENT
                text={{text: message.caption}}
                textColor='white'
              />
            </Block>
          }
        </Block>
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
      <Block key={this.props.message._id} flex>
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
              {this.props.seenElement}
            </LinearGradient>
          </Block>
        </Block>
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  messageCardWrapper: {
    maxWidth: '85%',
    marginLeft: 8,
    marginBottom: 20
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: theme.COLORS.WHITE
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.12)',
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
    marginBottom: theme.SIZES.BASE
  }
})

export default RightChatItem
