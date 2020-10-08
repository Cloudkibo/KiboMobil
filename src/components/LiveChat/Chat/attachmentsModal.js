import React from 'react'
import { TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Block, Text, theme } from 'galio-framework'
import Icon from '../../../components/Icon'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

class AttachmentsModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.pickImage = this.pickImage.bind(this)
  }

  async pickImage () {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
    } else {
      this.props.setGalleryPermission(true)
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1
      })
      if (result && result.uri) {
        let name = result.uri.split('ImagePicker/')[1]
        const info = await FileSystem.getInfoAsync(result.uri)
        result.size = info.size
        result.name = name
        this.props.uploadAttachment(result)
      }
    }
  }

  render () {
    return (
      <Modal isVisible={this.props.showAttachmentsModal} style={{justifyContent: 'flex-end', margin: 0}} onBackdropPress={this.props.setAttachmentsModal}>
        <Block style={{backgroundColor: 'white', height: 200}}>
          <TouchableOpacity onPress={() => {
            this.props.setAttachmentsModal()
            this.pickImage()
          }}>
            <Block row style={{marginVertical: 15, marginHorizontal: 16}}>
              <Icon
                size={16}
                name='images'
                family='entypo'
                style={{marginRight: 10}}
              />
              <Text h6>
              Photo and Video Library
              </Text>
            </Block>
          </TouchableOpacity>
          <Block style={{borderTopWidth: 1, borderTopColor: '#f4f5f8'}}>
            <TouchableOpacity onPress={() => {
              this.props.selectAttachment()
              this.props.setAttachmentsModal()
            }}>
              <Block row style={{marginHorizontal: 16, marginVertical: 16}}>
                <Icon
                  size={16}
                  name='file1'
                  family='AntDesign'
                  style={{marginRight: 10}}
                />
                <Text h6>
                    Document
                </Text>
              </Block>
            </TouchableOpacity>
            <Block center style={{marginTop: 15}}>
              <Button radius={10}
                shadowless
                style={{backgroundColor: theme.COLORS.MUTED, borderColor: '#ebedf2', marginVertical: 10, marginHorizontal: 16}}
                onPress={this.props.setAttachmentsModal}>
                <Text style={{color: 'white', marginVertical: 10, marginHorizontal: 16}}>Cancel</Text></Button>
            </Block>
          </Block>
        </Block>
      </Modal>
    )
  }
}

export default AttachmentsModal
