import * as ActionTypes from '../constants/constants'

export function subscribersInfo (state = {}, action) {
  let subscribers = state.subscribers
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
    case ActionTypes.FETCH_SUBSCRIBERS_SEARCH_OVERRIDE:
      return Object.assign({}, state, {
        searchedSubscribers: action.data,
        searchedCount: action.count
      })
    case ActionTypes.FETCH_SUBSCRIBERS_SEARCH:
      return Object.assign({}, state, {
        searchedSubscribers: [...state.searchedSubscribers, ...action.data],
        searchedCount: action.count
      })
    case ActionTypes.UPDATE_SUBSCRIBER_PICTURE:
      if (subscribers) {
        let subscriberIndex = subscribers.findIndex(s => s._id === action.subscriberId)
        subscribers[subscriberIndex].profilePic = action.profilePic
        return Object.assign({}, state, {
          subscribers: [...subscribers],
          timestamp: new Date().getTime()
        })
      } else {
        return state
      }
    case ActionTypes.UPDATE_SUBSCRIBERS_INFO:
      return Object.assign({}, state, action, action.data)
    case ActionTypes.NEW_SUBSCRIBER_EVENT:
      console.log('new subscriber reducer', action.data)
      return Object.assign({}, state, {
      })
    default:
      return state
  }
}
