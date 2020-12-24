import * as ActionTypes from '../constants/constants'

const initialState = {
}

export function whatsAppSubscribersInfo (state = initialState, action) {
  let index = -1
  switch (action.type) {
    case ActionTypes.UPDATE_WHATSAPP_CONTACT:
      let currentContacts = state.contacts
      if (currentContacts) {
        index = currentContacts.findIndex((contact) => contact._id === action.id)
        if (index >= 0) {
          let keys = Object.keys(action.data)
          for (let i = 0; i < keys.length; i++) {
            currentContacts[index][keys[i]] = action.data[keys[i]]
          }
        }
      }
      return Object.assign({}, state, {
        contacts: currentContacts ? [...currentContacts] : currentContacts,
        timestamp: new Date().getTime()
      })
    case ActionTypes.LOAD_WHATSAPP_CONTACTS_OVERRIDE:
      return Object.assign({}, state, {
        contacts: action.data,
        count: action.count
      })
    case ActionTypes.LOAD_WHATSAPP_CONTACTS:
      return Object.assign({}, state, {
        contacts: [...state.contacts, ...action.data],
        count: action.count
      })
    case ActionTypes.UPDATE_SUBSCRIBERS_INFO_WHATSAPP:
      return Object.assign({}, state, action, action.data)
    case ActionTypes.NEW_SUBSCRIBER_WHATSAPP_EVENT:
      if (state.contacts) {
        let subscribers = JSON.parse(JSON.stringify(state.contacts))
        let count = state.count
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriber._id)
        if (index < 0) {
          count = count + 1
          subscribers = [action.data.payload.subscriber, ...state.contacts]
        }
        return Object.assign({}, state, {
          contacts: subscribers,
          count
        })
      } else {
        return state
      }
    case ActionTypes.SUBSCRIBE_WHATSAPP_EVENT:
      if (state.contacts) {
        let subscribers = JSON.parse(JSON.stringify(state.contacts))
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriber_id)
        if (index >= 0) {
          subscribers[index].isSubscribed = true
        }
        return Object.assign({}, state, {
          contacts: subscribers
        })
      } else {
        return state
      }
    case ActionTypes.UNSUBSCRIBE_WHATSAPP_EVENT:
      if (state.contacts) {
        let subscribers = JSON.parse(JSON.stringify(state.contacts))
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriber_id)
        if (index >= 0) {
          subscribers[index].isSubscribed = false
        }
        return Object.assign({}, state, {
          contacts: subscribers
        })
      } else {
        return state
      }
    case ActionTypes.UPDATE_SUBSCRIBER_WHATSAPP_EVENT:
      if (state.contacts) {
        let subscribers = JSON.parse(JSON.stringify(state.contacts))
        let index = subscribers.findIndex(s => s._id === action.data.payload.subscriberId)
        if (index >= 0) {
          subscribers[index].name = action.data.payload.name
        }
        return Object.assign({}, state, {
          contacts: subscribers
        })
      } else {
        return state
      }
    case ActionTypes.BACKGROUND_DATA_FETCH_WHATSAPP:
      return Object.assign({}, state, {
        backgroundDataFetchWhatsApp: true
      })
    default:
      return state
  }
}
