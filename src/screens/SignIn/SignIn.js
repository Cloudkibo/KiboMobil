import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { saveNotificationToken } from '../../redux/actions/basicInfo.actions'
import { StyleSheet, Dimensions, Platform, Image, TouchableOpacity, View, Text, TextInput, AsyncStorage, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native'
import { Block, Button, Input, theme } from 'galio-framework'
import {getAutomatedOptions } from '../../redux/actions/basicInfo.actions'

import { LinearGradient } from 'expo-linear-gradient'
import { materialTheme } from '../../constants/'
import { HeaderHeight } from '../../constants/utils'

import { signIn } from '../../redux/actions/signIn.actions'
import { logOut } from '../../redux/actions/logOut.actions'
import * as Notifications from 'expo-notifications';
const { width } = Dimensions.get('window')

class SignIn extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      email: '',
      password: '',
      active: {
        email: false,
        password: false,
        errorMessage: ''
      },
      loading: false,
      keyboardHeight: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.login = this.login.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  async removeExpoToken () {
    console.log('called removeExpoToken', this.props.user)
    let currentDeviceToken = (await Notifications.getExpoPushTokenAsync()).data
    let user = this.props.user
    if (user) {
      let expoListToken = user.expoListToken.filter(expoToken => expoToken !== currentDeviceToken)
      user.expoListToken = expoListToken
      this.props.saveNotificationToken(user, this.props.logOut)
    }
  }

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.removeExpoToken()
    })
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => this.keyboardDidShow(event))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) => this.keyboardDidHide(event))
  }

  keyboardDidShow (event) {
    this.setState({ keyboardShow: true, keyboardHeight: event.endCoordinates.height > 100 ? (Platform.OS === 'ios' ? event.endCoordinates.height : 0) : 0 })
  }
  keyboardDidHide (event) {
    this.setState({ keyboardShow: false, keyboardHeight: 0 })
  }

  componentWillUnmount () {
    // Remove the event listener
    // this.props.focusListener.remove();
    // this.list.forEach( item => item.remove() )
    this._unsubscribe()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  handleChange (name, value) {
    this.setState({ [name]: value })
    this.setState({ errorMessage: null })
  }

  toggleActive (name) {
    const { active } = this.state
    active[name] = !active[name]

    this.setState({ active })
  }

  login () {
    if (this.state.email === '') {
      this.setState({errorMessage: 'Email is Required'})
    } else if (this.state.password === '') {
      this.setState({errorMessage: 'Password is required'})
    } else {
      this.setState({loading: true})
      this.props.signIn({email: this.state.email, password: this.state.password}, this.handleResponse)
    }
  }

  async handleResponse (res) {
    this.setState({loading: false})
    if (res.status === 'success') {
      await AsyncStorage.setItem('token', res.token)
      this.props.getAutomatedOptions()
      this.props.navigation.navigate('App Loading')
    } else if (res.status === 'failed') {
      this.setState({errorMessage: res.description})
    }
  }

  render () {
    let marginFromBottom = (this.state.keyboardHeight === 0) ? 0 : this.state.keyboardHeight
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.parent}>
          <View style={{...styles.upper}}>
            <Block flex middle>
              <Block>
                <Image source={require('../../../assets/images/logo.png')} style={styles.image} />
              </Block>
              <Block>
                <Input
                  borderless
                  color='black'
                  placeholder='Email'
                  type='email-address'
                  autoCapitalize='none'
                  bgColor='transparent'
                  onBlur={() => this.toggleActive('email')}
                  onFocus={() => this.toggleActive('email')}
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  value={this.state.email}
                  onChangeText={text => this.handleChange('email', text)}
                  style={styles.input}
                />
                <Input
                  password
                  viewPass
                  borderless
                  color='black'
                  autoCapitalize='none'
                  iconColor={materialTheme.COLORS.PLACEHOLDER}
                  placeholder='Password'
                  bgColor='transparent'
                  onBlur={() => this.toggleActive('password')}
                  onFocus={() => this.toggleActive('password')}
                  placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                  value={this.state.password}
                  onChangeText={text => this.handleChange('password', text)}
                  style={styles.input}
                />
                {this.state.errorMessage &&
                  <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                }
              </Block>
              <TouchableOpacity disabled={this.state.password === '' || this.state.email === ''} style={{ ...styles.bottomParent, marginBottom: marginFromBottom }}>
                <Button
                  loading={this.state.loading}
                  shadowless
                  style={{ height: 48, width: width * 0.8 }}
                  onPress={this.login}
                >
                    SIGN IN
                </Button>
              </TouchableOpacity>
            </Block>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {signIn, logOut, saveNotificationToken, getAutomatedOptions},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

const styles = StyleSheet.create({
  signin: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0
  },
  input: {
    marginTop: 20,
    width: width * 0.8,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER
  },
  image: {
    height: 56,
    width: 264
  },
  errorMessage: {
    color: 'red',
    justifyContent: 'flex-start',
    marginTop: 20
  },
  parent: {
        flex: 1,
        padding: 10
    },

    upper: {
        paddingTop: 44,
        padding: 10,
        flex: 1,
    },

    textInput: {
        height: 40, borderColor: 'gray', borderWidth: 1
    },

    bottomParent: {
        marginTop: 20,
        alignItems: "center",
        width: '100%',
        height: 40,
    },

    bottom: {
        textAlignVertical: "center", textAlign: "center",
    }
})
