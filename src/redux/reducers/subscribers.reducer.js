import * as ActionTypes from '../constants/constants'

export function subscribersInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_SUBSCRIBERS_OVERRIDE:
      return Object.assign({}, state, {
        subscribers: action.data,
        count: action.count
      })
    case ActionTypes.FETCH_SUBSCRIBERS:
      return Object.assign({}, state, {
        subscribers: [...state.subscribers, ...action.data],
        count: action.count
      })
    default:
      return state
  }
}
