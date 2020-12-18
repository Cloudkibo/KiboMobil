import React from 'react'
import { FlatList } from 'react-native'
import { Block, Text } from 'galio-framework'

function QuickReplies(props) {
  const buttons = props.buttons ? [...props.buttons] : []
  if (buttons.find((b) => !!b.skipAllowed)) {
    buttons.push({ title: 'skip' })
  }
  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, justifyContent: props.alignment ? props.alignment : 'center' }}
      horizontal
      style={{ marginTop: 5 }}
      data={buttons}
      keyExtractor={(item, index) => index}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <Block center style={{ marginRight: 5, borderWidth: 1, borderRadius: 10, padding: 5, borderColor: 'blue' }}>
            <Text color='blue'>{item.title}</Text>
          </Block>
        )
      }}
    />
  )
}

export default QuickReplies
