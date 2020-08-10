import React from 'react'
import { StyleSheet } from 'react-native'
import { Block, Text } from 'galio-framework'
import moment from 'moment'

class SubscriberDetail extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  getDate (datetime) {
    let d = new Date(datetime)
    let dayofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
    let date = d.getDate()
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
    let year = d.getFullYear()

    return [dayofweek, date, month, year, d.toLocaleTimeString()].join(' ')
  }

  getStatus (status) {
    if (status) {
      return 'Subscribed'
    } else {
      return 'UnSubscribed'
    }
  }

  render () {
    const {item} = this.props
    return (
      <Block flex style={styles.expandedBlock}>
        <Block flex row style={{marginBottom: 12}}>
          <Text h7 style={{marginRight: 10}}>
            Status:
          </Text>
          <Text h7 muted>
            {this.getStatus(item.isSubscribed)}
          </Text>
        </Block>
        <Block flex row style={{marginBottom: 12}}>
          <Text h7 style={{marginRight: 10}}>
            Subscribed At:
          </Text>
          <Text h7 muted>
            {`${this.getDate(item.datetime)}\n(${moment(item.datetime).fromNow()})`}
          </Text>
        </Block>
      </Block>
    )
  }
}

export default SubscriberDetail

const styles = StyleSheet.create({
  expandedBlock: {
    marginHorizontal: 20,
    marginBottom: 20
  }
})
