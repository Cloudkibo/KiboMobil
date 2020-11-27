import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Block, Text } from 'galio-framework'
import { fetchSubscribers } from '../../redux/actions/subscribers.actions'
import Icon from '../../components/Icon'
import SubscriberDetail from './SubscriberDetail'
import { materialTheme } from '../../constants/'

class SubscribersListItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      expanded: false
    }
    this.showSubscriberDetail = this.showSubscriberDetail.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
  }

  showSubscriberDetail () {
    this.setState({expanded: !this.state.expanded})
  }

  profilePicError (subscriber) {
    this.props.updatePicture({ subscriber })
  }

  render () {
    const {item} = this.props
    return (
      <TouchableOpacity style={styles.touchableOpacity} onPress={this.showSubscriberDetail}>
        <Block flex row style={{paddingVertical: 20}}>
          <Block flex={0.2}>
            <Image
              onError={() => this.profilePicError(item)}
              source={{uri: item.profilePic ? item.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'}}
              style={styles.avatar} />
          </Block>
          <Block style={{marginTop: 2, marginLeft: 10}} flex={0.6}>
            <Text size={16} style={{marginBottom: 5}} muted={!item.isSubscribed}>
              {`${item.firstName} ${item.lastName}`}
            </Text>
            <Block flex row>
              <Icon
                size={16}
                name='facebook'
                family='entypo'
                color={materialTheme.COLORS.MUTED}
                style={{marginRight: 10}}
              />
              <Text h7 muted={!item.isSubscribed}>
                {item.pageId.pageName}
              </Text>
            </Block>
          </Block>
          <Block flex={0.2} middle>
            <Icon
              size={25}
              name={this.state.expanded ? 'chevron-up' : 'chevron-down'}
              family='entypo'
              color={materialTheme.COLORS.MUTED}
              style={{marginRight: 10}}
            />
          </Block>
        </Block>
        {this.state.expanded &&
        <SubscriberDetail item={item} />
        }
      </TouchableOpacity>
    )
  }
}

function mapStateToProps (state) {
  return {
    subscribers: (state.subscribersInfo.subscribers),
    count: (state.subscribersInfo.count)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSubscribers
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribersListItem)
const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
    marginHorizontal: 16
  },
  touchableOpacity: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f5f8'
  }
})
