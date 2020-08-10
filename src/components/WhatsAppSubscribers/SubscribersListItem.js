import React from 'react'
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Block, Text } from 'galio-framework'
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
  }

  showSubscriberDetail () {
    this.setState({expanded: !this.state.expanded})
  }

  render () {
    const {item} = this.props
    return (
      <TouchableOpacity style={styles.touchableOpacity} onPress={this.showSubscriberDetail}>
        <Block flex row style={{paddingVertical: 20}}>
          <Block flex={0.2}>
            <Image
              source={{uri: 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'}}
              style={styles.avatar} />
          </Block>
          <Block style={{marginTop: 2, marginLeft: 10}} flex={0.6}>
            <Text size={16} style={{marginBottom: 5}} muted={!item.isSubscribed}>
              {item.name}
            </Text>
            <Block flex row>
              <Icon
                size={16}
                name='phone'
                family='Feather'
                color={materialTheme.COLORS.MUTED}
                style={{marginRight: 10}}
              />
              <Text h7 muted={!item.isSubscribed}>
                {item.number}
              </Text>
            </Block>
          </Block>
          <Block flex={0.1} middle>
            <Icon
              onPress={() => this.props.showEdit(item)}
              size={20}
              name='edit'
              family='antdesign'
              color={materialTheme.COLORS.MUTED}
              style={{marginRight: 10}}
            />
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

export default SubscribersListItem

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
