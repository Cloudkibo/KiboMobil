import React from 'react'
import { StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { Block, Text, theme } from 'galio-framework'

import Icon from './Icon'
import materialTheme from '../constants/Theme'

class DrawerItem extends React.Component {
  renderIcon () {
    const { title, focused } = this.props

    switch (title) {
      case 'Dashboard':
        return (
          <Icon
            size={16}
            name='dashboard'
            family='MaterialIcons'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'Live Chat':
        return (
          <Icon
            size={16}
            name='chat'
            family='Entypo'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'Subscribers':
        return (
          <Icon
            size={16}
            name='users'
            family='entypo'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'Pages':
        return (
          <Icon
            size={16}
            name='facebook'
            family='entypo'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'Invite Subscribers':
        return (
          <Icon
            size={16}
            name='add-user'
            family='entypo'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'User Guide':
        return (
          <Icon
            size={16}
            name='add-user'
            family='entypo'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'Log Out':
        return (
          <Icon
            size={16}
            name='log-out'
            family='entypo'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      case 'Sign Up':
        return (
          <Icon
            size={16}
            name='md-person-add'
            family='ionicon'
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        )
      default:
        return null
    }
  }

  render () {
    const { title, focused, navigation } = this.props
    return (
      <TouchableOpacity
        style={{ height: 55 }}
        onPress={() => {
          title === 'User Guide' ? Linking.openURL('https://kibopush.com/kibopush-mobile')
            : navigation.navigate(title)
        }}
      >
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
            focused ? [styles.activeStyle, styles.shadow] : null
          ]}
        >
          <Block middle flex={0.1} style={{ marginRight: 28 }}>
            {this.renderIcon()}
          </Block>
          <Block flex={0.9}>
            <Text size={16} color={focused ? 'white' : materialTheme.COLORS.MUTED}>
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    )
  }
}

export default DrawerItem

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 6
  },
  activeStyle: {
    // backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  }
})
