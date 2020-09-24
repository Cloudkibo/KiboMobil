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

export function handleSocketEventWhatsapp (data) {
  return {
    type: ActionTypes.SOCKET_EVENT_WHATSAPP,
    data
  }
}

export function clearSocketDataWhatsapp () {
  return {
    type: ActionTypes.CLEAR_SOCKET_DATA_WHATSAPP
  }
}

export function handleSocketEventSubscribers (data) {
  return {
    type: ActionTypes.SOCKET_EVENT_SUBSCRIBERS,
    data
  }
}

export function clearSocketDataSubscribers () {
  return {
    type: ActionTypes.CLEAR_SOCKET_DATA_SUBSCRIBERS
  }
}

export function handleSocketEventSubscribersWhatsApp (data) {
  return {
    type: ActionTypes.SOCKET_EVENT_SUBSCRIBERS_WHATSAPP,
    data
  }
}

export function clearSocketDataSubscribersWhatsApp () {
  return {
    type: ActionTypes.CLEAR_SOCKET_DATA_SUBSCRIBERS_WHATSAPP
  }
}

export function connectFbPage (data) {
  return {
    type: ActionTypes.CONNECT_FB_PAGE_EVENT,
    data
  }
}

export function disConnectFbPage (data) {
  return {
    type: ActionTypes.DISCONNECT_FB_PAGE_EVENT,
    data
  }
}
