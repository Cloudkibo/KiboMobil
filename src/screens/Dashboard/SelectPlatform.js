import React from 'react'
import { FlatList } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Block, Text } from 'galio-framework'
import materialTheme from '../../constants/Theme'
import { CheckBox } from 'react-native-elements'

class SelectPlatform extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: false,
      currentSelectedValue: this.props.user ? {value: this.props.user.platform, label: this.props.user.platform === 'messenger' ? 'Messenger' : 'WhatsApp'} : '',
      data: [{value: 'messenger', label: 'Messenger'}, {value: 'whatsApp', label: 'WhatsApp'}]
    }
    this.renderItem = this.renderItem.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.assign = this.assign.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    if (nextProps.user) {
      let currentSelectedValue = {value: nextProps.user.platform, label: nextProps.user.platform === 'messenger' ? 'Messenger' : 'WhatsApp'}
      this.setState({currentSelectedValue: currentSelectedValue})
    }
  }

  changeSelected (item) {
    let value = {value: item.value, label: item.value === 'messenger' ? 'Messenger' : 'WhatsApp'}
    this.setState({currentSelectedValue: value})
  }

  assign () {
    if (this.state.currentSelectedValue.value !== this.props.user.platform) {
      this.props.clearSession(true)
      let user = JSON.parse(JSON.stringify(this.props.user))
      user.platform = this.state.currentSelectedValue.value
      this.props.updatePlatform(user, {platform: this.state.currentSelectedValue.value})
      this.props.toggleAssignmentModal(false)
    } else {
      this.props.toggleAssignmentModal(false)
    }
  }

  renderItem ({ item }) {
    return (
      <Block flex row style={{marginVertical: 5, marginHorizontal: 16}}>
        <CheckBox
          checked={this.state.currentSelectedValue.value === item.value}
          title={item.label}
          onPress={(value) => this.changeSelected(item, value)}
          containerStyle={{margin: 0, padding: 0, backgroundColor: 'white', borderWidth: 0}} />
      </Block>
    )
  }

  renderEmpty () {
    return (
      <Text color={materialTheme.COLORS.ERROR} style={{marginTop: 10, marginHorizontal: 16}}>
        No data to display
      </Text>
    )
  }

  closeModal () {
    this.props.toggleAssignmentModal(false)
    let value = {value: this.props.user.platform, label: this.props.user.platform === 'messenger' ? 'Messenger' : 'WhatsApp'}
    this.setState({currentSelectedValue: value})
  }

  render () {
    return (
      <Modal isVisible={this.props.showModal} style={{justifyContent: 'flex-end', margin: 0}} onBackdropPress={this.closeModal}>
        <Block style={{backgroundColor: 'white', height: 200}}>
          <Block style={{borderBottomWidth: 1, borderBottomColor: '#f4f5f8'}}>
            <Text h5 style={{marginVertical: 10, marginHorizontal: 16}}>Select Platform:</Text>
          </Block>
          <FlatList
            style={{marginTop: 10}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.value}
            ListEmptyComponent={this.renderEmpty()} />
          <Block center style={{marginTop: 15}}>
            <Button radius={10}
              loading={this.state.loading}
              style={{marginVertical: 10, marginHorizontal: 16}}
              onPress={this.assign}>Done</Button>
          </Block>
        </Block>
      </Modal>
    )
  }
}

export default SelectPlatform
