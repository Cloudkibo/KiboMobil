import { newSubscriberEvent, subscribeEvent, unsubscribeEvent } from '../redux/actions/socket.actions'

export function handleSubscribers (store, data) {
  switch (data.action) {
    case 'Messenger_new_subscriber':
      store.dispatch(newSubscriberEvent(data))
      break
    case 'Messenger_subscribe_subscriber':
      store.dispatch(subscribeEvent(data))
      break
    case 'Messenger_unsubscribe_subscriber':
      store.dispatch(unsubscribeEvent(data))
      break
    default:
  }
}
