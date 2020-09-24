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

    case ActionTypes.CONNECT_FB_PAGE: {
      let dashboardStats = JSON.parse(JSON.stringify(state.dashboard))
      dashboardStats.pages = dashboardStats.pages + 1
      return Object.assign({}, state, {
        dashboard: dashboardStats
    })
    }
    case ActionTypes.DISCONNECT_FB_PAGE: {
      let dashboardStats = JSON.parse(JSON.stringify(state.dashboard))
      dashboardStats.pages = dashboardStats.pages - 1
      return Object.assign({}, state, {
        dashboard: dashboardStats
    })
    }
    default:
      return state
  }
}
