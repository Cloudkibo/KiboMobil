import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showContacts (data) {
  return {
    type: ActionTypes.LOAD_WHATSAPP_CONTACTS_LIST,
    contacts: data.contacts,
    count: data.count
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
  console.log('data for loadWhatsAppContactsList', data)
  return (dispatch) => {
    callApi('whatsAppContacts', 'post', data)
      .then(res => {
        console.log('response from loadWhatsAppContactsList', res)
        dispatch(showContacts(res.payload))
        if (prepareExport) {
          prepareExport(res)
        }
      })
  }
}
export function editSubscriberWhatsApp (id, data, callback) {
  console.log('data for editSubscriber', data)
  return (dispatch) => {
    callApi(`whatsAppContacts/update/${id}`, 'post', data)
      .then(res => {
        console.log('response from editSubscriber', res)
        dispatch(updateContact(id, data))
        callback(res)
      })
  }
}
