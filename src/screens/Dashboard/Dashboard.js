import React from 'react'
import { StyleSheet, Dimensions, ScrollView } from 'react-native'
import { Block, theme } from 'galio-framework'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CardBox from '../../components/Dashboard/CardBox'
import { loadDashboardData } from '../../redux/actions/dashboard.actions'

const { width } = Dimensions.get('screen')

class Dashboard extends React.Component {
  /* eslint-disable */
  UNSAFE_componentWillMount () {
  /* eslint-enable */
  }

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.loadDashboardData()
    })
  }
  componentWillUnmount () {
    this._unsubscribe()
  }

  render () {
    return (
      <Block flex center style={styles.home}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}>
          {this.props.dashboard &&
            <Block middle flex>
              <Block flex row middle>
                <CardBox title={this.props.dashboard.totalPages} subtitle='Total Pages' style={{ borderBottomColor: theme.COLORS.PRIMARY, marginRight: theme.SIZES.BASE }} />
                <CardBox title={this.props.dashboard.pages} subtitle='Connected Pages' style={{ borderBottomColor: theme.COLORS.WARNING }} />
              </Block>
              <Block flex row>
                <CardBox title={this.props.dashboard.subscribers} subtitle='Subscribers' style={{ borderBottomColor: theme.COLORS.ERROR, marginRight: theme.SIZES.BASE }} />
                <CardBox title={this.props.dashboard.unreadCount} subtitle='New Messages' style={{ borderBottomColor: theme.COLORS.INFO }} />
              </Block>
            </Block>
          }
        </ScrollView>
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    dashboard: (state.dashboardInfo.dashboard)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadDashboardData},
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

const styles = StyleSheet.create({
  home: {
    width: width
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2
  }
})
