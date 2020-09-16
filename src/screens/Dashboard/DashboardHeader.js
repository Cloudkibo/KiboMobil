import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updatePlatform } from '../../redux/actions/basicInfo.actions'
import { clearSession } from '../../redux/actions/liveChat.actions'
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native'
import { Block, NavBar, theme } from 'galio-framework'
import Icon from '../../components/Icon'
import SelectPlatform from './SelectPlatform'

const { height, width } = Dimensions.get('window')
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896)

class DashboardHeader extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showAssignmentModal: false
    }
    this.handleLeftPress = this.handleLeftPress.bind(this)
    this.toggleAssignmentModal = this.toggleAssignmentModal.bind(this)
    this.renderRight = this.renderRight.bind(this)
  }
  handleLeftPress () {
    const { back, navigation } = this.props
    return (back ? navigation.goBack() : navigation.openDrawer())
  }
  toggleAssignmentModal (value) {
    this.setState({showAssignmentModal: false})
  }
  renderRight () {
    return (
      <Block flex={0.8} row>
        { this.props.automated_options && this.props.automated_options.whatsApp &&
        <TouchableOpacity onPress={() => this.setState({showAssignmentModal: true})}>
          <Icon
            size={20}
            name='dots-three-vertical'
            family='Entypo'
            style={{marginLeft: 40, marginTop: 6}}
          />
        </TouchableOpacity>
        }
        <SelectPlatform
          showModal={this.state.showAssignmentModal}
          toggleAssignmentModal={this.toggleAssignmentModal}
          user={this.props.user}
          updatePlatform={this.props.updatePlatform}
          clearSession={this.props.clearSession}
        />
      </Block>
    )
  }

  render () {
    const { back, title, white, transparent } = this.props
    const noShadow = ['Search', 'Profile'].includes(title)
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null
    ]

    return (
      <Block style={headerStyles}>
        <NavBar
          back={back}
          title={title}
          style={styles.navbar}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          leftStyle={{ paddingTop: 3, flex: 0.3 }}
          leftIconName={back ? null : 'navicon'}
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          titleStyle={[
            styles.title,
            { color: theme.COLORS[white ? 'WHITE' : 'ICON'] }
          ]}
          onLeftPress={this.handleLeftPress}
        />
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlatform: updatePlatform,
    clearSession: clearSession
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHeader)

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
  }
})
