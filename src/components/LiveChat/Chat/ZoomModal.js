import React from 'react'
import { Block, Text, Button } from 'galio-framework'
import { KeyboardAvoidingView, View, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions} from 'react-native'
import Modal from 'react-native-modal'
const { height } = Dimensions.get('screen')

class ZoomModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      cannedResponsesAll: [],
      cannedResponses: [],
      showCannedMessages: false,
      selectedCannedResponse: null
    }
  }

  render () {
    return (
      <Modal isVisible={this.props.showModal} onBackdropPress={this.closeModal}>
        <Block style={{backgroundColor: 'red', height: height * 0.6}}>
        </Block>
      </Modal>
    )
  }
}


export default ZoomModal
