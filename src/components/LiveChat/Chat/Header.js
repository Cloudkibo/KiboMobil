import React from 'react'
import { withNavigation } from '@react-navigation/compat'
import { TouchableOpacity, StyleSheet, Platform, Dimensions, Image } from 'react-native'
import { Button, Block, NavBar, Text, theme } from 'galio-framework'

import Icon from '../../Icon'

const { height, width } = Dimensions.get('window')
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896)

class Header extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleLeftPress = this.handleLeftPress.bind(this)
  }

  handleLeftPress () {
    const { back, navigation } = this.props
    return (back ? navigation.goBack() : navigation.openDrawer())
  }

  renderRight () {
    return (
      <Block flex={0.8} row>
        <Button round style={{ width: 80, height: 30 }} color='success'>
          <Text style={{color: 'white'}}>Reopen</Text>
        </Button>
        <TouchableOpacity>
          <Icon
            size={20}
            name='dots-three-vertical'
            family='Entypo'
            style={{marginLeft: 8, marginTop: 6}}
          />
        </TouchableOpacity>
      </Block>
    )
  }

  renderTitle (activeSession) {
    return (<Block row flex middle style={{marginLeft: -30, paddingBottom: 10}}>
      <Block flex={0.2}>
        <Image
          onError={({ nativeEvent: {error} }) => console.log(error)}
          source={{uri: activeSession.profilePic}}
          style={styles.avatar} />
      </Block>
      <Block flex={0.8}>
        <Text size={16} style={{marginLeft: 5}}>
          {`${activeSession.firstName} ${activeSession.lastName}`}
        </Text>
        <Text size={12} style={{marginLeft: 5}}>
          Assigned
        </Text>
      </Block>
    </Block>)
  }

  render () {
    const { back, white, transparent, activeSession } = this.props
    return (
      <Block>
        <NavBar
          back={back}
          title={this.renderTitle(activeSession)}
          style={styles.navbar}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ flex: 0.3, paddingBottom: 10 }}
          leftIconName='arrowleft'
          leftIconFamily='AntDesign'
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] }
          ]}
          onLeftPress={this.handleLeftPress} />
      </Block>
    )
  }
}

export default withNavigation(Header)

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold'
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10
  }
})
