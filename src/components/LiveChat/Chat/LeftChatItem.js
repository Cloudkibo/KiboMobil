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
import CARD from '../Messages/Card'
import LOCATION from '../Messages/Location'

const { width } = Dimensions.get('screen')

class LeftChatItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.getMessage = this.getMessage.bind(this)
    this.getType = this.getType.bind(this)
  }

  getType () {
    let type = this.props.message.payload.type || this.props.message.payload.componentType
    if (
      this.props.message.payload.attachments &&
      this.props.message.payload.attachments.length > 0
    ) {
      type = this.props.message.payload.attachments[0].type
    }
    return type
  }

  getMessage () {
    const type = this.getType()
    const message = this.props.message.payload
    if (type === 'url-card') {
      return (
        <CARD
          card={message}
        />
      )
    } else if (type === 'video') {
      const video = {
        fileurl: { url: message.attachments ? message.attachments[0].payload.url : message.fileurl.url }
      }
      return (
        <VIDEO
          video={video}
        />
      )
    } else if (type === 'audio') {
      const audio = {
        fileurl: { url: message.attachments ? message.attachments[0].payload.url : message.fileurl.url }
      }
      return (
        <AUDIO
          audio={audio}
        />
      )
    } else if (type === 'image') {
      const image = {
        fileurl: message.attachments ? message.attachments[0].payload.url : message.fileurl.url
      }
      return (
        <IMAGECOMPONENT
          image={image}
        />
      )
    } else if (type === 'file') {
      const url = message.attachments ? message.attachments[0].payload.url : message.fileurl.url
      const name = message.fileName || url.split('?')[0].split('/').pop()
      return (
        <FILE
          file={{fileurl: {url}, fileName: name}}
        />
      )
    } else if (type === 'location') {
      return (
        <LOCATION
          data={message.attachments[0]}
        />
      )
    } else if (message.text) {
      return (
        <TEXTCOMPONENT
          linkColor='#5867dd'
          text={message}
        />
      )
    }
  }

  render () {
    return (
      <Block key={this.props.message._id}>
        {
          this.props.index === 0
            ? <Block row middle>
              <Text style={styles.time}>{this.props.displayDate(this.props.message.datetime)}</Text>
            </Block>
            : this.props.index > 0 && this.props.showDate(this.props.previousMessage.datetime, this.props.message.datetime) &&
            <Block row middle>
              <Text style={styles.time}>{this.props.displayDate(this.props.message.datetime)}</Text>
            </Block>
        }
        <Block row>
          <Image source={{ uri: this.props.activeSession.profilePic }} style={[styles.avatar, styles.shadow]} />
          <Block style={styles.messageCardWrapper}>
            <Block style={[styles.messageCard, styles.shadow]}>
              {this.getMessage()}
            </Block>
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

export default LeftChatItem