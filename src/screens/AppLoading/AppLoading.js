import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getuserdetails, getAutomatedOptions } from '../../redux/actions/basicInfo.actions'
import { AppState, AsyncStorage, ActivityIndicator, Platform, Alert, Linking, Dimensions, StyleSheet } from 'react-native'
import { Block, Text, theme, Button } from 'galio-framework'
import { joinRoom } from '../../socket/index'
import { loadDashboardData } from '../../redux/actions/dashboard.actions'
import { fetchPages } from '../../redux/actions/pages.actions'
import { loadCardBoxesDataWhatsApp } from '../../redux/actions/whatsAppDashboard.actions'

// import * as Sentry from 'sentry-expo'
import Bugsnag from '@bugsnag/expo'
import VersionCheck from 'react-native-version-check-expo'

const { width } = Dimensions.get('screen')

class Loading extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isLoadingComplete: true,
      appState: AppState.currentState,
      loadingData: true
    }
    this.handleResponse = this.handleResponse.bind(this)
    this.handleAutomatedResponse = this.handleAutomatedResponse.bind(this)
    this.fetchInActiveData = this.fetchInActiveData.bind(this)
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
    // this._handleNotification = this._handleNotification.bind(this)
  }

  async componentDidMount () {
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
            [{ text: 'No Thanks' },
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
    // const subscription = Notifications.addNotificationReceivedListener(notification => {
    //   console.log('notification got');
    // });
    // Notifications.setNotificationHandler({
    //   handleNotification: async (notification) => {
    //     console.log('handleNotification')
    //   }
    // })
    AppState.addEventListener('change', this._handleAppStateChange)
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('token').then(token => {
        if (token) {
          this.props.getuserdetails(this.handleResponse, joinRoom)
          this.props.getAutomatedOptions(this.handleAutomatedResponse)
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

  _handleAppStateChange (nextAppState) {
    console.log('AppState.currentState', this.state.appState)
    console.log('AppState.nextAppState', nextAppState)
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState})
  }
  componentWillUnmount () {
    this._unsubscribe()
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  handleResponse (res) {
    if (res.status === 'success' && this.props.automated_options) {
      this.setState({loadingData: false})
      this.fetchInActiveData(res.payload, this.props.automated_options)
      res.payload.connectFacebook || this.props.automated_options.whatsApp
        ? this.props.navigation.navigate('App')
        : this.setState({loadingData: false})
    }
  }

  fetchInActiveData (user, automatedOptions) {
    if (user.connectFacebook) {
      this.props.loadDashboardData()
      this.props.fetchPages()
    }
    if (automatedOptions.whatsApp) {
      this.props.loadCardBoxesDataWhatsApp()
    }
  }

  handleAutomatedResponse (res) {
    if (res.status === 'success' && this.props.user) {
      this.fetchInActiveData(this.props.user, res.payload)
      res.payload.whatsApp || this.props.user.connectFacebook
        ? this.props.navigation.navigate('App')
        : this.setState({loadingData: false})
    }
  }

  render () {
    if (this.state.loadingData) {
      return (
        <ActivityIndicator size='large' style={{flex: 1}} />
      )
    } else {
      return (
        <Block flex center style={styles.block}>
          <Block style={styles.pages} flex middle>
            <Text h6>You do not have any platform (Facebook or whatsApp) connected. In order to start using the app, you have to connect any one of the platforms. Please go to our website and connect them.</Text>
            <Button radius={10}
              style={{marginTop: 30}}
              onPress={() => Linking.openURL('https://kibochat.cloudkibo.com')}>Connect Platform</Button>
          </Block>
        </Block>
      )
    }
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getuserdetails,
    getAutomatedOptions,
    loadDashboardData,
    fetchPages,
    loadCardBoxesDataWhatsApp
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Loading)
const styles = StyleSheet.create({
  block: {
    width: width,
    backgroundColor: theme.COLORS.WHITE
  },
  pages: {
    marginHorizontal: 20
  }
})
