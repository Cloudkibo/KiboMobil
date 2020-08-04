import * as ActionTypes from '../constants/constants'

export function smsWhatsAppDashboardInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CARDBOXES_DATA:
      return Object.assign({}, state, {
        cardBoxesData: action.data
      })
    default:
      return state
  }
}
