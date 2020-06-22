import React from 'react'
import { Dimensions, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Block, Text } from 'galio-framework'
import Tabs from '../../Tabs'
import { materialTheme } from '../../../constants/'
import { CheckBox } from 'react-native-elements'
import Toast from 'react-native-tiny-toast'

const { height } = Dimensions.get('screen')

class AssignSession extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentSelected: this.props.activeSession.is_assigned ? {
        value: this.props.activeSession.assigned_to.id,
        label: this.props.activeSession.assigned_to.name,
        group: this.props.activeSession.assigned_to.type
      } : '',
      tabValue: 'agents'
    }
    this.changeTab = this.changeTab.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.changeSelected = this.changeSelected.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.assign = this.assign.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
    this.unassignAgent = this.unassignAgent.bind(this)
    this.unassignTeam = this.unassignTeam.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
  /* eslint-enable */
    if (nextProps.activeSession) {
      let currentSelected = nextProps.activeSession.is_assigned ? {
        value: nextProps.activeSession.assigned_to.id,
        label: nextProps.activeSession.assigned_to.name,
        group: nextProps.activeSession.assigned_to.type
      } : ''
      this.setState({currentSelected: currentSelected})
    }
  }

  changeTab (value) {
    this.setState({
      tabValue: value
    })
  }

  changeSelected (item) {
    if (item.value === this.state.currentSelected.value) {
      this.setState({currentSelected: ''})
    } else {
      this.setState({
        currentSelected: {
          value: item.value,
          label: item.label,
          group: item.group
        }
      })
    }
  }

  assign () {
    if (this.state.currentSelected === '' && this.props.activeSession.is_assigned) {
      if (this.props.activeSession.assigned_to.type === 'agent') {
        this.unassignAgent()
      } else {
        this.unassignTeam()
      }
    } else if (this.state.currentSelected !== '') {
      if (this.state.currentSelected.group === 'agent') {
        this.assignToAgent()
      } else {
        this.assignToTeam()
      }
    }
    this.props.toggleAssignmentModal(false)
  }

  unassignAgent () {
    let data = {
      agentId: this.props.activeSession.assigned_to.id,
      agentName: this.props.activeSession.assigned_to.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.assignToAgent(data, (res) => {
      if (res.status === 'success') {
        let activeSession = this.props.activeSession
        activeSession.is_assigned = false
        this.props.handleAssignment(activeSession)
        Toast.show('Agent unassigned succesfully')
      } else {
        Toast.show('Agent was unable to be unassigned')
      }
    })
    // if (this.props.activeSession.assigned_to.id !== this.props.user._id) {
    //   let notificationsData = {
    //     message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been unassigned from you.`,
    //     category: { type: 'chat_session', id: this.props.activeSession._id },
    //     agentIds: [this.props.activeSession.assigned_to.id],
    //     companyId: this.props.activeSession.companyId
    //   }
    //   this.props.sendNotifications(notificationsData)
    // }
  }

  unassignTeam () {
    let data = {
      teamId: this.props.activeSession.assigned_to.id,
      teamName: this.props.activeSession.assigned_to.name,
      subscriberId: this.props.activeSession._id,
      isAssigned: false
    }
    this.props.fetchTeamAgents(this.props.activeSession.assigned_to.id)
    this.props.assignToTeam(data, (res) => {
      if (res.status === 'success') {
        let activeSession = this.props.activeSession
        activeSession.is_assigned = false
        this.props.handleAssignment(activeSession)
        Toast.show('Team unassigned succesfully')
        this.props.alertMsg.success('Team unassigned succesfully')
      } else {
        Toast.show('Team was unable to be unassigned')
      }
    })
  }

  assignToAgent () {
    let data = {
      agentId: this.state.currentSelected.value,
      agentName: this.state.currentSelected.label,
      subscriberId: this.props.activeSession._id,
      isAssigned: true
    }
    this.props.assignToAgent(data, (res) => {
      if (res.status === 'success') {
        let activeSession = this.props.activeSession
        activeSession.is_assigned = true
        activeSession.assigned_to = {
          id: this.state.currentSelected.value,
          name: this.state.currentSelected.label,
          type: 'agent'
        }
        this.props.handleAssignment(activeSession)
        Toast.show('Agent assigned succesfully')
      } else {
        Toast.show('Agent was unable to be assigned')
      }
    })
    // if (this.state.currentSelected.value !== this.props.user._id) {
    //   let notificationsData = {
    //     message: `Session of subscriber ${this.props.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been assigned to you.`,
    //     category: { type: 'chat_session', id: this.props.activeSession._id },
    //     agentIds: [this.state.currentSelected.value],
    //     companyId: this.props.activeSession.companyId
    //   }
    //   this.props.sendNotifications(notificationsData)
    // }
  }

  assignToTeam () {
    let data = {
      teamId: this.state.currentSelected.value,
      teamName: this.state.currentSelected.label,
      subscriberId: this.props.activeSession._id,
      isAssigned: true
    }
    this.props.fetchTeamAgents(this.state.currentSelected.value)
    this.props.assignToTeam(data, (res) => {
      if (res.status === 'success') {
        let activeSession = this.props.activeSession
        activeSession.is_assigned = true
        activeSession.assigned_to = {
          id: this.state.currentSelected.value,
          name: this.state.currentSelected.label,
          type: 'agent'
        }
        this.props.handleAssignment(activeSession)
        Toast.show('Team assigned succesfully')
      } else {
        Toast.show('Team was unable to be assigned')
      }
    })
  }

  renderItem ({ item }) {
    return (
      <Block flex row style={{marginVertical: 5, marginHorizontal: 16}}>
        <CheckBox
          checked={this.state.currentSelected !== '' && this.state.currentSelected.value && this.state.currentSelected.value === item.value}
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
    let currentSelected = this.props.activeSession.is_assigned ? {
      value: this.props.activeSession.assigned_to.id,
      label: this.props.activeSession.assigned_to.name,
      group: this.props.activeSession.assigned_to.type
    } : ''
    this.setState({currentSelected: currentSelected})
    this.props.toggleAssignmentModal(false)
  }

  render () {
    return (
      <Modal isVisible={this.props.showModal} style={{justifyContent: 'flex-end', margin: 0}} onBackdropPress={this.closeModal}>
        <Block style={{backgroundColor: 'white', height: height / 2}}>
          <Block style={{borderBottomWidth: 1, borderBottomColor: '#f4f5f8'}}>
            <Text h5 style={{marginVertical: 10, marginHorizontal: 16}}>Assign this chat session to:</Text>
          </Block>
          <Tabs
            data={[{id: 'agents', title: 'Agents'}, {id: 'teams', title: 'Teams'}]}
            initialIndex={this.state.currentSelected && this.state.currentSelected.group === 'team' ? 'teams' : 'agents'}
            onChange={id => this.changeTab(id)} />
          <FlatList
            style={{marginTop: 10}}
            data={this.state.tabValue === 'agents' ? this.props.agents : this.props.teams}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.value}
            ListEmptyComponent={this.renderEmpty()} />
          <Block center style={{marginTop: 15}}>
            <Button radius={10}
              style={{marginVertical: 10, marginHorizontal: 16}}
              onPress={this.assign}>Done</Button>
          </Block>
        </Block>
      </Modal>
    )
  }
}

export default AssignSession
