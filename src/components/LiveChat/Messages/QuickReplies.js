import React from 'react'
import { FlatList } from 'react-native'
import { Block, Text } from 'galio-framework'

class QuickReplies extends React.Component {
    constructor (props, context) {
        super(props, context)
    }

    render () {
        return (
            <FlatList
                contentContainerStyle={{flexGrow: 1, justifyContent: this.props.alignment ? this.props.alignment : 'center'}}
                horizontal
                style={{marginTop: 5}}
                data={this.props.buttons ? [...this.props.buttons] : []}
                keyExtractor={(item, index) => index}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                return (
                    <Block center style={{marginRight: 5, borderWidth: 1, borderRadius: 10, padding: 5, borderColor: 'blue'}}>
                        <Text color='blue'>{item.title}</Text>
                    </Block>
                )
            }}
            />
      )   
    }
}

export default QuickReplies