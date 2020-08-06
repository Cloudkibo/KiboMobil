import React from 'react'

import { Dimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { Icon, Header } from '../components/'
import { materialTheme } from '../constants/'

// screens
import AppLoadingScreen from '../screens/AppLoading/AppLoading'
import DashboardScreen from '../screens/Dashboard/Dashboard'
import PagesScreen from '../screens/Pages/Pages'
import SubscribersScreen from '../screens/Subscribers/Subscribers'
import InviteSubscribersScreen from '../screens/InviteSubscribers/InviteSubscribers'
import LiveChatSessionScreen from '../screens/LiveChat/LiveChat'
import WhatsappLiveChatSessionScreen from '../screens/WhatsappLivechat/WhatsappLiveChat'
import WhatsappTemplateMessage from '../screens/WhatsappLivechat/WhatsappTemplateMessage'
import ChatScreen from '../screens/LiveChat/Chat'
import DashboardHeader from '../screens/Dashboard/DashboardHeader'
import ChatHeader from '../screens/LiveChat/ChatHeader'
import SignInScreen from '../screens/SignIn/SignIn'

import CustomDrawerContent from './Menu'

const { width } = Dimensions.get('screen')

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default function OnboardingStack (props) {
  let user = props.user
  return (
    <Stack.Navigator mode='card' headerMode='none'>
      <Stack.Screen
        name='App Loading'
        component={AppLoadingScreen}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Sign In'
        component={SignInScreen}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name='App'>
        {(props) => <AppStack {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

function InviteSubscribersStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Invite Subscribers'
        component={InviteSubscribersScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Invite Subscribers'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function PagesStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Pages'
        component={PagesScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Pages'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function LiveChatStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Live Chat'
        component={LiveChatSessionScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Live Chat'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => {
            const activeSession = scene.__memo[0].params.activeSession
            return (
              <ChatHeader
                back
                activeSession={activeSession}
                title={`${activeSession.firstName} ${activeSession.lastName}`}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />

      
    </Stack.Navigator>
  )
}

function WhatsappLivechat (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Live Chat'
        component={WhatsappLiveChatSessionScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Live Chat'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => {
            const activeSession = scene.__memo[0].params.activeSession
            return (
              <ChatHeader
                back
                activeSession={activeSession}
                title={`${activeSession.firstName} ${activeSession.lastName}`}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
        <Stack.Screen
        name='WhatsappTemplateMessage'
        component={WhatsappTemplateMessage}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='send Message'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function SubscribersStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Subscribers'
        component={SubscribersScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Subscribers'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function DashboardStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Dashboard'
        component={DashboardScreen}
        options={{
          header: ({ navigation, scene }) => (
            <DashboardHeader
              search
              options
              title='Dashboard'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => {
            const activeSession = scene.__memo[0].params.activeSession
            return (
              <ChatHeader
                back
                activeSession={activeSession}
                title={`${activeSession.firstName} ${activeSession.lastName}`}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}

function AppStack (props, param) {
  let user = props.user
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => (
        <CustomDrawerContent {...props} profile={user} />
      )}
      drawerStyle={{
        backgroundColor: 'white',
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintColor: 'white',
        inactiveTintColor: '#000',
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          paddingVertical: 4,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: 'normal'
        }
      }}
      initialRouteName='Dashboard'
    >
      <Drawer.Screen
        name='Dashboard'
        component={DashboardStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name='dashboard'
              family='GalioExtra'
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name='Live Chat'
        component={user ? user.platform === 'messenger' ? LiveChatStack : WhatsappLivechat : LiveChatStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name='man'
              family='entypo'
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name='Subscribers'
        component={SubscribersStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name='baby'
              family='GalioExtra'
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name='Pages'
        component={PagesStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name='facebook'
              family='entypo'
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
              style={{ marginLeft: 4, marginRight: 4 }}
            />
          )
        }}
      />
      <Drawer.Screen
        name='Invite Subscribers'
        component={InviteSubscribersStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name='circle-10'
              family='GalioExtra'
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name='Log Out'
        component={SignInScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name='circle-10'
              family='GalioExtra'
              color={focused ? 'white' : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
    </Drawer.Navigator>
  )
}
