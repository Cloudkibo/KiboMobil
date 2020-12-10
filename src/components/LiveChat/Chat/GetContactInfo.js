import React from 'react'
import { Block, Text, Button, theme, Input } from 'galio-framework'
import {View, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert, Linking, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from 'react-native'
import Modal from 'react-native-modal'
import Icon from '../../../components/Icon'
import DropDownPicker from 'react-native-dropdown-picker'
import { CheckBox } from 'react-native-elements'
import LeftChatItem from './LeftChatItem'
import TextComponent from '../Messages/Text'
import QuickReplies from '../Messages/QuickReplies'
const { width } = Dimensions.get('screen')

class GetContactInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
        query: '',
        message: '',
        keyboardInputAllowed: false,
        skipAllowed: false,
        errorMessage: ''
    }
    this.getCorrespondingCustomField = this.getCorrespondingCustomField.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.getQuickReplies = this.getQuickReplies.bind(this)
    this.getQuickReplyTitle = this.getQuickReplyTitle.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }


  getCorrespondingCustomField () {
    if (this.state.query === 'email') {
      return "Email"
    } else if (this.state.query === 'phone') {
      return "Phone Number"
    }
  }

  getQuickReplyTitle () {
    if (this.state.query === 'email') {
      return "subscriber's email"
    } else if (this.state.query === 'phone') {
      return "subscriber's phone number"
    }
  }

  getQuickReplies () {
    let quickReplies = [{title: this.getQuickReplyTitle()}]
    if (this.state.skipAllowed) {
        quickReplies.push({title: 'skip'})
    }
    return quickReplies
  }

  sendMessage (e) {
    e.preventDefault()
    if (!this.state.message) {
        this.setState({errorMessage: 'Message is required'})
        return
    }
    this.props.setGetContactInfoModal()
    const quickReplies = [
      {
        title: this.getQuickReplyTitle(),
        query: this.state.query,
        keyboardInputAllowed: this.state.keyboardInputAllowed,
        skipAllowed: this.state.skipAllowed
      }
    ]
    this.props.sendQuickReplyMessage(this.state.message, quickReplies)
  }

  updateQuery (query) {
    const updatedState = {query}
    if (!query) {
      updatedState.message = ''
      updatedState.keyboardInputAllowed = false
      updatedState.skipAllowed = false
    }
    this.setState(updatedState)
  }

  render () {
    return (
      <Modal isVisible={this.props.showGetContactInfoModal} onBackdropPress={this.props.setGetContactInfoModal} style={{margin: 0}}>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : null}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Block style={{backgroundColor: 'white', padding: 20, display: 'flex'}}>
                        {
                            !this.state.query ?
                            <Block center>
                                <Button 
                                    onPress={() => this.updateQuery('email')}
                                    radius={10}
                                    style={{marginVertical: 10, marginHorizontal: 16}}
                                >
                                    Get Email
                                </Button>
                                <Button 
                                    onPress={() => this.updateQuery('phone')}
                                    radius={10}
                                    style={{marginVertical: 10, marginHorizontal: 16}}
                                >
                                    Get Phone Number
                                </Button>
                            </Block> : []
                        }
                        {
                            this.state.query ? 
                            <Block>      
                                <Text h5 style={{marginVertical: 10}}>
                                    Ask for Subscriber's {this.getCorrespondingCustomField()}
                                </Text>
                                <Text>
                                    This will enable you to retrieve subscriber's {this.getCorrespondingCustomField().toLowerCase()} and store it in a custom field: "{this.getCorrespondingCustomField()}".
                                    {"\n\n"}
                                    {this.state.query === 'phone' && "Note: You will only be able to retrieve user's phone number if they have made their number public on Facebook. Also, this quick reply will be removed if you send another message before the user taps on it."}
                                    {this.state.query === 'email' && 'Note: This quick reply will be removed if you send another message before the user taps on it.'}
                                </Text>
                                <Input
                                    maxLength={100}
                                    multiline
                                    placeholder="Enter message text..."
                                    color="black"
                                    placeholderTextColor="gray"
                                    style={{height: 80, alignItems: 'flex-start', paddingVertical: 5, marginTop: 10}}
                                    value={this.state.message}
                                    onChangeText={text => this.setState({message: text, errorMessage: ''})}
                                />
                                {this.state.errorMessage ?
                                    <Text style={{color: 'red', marginHorizontal: 10, position: 'relative', bottom: 5}}>{this.state.errorMessage}</Text> : []
                                }
                                <CheckBox
                                    title={"Allow Keyboard Input"}
                                    containerStyle={{margin: 0, marginTop: 10, padding: 0, backgroundColor: 'white', borderWidth: 0}} 
                                    checked={this.state.keyboardInputAllowed}
                                    onPress={() => this.setState({keyboardInputAllowed: !this.state.keyboardInputAllowed})}
                                />
                                <CheckBox
                                    title={"Allow Skip"}
                                    containerStyle={{margin: 0, marginTop: 10, padding: 0, backgroundColor: 'white', borderWidth: 0}} 
                                    checked={this.state.skipAllowed}
                                    onPress={() => this.setState({skipAllowed: !this.state.skipAllowed})}
                                />
                                <Text style={{fontWeight: "bold", marginTop: 20, marginBottom: 5}}>Preview:</Text>
                                <Block style={styles.previewBlock}>
                                    <Block style={styles.messageCardWrapper}>
                                        <Block style={[styles.messageCard, styles.shadow]}>
                                            <TextComponent
                                                linkColor='#5867dd'
                                                text={{text: this.state.message}}
                                            />
                                        </Block>
                                    </Block>
                                    <QuickReplies buttons={this.getQuickReplies()}/>
                                </Block>

                                <Block style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30}}>
                                    <Button 
                                        shadowless
                                        color="warning"
                                        onPress={() => this.updateQuery('email')}
                                        radius={10}
                                        style={{marginVertical: 10, width: '30%', marginRight: 20}}
                                        onPress={() => this.updateQuery('')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        color="success"
                                        shadowless
                                        onPress={this.sendMessage}
                                        radius={10}
                                        style={{marginVertical: 10, width: '30%'}}
                                    >
                                        Send
                                    </Button>
                                </Block>

                            </Block> : []
                        }
                    </Block>
                </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

export default GetContactInfo

const styles = StyleSheet.create({
  block: {
    width: width
  },
  subBlock: {
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
  options: {
    padding: theme.SIZES.BASE / 2
  },
  countDownButton: {
    borderRadius: 50,
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2
  },
  previewBlock: {
    backgroundColor: 'white', 
    minHeight: 100, 
    padding: 10,
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: 'lightgray',
  },
  messageCardWrapper: {
    alignSelf: 'flex-start',
    maxWidth: '75%',
    marginLeft: 8,
    marginBottom: 20,
    marginTop: 20
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#D6DADD',
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 20,
    shadowOpacity: 1
  },
})
