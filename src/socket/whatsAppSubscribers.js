import {
  newSubscriberWhatsAppEvent,
  updateSubscriberWhatsAppEvent,
  subscribeWhatsAppEvent,
  unsubscribeWhatsAppEvent
} from '../redux/actions/socket.actions'

export function handleWhatsAppSubscribers (store, data) {
  switch (data.action) {
    case 'Whatsapp_new_subscriber':
      store.dispatch(newSubscriberWhatsAppEvent(data))
      break
    case 'Whatsapp_subscriberName_update':
      store.dispatch(updateSubscriberWhatsAppEvent(data))
      break
    case 'Whatsapp_subscribe_subscriber':
      store.dispatch(subscribeWhatsAppEvent(data))
      break
    case 'Whatsapp_unsubscribe_subscriber':
      store.dispatch(unsubscribeWhatsAppEvent(data))
      break
    default:
  }
}
