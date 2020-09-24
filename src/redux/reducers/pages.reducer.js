import * as ActionTypes from '../constants/constants'

// const initialState = {
//   pages: [],
//   otherPages: []
// }

export function pagesInfo (state = [], action) {
  // console.log('action.data', action.data)
  switch (action.type) {
    case ActionTypes.FETCH_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })
    case ActionTypes.FETCH_CONNECTED_PAGES_LIST:
      return Object.assign({}, state, {
        connectedPages: action.data
      })
      case ActionTypes.CONNECT_FB_PAGE: {
        let pages = JSON.parse(JSON.stringify(state.pages))
        console.log('pages in pages', pages)
        let pageIndex = pages.findIndex(page => page._id === action.data._id)
        pages[pageIndex] = action.data
        return Object.assign({}, state, {
          pages: pages
      })
    }
      case ActionTypes.DISCONNECT_FB_PAGE: {
        let pages = JSON.parse(JSON.stringify(state.pages))
        let pageIndex = pages.findIndex(page => page.pageId === action.data.page_id)
        pages[pageIndex].connected = false
        return Object.assign({}, state, {
          pages: pages
      })
    }
    default:
      return state
  }
}
