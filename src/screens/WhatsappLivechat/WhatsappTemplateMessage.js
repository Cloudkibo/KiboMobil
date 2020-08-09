import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {validatePhoneNumber} from '../../utility/utils'
import { StyleSheet, Dimensions, Image, FlatList, Alert, ActivityIndicator, Platform, TextInput,ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { Button, Block, Text, theme } from 'galio-framework'
import { CheckBox } from 'react-native-elements'
import {createNewContact, sendChatMessage} from '../../redux/actions/whatsAppChat.actions'
import { materialTheme } from '../../constants/'
import { View } from 'react-native-animatable';
import { HitTestResultTypes } from 'expo/build/AR'
import Perview from './Preview'
const { width } = Dimensions.get('screen')

let Toast = null
if (Platform.OS === 'ios') {
  Toast = require('react-native-tiny-toast')
} else {
  Toast = require('react-native-simple-toast')
}

class WhatsappTemplateMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showAssignmentModal: false,
      isTemplateValid: true,
      number: '',
      isPhoneNumberValid: false,
      isButtonDisabled: true,
      selectedTemplate: this.props.whatsAppMessageTemplates ? {...this.props.whatsAppMessageTemplates[0]}: null
    }
    this.renderItem = this.renderItem.bind(this)
    this.onInputPhoneChange = this.onInputPhoneChange.bind(this)
    this.sendTemplate = this.sendTemplate.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
    this.reset = this.reset.bind(this)
    this.Preview = this.Preview.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.validateTemplate = this.validateTemplate.bind(this)
    this._sendTemplate = this._sendTemplate.bind(this)
    this.sendTemplate = this.sendTemplate.bind(this)
    this._setMessageData = this._setMessageData.bind(this)
    this.showErrorDialog = this.showErrorDialog.bind(this)
    this.toggleAssignmentModal = this.toggleAssignmentModal.bind(this)
  }

  toggleAssignmentModal (value) {
    this.setState({showAssignmentModal: false})
  }

  showErrorDialog (message) {
    Alert.alert(
      'ERROR!',
      message,
      [
        { text: 'OK' }
      ],
      { cancelable: true }
    )
  }

  sendTemplate () {
    if(!this.state.isButtonDisabled) {
      this.setState({sendingTemplate: true})
        this.props.createNewContact({
          number: '+' + this.state.number.replace(/\D/g, '')
        }, (res) => {
            this._sendTemplate(res.payload)
        })
      }
    }
  _sendTemplate(session) {
    let payload = {
      componentType: 'text',
      text: this.state.selectedTemplate.text,
      buttons: this.state.selectedTemplate.button,
      templateArguments: this.state.selectedTemplate.templateArguments,
      templateName: this.state.selectedTemplate.name
    }
    let data = this._setMessageData(session, payload)
    this.props.sendChatMessage(data, (res) => {
      if (res.status === 'success') {
        Toast.default.show('Message send successfully')
        this.reset()
        this.props.navigation.navigate('Live Chat')
      } else {
        this.showErrorDialog(res.payload)
     }
    })
    }
    _setMessageData(session, payload, urlMeta) {
      const data = {
        senderNumber: this.props.automated_options.flockSendWhatsApp.number,
        recipientNumber: session.number,
        contactId: session._id,
        payload,
        datetime: new Date().toString(),
        repliedBy: {
          id: this.props.user._id,
          name: this.props.user.name,
          type: 'agent'
        },
        url_meta: urlMeta
      }
      return data
    }
  onTextChange (text) {
    let selectedTemplate = this.state.selectedTemplate
    selectedTemplate.text =  text
    this.setState({
      selectedTemplate: selectedTemplate
    })
    this.validateTemplate(text)
  }

  validateTemplate(msg) {
    let regex = new RegExp(this.state.selectedTemplate.regex)
    let templateArguments = this.state.selectedTemplate.templateArguments
    let isValid = regex.test(msg)
    if (isValid) {
      let matches = regex.exec(msg)
      for (let i = 1; i < matches.length; i++) {
        if (!matches[i]) {
          isValid = false
        }
      }
      templateArguments = matches.slice(1).join(',')
    }
    let buttonDisabled = true
    if(this.state.isPhoneNumberValid && isValid) {
      buttonDisabled = false
    } 
    this.setState({
      isTemplateValid: isValid,
      isButtonDisabled: buttonDisabled
    })
  }

  Preview () {
    this.setState({showAssignmentModal: true})
  }
  reset () {
    console.log('called reset')
    this.setState({number: '', selectedTemplate: {...this.props.whatsAppMessageTemplates[0]}, isPhoneNumberValid:false, isTemplateValid: true, isButtonDisabled: true})
  }

  changeSelected (item) {
   this.setState({isTemplateValid: true, selectedTemplate: {...item}})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if(nextProps.whatsAppMessageTemplates && !this.state.selectedTemplate) {
      this.setState({selectedTemplate: {...this.props.whatsAppMessageTemplates[0]}})
    }
  }

  onInputPhoneChange (text) {
    let isPhoneNumberValid = validatePhoneNumber(text)
    let buttonDisabled = true
    if(this.state.isTemplateValid && isPhoneNumberValid) {
      buttonDisabled = false
    }
    this.setState({
      number: text,
      isPhoneNumberValid: isPhoneNumberValid,
      isButtonDisabled: buttonDisabled
    }) 
  }
  renderItem ({ item }) {
    return (
      <Block flex row style={{marginVertical: 5, marginHorizontal: 16}}>
        <CheckBox
          checked={this.state.selectedTemplate.name === item.name}
          title={item.name}
          onPress={(value) => this.changeSelected(item, value)}
          containerStyle={{margin: 0, padding: 0, backgroundColor: 'white', borderWidth: 0}} />
      </Block>
    )
  }
  render () {
    console.log('this.state.isButtonDisabled', this.state.isButtonDisabled)
      return (
        <ScrollView >
        <KeyboardAvoidingView        
        keyboardVerticalOffset={100}
        behavior={Platform.OS == "ios" ? "padding" : null}
        style={{
          flex: 1
        }}
      >        
          <Block flex center style={styles.block}>
            <Block shadow style={styles.pages}>
              <Text style={{marginHorizontal: 25,fontWeight: "bold" , marginTop:10}}>
                WhatsApp Number:
              </Text>
              <View style={{marginTop:5}}>
              <TextInput
                style={{height: 40, width: 300, marginHorizontal: 25,  borderColor: 'gray', borderWidth: 1}}
                value={this.state.number}
                onChangeText={text => this.onInputPhoneChange(text)}
              />
              <Text style={{marginHorizontal: 25,fontWeight: "bold", color: this.state.isPhoneNumberValid ? 'white': 'red'}}>
                 invalid phone number
              </Text>
              </View>
              <Text style={{marginHorizontal: 25, marginTop:5, fontWeight: "bold" }}>
                Select Template:
              </Text>
              <FlatList
              style={{marginTop: 2}}
              data={this.props.whatsAppMessageTemplates}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.name} />
              <ScrollView
              style= {{marginTop: 10,  marginHorizontal: 25, height:80}}
              showsVerticalScrollIndicator = {true}
              persistentScrollbar={true}
              >
                <TextInput
                style= {{textAlignVertical: 'top', borderColor: 'gray', borderWidth: 1}}
                multiline = {true}
                numberOfLines = {4}
                value={this.state.selectedTemplate ? this.state.selectedTemplate.text: ''}
                onChangeText={text => this.onTextChange(text)}
                />
              </ScrollView>
              {!this.state.isTemplateValid && 
              <Text style={{marginHorizontal: 25,fontWeight: "bold", color: 'red'}}>
                 Message template format cann't be changed.
              </Text>
              }
              <Text style={{marginHorizontal: 25}}>
              {'Each variable "{{x}}" can be replaced with text that contains letters, digits, special characters or spaces.'}
            </Text>
            <View style={styles.container}>
              <Button radius={10}
                style={styles.button}
                onPress={this.reset}>Reset</Button>
              <Button radius={10}
                style={styles.button}
                onPress={this.Preview}>Preview</Button>
              <Button radius={10}
                style={this.state.isButtonDisabled ? [styles.button, {backgroundColor:'#CE9DD9'}]: [styles.button]}
                onPress={this.sendTemplate}
                >Send</Button>
            </View>

          <Perview
          showModal={this.state.showAssignmentModal}
          toggleAssignmentModal={this.toggleAssignmentModal}
          user = {this.props.user}
          selectedTemplate = {this.state.selectedTemplate}
          />
            </Block>
          </Block>
        </KeyboardAvoidingView>
        </ScrollView>

      )
    }

}

function mapStateToProps (state) {
  return {
    whatsAppMessageTemplates: (state.settingsInfo.whatsAppMessageTemplates),
    automated_options: (state.basicInfo.automated_options),
    user: (state.basicInfo.user),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createNewContact,
    sendChatMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsappTemplateMessage)
const styles = StyleSheet.create({
  block: {
    width: width,
  },
  pages: {
    width: width,
    borderWidth: 0,
    // marginVertical: theme.SIZES.BASE * 1.5,
    marginHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 0.1
  },
  optionsButton: {
    width: 'auto',
    paddingHorizontal: theme.SIZES.BASE,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    alignSelf: 'flex-end'
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
    marginHorizontal: 16
  },
  page: {
    paddingVertical: 20
  },
  button: {
    height: 40,
    width: 100,
    marginHorizontal: 10,
    marginVertical: 15,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  }
})
