import callApi from '../../utility/api.caller.service'

export function signIn (data, callback) {
  return (dispatch) => {
    callApi('auth/local', 'post', data, 'accounts').then(res => {
      callback(res)
    })
  }
}
