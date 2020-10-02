import React from 'react'
import PropTypes from 'prop-types'
import { validURL, isEmoji } from '../../../screens/LiveChat/utilities'
import CARD from './Card'
import {
  FlatList,
  Linking
} from 'react-native'
import { Block, Text, Button } from 'galio-framework'
import materialTheme from '../../../constants/Theme'

class TextComponent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      opacity: 1.0,
      isOnPressFire: false
    }
    this.getText = this.getText.bind(this)
    this.getCardProps = this.getCardProps.bind(this)
  }

  getCardProps () {
    const image = this.props.urlMeta.image || this.props.urlMeta.ogImage
    const card = {
      title: this.props.urlMeta.title || this.props.urlMeta.ogTitle,
      description: this.props.urlMeta.description || this.props.urlMeta.ogDescription,
      imageUrl: image && image.url
    }
    return card
  }

  getText (text) {
    if (text.length === 2 && isEmoji(text)) {
      return (
        <Block style={{fontSize: '30px'}}>
          <Text color={this.props.textColor}>{text}</Text>
        </Block>
      )
    } else {
      let words = text.replace(/\n/g, ' \r\n').split(' ')
      let wordElements = words.map((word, index) => {
        if (validURL(word.trim())) {
          let url = word.trim()
          var pattern = /^((http|https|ftp):\/\/)/
          if (!pattern.test(word.trim())) {
            url = 'http://' + url
          }
          return (
            <Text style={{textDecorationLine: 'underline', color: this.state.opacity === 1.0 ? '#FFF' : materialTheme.COLORS.MUTED, opacity: this.state.opacity}}
              suppressHighlighting
              onResponderGrant={() => {
                this.setState({opacity: 0.5, isOnPressFire: true})
              }}
              onResponderRelease={() => {
                setTimeout(() => {
                  this.setState({opacity: 1.0, isOnPressFire: false})
                }, 350)
              }}
              onResponderTerminate={() => {
                this.setState({opacity: 1.0, isOnPressFire: false})
              }}
              onPress={() => {
                if (this.state.isOnPressFire) {
                  Linking.openURL(url)
                }
                this.setState({opacity: 1.0, isOnPressFire: false})
              }}>
              {word + (index < words.length - 1 ? ' ' : '')}
            </Text>
          )
        } else {
          return (
            <Text color={this.props.textColor}>{word + (index < words.length - 1 ? ' ' : '')}</Text>
          )
        }
      })
      return (
        <Text>
          {wordElements}
        </Text>
      )
    }

  //   if (validURL(text)) {
  //     return (
  //       <Block>
  //         <TouchableOpacity onPress={() => Linking.openURL(text)}>
  //           <Text color={this.props.linkColor} style={{textDecorationLine: 'underline'}}>
  //             {text}
  //           </Text>
  //         </TouchableOpacity>
  //       </Block>
  //     )
  //   } else if (text.length === 2 && isEmoji(text)) {
  //     return (
  //       <Block style={{fontSize: '30px'}}>
  //         <Text color={this.props.textColor}>{text}</Text>
  //       </Block>
  //     )
  //   } else {
  //     return (
  //       <Block>
  //         <Text color={this.props.textColor}>{text}</Text>
  //       </Block>
  //     )
  //   }
  }

  render () {
    return (
      <Block>
        {this.getText(this.props.text.text)}
        {this.props.text.buttons &&
          this.props.text.buttons.length > 0 &&
          <FlatList
            data={this.props.text.buttons}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Block center>
                  <Button size='small' radius={10} style={{backgroundColor: 'white', marginVertical: 5, height: 35}}>
                    <Text>{item.type === 'element_share' ? 'SHARE' : item.title.toUpperCase()}</Text>
                  </Button>
                </Block>
              )
            }}
          />
        }
        {this.props.urlMeta && this.props.urlMeta.constructor === Object && Object.keys(this.props.urlMeta).length > 0 &&
          <CARD
            card={this.getCardProps()}
            color='#575962'
          />
        }
      </Block>
    )
  }
}

TextComponent.propTypes = {
  'text': PropTypes.object.isRequired,
  'color': PropTypes.string,
  'textColor': PropTypes.string,
  'urlMeta': PropTypes.object
}

export default TextComponent
