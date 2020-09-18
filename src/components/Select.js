import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { Block, Text, Icon, theme } from 'galio-framework'

import { materialTheme } from '../constants/'

const { width } = Dimensions.get('screen')

export default class DropDown extends React.Component {
  render () {
    const { onSelect, style, ...props } = this.props
    return (
        <DropDownPicker
        items={this.props.options}
        itemStyle={{
            justifyContent: 'flex-start'
        }}
        containerStyle={{height: 45}}
        style={[styles.qty, style]}
        defaultValue={this.props.value}
        placeholder='Select a Page'
        dropDownStyle={{backgroundColor: '#fafafa', width: width * 0.7, zIndex: 10000, marginTop: 2}}
        onChangeItem={this.props.onSelect}

      {...props}/>
    )
  }
}

const styles = StyleSheet.create({
  qty: {
    width: theme.SIZES.BASE * 6,
    backgroundColor: materialTheme.COLORS.DEFAULT,
    paddingHorizontal: theme.SIZES.BASE,
    paddingTop: 10,
    paddingBottom: 9.5,
    borderRadius: 3,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    zIndex: 5000
  },
  dropdown: {
    height: 'auto',
    marginLeft: -theme.SIZES.BASE,
  }
})
