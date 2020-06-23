import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Block, Text, theme} from 'galio-framework'
import { withNavigation } from '@react-navigation/compat'

class CardBox extends React.Component {
  render () {
    return (
      <Block flex style={[styles.product, styles.shadow, this.props.style]}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(this.props.navigateTo)}>
          <Block flex style={styles.productDescription}>
            <Text h2 style={styles.productTitle}>{this.props.title}</Text>
            <Text size={14}>{this.props.subtitle}</Text>
          </Block>
        </TouchableOpacity>
      </Block>
    )
  }
}
export default withNavigation(CardBox)

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    minHeight: 114,
    borderBottomWidth: 3
  },
  productTitle: {
    flex: 0.5,
    flexWrap: 'wrap'
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
    marginLeft: 10
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 2
  }
})
