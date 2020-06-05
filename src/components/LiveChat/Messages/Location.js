import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform
} from 'react-native'
import { Text } from 'galio-framework'

const { width } = Dimensions.get('screen')

class Location extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
    this.getUrl = this.getUrl.bind(this)
    this.getMainUrl = this.getMainUrl.bind(this)
  }

  getUrl () {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}`
  }

  getMainUrl () {
  // return `https://www.google.com/maps/place/${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}/`
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
    const latLng = `${this.props.data.payload.coordinates.lat},${this.props.data.payload.coordinates.long}`
    const label = 'Custom Label'
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    })
    return url
  }

  render () {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(this.getMainUrl())}>
        <Image resizeMode='contain' style={styles.image} source={{ uri: this.getUrl() }} />
        <Text>{this.props.data.title}</Text>
      </TouchableOpacity>
    )
  }
}

Location.propTypes = {
  'data': PropTypes.object.isRequired
}

export default Location

const styles = StyleSheet.create({
  image: {
    width: width * 0.75,
    height: 150,
    flex: 1,
    borderRadius: 3
  }
})
