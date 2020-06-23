import React from 'react'
import { Block, Text, Button } from 'galio-framework'
import { KeyboardAvoidingView } from 'react-native'
import { materialTheme } from '../../../constants/'
import { displayDate, showDate } from '../../../screens/LiveChat/utilities'
import moment from 'moment'
import BODY from './Body'
import FOOTER from './MessageForm'

class Chat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.overrideUserInput = this.overrideUserInput.bind(this)
    this.updateNewMessage = this.updateNewMessage.bind(this)

    this.newMessage = false
  }

  updateNewMessage (value) {
    this.newMessage = value
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
        keyboardVerticalOffset = {100}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{
          flex: 1
        }}
      >
      <Block flex>
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