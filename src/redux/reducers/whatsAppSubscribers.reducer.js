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
    default:
      return state
  }
}
