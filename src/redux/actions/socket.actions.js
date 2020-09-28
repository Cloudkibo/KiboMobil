import * as ActionTypes from '../constants/constants'

export function setSocketStatus (data) {
  return {
    type: ActionTypes.SET_SOCKET_STATUS,
    data
  }
}

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
export function newSubscriberEvent (data) {
  return {
    type: ActionTypes.NEW_SUBSCRIBER_EVENT,
    data
  }
}

export function disConnectFbPage (data) {
  return {
    type: ActionTypes.DISCONNECT_FB_PAGE_EVENT,
    data
  }
}
export function subscribeEvent (data) {
  return {
    type: ActionTypes.SUBSCRIBE_EVENT,
    data
  }
}

export function unsubscribeEvent (data) {
  return {
    type: ActionTypes.UNSUBSCRIBE_EVENT,
    data
  }
}

export function newSubscriberWhatsAppEvent (data) {
  return {
    type: ActionTypes.NEW_SUBSCRIBER_WHATSAPP_EVENT,
    data
  }
}

export function subscribeWhatsAppEvent (data) {
  return {
    type: ActionTypes.SUBSCRIBE_WHATSAPP_EVENT,
    data
  }
}

export function unsubscribeWhatsAppEvent (data) {
  return {
    type: ActionTypes.UNSUBSCRIBE_WHATSAPP_EVENT,
    data
  }
}
export function updateSubscriberWhatsAppEvent (data) {
  return {
    type: ActionTypes.UPDATE_SUBSCRIBER_WHATSAPP_EVENT,
    data
  }
}
