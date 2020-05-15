/**
 * Created by sojharo on 26/07/2017.
 */

import fetch from 'isomorphic-fetch'
import _ from 'lodash'
// import auth from './auth.service'
import { AsyncStorage } from 'react-native'
import {apiUrls} from './api.urls'

export const API_URL = '/api'

export default async function callApi (endpoint, method = 'get', body, type = 'kibochat') {
  let headers = {
    'content-type': 'application/json'
  }
  const token = await AsyncStorage.getItem('token')
  if (token) {
    headers = _.merge(headers, {
      Authorization: `Bearer ${token}`
    })
  }
  let fetchUrl = ''
  fetchUrl = `${apiUrls[type]}/${endpoint}`
  return fetch(fetchUrl, {
    headers,
    method,
    body: JSON.stringify(body)
  }).then(response => {
    if (response.statusText === 'Unauthorized') {
      // auth.logout()
      // this.props.history.push('/')
      return Promise.reject(response.statusText)
    }
    return response
  }).then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return json
    })
    .then(
      response => response,
      error => error
    )
}
