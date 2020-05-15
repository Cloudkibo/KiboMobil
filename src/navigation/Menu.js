import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Image
} from 'react-native'
import { Block, Text, theme } from 'galio-framework'
import { useSafeArea } from 'react-native-safe-area-context'

import { Drawer as DrawerCustomItem } from '../components/'

function CustomDrawerContent ({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea()
  const screens = [
    'Dashboard',
    'Live Chat',
    'Subscribers',
    'Pages',
    'Invite Subscribers'
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
          showsVerticalScrollIndicator={false}
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
        <Block flex={0.23} style={styles.footer}>
          <Block row style={styles.profile}>
            <Image source={{ uri: profile.facebookInfo.profilePic }} style={styles.avatar} />
            <Block>
              <Text h5 color='white'>
                {profile.name}
              </Text>
              <Text h7 color='white'>
                {profile.email}
              </Text>
            </Block>
          </Block>
          <Block style={{paddingHorizontal: 6, paddingBottom: 0}}>
            <DrawerCustomItem
              title='Log Out'
              key={screens.length}
              navigation={navigation}
              focused
            />
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
    justifyContent: 'flex-end',
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
    backgroundColor: 'rgb(45, 45, 63)'
  }
})

export default CustomDrawerContent
