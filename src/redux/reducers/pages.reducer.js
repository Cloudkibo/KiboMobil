import * as ActionTypes from '../constants/constants'

// const initialState = {
//   pages: [],
//   otherPages: []
// }

export function pagesInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.FETCH_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })
    case ActionTypes.FETCH_CONNECTED_PAGES_LIST:
      return Object.assign({}, state, {
        connectedPages: action.data
      })
    default:
      return state
  }
}
