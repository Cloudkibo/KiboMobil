import * as ActionTypes from '../constants/constants'

const initialState = {
  permissions: [],
  zoomIntegrations: []
}
export function settingsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_CANNED_RESPONSES:
      return Object.assign({}, state, {
        cannedResponses: action.data
      })
    case ActionTypes.UPDATE_ZOOM_INTEGRATIONS:
      return Object.assign({}, state, {
        zoomIntegrations: action.data
      })
    default:
      return state
  }
}
