import {AsyncStorage} from 'react-native'

export function logOut (data, callback) {
  return (dispatch) => {
    AsyncStorage.removeItem('token')
  }
}
