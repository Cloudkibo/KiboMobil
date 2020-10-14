import * as ActionTypes from '../constants/constants'

const initialState = {
}

export function basicInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_USER_DETAILS:
      return Object.assign({}, state, {
        user: action.data
      })
    case ActionTypes.GET_AUTOMATED_OPTIONS:
      return Object.assign({}, state, {
        automated_options: action.data
      })
    case ActionTypes.SAVE_EXPOTOKEN:
    let automated_options = state.automated_options
    Object.assign(automated_options, action.data)
      return Object.assign({}, state, {
        automated_options: automated_options
      })
    default:
      return state
  }
}
