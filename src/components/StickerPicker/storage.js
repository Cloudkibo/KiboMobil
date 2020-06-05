import AsyncStorage from '@react-native-community/async-storage'

class Storage {
  constructor (userId) {
    Object.assign(this, { userId })
  }

  static storeItem (key, value) {
    try {
      AsyncStorage.setItem(key, JSON.stringify(value))
        .then(result => {
        })
        .catch((err) => {
          console.log('Error while saving to localStorage.', err)
        })
    } catch (err) {
      console.error('Error while saving to localStorage.', err)
    }
  }

  static getItem (key) {
    let item = null

    try {
      AsyncStorage.getItem(key)
        .then(item => {
          item = JSON.parse(item)
        })
        .catch((err) => {
          console.error('Error while retrieving item from localStorage.', err)
        })
    } catch (err) {
      console.error('Error while retrieving item from localStorage.', err)
    }

    return item
  }

  storePack (packName, packTitle, packStickers) {
    const stickers = packStickers.map(packSticker => (
      {
        image: packSticker.image,
        content_id: packSticker.content_id
      }
    ))

    const key = `${this.userId}-${packName}`
    const value = {
      name: packName,
      title: packTitle,
      stickers
    }

    this.constructor.storeItem(key, value)
  }

  getPack (packName) {
    const key = `${this.userId}-${packName}`

    return this.constructor.getItem(key)
  }

  storeMyPacks (packs) {
    const key = `${this.userId}-sticker-packs`
    const value = packs.map(pack => (
      {
        pack_name: pack.pack_name,
        main_icon: pack.main_icon
      }
    ))

    this.constructor.storeItem(key, value)
  }

  getMyPacks () {
    const key = `${this.userId}-sticker-packs`

    return this.constructor.getItem(key)
  }
}

export default Storage
