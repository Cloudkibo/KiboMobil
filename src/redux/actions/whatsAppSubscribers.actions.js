import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showContacts (payload, data) {
  if (data.first_page === 'first') {
    return {
      type: ActionTypes.LOAD_WHATSAPP_CONTACTS_OVERRIDE,
      data: payload.contacts,
      count: payload.count
    }
  } else {
    return {
      type: ActionTypes.LOAD_WHATSAPP_CONTACTS,
      data: payload.contacts,
      count: payload.count
    }
  }
}

export function updateContact (id, data) {
  return {
    type: ActionTypes.UPDATE_WHATSAPP_CONTACT,
    id,
    data
  }
}

export function loadWhatsAppContactsList (data, prepareExport) {
  return (dispatch) => {
    callApi(dispatch, 'whatsAppContacts', 'post', data)
      .then(res => {
        dispatch(showContacts(res.payload, data))
        if (prepareExport) {
          prepareExport(res)
        }
      })
  }
}
export function editSubscriberWhatsApp (id, data, callback) {
  return (dispatch) => {
    callApi(dispatch, `whatsAppContacts/update/${id}`, 'post', data)
      .then(res => {
        dispatch(updateContact(id, data))
        callback(res)
      })
  }
}
