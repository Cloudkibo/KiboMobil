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
        console.log('index', index)
        if (index >= 0) {
          let keys = Object.keys(action.data)
          for (let i = 0; i < keys.length; i++) {
            currentContacts[index][keys[i]] = action.data[keys[i]]
          }
        }
      }
      return Object.assign({}, state, {
        contacts: currentContacts ? [...currentContacts] : currentContacts
      })
    case ActionTypes.LOAD_WHATSAPP_CONTACTS_LIST:
      return Object.assign({}, state, {
        contacts: action.contacts,
        count: action.count
      })
    default:
      return state
  }
}
