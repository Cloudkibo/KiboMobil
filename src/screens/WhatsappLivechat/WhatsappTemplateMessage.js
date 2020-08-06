import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {validatePhoneNumber} from '../../utility/utils'
import { StyleSheet, Dimensions, Image, FlatList, Alert, ActivityIndicator, Platform, TextInput,ScrollView, KeyboardAvoidingView } from 'react-native'
import { Button, Block, Text, theme } from 'galio-framework'
import { CheckBox } from 'react-native-elements'

import { materialTheme } from '../../constants/'
import { View } from 'react-native-animatable';

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
      number: '',
      isPhoneNumberValid: false,
      selectedTemplate: this.props.whatsAppMessageTemplates ? this.props.whatsAppMessageTemplates[0]: null
    }
    this.renderItem = this.renderItem.bind(this)
    this.onInputPhoneChange = this.onInputPhoneChange.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected (item) {
   this.setState({selectedTemplate: item})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if(nextProps.whatsAppMessageTemplates && !this.state.selectedTemplate) {
      this.setState({selectedTemplate: whatsAppMessageTemplates[0]})
    }
  }

  onInputPhoneChange (text) {
    this.setState({
      number: text,
      isPhoneNumberValid: validatePhoneNumber(text)
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
    console.log('whatsAppMessageTemplates', this.props.whatsAppMessageTemplates)
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
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                onChangeText={text => this.onInputPhoneChange(text)}
              />
              {!this.state.isPhoneNumberValid &&
              <Text style={{marginHorizontal: 25,fontWeight: "bold", color: 'red'}}>
                 invalid phone number
              </Text>
              }
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
              style= {{maxHeight: 80, margin: 10, marginHorizontal: 25}}
              showsVerticalScrollIndicator = {true}
              persistentScrollbar={true}
              >
                <TextInput
                style= {{textAlignVertical: 'top', borderColor: 'gray', borderWidth: 1}}
                multiline = {true}
                numberOfLines = {4}
                value={this.state.selectedTemplate ? this.state.selectedTemplate.text: ''}
                />
              </ScrollView>
              <Text style={{marginHorizontal: 25}}>
              {'Each variable "{{x}}" can be replaced with text that contains letters, digits, special characters or spaces.'}
            </Text>
            <View style={styles.container}>
              <Button radius={10}
                style={styles.button}
                onPress={this.assign}>Reset</Button>
              <Button radius={10}
                style={styles.button}
                onPress={this.assign}>Cancel</Button>
              <Button radius={10}
                style={styles.button}
                onPress={this.assign}>Send</Button>
            </View>
            </Block>
          </Block>
        </KeyboardAvoidingView>
        </ScrollView>

      )
    }

}

function mapStateToProps (state) {
  return {
    whatsAppMessageTemplates: (state.settingsInfo.whatsAppMessageTemplates)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
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
    marginVertical: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  }
})
