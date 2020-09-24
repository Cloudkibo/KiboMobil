import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, Image, FlatList, Alert, ActivityIndicator, Platform } from 'react-native'
import { Button, Block, Text, theme } from 'galio-framework'
import { connectPage, disconnectPage} from '../../redux/actions/pages.actions'

import { materialTheme } from '../../constants/'

const { width } = Dimensions.get('screen')

let Toast = null
if (Platform.OS === 'ios') {
  Toast = require('react-native-tiny-toast')
} else {
  Toast = require('react-native-simple-toast')
}

class Pages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.renderPage = this.renderPage.bind(this)
    this.showErrorDialog = this.showErrorDialog.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  componentDidMount () {

  }
  componentWillUnmount () {
    this._unsubscribe()
  }

  showSucessMessage (message) {
    Toast.default.show(message)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

  }

  renderPage ({ item }) {
    return (
      <Block flex row style={styles.page}>
        <Image source={{ uri: item.pagePic }} style={styles.avatar} />
        <Text h6 style={{marginTop: 10, width: 120}}>
          {item.pageName}
        </Text>
        <Block flex={0.9} middle>
          {item.connected
            ? <Button
              round
              textStyle={{color: theme.COLORS.ERROR}}
              style={[styles.optionsButton, {borderColor: theme.COLORS.ERROR}]}
              onPress={() => this.props.disconnectPage(item, this.showSucessMessage)}>
              Disconnect
            </Button>
            : <Button
              round
              textStyle={{color: theme.COLORS.SUCCESS}}
              style={[styles.optionsButton, {borderColor: theme.COLORS.SUCCESS}]}
              onPress={() => this.props.connectPage(item, this.showErrorDialog, this.showSucessMessage)}>Connect
            </Button>
          }
        </Block>
      </Block>
    )
  }

  showErrorDialog (message) {
    Alert.alert(
      'ERROR!',
      message,
      [
        { text: 'OK' }
      ],
      { cancelable: true }
    )
  }

  renderEmpty () {
    return (
      <Text color={materialTheme.COLORS.ERROR}>No data to display</Text>
    )
  }

  render () {
      return (
        <Block flex center style={styles.block}>
          <Block shadow style={styles.pages}>
            {this.props.pages &&
              <FlatList
                data={this.props.pages}
                renderItem={this.renderPage}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={this.renderEmpty()} />
            }
          </Block>
        </Block>
      )
  }
}

function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    connectPage,
    disconnectPage,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Pages)
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
