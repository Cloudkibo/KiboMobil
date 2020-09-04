import React from 'react'
import { connect } from 'react-redux'
import Screens from './navigation/Screens'
import { Platform, StatusBar } from 'react-native'
import { Block } from 'galio-framework'

class SubApp extends React.Component {
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
    user: (state.basicInfo.user)
  }
}
export default connect(mapStateToProps)(SubApp)
