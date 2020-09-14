import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Dimensions, FlatList, View, ActivityIndicator,Platform} from 'react-native'
import { Block, Text, theme, Input, Button } from 'galio-framework'
import { MaterialIcons } from '@expo/vector-icons'
import Icon from '../../components/Icon'
import { materialTheme } from '../../constants/'
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants';
import WhatsappChatScreen from '../WhatsappLivechat/WhatsappLiveChat'
import { saveNotificationToken} from '../../redux/actions/basicInfo.actions'
import MessengerLiveChat from './LiveChat'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

class ChatSessionScreen extends React.Component {

    constructor (props, context) {
        super(props, context)

        this.state = {
         messengerActiveSession : null,
         whatsappActiveSession : null
        }
        this.clearSessionState=  this.clearSessionState.bind(this)
    }

    clearSessionState() {
        this.setState({messengerActiveSession: null, whatsappActiveSession: null})
    }

    componentDidMount () {
        this.registerForPushNotificationsAsync(this.props.user)
        this._notificationSubscription = Notifications.addNotificationResponseReceivedListener(this._handleNotification)
        this._notificationListener = Notifications.addNotificationReceivedListener(notification => {
        });
    }

    _handleNotification = notification => {
        console.log('notification.origin in livechat', notification.notification.request.content.data)
        if(notification.notification.request.content.data.action === 'chat_whatsapp') {
          let activeSubscriber = notification.notification.request.content.data.subscriber
          activeSubscriber.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
          this.setState({whatsappActiveSession: activeSubscriber})
        } else if (notification.notification.request.content.data.action === 'chat_messenger') {
         this.setState({messengerActiveSession: notification.notification.request.content.data.subscriber})
        }
      };

    registerForPushNotificationsAsync = async (user) => {
     if(user) {
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
        let token = (await Notifications.getExpoPushTokenAsync()).data
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
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        if(nextProps.user !== this.props.user) {
            this.registerForPushNotificationsAsync(nextProps.user)
        }
    }

    render () {
        return (
            this.props.user && this.props.user.platform === 'messenger' ? 
            <MessengerLiveChat navigation = {this.props.navigation} activeSession= {this.state.messengerActiveSession} clearSessionState= {this.clearSessionState}/>
            : <WhatsappChatScreen navigation = {this.props.navigation} activeSession= {this.state.whatsappActiveSession} clearSessionState= {this.clearSessionState}/>

        )}

}

function mapStateToProps (state) {
    return {
      user: (state.basicInfo.user)
    }
  }
function mapDispatchToProps (dispatch) {
    return bindActionCreators({
    saveNotificationToken,
}, dispatch)
  }
export default connect(mapStateToProps, mapDispatchToProps)(ChatSessionScreen)
