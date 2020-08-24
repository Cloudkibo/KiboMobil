/**
 * @flow
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import Slider from '@react-native-community/slider'
import { Block, Text } from 'galio-framework'
import { Audio } from 'expo-av'
import Icon from '../../../components/Icon'

const LOOPING_TYPE_ALL = 0
const LOOPING_TYPE_ONE = 1

const { width: DEVICE_WIDTH } = Dimensions.get('window')
const RATE_SCALE = 3.0

class AudioComponent extends React.Component {
  constructor (props) {
    super(props)
    this.isSeeking = false
    this.shouldPlayAtEndOfSeek = false
    this.playbackInstance = null
    this.state = {
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      throughEarpiece: false
    }

    this._loadNewPlaybackInstance = this._loadNewPlaybackInstance.bind(this)
    this._updateScreenForLoading = this._updateScreenForLoading.bind(this)
    this._onPlaybackStatusUpdate = this._onPlaybackStatusUpdate.bind(this)
    this._onPlayPausePressed = this._onPlayPausePressed.bind(this)
    this._trySetRate = this._trySetRate.bind(this)
    this._onRateSliderSlidingComplete = this._onRateSliderSlidingComplete.bind(this)
    this._onSeekSliderValueChange = this._onSeekSliderValueChange.bind(this)
    this._onSeekSliderSlidingComplete = this._onSeekSliderSlidingComplete.bind(this)
    this._getMMSSFromMillis = this._getMMSSFromMillis.bind(this)
    this._getTimestamp = this._getTimestamp.bind(this)
    this._getSeekSliderPosition = this._getSeekSliderPosition.bind(this)

    this._loadNewPlaybackInstance()
  }

  componentDidMount () {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    })
  }

  async _loadNewPlaybackInstance (playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync()
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null
    }

    const source = { uri: this.props.audio.fileurl.url }
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: this.state.volume,
      isMuted: this.state.muted,
      isLooping: this.state.loopingType === LOOPING_TYPE_ONE
    }
    const { sound } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    )
    this.playbackInstance = sound

    this._updateScreenForLoading(false)
  }

  _updateScreenForLoading (isLoading) {
    if (isLoading) {
      this.setState({
        isPlaying: false,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true
      })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  _onPlaybackStatusUpdate (status) {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch
      })
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`)
      }
    }
  };

  _onPlayPausePressed () {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync()
      } else {
        this.playbackInstance.playAsync()
      }
    }
  };

  async _trySetRate (rate, shouldCorrectPitch) {
    if (this.playbackInstance != null) {
      try {
        await this.playbackInstance.setRateAsync(rate, shouldCorrectPitch)
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  async _onRateSliderSlidingComplete (value) {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch)
  };

  _onSeekSliderValueChange (value) {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay
      this.playbackInstance.pauseAsync()
    }
  };

  async _onSeekSliderSlidingComplete (value) {
    if (this.playbackInstance != null) {
      this.isSeeking = false
      const seekPosition = value * this.state.playbackInstanceDuration
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition)
      } else {
        this.playbackInstance.setPositionAsync(seekPosition)
      }
    }
  };

  _getSeekSliderPosition () {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      )
    }
    return 0
  }

  _getMMSSFromMillis (millis) {
    const totalSeconds = millis / 1000
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor(totalSeconds / 60)

    const padWithZero = number => {
      const string = number.toString()
      if (number < 10) {
        return '0' + string
      }
      return string
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
  }

  _getTimestamp () {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`
    }
    return ''
  }

  render () {
    return (
      <Block style={styles.container}>
        <Block row style={{marginTop: 10, marginHorizontal: 10}}>
          <Block flex={0.75}>
            <View style={[
              styles.buttonsContainerBase,
              styles.buttonsContainerTopRow]}>
              <TouchableOpacity
                style={styles.wrapper}
                onPress={this._onPlayPausePressed}
                disabled={this.state.isLoading}>
                <Icon
                  size={20}
                  name={this.state.isPlaying ? 'pause-circle' : 'playcircleo'}
                  family={this.state.isPlaying ? 'feather' : 'antdesign'}
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
            </View>
          </Block>
          <Block flex={9.25}>
            <Block style={styles.playbackContainer}>
              <Slider
                style={styles.playbackSlider}
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={this.state.isLoading}
              />
            </Block>
          </Block>
        </Block>
        <Block row style={styles.timestampRow}>
          <Text style={styles.buffering}>
            {this.state.isBuffering ? 'Buffering...' : ''}
          </Text>
          <Text style={styles.timestamp}>
            {this._getTimestamp()}
          </Text>
        </Block>
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(241, 240, 240)',
    width: DEVICE_WIDTH * 0.75,
    borderRadius: 20
  },
  playbackContainer: {
    alignSelf: 'stretch'
  },
  playbackSlider: {
    alignSelf: 'stretch'
  },
  timestampRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 5
  },
  buffering: {
    textAlign: 'left',
    paddingLeft: 20
  },
  timestamp: {
    textAlign: 'right',
    paddingRight: 20
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonsContainerTopRow: {
    maxHeight: 100,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0
  }
})

Audio.propTypes = {
  'audio': PropTypes.object.isRequired
}

export default AudioComponent
