import * as ActionTypes from '../constants/constants'

const initialState = {
  permissions: []
}
export function settingsInfo (state = initialState, action) {
  switch (action.type) {
    
  case ActionTypes.GET_CANNED_RESPONSES:
  return Object.assign({}, state, {
    cannedResponses: action.data
  })

    default:
      return state
  }
}