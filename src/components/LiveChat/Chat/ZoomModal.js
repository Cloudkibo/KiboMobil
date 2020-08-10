import React from 'react'
import { Block, Text, Button, theme, Input } from 'galio-framework'
import { KeyboardAvoidingView, View, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions, FlatList, Alert, Linking } from 'react-native'
import Modal from 'react-native-modal'
import { Select } from '../../../components/'
import Icon from '../../../components/Icon'
const { width, height } = Dimensions.get('screen')

class ZoomModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.initialZoomCountdown = 3
    this.initialZoomInvitationMessage = 'Please join Zoom meeting to discuss this in detail. [invite_url]'
    this.state = {
      selectedZoom: props.zoomIntegrations[0],
      listData: [{id: '0'}],
      zoomTopic: '',
      zoomAgenda: '',
      zoomInvitationMessage: this.initialZoomInvitationMessage,
      zoomMeetingCreated: false,
      zoomCountdown: this.initialZoomCountdown,
      zoomMeetingUrl: '',
      zoomMeetingCreationError: false,
      text: '',
      errorMessage: ''
    }
    this.renderList = this.renderList.bind(this)
    this.handleZoomSelect = this.handleZoomSelect.bind(this)
    this.setZoomTopic = this.setZoomTopic.bind(this)
    this.setZoomAgenda = this.setZoomAgenda.bind(this)
    this.setZoomInvitationMessage = this.setZoomInvitationMessage.bind(this)
    this.createZoomMeeting = this.createZoomMeeting.bind(this)
    this.appendInvitationUrl = this.appendInvitationUrl.bind(this)
  }

  handleZoomSelect (index, value) {
    let selectedZoom = this.props.zoomIntegrations[index]
    this.setState({selectedZoom: selectedZoom})
  }

  setZoomTopic (text) {
    this.setState({zoomTopic: text, errorMessage: ''})
  }

  setZoomAgenda (text) {
    this.setState({zoomAgenda: text, errorMessage: ''})
  }

  setZoomInvitationMessage (text) {
    // if (!e.target.value) {
    //   e.target.setCustomValidity("Please fill in this field.")
    // } else if (!e.target.value.includes('[invite_url]')) {
    //   e.target.setCustomValidity("[invite_url] is required in the invitation message.")
    // } else {
    //   e.target.setCustomValidity("")
    // }
    this.setState({zoomInvitationMessage: text, errorMessage: ''})
  }

  checkEnteredData () {
    let valid = true
    if (this.state.zoomTopic === '' || this.state.zoomAgenda === '' || this.state.zoomInvitationMessage === '') {
      this.setState({errorMessage: 'Please enter all details'})
      valid = false
    } else if (!this.state.zoomInvitationMessage.includes('[invite_url]')) {
      this.setState({errorMessage: '[invite_url] is required in the invitation message.'})
      valid = false
    }
    return valid
  }

  createZoomMeeting (event) {
    if (this.checkEnteredData()) {
      const data = this.props.performAction('create a zoom meeting', this.props.activeSession)
      if (data.isAllowed) {
        this.setState({zoomMeetingLoading: true}, () => {
          this.props.createZoomMeeting({
            subscriberId: this.props.activeSession._id,
            topic: this.state.zoomTopic,
            agenda: this.state.zoomAgenda,
            invitationMessage: this.state.zoomInvitationMessage,
            zoomUserId: this.state.selectedZoom._id,
            platform: this.props.user.platform
          }, (res) => {
            if (res.status === 'success' && res.payload) {
              this.setState({
                zoomMeetingLoading: false,
                zoomMeetingCreated: true,
                zoomMeetingUrl: res.payload.joinUrl,
                text: this.state.zoomInvitationMessage.replace('[invite_url]', res.payload.joinUrl)
              }, () => {
                this.sendMessage()
                this.zoomCountdownTimer = setInterval(() => {
                  if (this.state.zoomCountdown <= 1) {
                    if (this.state.zoomMeetingUrl) {
                      clearInterval(this.zoomCountdownTimer)
                      Linking.openURL(this.state.zoomMeetingUrl).catch((err) => console.error('An error occurred', err))
                      this.props.setZoomModal()
                    }
                  } else {
                    this.setState({zoomCountdown: this.state.zoomCountdown - 1})
                  }
                }, 1000)
              })
            } else {
              this.setState({zoomMeetingCreationError: true, zoomMeetingLoading: false})
            }
          })
        })
      } else {
        Alert.alert('ERROR!', data.errorMsg, [{ text: 'OK' }], { cancelable: true })
      }
    }
  }

  appendInvitationUrl () {
    if (!this.state.zoomInvitationMessage.includes('invite_url')) {
      this.setState({zoomInvitationMessage: this.state.zoomInvitationMessage + ' [invite_url]'})
    }
  }

  sendMessage () {
    let payload = {}
    let data = {}
    payload = {
      componentType: 'text',
      text: this.state.text
    }
    data = this.props.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data)
    this.setState({text: ''})
    data.format = 'convos'
    this.updateChatData(data, payload)
  }

  updateChatData (data, payload) {
    data._id = new Date().getTime()
    let sessions = this.props.sessions
    let session = this.props.activeSession
    let index = sessions.findIndex((s) => s._id === session._id)
    sessions.splice(index, 1)
    session.lastPayload = payload
    session.lastRepliedBy = data.replied_by
    session.pendingResponse = false
    session.last_activity_time = new Date()
    this.props.updateNewMessage(true)
    this.props.updateState({
      reducer: true,
      userChat: [...this.props.userChat, data],
      sessions: [session, ...sessions]
    })
  }

  renderList () {
    if (this.props.zoomIntegrations.length === 0) {
      return (
        <Block style={{paddingVertical: 20}}>
          <Block flex row style={styles.options}>
            <Text>You have not integrated Zoom Meetings with KiboPush. Please go to our web portal and integrate zoom to continue.</Text>
          </Block>
        </Block>
      )
    } else if (!this.state.zoomMeetingCreated) {
      return (
        <Block style={{paddingVertical: 20, marginHorizontal: 10}}>
          <Block flex row style={styles.options}>
            <Block flex={0.2} middle><Text size={14}>Account:</Text></Block>
            <Block flex={0.8} middle>
              <Select
                dropDownStyle={{marginTop: 10, width: width * 0.7}}
                style={{width: width * 0.7}}
                value={this.state.selectedZoom ? this.state.selectedZoom.firstName + ' ' + this.state.selectedZoom.lastName : ''}
                options={this.props.zoomIntegrations.map(z => z.firstName + ' ' + z.lastName)}
                onSelect={(index, value) => this.handleZoomSelect(index, value)}
              />
            </Block>
          </Block>
          <Block flex row style={styles.options}>
            <Block flex={0.2} middle><Text size={14}> Topic:</Text></Block>
            <Block flex={0.8} middle>
              <Input
                color='grey'
                style={{width: width * 0.7}}
                onChangeText={text => this.setZoomTopic(text)}
                value={this.state.zoomTopic} />
            </Block>
          </Block>
          <Block flex row style={styles.options}>
            <Block flex={0.2} middle><Text size={14}> Agenda:</Text></Block>
            <Block flex={0.8} middle>
              <Input
                color='grey'
                style={{width: width * 0.7}}
                onChangeText={text => this.setZoomAgenda(text)}
                value={this.state.zoomAgenda} />
            </Block>
          </Block>
          <Block style={styles.options}>
            <Text size={14}> Invitation Message:</Text>
            <Input
              color='grey'
              style={{height: 'auto', paddingVertical: 0}}
              multiline
              numberOfLines={3}
              value={this.state.zoomInvitationMessage}
              onChangeText={text => this.setZoomInvitationMessage(text)}
              right
              iconContent={
                <TouchableOpacity onPress={this.appendInvitationUrl}>
                  <Icon size={20} color={theme.COLORS.MUTED} name='link' family='entypo' />
                </TouchableOpacity>
              }
            />
          </Block>
          {this.state.errorMessage !== '' &&
            <Text style={{color: 'red', marginHorizontal: 10}}>{this.state.errorMessage}</Text>
          }
          <Block center style={{marginTop: 15}}>
            <Button radius={10}
              loading={this.state.zoomMeetingLoading}
              style={{marginVertical: 10, marginHorizontal: 16}}
              onPress={this.createZoomMeeting}>Create and Invite</Button>
          </Block>
          {this.state.zoomMeetingCreationError &&
            <Text style={{color: 'red', marginHorizontal: 10}}>There was an error creating the meeting. Please try again.</Text>
          }
        </Block>
      )
    } else {
      return (
        <Block style={{paddingVertical: 20, marginHorizontal: 10}}>
          <Block flex row style={styles.options}>
            <Text>Zoom meeting has been successfully created and invitation has been sent to {this.props.activeSession.firstName}. Redirecting you to Zoom Meetings in:</Text>
          </Block>
          <Block center style={{marginTop: 30}}>
            <Button style={styles.countDownButton}>
              <Text h1 color='black'>{this.state.zoomCountdown}</Text>
            </Button>
          </Block>
        </Block>
      )
    }
  }

  render () {
    return (
      <Modal isVisible={this.props.showZoomModal} onBackdropPress={this.props.setZoomModal} style={{margin: 0}}>
        <Block style={{backgroundColor: 'white', height: height * 0.6}}>
          <FlatList
            data={this.state.listData}
            renderItem={this.renderList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        </Block>
      </Modal>
    )
  }
}

export default ZoomModal

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
  }
})
