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
import { saveNotificationToken, saveExpoToken} from '../../redux/actions/basicInfo.actions'
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

    isWhatsappNotification(action) {
        let whatsappAction = ['chat_whatsapp', 'chat_whatsapp_unresolvedSession', 'chat_whatsapp_pendingSession']
        if(whatsappAction.includes(action)) {
            return true
        } else{
            return false
        }
    }

    isMessengerNotification(action) {
        let messengerAction = ['chat_messenger', 'chat_messenger_unresolvedSession', 'chat_messenger_pendingSession']
        if(messengerAction.includes(action)) {
            return true
        } else{
            return false
        }
    }

    _handleNotification = notification => {
        if(this.isWhatsappNotification(notification.notification.request.content.data.action)) {
          let activeSubscriber = notification.notification.request.content.data.subscriber
          activeSubscriber.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
          this.setState({whatsappActiveSession: activeSubscriber})
        } else if (this.isMessengerNotification(notification.notification.request.content.data.action)) {
         this.setState({messengerActiveSession: notification.notification.request.content.data.subscriber})
        }
      };

    registerForPushNotificationsAsync = async (user, retryCount) => {
        try {
            if(user) {
                if (Constants.isDevice) {
                const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Please enable Notifcation from Device settings to get Push Notifications from KiboPush!');
                    return;
                }
                let token = (await Notifications.getExpoPushTokenAsync()).data
                console.log(token);
                if(token) {
                    this.props.saveExpoToken({expoToken: token})
                    if(!user.expoListToken.includes(token)) {
                        user.expoListToken.push(token)
                        this.props.saveNotificationToken(user)
                        user.currentDeviceToken = token
                    } else {
                        console.log('token already exist in database')
                    }
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
        } catch(error) {
            console.log(error.message);
            if(error.message.toUpperCase() === 'TOO_MANY_REGISTRATIONS') {
             alert('Your device has too many apps registered with Firebase Cloud Messaging. Please delete any one app to get Push Notification From KiboPush.')
            } else if(error && error.message && error.message.includes('Network request failed')) {
                this.registerForPushNotificationsAsync(user, retryCount - 1)
            } else if(retryCount === 0 ) {
                alert('Your internet connection is unstable. Please connect device with stable internet to get Push Notification From KiboPush.' )
            }
          }
    }
    UNSAFE_componentWillReceiveProps (nextProps) {
        if(nextProps.user !== this.props.user) {
            this.registerForPushNotificationsAsync(nextProps.user, 3)
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
    saveExpoToken,
}, dispatch)
  }
export default connect(mapStateToProps, mapDispatchToProps)(ChatSessionScreen)
