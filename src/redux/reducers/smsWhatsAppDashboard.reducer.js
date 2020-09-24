import * as ActionTypes from '../constants/constants'

export function smsWhatsAppDashboardInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CARDBOXES_DATA:
      return Object.assign({}, state, {
        cardBoxesData: action.data
      })
    case ActionTypes.UPDATE_DASHBOARD_INFO_WHATSAPP:
      return Object.assign({}, state, action, action.data)
    case ActionTypes.NEW_SUBSCRIBER_WHATSAPP_EVENT:
      let dashboard1 = JSON.parse(JSON.stringify(state.cardBoxesData))
      dashboard1.subscribers = state.cardBoxesData.subscribers + 1
      return Object.assign({}, state, {
        cardBoxesData: dashboard1
      })
    case ActionTypes.SUBSCRIBE_WHATSAPP_EVENT:
      let dashboard2 = JSON.parse(JSON.stringify(state.cardBoxesData))
      dashboard2.subscribers = state.cardBoxesData.subscribers + 1
      return Object.assign({}, state, {
        cardBoxesData: dashboard2
      })
    case ActionTypes.UNSUBSCRIBE_WHATSAPP_EVENT:
      let dashboard3 = JSON.parse(JSON.stringify(state.cardBoxesData))
      dashboard3.subscribers = state.cardBoxesData.subscribers - 1
      return Object.assign({}, state, {
        cardBoxesData: dashboard3
      })
    default:
      return state
  }
}
