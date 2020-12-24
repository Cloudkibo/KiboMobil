import { connectFbPage, disConnectFbPage } from '../redux/actions/socket.actions'

export function handleFBPageEvent (store, data) {
  switch (data.action) {
    case 'page_connect':
      store.dispatch(connectFbPage(data.payload.data))
      break
    case 'page_disconnect':
      store.dispatch(disConnectFbPage(data.payload))
      break
    default:
  }
}
