import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native'
import { Block, Text, theme } from 'galio-framework'
import { useSafeArea } from 'react-native-safe-area-context'
import Profile from './Profile'
import { Drawer as DrawerCustomItem } from '../components/'
import app from '../../app.json'

function CustomDrawerContent ({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea()
  const screens = profile && profile.platform === 'whatsApp' ? [
    'Dashboard',
    'Live Chat',
    'Subscribers',
    'User Guide'
  ] : [
    'Dashboard',
    'Live Chat',
    'Subscribers',
    'Pages',
    'Invite Subscribers',
    'User Guide'
  ]
  return (
    <Block
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <Block flex={0.1} style={styles.header}>
        <Text h4 color={'white'}>
          KIBOPUSH
        </Text>
      </Block>
      <Block flex style={styles.menuItems}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === 'left' ? insets.left : 0,
              paddingRight: drawerPosition === 'right' ? insets.right : 0
            }
          ]}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index}
              />
            )
          })}
        </ScrollView>
      </Block>
      {profile &&
        <Block style={styles.footer}>
          <Profile profile={profile} />
          <Block style={{paddingHorizontal: 6, paddingBottom: 10, marginBottom: theme.SIZES.BASE / 2, borderBottomWidth: 1, borderBottomColor: '#979797'}}>
            <DrawerCustomItem
              title='Log Out'
              key={screens.length}
              navigation={navigation}
              focused
            />
          </Block>
          <Block style={{paddingHorizontal: 6, marginBottom: theme.SIZES.BASE / 2}}>
            <Text color='white'>Version: {Platform.OS === 'ios' ? app.expo.ios.buildNumber : app.expo.android.versionCode}</Text>
          </Block>
        </Block>
      }
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: 'rgb(33, 32, 53)',
    paddingHorizontal: 28,
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10
  },
  footer: {
    backgroundColor: '#2c2e3e'
  },
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
  },
  menuItems: {
    paddingLeft: 7,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'rgb(45, 45, 63)'
  }
})

export default CustomDrawerContent
