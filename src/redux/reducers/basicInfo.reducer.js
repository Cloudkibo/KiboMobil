import * as ActionTypes from '../constants/constants'

const initialState = {
}

export function basicInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_USER_DETAILS:
      return Object.assign({}, state, {
        user: action.data
      })

    default:
      return state
  }
}
