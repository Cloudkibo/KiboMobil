import React from 'react'
import { Block, Text, Button } from 'galio-framework'
import { KeyboardAvoidingView, View, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import {ListItem, Card } from 'react-native-elements'
import { materialTheme } from '../../../constants/'
import { displayDate, showDate } from '../../../screens/LiveChat/utilities'
import moment from 'moment'
import BODY from './Body'
import FOOTER from './MessageForm'


class Chat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      cannedResponsesAll: [],
      cannedResponses: [],
      showCannedMessages: false,
      selectedCannedResponse: null
    }
    this.overrideUserInput = this.overrideUserInput.bind(this)
    this.updateNewMessage = this.updateNewMessage.bind(this)
    this.showCannResponse = this.showCannResponse.bind(this)
    this.saveCannedResponses =this.saveCannedResponses.bind(this)
    this.selectCannedResponse= this.selectCannedResponse.bind(this)
    this.onCannedMessageChange = this.onCannedMessageChange.bind(this)
    this.setCannedResponse = this.setCannedResponse.bind(this)

    this.newMessage = false
  }

  setCannedResponse (cannResponse) {
    if(cannResponse) {
      this.selectCannedResponse(cannResponse)
    } else {
      this.setState({selectedCannedResponse: cannResponse})
    }
  }

  onCannedMessageChange (value) {
    let cannResponse = this.state.selectedCannedResponse
    cannResponse.responseMessage = value
    this.setState({selectedCannedResponse: cannResponse})
  }

  selectCannedResponse (selectedcannResponse) {
    let cannResponse = {...selectedcannResponse}
    let activeSession = this.props.activeSession
    if (cannResponse.responseMessage.includes('{{user_full_name}}')) {
      cannResponse.responseMessage = cannResponse.responseMessage.replace(
        '{{user_full_name}}', activeSession.firstName + ' ' + activeSession.lastName)
    }
    if (cannResponse.responseMessage.includes('{{user_first_name}}')) {
      cannResponse.responseMessage = cannResponse.responseMessage.replace(
        '{{user_first_name}}', activeSession.firstName)
    }
    if (cannResponse.responseMessage.includes('{{user_last_name}}')) {
      cannResponse.responseMessage = cannResponse.responseMessage.replace(
        '{{user_last_name}}', activeSession.lastName)
    }
    this.setState({selectedCannedResponse: cannResponse})
  }

  updateNewMessage (value) {
    this.newMessage = value
  }

  saveCannedResponses (cannedResponses) {
    this.setState({cannedResponses: cannedResponses})
  }

  showCannResponse (cannResponse) {
    this.setState({showCannedMessages: cannResponse})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {

    if (nextProps.cannedResponses) {
      this.setState({ cannedResponses: nextProps.cannedResponses, cannedResponsesAll:nextProps.cannedResponses })
    }
  }

  overrideUserInput () {
    let activeSession = this.props.activeSession
    activeSession.waitingForUserInput.componentIndex = -1
    this.props.updateState({
      activeSession
    })
  }

  render () {
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={100}
        behavior={Platform.OS == "ios" ? "padding" : null}
        style={{
          flex: 1
        }}
      >
        <Block flex>
          <View style= {{flex:1}}>
          <BODY
            userChat={this.props.userChat}
            chatCount={this.props.chatCount}
            activeSession={this.props.activeSession}
            showDate={showDate}
            displayDate={displayDate}
            loadingChat={this.props.loadingChat}
            user={this.props.user}
            fetchUserChats={this.props.fetchUserChats}
            markRead={this.props.markRead}
            updateState={this.props.updateState}
            newMessage={this.newMessage}
            updateNewMessage={this.updateNewMessage}
          />
           {(this.state.showCannedMessages && !this.state.selectedCannedResponse && this.state.cannedResponses.length > 0) ? <View style={{maxHeight: 150, marginLeft: 25, marginRight: 25}}>
             <ScrollView
              showsVerticalScrollIndicator = {true}
              persistentScrollbar={true}
             > 
           {this.state.cannedResponses.map((cannedResponse, i) => (
            <TouchableOpacity  onPress={() => this.selectCannedResponse(cannedResponse)}>
            <ListItem 
            key={i}
            title={cannedResponse.responseCode}
            subtitle={cannedResponse.responseMessage.length > 40 ? cannedResponse.responseMessage.substring(0, 40) + "……": cannedResponse.responseMessage}
            containerStyle = {{height: 50}}
            bottomDivider
          />
          </TouchableOpacity>
        ))}
        </ScrollView>
        </View>
        : this.state.selectedCannedResponse &&
        <View>
        <Card title = {this.state.selectedCannedResponse.responseCode} >
        <ScrollView
        style= {{maxHeight: 80}}
        showsVerticalScrollIndicator = {true}
        persistentScrollbar={true}
        >
        {/*react-native-elements Card*/}
        <TextInput
        style= {{textAlignVertical: 'top'}}
        multiline = {true}
        numberOfLines = {4}
        onChangeText={text => this.onCannedMessageChange(text)}
        value=  {this.state.selectedCannedResponse.responseMessage}
     />
     </ScrollView>
        </Card>
      </View>
        } 
          </View>
          
          {!moment(this.props.activeSession.lastMessagedAt).isAfter(moment().subtract(24, 'hours')) && !this.props.isSMPApproved
            ? <Block row style={{backgroundColor: materialTheme.COLORS.ERROR, margin: 10, borderRadius: 10}}>
              <Text style={{color: 'white', marginVertical: 5, marginHorizontal: 10}}>
                Chat's 24 hours window session has been expired for this subscriber. You cannot send a message to this subscriber until they message you.
              </Text>
            </Block>
            : this.props.activeSession.waitingForUserInput &&
              this.props.activeSession.waitingForUserInput.componentIndex > -1
              ? <Block row style={{backgroundColor: materialTheme.COLORS.ERROR, margin: 10, borderRadius: 10}}>
                <Text style={{color: 'white', marginVertical: 5, marginHorizontal: 10}}>
                A user input component was last sent to this subscriber and we are waiting for a response from them.
                </Text>
                <Button round style={{ width: 80, height: 30 }} color='success'
                  onPress={this.overrideUserInput}>
                  <Text style={{color: 'white'}}>I don't want to wait</Text>
                </Button>
              </Block>
              : <FOOTER
                showCannResponse = {this.showCannResponse}
                setCannedResponse = {this.setCannedResponse}
                selectedCannedResponse = {this.state.selectedCannedResponse}
                saveCannedResponses= {this.saveCannedResponses}
                cannedResponsesAll = {this.state.cannedResponsesAll}
                performAction={this.props.performAction}
                activeSession={this.props.activeSession}
                user={this.props.user}
                sendChatMessage={this.props.sendChatMessage}
                alertMsg={this.props.alertMsg}
                updateState={this.props.updateState}
                userChat={this.props.userChat}
                sessions={this.props.sessions}
                uploadAttachment={this.props.uploadAttachment}
                sendAttachment={this.props.sendAttachment}
                uploadRecording={this.props.uploadRecording}
                getPicker={this.getPicker}
                togglePopover={this.togglePopover}
                updateNewMessage={this.updateNewMessage}
                deletefile={this.props.deletefile}
                fetchUrlMeta={this.props.fetchUrlMeta}
                updateChatAreaHeight={this.updateChatAreaHeight}
                showUploadAttachment={this.props.showUploadAttachment}
                showRecordAudio={this.props.showRecordAudio}
                showSticker={this.props.showSticker}
                showEmoji={this.props.showEmoji}
                showGif={this.props.showGif}
                showThumbsUp={this.props.showThumbsUp}
                setMessageData={this.props.setMessageData}
                filesAccepted={this.props.filesAccepted}
              />
          }
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

Chat.defaultProps = {
  showTemplates: false
}


export default Chat
