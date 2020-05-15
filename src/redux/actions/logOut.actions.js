import {AsyncStorage} from 'react-native'

export function logOut (data, callback) {
  console.log('logout called')
  return (dispatch) => {
    AsyncStorage.removeItem('token')
  }
}
