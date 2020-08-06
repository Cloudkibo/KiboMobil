import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, Image, FlatList, Alert, ActivityIndicator, Platform } from 'react-native'
import { Button, Block, Text, theme } from 'galio-framework'

import { materialTheme } from '../../constants/'

const { width } = Dimensions.get('screen')

let Toast = null
if (Platform.OS === 'ios') {
  Toast = require('react-native-tiny-toast')
} else {
  Toast = require('react-native-simple-toast')
}

class WhatsappTemplateMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
      return (
        <Block flex center style={styles.block}>
          <Block shadow style={styles.pages}>
          <Text>
          WhatsApp Number:
        </Text>
          </Block>
        </Block>
      )
    }

}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsappTemplateMessage)
const styles = StyleSheet.create({
  block: {
    width: width
  },
  pages: {
    width: width,
    borderWidth: 0,
    // marginVertical: theme.SIZES.BASE * 1.5,
    marginHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 0.1
  },
  optionsButton: {
    width: 'auto',
    paddingHorizontal: theme.SIZES.BASE,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    alignSelf: 'flex-end'
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
    marginHorizontal: 16
  },
  page: {
    paddingVertical: 20
  }
})
