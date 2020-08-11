import React from 'react'
import PropTypes from 'prop-types'
import {
  FlatList,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'
import Icon from '../../../components/Icon'
import { Block, Text, Button } from 'galio-framework'

class Contact extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <Block flex row style={{flexDirection: 'row', marginRight: 10}}>
        <Block>
          <Image
            source={{uri: 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'}}
            style={styles.avatar} />
        </Block>
        <Block>
          <Text color='black' size={16} style={{marginBottom: 3}}>
            {this.props.name}
          </Text>
          <Block flex row>
            <Icon
              size={16}
              name='phone'
              family='Feather'
              style={{marginRight: 5}}
            />
            <Text h7 color='black'>
              {this.props.number}
            </Text>
          </Block>
        </Block>
      </Block>
    )
  }
}

Contact.propTypes = {
  'name': PropTypes.string.isRequired,
  'number': PropTypes.string.isRequired
}

export default Contact

const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10
  }
})
