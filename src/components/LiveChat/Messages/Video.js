import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions } from 'react-native'
import VideoPlayer from 'expo-video-player'

const { width } = Dimensions.get('screen')

class VideoComponent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.onError = this.onError.bind(this)
  }
  onError () {
    console.log('in video error')
  }

  render () {
    if (!this.props.video) {
      return null
    } else {
      return (
        <VideoPlayer
          videoProps={{
            inFullscreen: true,
            shouldPlay: false,
            resizeMode: 'contain',
            source: {
              uri: this.props.video.fileurl.url
            }
          }}
          videoBackground='transparent'
          height={150}
          width={width * 0.75}
          showControlsOnLoad
          switchToLandscape={this.switchToLandscape}
          errorCallback={this.onError}
        />
      )
    }
  }
}

VideoComponent.propTypes = {
  'video': PropTypes.object.isRequired
}

export default VideoComponent
