import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logOut } from '../../redux/actions/logOut.actions'

class Dashboard extends React.Component {
  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
    this.props.logOut()
  }

  render () {
    this.props.navigation.navigate('Sign In')
    return null
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {logOut},
    dispatch)
}

export default connect(null, mapDispatchToProps)(Dashboard)
