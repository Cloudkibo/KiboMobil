import * as ActionTypes from '../constants/constants'

export function smsWhatsAppDashboardInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CARDBOXES_DATA:
      return Object.assign({}, state, {
        cardBoxesData: action.data
      })
    case ActionTypes.UPDATE_DASHBOARD_INFO_WHATSAPP:
      return Object.assign({}, state, action, action.data)
    default:
      return state
  }
}
