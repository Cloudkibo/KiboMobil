import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { Block, Text, Button } from 'galio-framework'

class Survey extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <Block>
        <Block>
          <Text color={this.props.textColor}>{this.props.survey.text}</Text>
        </Block>
        {this.props.survey.attachment.payload.buttons &&
          this.props.survey.attachment.payload.buttons.length > 0 &&
          <FlatList
            data={this.props.survey.attachment.payload.buttons}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Block center>
                  <Button size='small' radius={10} style={{backgroundColor: 'white', marginVertical: 5, height: 35}}>
                    <Text>{
                      typeof item.title === 'string' &&
                      item.title.toUpperCase()
                    }</Text>
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

Survey.propTypes = {
  'survey': PropTypes.object.isRequired,
  'textColor': PropTypes.string
}

export default Survey
