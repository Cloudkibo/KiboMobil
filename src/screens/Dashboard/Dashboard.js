import React from 'react'
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import { Block, theme } from 'galio-framework'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CardBox from '../../components/Dashboard/CardBox'
const { width } = Dimensions.get('screen')

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <Block flex center style={styles.home}>
        {this.props.user && ((this.props.user.platform === 'messenger' && !this.props.dashboard) || (this.props.user.platform === 'whatsApp' && !this.props.cardBoxesData))
          ? <Block flex={0.8} middle><ActivityIndicator size='large' /></Block>
          : <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.products}>
            {(this.props.dashboard || this.props.cardBoxesData) &&
              <Block middle flex>
                {this.props.user && this.props.user.platform === 'messenger' && this.props.dashboard &&
                <Block flex row middle>
                  <CardBox
                    title={this.props.dashboard.totalPages}
                    subtitle='Total Pages'
                    style={{ borderBottomColor: theme.COLORS.PRIMARY, marginRight: theme.SIZES.BASE }}
                    navigateTo='Pages'
                  />
                  <CardBox
                    title={this.props.dashboard.pages}
                    subtitle='Connected Pages'
                    style={{ borderBottomColor: theme.COLORS.WARNING }}
                    navigateTo='Pages'
                  />
                </Block>
                }
                <Block flex row>
                  <CardBox
                    title={this.props.user && this.props.user.platform === 'messenger' ? this.props.dashboard ? this.props.dashboard.subscribers : 0 : this.props.cardBoxesData ? this.props.cardBoxesData.subscribers : 0}
                    subtitle='Subscribers'
                    style={{ borderBottomColor: theme.COLORS.ERROR, marginRight: theme.SIZES.BASE }}
                    navigateTo='Subscribers'
                  />
                  <CardBox title={this.props.user && this.props.user.platform === 'messenger' ? this.props.dashboard ? this.props.dashboard.unreadCount : 0 : this.props.cardBoxesData ? this.props.cardBoxesData.chats : 0}
                    subtitle='New Messages'
                    style={{ borderBottomColor: theme.COLORS.INFO }}
                    navigateTo='Live Chat'
                  />
                </Block>
              </Block>
            }
          </ScrollView>
        }
      </Block>
    )
  }
}

function mapStateToProps (state) {
  return {
    dashboard: (state.dashboardInfo.dashboard),
    user: (state.basicInfo.user),
    cardBoxesData: (state.smsWhatsAppDashboardInfo.cardBoxesData)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
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
