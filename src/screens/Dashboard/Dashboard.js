import React from 'react'
import { StyleSheet, Dimensions, ScrollView } from 'react-native'
import { Block, theme } from 'galio-framework'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CardBox from '../../components/Dashboard/CardBox'
import { saveNotificationToken } from '../../redux/actions/basicInfo.actions'
import { loadDashboardData} from '../../redux/actions/dashboard.actions'
import { Text, View, Button, Vibration, Platform } from 'react-native'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
const { width } = Dimensions.get('screen')

class Dashboard extends React.Component {
  state = {
    expoPushToken: '',
    notification: {},
  }
  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  componentDidMount () {
    this.registerForPushNotificationsAsync()
    this._notificationSubscription = Notifications.addListener(this._handleNotification)
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.loadDashboardData()
    })
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    console.log('notification', notification);
    this.setState({ notification: notification })
    console.log('this.props.navigation', this.props.navigation)
    if(notification.origin === 'selected') {
    this.props.navigation.navigate('Chat', { activeSession: notification.data })
    }
  };
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      let user = this.props.user
      console.log(token);
      if(!user.expoListToken.includes(token)) {
        user.expoListToken.push(token)
        this.props.saveNotificationToken(user)
      } else {
        console.log('token already exist in database')
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }
  componentWillUnmount () {
    this._unsubscribe()
  }

  render () {
    return (
      <Block flex center style={styles.home}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}>
          {this.props.dashboard &&
            <Block middle flex>
              <Block flex row middle>
                <CardBox title={this.props.dashboard.totalPages} subtitle='Total Pages' style={{ borderBottomColor: theme.COLORS.PRIMARY, marginRight: theme.SIZES.BASE }} />
                <CardBox title={this.props.dashboard.pages} subtitle='Connected Pages' style={{ borderBottomColor: theme.COLORS.WARNING }} />
              </Block>
              <Block flex row>
                <CardBox title={this.props.dashboard.subscribers} subtitle='Subscribers' style={{ borderBottomColor: theme.COLORS.ERROR, marginRight: theme.SIZES.BASE }} />
                <CardBox title={this.props.dashboard.unreadCount} subtitle='New Messages' style={{ borderBottomColor: theme.COLORS.INFO }} />
              </Block>
            </Block>
          }
        </ScrollView>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    dashboard: (state.dashboardInfo.dashboard),
    user: (state.basicInfo.user),
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadDashboardData,
    saveNotificationToken},
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

const styles = StyleSheet.create({
  home: {
    width: width
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2
  }
})
