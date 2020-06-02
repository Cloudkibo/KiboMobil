import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import Card from './Card'

class Gallery extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <FlatList
        data={this.props.gallery.cards}
        keyExtractor={(item, index) => index}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item, index }) => {
          return (
            <Card card={item} />
          )
        }}
      />
    )
  }
}

Gallery.propTypes = {
  'gallery': PropTypes.object.isRequired
}

export default Gallery
