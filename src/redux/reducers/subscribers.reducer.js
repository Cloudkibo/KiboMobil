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
        if (subscribers[subscriberIndex]) {
          subscribers[subscriberIndex].profilePic = action.profilePic
        }
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
      if (state.subscribers) {
        let subscribers = JSON.parse(JSON.stringify(state.subscribers))
        let count = state.count
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriber._id)
        if (index < 0) {
          count = count + 1
          subscribers = [action.data.payload.subscriber, ...state.subscribers]
        }
        return Object.assign({}, state, {
          subscribers,
          count
        })
      } else {
        return state
      }
    case ActionTypes.SUBSCRIBE_EVENT:
      if (state.subscribers) {
        let subscribers = JSON.parse(JSON.stringify(state.subscribers))
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriber_id)
        if (index >= 0) {
          subscribers[index].isSubscribed = true
        }
        return Object.assign({}, state, {
          subscribers
        })
      } else {
        return state
      }
    case ActionTypes.UNSUBSCRIBE_EVENT:
      if (state.subscribers) {
        let subscribers = JSON.parse(JSON.stringify(state.subscribers))
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriber_id)
        if (index >= 0) {
          subscribers[index].isSubscribed = false
        }
        return Object.assign({}, state, {
          subscribers
        })
      } else {
        return state
      }
    case ActionTypes.DISCONNECT_FB_PAGE_EVENT:
      return Object.assign({}, state, {
        shouldFetchSubscribers: true
      })
    case ActionTypes.CONNECT_FB_PAGE_EVENT:
      return Object.assign({}, state, {
        shouldFetchSubscribers: true
      })
    case ActionTypes.BACKGROUND_DATA_FETCH:
      return Object.assign({}, state, {
        backgroundDataFetch: true
      })
    default:
      return state
  }
}
