import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, StyleSheet, Dimensions, Image } from 'react-native'
import { Block, Text, Button } from 'galio-framework'
const { width } = Dimensions.get('screen')

class Card extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.getSubtitle = this.getSubtitle.bind(this)
  }

  getSubtitle (card) {
    let subtitle = card.subtitle || card.description
    if (subtitle.length > 30) {
      subtitle = `${subtitle.substring(0, 30)}...`
    }
    return subtitle
  }

  render () {
    return (
      <Block style={styles.block}>
        {(this.props.card.image_url || this.props.card.imageUrl) &&
          <Block style={styles.imageBlock}>
            <Image resizeMode='contain' style={styles.image} source={{ uri: this.props.card.image_url || this.props.card.imageUrl }} />
          </Block>
        }
        <Block style={styles.subBlock}>
          <Block flex row style={{marginHorizontal: 5, marginTop: 5}}>
            <Text h6 style={{fontWeight: 'bold'}}>{this.props.card.title.length > 20 ? `${this.props.card.title.substring(0, 20)}...` : this.props.card.title}</Text>
          </Block>
          {
            (this.props.card.subtitle || this.props.card.description) &&
            <Block flex row style={{marginHorizontal: 5, marginTop: 5}}>
              <Text h6>{this.getSubtitle(this.props.card)}</Text>
            </Block>
          }
          {this.props.card.buttons &&
          this.props.card.buttons.length > 0 &&
            <FlatList
              style={{marginTop: 5}}
              data={this.props.card.buttons}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <Block center>
                    <Button radius={10} style={{backgroundColor: 'white', marginVertical: 5, height: 35, width: width * 0.6}}>
                      <Text>{item.type === 'element_share' ? 'SHARE' : item.title.toUpperCase()}</Text>
                    </Button>
                  </Block>
                )
              }}
            />
          }
          <Block style={{marginBottom: 10}} />
        </Block>
      </Block>
    )
  }
}

Card.propTypes = {
  'card': PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  image: {
    width: width / 1.5,
    height: 150,
    flex: 1
  },
  block: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)'
  },
  imageBlock: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  },
  subBlock: {
    backgroundColor: 'rgb(241, 240, 240)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  }
})

export default Card
