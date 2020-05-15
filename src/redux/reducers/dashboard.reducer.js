import * as ActionTypes from '../constants/constants'

const initialState = {
}

export function dashboardInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DASHBOARD:
      return Object.assign({}, state, {
        dashboard: action.data
      })
    default:
      return state
  }
}
