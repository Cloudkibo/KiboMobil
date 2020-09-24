import * as ActionTypes from '../constants/constants'

const initialState = {
}

export function dashboardInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DASHBOARD:
      return Object.assign({}, state, {
        dashboard: action.data
      })
    case ActionTypes.UPDATE_DASHBOARD_INFO:
      return Object.assign({}, state, action, action.data)
    case ActionTypes.NEW_SUBSCRIBER_EVENT:
      let dashboard1 = JSON.parse(JSON.stringify(state.dashboard))
      dashboard1.subscribers = state.dashboard.subscribers + 1
      return Object.assign({}, state, {
        dashboard: dashboard1
      })
    case ActionTypes.SUBSCRIBE_EVENT:
      let dashboard2 = JSON.parse(JSON.stringify(state.dashboard))
      dashboard2.subscribers = state.dashboard.subscribers + 1
      return Object.assign({}, state, {
        dashboard: dashboard2
      })
    case ActionTypes.UNSUBSCRIBE_EVENT:
      let dashboard3 = JSON.parse(JSON.stringify(state.dashboard))
      dashboard3.subscribers = state.dashboard.subscribers - 1
      return Object.assign({}, state, {
        dashboard: dashboard3
      })
    default:
      return state
  }
}
