import React from 'react'
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import { Block, theme } from 'galio-framework'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CardBox from '../../components/Dashboard/CardBox'
import { saveNotificationToken, getAutomatedOptions } from '../../redux/actions/basicInfo.actions'
import { loadCardBoxesDataWhatsApp } from '../../redux/actions/whatsAppDashboard.actions'
import { loadDashboardData} from '../../redux/actions/dashboard.actions'
import { Text, View, Button, Vibration, Platform } from 'react-native'
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
const { width } = Dimensions.get('screen')

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    state = {
      expoPushToken: '',
      notification: {},
    }
    this._loadData = this._loadData.bind(this)
}
  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  _loadData (user) {
    if(user.platform === 'messenger') {
      this.props.loadDashboardData()
    } else {
      this.props.loadCardBoxesDataWhatsApp()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if(nextProps.user && this.props.user && this.props.user.platform !== nextProps.user.platform) {
     this._loadData(nextProps.user)
    } else if(nextProps.user && !this.props.user) {
      this._loadData(nextProps.user)
    }
  }
  componentDidMount () {
    this.props.getAutomatedOptions()
    this.registerForPushNotificationsAsync()
    this._notificationSubscription = Notifications.addNotificationResponseReceivedListener(this._handleNotification)
    this._notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // console.log('received_notification', notification)
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if(this.props.user) {
        if(this.props.user.platform === 'messenger') {
          this.props.loadDashboardData()
        } else {
          this.props.loadCardBoxesDataWhatsApp()
        }
      }
    })
  }

  _handleNotification = notification => {
    this.setState({ notification: notification.notification })
    console.log('notification.origin', notification.notification.request.content.data)
     
    if(notification.notification.request.content.data.action === 'chat_whatsapp') {
      let activeSubscriber = notification.notification.request.content.data.subscriber
      activeSubscriber.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
      this.props.navigation.navigate('Live Chat', {
        screen: 'Whatsapp Live Chat',
        params: {activeSession: activeSubscriber}
      });
    } else if (notification.notification.request.content.data.action === 'chat_messenger') {
     this.props.navigation.navigate('Live Chat', {
        screen: 'Live Chat',
        params: {activeSession: notification.notification.request.content.data.subscriber}
      });    
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
      token = (await Notifications.getExpoPushTokenAsync()).data
      let user = this.props.user
      console.log(token);
      if(!user.expoListToken.includes(token)) {
        user.expoListToken.push(token)
        this.props.saveNotificationToken(user)
        user.currentDeviceToken = token
      } else {
        console.log('token already exist in database')
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        // importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }
  componentWillUnmount () {
    this._unsubscribe()
  }

  render () {
    return (
      <Block flex center style={styles.home}>
      {
        this.props.user && ((this.props.user.platform === 'messenger' && !this.props.dashboard) || (this.props.user.platform === 'whatsApp' && !this.props.cardBoxesData)) ?
        <Block flex={0.8} middle><ActivityIndicator size='large' /></Block>
        :
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}>
          {(this.props.dashboard || this.props.cardBoxesData) &&
            <Block middle flex>
             {
              this.props.user && this.props.user.platform === 'messenger' && this.props.dashboard &&
              <Block flex row middle>
                <CardBox
                  title={this.props.dashboard.totalPages}
                  subtitle='Total Pages'
                  style={{ borderBottomColor: theme.COLORS.PRIMARY, marginRight: theme.SIZES.BASE }}
                  navigateTo='Pages'
                />
                <CardBox
                  title={this.props.dashboard.pages}
                  subtitle='Connected Pages'
                  style={{ borderBottomColor: theme.COLORS.WARNING }}
                  navigateTo='Pages'
                />
              </Block>
              }
              <Block flex row>
                <CardBox
                  title={this.props.user && this.props.user.platform === 'messenger' ? this.props.dashboard ? this.props.dashboard.subscribers: 0: this.props.cardBoxesData ? this.props.cardBoxesData.subscribers: 0}
                  subtitle='Subscribers'
                  style={{ borderBottomColor: theme.COLORS.ERROR, marginRight: theme.SIZES.BASE }}
                  navigateTo='Subscribers'
                />
                <CardBox title={this.props.user && this.props.user.platform === 'messenger' ? this.props.dashboard ? this.props.dashboard.unreadCount:0 : this.props.cardBoxesData  ? this.props.cardBoxesData.chats: 0}
                  subtitle='New Messages'
                  style={{ borderBottomColor: theme.COLORS.INFO }}
                  navigateTo='Live Chat'
                />
              </Block>
            </Block>
          }
        </ScrollView>
      }
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    dashboard: (state.dashboardInfo.dashboard),
    user: (state.basicInfo.user),
    cardBoxesData: (state.smsWhatsAppDashboardInfo.cardBoxesData),
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadDashboardData,
    saveNotificationToken,
    getAutomatedOptions,
    loadCardBoxesDataWhatsApp},
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
