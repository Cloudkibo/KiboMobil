import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNavigation } from '@react-navigation/compat'
import { TouchableOpacity, StyleSheet, Platform, Dimensions, Image } from 'react-native'
import { Button, Block, NavBar, Text, theme } from 'galio-framework'
import Toast from 'react-native-simple-toast'
import Icon from '../../components/Icon'
import ASSIGNSESSION from '../../components/LiveChat/Chat/AssignSession'

import { changeStatus, fetchTeamAgents, assignToTeam, assignToAgent } from '../../redux/actions/liveChat.actions'

const { height, width } = Dimensions.get('window')
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896)

class Header extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: this.props.activeSession,
      showAssignmentModal: false
    }
    this.handleLeftPress = this.handleLeftPress.bind(this)
    this.renderRight = this.renderRight.bind(this)
    this.renderTitle = this.renderTitle.bind(this)
    this.performAction = this.performAction.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.toggleAssignmentModal = this.toggleAssignmentModal.bind(this)
    this.getAgents = this.getAgents.bind(this)
    this.getTeams = this.getTeams.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.handleAssignment = this.handleAssignment.bind(this)
  }

  fetchTeamAgents (id) {
    this.props.fetchTeamAgents(id, this.handleAgents)
  }

  handleAgents (teamAgents) {
    // let agentIds = []
    // for (let i = 0; i < teamAgents.length; i++) {
    //   if (teamAgents[i].agentId !== this.props.user._id) {
    //     agentIds.push(teamAgents[i].agentId)
    //   }
    // }
    // if (agentIds.length > 0) {
    //   let notificationsData = {
    //     message: `Session of subscriber ${this.state.activeSession.firstName + ' ' + this.state.activeSession.lastName} has been assigned to your team.`,
    //     category: { type: 'chat_session', id: this.state.activeSession._id },
    //     agentIds: agentIds,
    //     companyId: this.state.activeSession.companyId
    //   }
    //   this.props.sendNotifications(notificationsData)
    // }
  }

  getAgents () {
    let agents = []
    if (this.props.members && this.props.members.length > 0) {
      agents = this.props.members.map(m => m.userId).map(agent => (
        {label: agent.name, value: agent._id, group: 'agent'}))
    }
    return agents
  }

  getTeams () {
    let teams = []
    if (this.props.teams && this.props.teams.length > 0) {
      teams = this.props.teams.map(team => (
        {label: team.name, value: team._id, group: 'team'}))
    }
    return teams
  }

  toggleAssignmentModal (value) {
    this.setState({showAssignmentModal: false})
  }

  performAction (errorMsg, session) {
    let isAllowed = true
    if (session.is_assigned) {
      if (session.assigned_to.type === 'agent' && session.assigned_to.id !== this.props.user._id) {
        isAllowed = false
        errorMsg = `Only assigned agent can ${errorMsg}`
      } else if (session.assigned_to.type === 'team') {
        this.fetchTeamAgents(session._id, (teamAgents) => {
          const agentIds = teamAgents.map((agent) => agent.agentId._id)
          if (!agentIds.includes(this.props.user._id)) {
            isAllowed = false
            errorMsg = `Only agents who are part of assigned team can ${errorMsg}`
          }
        })
      }
    }
    errorMsg = `You can not perform this action. ${errorMsg}`
    return {isAllowed, errorMsg}
  }

  handleStatusChange (session, status) {
    const message = (status === 'resolved') ? 'Session has been marked as resoleved successfully' : 'Session has been reopened successfully'
    let activeSession = this.state.activeSession
    activeSession.status = status
    this.setState({activeSession: activeSession})
    Toast.show(message, Toast.SHORT, [
      'UIAlertController'
    ])
  }

  handleAssignment (activeSession) {
    this.setState({activeSession: activeSession})
  }

  changeStatus (status, session) {
    let errorMsg = (status === 'resolved') ? 'mark this session as resolved' : 'reopen this session'
    const data = this.performAction(errorMsg, session)
    if (data.isAllowed) {
      this.props.changeStatus({_id: session._id, status: status}, () => this.handleStatusChange(session, status))
    } else {
      Toast.show(data.errorMsg, Toast.SHORT, [
        'UIAlertController'
      ])
    }
  }

  handleLeftPress () {
    const { back, navigation } = this.props
    return (back ? navigation.goBack() : navigation.openDrawer())
  }

  renderRight () {
    return (
      <Block flex={0.8} row>
        {this.props.activeSession.status === 'new'
          ? <Button round style={{ width: 80, height: 30 }} color='success'
            onPress={() => this.changeStatus('resolved', this.state.activeSession)}>
            <Text style={{color: 'white'}}>Done</Text>
          </Button>
          : <Button round style={{ width: 80, height: 30 }} color='success'
            onPress={() => this.changeStatus('new', this.state.activeSession)}>
            <Text style={{color: 'white'}}>Reopen</Text>
          </Button>
        }
        {(this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
          (['admin', 'buyer'].includes(this.props.user.role)) &&
          <TouchableOpacity onPress={() => this.setState({showAssignmentModal: true})}>
            <Icon
              size={20}
              name='dots-three-vertical'
              family='Entypo'
              style={{marginLeft: 8, marginTop: 6}}
            />
          </TouchableOpacity>
        }
        <ASSIGNSESSION
          showModal={this.state.showAssignmentModal}
          toggleAssignmentModal={this.toggleAssignmentModal}
          teams={this.getTeams()}
          agents={this.getAgents()}
          activeSession={this.props.activeSession}
          fetchTeamAgents={this.props.fetchTeamAgents}
          assignToTeam={this.props.assignToTeam}
          assignToAgent={this.props.assignToAgent}
          user={this.props.user}
          handleAssignment={this.handleAssignment}
        />
      </Block>
    )
  }

  renderTitle (activeSession) {
    return (<Block row flex middle style={{marginLeft: -30, paddingBottom: 10}}>
      <Block flex={0.2}>
        <Image
          onError={({ nativeEvent: {error} }) => console.log(error)}
          source={{uri: activeSession.profilePic}}
          style={styles.avatar} />
      </Block>
      <Block flex={0.8}>
        <Text size={16} style={{marginLeft: 5}}>
          {`${activeSession.firstName} ${activeSession.lastName}`}
        </Text>
        {(this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
        (['admin', 'buyer'].includes(this.props.user.role)) &&
          <Text size={12} style={{marginLeft: 5}}>
            {activeSession.is_assigned ? 'Assigned' : 'Unassigned'}
          </Text>
        }
      </Block>
    </Block>)
  }

  render () {
    const { back, white, transparent } = this.props
    return (
      <Block>
        <NavBar
          back={back}
          title={this.renderTitle(this.state.activeSession)}
          style={styles.navbar}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ flex: 0.3, paddingBottom: 10 }}
          leftIconName='arrowleft'
          leftIconFamily='AntDesign'
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] }
          ]}
          onLeftPress={this.handleLeftPress} />
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    members: (state.membersInfo.members),
    teams: (state.teamsInfo.teams)
    // socketData: (state.socketInfo.socketData)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeStatus,
    fetchTeamAgents,
    assignToTeam,
    assignToAgent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Header))

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold'
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10
  }
})
