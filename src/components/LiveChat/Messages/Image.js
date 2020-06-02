import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'

const { width } = Dimensions.get('screen')

class ImageComponent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(this.props.image.fileurl.url || this.props.image.fileurl)}>
        <Image resizeMode='contain' style={styles.image} source={{ uri: this.props.image.fileurl.url || this.props.image.fileurl }} />
      </TouchableOpacity>
    )
  }
}

ImageComponent.propTypes = {
  'image': PropTypes.object.isRequired
}

export default ImageComponent

const styles = StyleSheet.create({
  image: {
    width: width * 0.75,
    height: 150,
    flex: 1,
    borderRadius: 3
  }
})
