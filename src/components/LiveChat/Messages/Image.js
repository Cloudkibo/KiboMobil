import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native'
import { Block } from 'galio-framework'

import ImageView from 'react-native-image-viewing'

const { width } = Dimensions.get('screen')

class ImageComponent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showFullScreen: false
    }
  }

  render () {
    return (
      <Block>
        <TouchableOpacity onPress={() => this.setState({showFullScreen: true})}>
          <Image resizeMode='contain' style={styles.image} source={{ uri: this.props.image.fileurl.url || this.props.image.fileurl }} />
        </TouchableOpacity>
        <ImageView
          images={[{uri: this.props.image.fileurl.url || this.props.image.fileurl}]}
          imageIndex={0}
          visible={this.state.showFullScreen}
          onRequestClose={() => this.setState({showFullScreen: false})}
        />
      </Block>
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
