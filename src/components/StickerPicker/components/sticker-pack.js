import React from 'react'
import PropTypes from 'prop-types'
import {Block, Text} from 'galio-framework'
import {
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'

function StickerPack ({ pack, sendSticker }) {
  return (
    <Block className='sticker-pack'>
      <Block className='stickers'>
        {pack.stickers.length > 0
          ? <FlatList
            showsHorizontalScrollIndicator={false}
            data={pack.stickers}
            renderItem={({item}) => (
              <Block style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                <TouchableOpacity onPress={() => sendSticker(item)}>
                  <Image style={{width: 80, height: 80}} source={{ uri: item.image.mdpi }} />
                </TouchableOpacity>
              </Block>
            )
            }
            numColumns={4}
            keyExtractor={(item) => item.content_id} />
          : <Text h5 style={{marginVertical: 10, marginHorizontal: 30}}>Loading...</Text>
        }
      </Block>
    </Block>
  )
}

StickerPack.propTypes = {
  pack: PropTypes.shape({
    title: PropTypes.string.isRequired,
    stickers: PropTypes.arrayOf(
      PropTypes.shape({
        content_id: PropTypes.number.isRequired,
        image: PropTypes.shape({
          mdpi: PropTypes.string.isRequired,
          hdpi: PropTypes.string.isRequired,
          xhdpi: PropTypes.string.isRequired,
          xxhdpi: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    ).isRequired
  }).isRequired,
  sendSticker: PropTypes.func.isRequired
}

export default StickerPack
