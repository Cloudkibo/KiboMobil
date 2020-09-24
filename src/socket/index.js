/**
 * Created by sojharo on 20/08/2017.
 */
import io from 'socket.io-client'
import { setSocketStatus } from '../redux/actions/basicInfo.actions'
import { socketUpdate, updateSessions } from './../redux/actions/liveChat.actions'
import { handleSubscribers } from './subscribers'
import { handleSocketEvent, handleSocketEventWhatsapp, handleSocketEventSubscribers, handleSocketEventSubscribersWhatsApp } from '../redux/actions/socket.actions'
const whatsAppActions = require('./../redux/actions/whatsAppChat.actions')
const socket = io('https://kibochat.cloudkibo.com')
let store

var joined = false
var myId = ''

var callbacks = {
  new_chat: false
}

export function registerAction (callback) {
  callbacks[callback.event] = callback.action
}

export function initiateSocket (storeObj) {
  store = storeObj
  socket.connect()
}

socket.on('connect', () => {
  if (myId !== '') {
    joinRoom(myId)
  }
  store.dispatch(setSocketStatus(true))
})

socket.on('disconnect', () => {
  joined = false
  store.dispatch(setSocketStatus(false))
})

socket.on('new_chat', (data) => {
  store.dispatch(socketUpdate(data))
})

socket.on('message', (data) => {
  console.log('socket called', data.action)
  if (['Messenger_new_subscriber', 'new_chat'].includes(data.action)) {
    handleSubscribers(store, data)
  }
  // if (['new_chat', 'agent_replied', 'session_pending_response', 'unsubscribe', 'session_status'].includes(data.action)) {
  //   if (data.action === 'new_chat') data.showNotification = true
  //   store.dispatch(handleSocketEvent(data))
  // } else if (data.action === 'session_assign') {
  //   store.dispatch(updateSessions(data.payload.data))
  // } else if (data.action === 'new_session_created_whatsapp') {
  //   store.dispatch(whatsAppActions.updateWhatspSessions(data.payload))
  // }
  // if (['new_chat_whatsapp', 'agent_replied_whatsapp', 'session_pending_response_whatsapp', 'unsubscribe_whatsapp', 'session_status_whatsapp', 'new_session_created_whatsapp', 'message_delivered_whatsApp', 'message_seen_whatsApp'].includes(data.action)) {
  //   if (data.action === 'new_chat_whatsapp') data.showNotification = true
  //   store.dispatch(handleSocketEventWhatsapp(data))
  // }
  // if (['new_subscriber'].includes(data.action)) {
  //   store.dispatch(handleSocketEventSubscribers(data))
  // }
  // if (['new_subscriber_whatsapp'].includes(data.action)) {
  //   store.dispatch(handleSocketEventSubscribersWhatsApp(data))
  // }
  if (callbacks[data.action]) {
    console.log('callback')
    callbacks[data.action](data.payload)
  }
})

export function log (tag, data) {
  socket.emit('logClient', {
    tag,
    data
  })
}

export function joinRoom (data) {
  console.log('Trying to join room socket', data)
  myId = data
  if (joined) {
    return
  }
  socket.emit('message', {
    action: 'join_room',
    room_id: data
  })
  joined = true
}
