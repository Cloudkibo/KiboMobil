import React from 'react'
import { withNavigation } from '@react-navigation/compat'
import { TouchableOpacity, StyleSheet, Platform, Dimensions, Image } from 'react-native'
import { Button, Block, NavBar, Input, Text, theme } from 'galio-framework'

import Icon from '../../Icon'
import materialTheme from '../../../constants/Theme'
import Tabs from '../..//Tabs'

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
          <Text style={{color: 'white'}}>Done</Text>
        </Button>
        <Icon
          size={16}
          name='facebook'
          family='entypo'
          color={materialTheme.COLORS.MUTED}
          style={{marginRight: 10}}
        />
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

  render() {
    const { back, title, white, transparent, navigation, scene, activeSession } = this.props
    // const { routeName } = navigation.state;
    // const { options } = scene.descriptor;
    // const routeName = scene.descriptor?.options.headerTitle ?? '';
    const noShadow = ["Search", "Profile"].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];
    return (
      <Block style={headerStyles}>
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
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
          ]}
          onLeftPress={this.handleLeftPress}>
        </NavBar>
      </Block>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
  },
});
