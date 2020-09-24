import { newSubscriberEvent } from '../redux/actions/subscribers.actions'

export function handleSubscribers (store, data) {
  console.log('in handleSubscribers')
  switch (data.action) {
    case 'new_chat':
      store.dispatch(newSubscriberEvent(data))
      break
    default:
  }
}
