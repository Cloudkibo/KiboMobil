import * as ActionTypes from '../constants/constants'

export function membersInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_MEMBERS:
      return Object.assign({}, state, {
        members: action.data
      })
    default:
      return state
  }
}
