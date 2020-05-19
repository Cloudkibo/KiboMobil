import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {StyleSheet, Image} from 'react-native'
import {Block, Text, theme} from 'galio-framework'
import { updatePicture } from '../redux/actions/basicInfo.actions'

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.profilePicError = this.profilePicError.bind(this)
  }
  profilePicError (e) {
    this.props.updatePicture({user: this.props.user})
  }
  render () {
    if (this.props.user) {
      return (
        <Block row style={styles.profile}>
          <Image
            onError={() => this.profilePicError()}
            source={{
              uri: this.props.user.facebookInfo && this.props.user.facebookInfo.profilePic
                ? this.props.user.facebookInfo.profilePic
                : 'https://cdn.cloudkibo.com/public/icons/users.jpg'
            }}
            style={styles.avatar} />
          <Block>
            <Text h5 color='white'>
              {this.props.user.name}
            </Text>
            <Text h7 color='white'>
              {this.props.user.email}
            </Text>
          </Block>
        </Block>
      )
    } else {
      return null
    }
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePicture
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const styles = StyleSheet.create({
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
    borderBottomWidth: 1,
    borderBottomColor: '#979797'
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginBottom: theme.SIZES.BASE,
    marginRight: 10,
    marginHorizontal: 16
  }
})
