import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getuserdetails } from '../../redux/actions/basicInfo.actions'
import { AppLoading } from 'expo'
import { Image, AsyncStorage, ActivityIndicator } from 'react-native'
import { Asset } from 'expo-asset'
import { Images } from '../../constants/'
import { joinRoom } from '../../utility/socketio'

const assetImages = [
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
  Images.Products.Auto,
  Images.Products.Motocycle,
  Images.Products.Watches,
  Images.Products.Makeup,
  Images.Products.Accessories,
  Images.Products.Fragrance,
  Images.Products.BMW,
  Images.Products.Mustang,
  Images.Products['Harley-Davidson']
]

class Loading extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isLoadingComplete: false
    }
    this._handleFinishLoading = this._handleFinishLoading.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this._loadResourcesAsync = this._loadResourcesAsync.bind(this)
    this.cacheImages = this.cacheImages.bind(this)
  }

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('token').then(token => {
        if (token) {
          this.props.getuserdetails(this.handleResponse, joinRoom)
        } else {
          this.props.navigation.navigate('Sign In')
        }
      })
    })
  }
  componentWillUnmount () {
    this._unsubscribe()
  }

  async _loadResourcesAsync () {
    return Promise.all([
      ...this.cacheImages(assetImages)
    ])
  }

  cacheImages (images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image)
      } else {
        return Asset.fromModule(image).downloadAsync()
      }
    })
  }

  _handleLoadingError (error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  };

  async _handleFinishLoading () {
    this.setState({isLoadingComplete: true})
  };

  handleResponse (res) {
    if (res.status === 'success') {
      this.props.navigation.navigate('App')
    }
  }

  render () {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <ActivityIndicator size='large' style={{flex: 1}} />
      )
    }
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {getuserdetails},
    dispatch)
}
export default connect(null, mapDispatchToProps)(Loading)
