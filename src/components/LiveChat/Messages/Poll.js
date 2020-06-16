import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { Block, Text, Button } from 'galio-framework'

class Poll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <Block>
        <Block>
          <Text color={this.props.textColor}>{this.props.poll.text}</Text>
        </Block>
        {this.props.poll.quick_replies &&
          this.props.poll.quick_replies.length > 0 &&
          <FlatList
            data={this.props.poll.quick_replies}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index }) => {
              return (
                <Block center>
                  <Button size='small' round
                    style={{
                      backgroundColor: 'white',
                      marginVertical: 5,
                      height: 35,
                      width: 'auto',
                      paddingHorizontal: 10,
                      marginRight: 5
                    }}>
                    <Text>{item.title}</Text>
                  </Button>
                </Block>
              )
            }}
          />
        }
      </Block>
    )
  }
}

Poll.propTypes = {
  'poll': PropTypes.object.isRequired,
  'textColor': PropTypes.string
}

export default Poll
