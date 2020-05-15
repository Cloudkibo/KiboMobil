import React from 'react'

import { Dimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { Icon, Header } from '../components/'
import { Images, materialTheme, tabs } from '../constants/'

// screens
import OnboardingScreen from '../screens/Onboarding'
import HomeScreen from '../screens/Home'
import AppLoadingScreen from '../screens/AppLoading/AppLoading'
import DashboardScreen from '../screens/Dashboard/Dashboard'
import WomanScreen from '../screens/Woman'
import PagesScreen from '../screens/Pages/Pages'
import SubscribersScreen from '../screens/Subscribers/Subscribers'
import InviteSubscribersScreen from '../screens/InviteSubscribers/InviteSubscribers'
import LogOutScreen from '../screens/LogOut/LogOut'


import ManScreen from '../screens/Man'
import KidsScreen from '../screens/Kids'
import NewCollectionScreen from '../screens/NewCollection'
import DealsScreen from '../screens/Deals'

import CategoriesScreen from '../screens/Categories'
import CategoryScreen from '../screens/Category'
import ProductScreen from '../screens/Product'
import GalleryScreen from '../screens/Gallery'
import ChatScreen from '../screens/Chat'

import CartScreen from '../screens/Cart'
import SignInScreen from '../screens/SignIn/SignIn'
import SignUpScreen from '../screens/SignUp'

import SearchScreen from '../screens/Search'
import ComponentsScreen from '../screens/Components'

import ProfileScreen from '../screens/Profile'
import SettingsScreen from '../screens/Settings'
import NotificationsScreen from '../screens/Notifications'
import PrivacyScreen from '../screens/Privacy'
import AboutScreen from '../screens/About'
import AgreementScreen from '../screens/Agreement'

import CustomDrawerContent from './Menu'

const { width } = Dimensions.get('screen')

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function ProfileStack (props) {
  return (
    <Stack.Navigator initialRouteName='Profile' mode='card' headerMode='screen'>
      <Stack.Screen
        name='Invite Subscribers'
        component={InviteSubscribersStack}
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
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title='Cart' scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function SettingsStack (props) {
  return (
    <Stack.Navigator
      initialRouteName='Settings'
      mode='card'
      headerMode='screen'
    >
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title='Settings' scene={scene} navigation={navigation} />
          )
        }}
      />
      <Stack.Screen
        name='Agreement'
        component={AgreementScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Agreement'
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name='Privacy'
        component={PrivacyScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Privacy'
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name='About'
        component={AboutScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='About us'
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name='Notifications'
        component={NotificationsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Notifications Settings'
              scene={scene}
              navigation={navigation}
            />
          )
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Shopping Cart'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function ComponentsStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Components'
        component={ComponentsScreen}
        option={{
          header: ({ navigation }) => (
            <Header title='Components' navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

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

function LogOutStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Log Out'
        component={LogOutScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Log Out'
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
      <Stack.Screen
        name='Deals'
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title='Best Deals'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title='Categories'
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor
            const title = (params && params.headerTitle) || 'Category'
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Gallery'
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Shopping Cart'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title='Search' navigation={navigation} scene={scene} />
          )
        }}
      />
    </Stack.Navigator>
  )
}



function ManStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='Man'
        component={ManScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='Man'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Deals'
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title='Best Deals'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title='Categories'
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor
            const title = (params && params.headerTitle) || 'Category'
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Gallery'
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Shopping Cart'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title='Search' navigation={navigation} scene={scene} />
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
      <Stack.Screen
        name='Deals'
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title='Best Deals'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title='Categories'
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor
            const title = (params && params.headerTitle) || 'Category'
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Gallery'
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Shopping Cart'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title='Search' navigation={navigation} scene={scene} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function NewCollectionStack (props) {
  return (
    <Stack.Navigator mode='card' headerMode='screen'>
      <Stack.Screen
        name='NewCollection'
        component={NewCollectionScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title='New Collection'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Deals'
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title='Best Deals'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title='Categories'
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor
            const title = (params && params.headerTitle) || 'Category'
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Gallery'
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Shopping Cart'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title='Search' navigation={navigation} scene={scene} />
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
            <Header
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
        name='Deals'
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title='Best Deals'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title='Categories'
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor
            const title = (params && params.headerTitle) || 'Category'
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            )
          }
        }}
      />
      <Stack.Screen
        name='Product'
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Gallery'
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=''
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Rachel Brown'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Cart'
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title='Shopping Cart'
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name='Search'
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title='Search' navigation={navigation} scene={scene} />
          )
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
        name='Man'
        component={ManStack}
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
