import React from 'react'
import { Dimensions, FlatList, Platform, View, ScrollView } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Block, Text } from 'galio-framework'
import Tabs from '../../components/Tabs';
import materialTheme from '../../constants/Theme';
import { CheckBox } from 'react-native-elements'

const { height } = Dimensions.get('screen')

let Toast = null
if (Platform.OS === 'ios') {
  Toast = require('react-native-tiny-toast')
} else {
  Toast = require('react-native-simple-toast')
}

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.closeModal = this.closeModal.bind(this)
  }

  /* eslint-disable */

  closeModal () {
    this.props.toggleAssignmentModal(false)
  }

  render () {
    return (
      <Modal isVisible={this.props.showModal} style={{justifyContent: 'flex-end', margin: 0}} onBackdropPress={this.closeModal}>
        <Block style={{backgroundColor: 'white', height: height / 2}}>
          <Block style={{borderBottomWidth: 1, borderBottomColor: '#f4f5f8'}}>
            <Text h5 style={{marginVertical: 10, marginHorizontal: 16}}>Preview:</Text>
          </Block>
          <ScrollView
              style= {{marginHorizontal:16, marginTop: 10,  borderColor: '1px solid rgba(0,0,0,.1)', borderWidth: 2, paddingLeft: 2, flex:1, height: 250}}
              showsVerticalScrollIndicator = {true}
              persistentScrollbar={true}
              >
          <View>
         <Text>{this.props.selectedTemplate.text}</Text>
         <View style= {{ justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
         {
           this.props.selectedTemplate.buttons.map((button, index) => (
            <Button radius={10} key={index}
            style={{marginVertical: 2, marginTop: 5, width: 200, backgroundColor:'#009688'
          }}
           onPress={this.closeModal}>{button.title}</Button>
           ))
         }
         </View>
         </View>
         </ScrollView>
          <Block center style={{marginTop: 15}}>
            <Button radius={10}
              style={{marginVertical: 10, marginHorizontal: 16}}
              onPress={this.closeModal}>Close</Button>
          </Block>
        </Block>
      </Modal>
    )
  }
}

export default Preview
