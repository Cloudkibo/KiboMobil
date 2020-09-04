/**
 * Created by sojharo on 26/07/2017.
 */

import fetch from 'isomorphic-fetch'
import _ from 'lodash'
// import auth from './auth.service'
import { AsyncStorage } from 'react-native'
import {apiUrls} from './api.urls'
import * as RootNavigation from '../rootNavigation.js'
export const API_URL = '/api'

export default async function callApi (dispatch, endpoint, method = 'get', body, type = 'kibochat') {
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
    if (response.status === 401) {
      AsyncStorage.removeItem('token')
      RootNavigation.navigate('Sign In')
      return Promise.reject(new Error('Unauthorized'))
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
