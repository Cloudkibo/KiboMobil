import * as ActionTypes from '../constants/constants'

export function handleSocketEvent (data) {
  return {
    type: ActionTypes.SOCKET_EVENT,
    data
  }
}

export function clearSocketData () {
  return {
    type: ActionTypes.CLEAR_SOCKET_DATA
  }
}
