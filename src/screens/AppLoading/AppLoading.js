import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getuserdetails, getAutomatedOptions } from '../../redux/actions/basicInfo.actions'
import { Image, AsyncStorage, ActivityIndicator, Platform, Alert, Linking } from 'react-native'
import { Asset } from 'expo-asset'
import { Images } from '../../constants/'
import { joinRoom } from '../../utility/socketio'
// import * as Sentry from 'sentry-expo'
import Bugsnag from '@bugsnag/expo'
import VersionCheck from 'react-native-version-check-expo'
import NetInfo from "@react-native-community/netinfo";

const assetImages = [
  Images.Onboarding
]

class Loading extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isLoadingComplete: false,
      showLoader: false
    }
    this._handleFinishLoading = this._handleFinishLoading.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this._loadResourcesAsync = this._loadResourcesAsync.bind(this)
    this.cacheImages = this.cacheImages.bind(this)
    // this._handleNotification = this._handleNotification.bind(this)
  }

  async componentDidMount () {
      NetInfo.fetch().then(state => {
      console.log('state', state)
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    VersionCheck.needUpdate()
      .then(result => {
        let currentVersion = parseInt(result.currentVersion, 10)
        let latestVersion = parseInt(result.latestVersion, 10)
        if (currentVersion < latestVersion || result.isNeeded) {
          let url = Platform.OS === 'android'
            ? 'https://play.google.com/store/apps/details?id=com.cloudkibo.kibopush'
            : 'https://apps.apple.com/us/app/kibopush/id1519207005'
          Alert.alert(
            'Update KiboPush?',
            'KiboPush recommends that you update to the latest version. This version includes few bug fixes and performance improvements. You can keep using the app while downloading the update.',
            [{ text: 'No Thanks', onPress: () => console.log('no thanks Pressed'), style: 'destructive' },
              { text: 'Update', onPress: () => Linking.openURL(url) }],
            { cancelable: true })
        }
      })
      .catch((err) => {
        Bugsnag.notify(err)
        // Sentry.captureException(err)
      })
    // if (Platform.OS === 'android') {
    //   Notifications.createChannelAndroidAsync('default', {
    //     name: 'default',
    //     sound: true,
    //     priority: 'max',
    //     vibrate: [0, 250, 250, 250],
    //   });
    // }
    // this._notificationSubscription = Notifications.addListener(this._handleNotification)
    this.props.navigation.navigate('Sign In')
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('token').then(token => {
        console.log('token', token)
        if (token) {
          this.props.getuserdetails(this.handleResponse, joinRoom)
        } else {
          this.props.navigation.navigate('Sign In')
        }
      })
    })
  }
  //   _handleNotification = notification => {
  //   console.log('notification', notification)
  //   if(notification.origin === 'selected') {
  //     this.props.navigation.navigate('Live Chat', {
  //       screen: 'Live Chat',
  //       params: {activeSession: notification.data},
  //     });
  //   }
  // }
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
    // Sentry.captureException(error)
  };

  async _handleFinishLoading () {
    console.log('_handleFinishLoading')
    this.setState({isLoadingComplete: true}, () => {
      AsyncStorage.getItem('token').then(token => {
        console.log('AsyncStorage')
        if (token) {
          this.setState({showLoader: true})
          this.props.getuserdetails(this.handleResponse, joinRoom)
        } else {
          this.props.navigation.navigate('Sign In')
        }
      })
    })
  };

  handleResponse (res) {
    if (res.status === 'success') {
      this.props.getAutomatedOptions()
      this.props.navigation.navigate('App')
    } else {
      this.props.navigation.navigate('Sign In')
    }
  }

  render () {
    console.log('re-render')
    // if (!this.state.isLoadingComplete) {
    //   return (
    //     <AppLoading
    //       startAsync={this._loadResourcesAsync}
    //       onError={this._handleLoadingError}
    //       onFinish={this._handleFinishLoading}
    //     />
    //   )
    // } else {
    return (
      <ActivityIndicator size='large' style={{flex: 1}} />
    )
    // }
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {getuserdetails, getAutomatedOptions},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Loading)
