import React from 'react'
import { connect } from 'react-redux'
import Screens from './navigation/Screens'
import { Platform, StatusBar, Alert } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { Block } from 'galio-framework'

class SubApp extends React.Component {
  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    NetInfo.fetch().then(state => {
      if (!nextProps.connected && !state.isConnected && !state.isInternetReachable) {
        Alert.alert('',
          'You are not connected to the internet. Make sure you have an active internet connection and try again.',
          [{ text: 'OK' }],
          { cancelable: true }
        )
      }
    })
  }
  render () {
    return (
      <Block flex>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        <Screens user={this.props.user} />
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    connected: (state.socketInfo.connected)
  }
}
export default connect(mapStateToProps)(SubApp)
