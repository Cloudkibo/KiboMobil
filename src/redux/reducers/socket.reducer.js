import * as ActionTypes from '../constants/constants'

const initialState = {
  socketData: null,
  connected: true
}

export function socketInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SOCKET_EVENT:
      return Object.assign({}, state, {
        socketData: action.data
      })

    case ActionTypes.CLEAR_SOCKET_DATA:
      return Object.assign({}, state, {
        socketData: null
      })
    case ActionTypes.SOCKET_EVENT_WHATSAPP:
      return Object.assign({}, state, {
        socketDataWhatsapp: action.data
      })
    case ActionTypes.CLEAR_SOCKET_DATA_WHATSAPP:
      return Object.assign({}, state, {
        socketDataWhatsapp: null
      })
    case ActionTypes.SET_SOCKET_STATUS:
      return Object.assign({}, state, {
        connected: action.data
      })
    default:
      return state
  }
}
