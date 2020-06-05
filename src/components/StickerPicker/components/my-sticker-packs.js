import React from 'react'
import PropTypes from 'prop-types'
import { Block, Text } from 'galio-framework'
import {
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'
function MyStickerPacks ({ stickerPacks, shop, toggleShop, showPack, colors }) {
  return (
    <Block className='my-packs'>
      <Block className='pack-list'>
        <Block className='stickers-tab'>
          <Block className='stickers' >
            {
              stickerPacks.length > 0
                ? <FlatList horizontal
                  showsHorizontalScrollIndicator={false}
                  data={stickerPacks}
                  renderItem={({item}) => (
                    <TouchableOpacity onPress={() => showPack(item.pack_name)} >
                      <Image style={{width: 50, height: 50}} source={{ uri: item.main_icon.mdpi }} />
                    </TouchableOpacity>
                  )
                  }
                  keyExtractor={(item) => item.pack_name} />
                : <Text h5 style={{marginVertical: 10, marginHorizontal: 16}}>Loading...</Text>
            }
          </Block>
        </Block>

      </Block>
    </Block>
  )
}

MyStickerPacks.propTypes = {
  stickerPacks: PropTypes.arrayOf(PropTypes.shape({
    pack_name: PropTypes.string.isRequired,
    main_icon: PropTypes.shape({
      mdpi: PropTypes.string.isRequired,
      hdpi: PropTypes.string.isRequired,
      xhdpi: PropTypes.string.isRequired,
      xxhdpi: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  showPack: PropTypes.func.isRequired,
  toggleShop: PropTypes.func.isRequired,
  shop: PropTypes.bool.isRequired,
  colors: PropTypes.shape({
    primary: PropTypes.string.isRequired
  }).isRequired
}

export default MyStickerPacks
