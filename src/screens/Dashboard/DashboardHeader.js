import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNavigation } from '@react-navigation/compat';
import { updatePlatform } from '../../redux/actions/basicInfo.actions'
import { clearWhatsappDashboardData } from '../../redux/actions/whatsAppDashboard.actions'
import { clearDashboardData} from '../../redux/actions/dashboard.actions'
import {clearSession} from '../../redux/actions/liveChat.actions'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, Platform, Dimensions,View } from 'react-native';
import { Button, Block, NavBar, Input, Text, theme } from 'galio-framework';
import {ListItem, Card } from 'react-native-elements'
import Icon from '../../components/Icon';
import materialTheme from '../../constants/Theme';
import Tabs from '../../components/Tabs';
import SelectPlatform from './SelectPlatform'
import { Select } from '../../components/'
const { height, width } = Dimensions.get('window');
import RNPickerSelect from 'react-native-picker-select';
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

let Toast = null
if (Platform.OS === 'ios') {
  Toast = require('react-native-tiny-toast')
} else {
  Toast = require('react-native-simple-toast')
}
const ChatButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Chat')}>
    <Icon
      family="GalioExtra"
      size={16}
      name="chat-33"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const BasketButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Cart')}>
    <Icon
      family="GalioExtra"
      size={16}
      name="basket-simple"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const SearchButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Search')}>
    <Icon
      size={16}
      family="entypo"
      name="magnifying-glass"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

class DashboardHeader extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            showAssignmentModal: false,
            automated_options: this.props.automated_options,
            selectedPlatform: 'messenger',
            Platforms: [{label: 'Messenger', value: 'messenger'}, {label: 'WhatsApp', value: 'whatsApp'}]
          }
          this.handlePlatformSelect = this.handlePlatformSelect.bind(this)
          this.handlePlatform = this.handlePlatform.bind(this)
    }
    handlePlatformSelect (value, index) {
      if(value) {
        this.setState({selectedPlatform: value})
        if(Platform.OS === 'android') {
          this.handlePlatform(value)
        }
    }
  }

    handlePlatform(value) {
      console.log('value', value)
      if (this.props.automated_options) {
    if( (value === 'messenger' && this.props.automated_options.facebook) || (value === 'whatsApp' && this.props.automated_options.whatsApp)) {
      if(value !== this.props.user.platform) {
      this.props.clearSession(true)
      this.props.updatePlatform({platform :value})
      if(value ==='messenger') {
        this.props.clearDashboardData()
        this.props.clearWhatsappDashboardData()

      } else {
        this.props.clearWhatsappDashboardData()
        this.props.clearDashboardData()
     }
    }
   } else {
    if(value === 'messenger') {
      this.setState({selectedPlatform: 'whatsApp'})
      Toast.default.show('Please Connect Facebook Account with KiboPush')
    } else {
      this.setState({selectedPlatform: 'messenger'})
      Toast.default.show('Please Connect WhatsApp Account with KiboPush')
    }
   }
  }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('DidMount called')
    if(nextProps.automated_options) {
      this.setState({automated_options: nextProps.automated_options})
    }
    if(nextProps.user !== this.props.user) {
      this.setState({selectedPlatform: nextProps.user.platform})
    }
  }
  componentDidMount () {
    if(this.props.automated_options) {
      this.setState({automated_options: this.props.automated_options})
    }
  }
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }
  renderRight = () => {
    const { white, title, navigation, scene } = this.props;
    const placeholder = {
      label: 'Select a Platform',
      value: null,
      color: '#9EA0A4',
    };
    return (
      <Block flex={0.8} row style={{width:width*0.4}}>
      <RNPickerSelect
      placeholder= {placeholder}
      onValueChange={(value) =>  this.handlePlatformSelect(value)}
      onDonePress= {(value)=> {this.handlePlatform(this.state.selectedPlatform)}}
      useNativeAndroidPickerStyle={false}
      items={this.state.Platforms}
      value={this.state.selectedPlatform}
      style={{
        ...pickerSelectStyles,
        iconContainer: {
          top: 5,
          right:12,
        },
      }}
      textInputProps={{ underlineColor: 'yellow' }}
      Icon={() => {
        return <Ionicons name="md-arrow-down" size={24} color="gray" />;
      }}
  />
  </Block>
    )
  }

  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        onFocus={() => navigation.navigate('Search')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
      />
    )
  }

  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Categories')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>{optionLeft || 'Categories'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Deals')}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>{optionRight || 'Best Deals'}</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })} />
    )
  }

  renderHeader = () => {
    const { search, tabs, options } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch() : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      )
    }
    return null;
  }

  render() {
    const { back, title, white, transparent, navigation, scene } = this.props;
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
          title={title}
          style={styles.navbar}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center', paddingRight:35, paddingTop: 3}}
          leftStyle={{ paddingTop: 3, flex: 0.3 }}
          leftIconName={back ? null : "navicon"}
          // leftIconFamily="font-awesome"
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] },
          ]}
          onLeftPress={this.handleLeftPress}
        />
      </Block>
    );
  }
}

function mapStateToProps (state) {
    return {
      user: (state.basicInfo.user),
      automated_options: (state.basicInfo.automated_options)
      // socketData: (state.socketInfo.socketData)
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        updatePlatform: updatePlatform,
        clearWhatsappDashboardData: clearWhatsappDashboardData,
        clearDashboardData: clearDashboardData,
        clearSession: clearSession
    }, dispatch)
  }

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHeader)

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
    // zIndex: 5,
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
  options: {
    // paddingRight:0,
    // flexWrap: "wrap",
    // padding: theme.SIZES.BASE / 2
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width:width*0.4,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width:width*0.4,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
