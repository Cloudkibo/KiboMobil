import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateSubscribers (payload, data) {
  if (data.first_page === 'first') {
    return {
      type: ActionTypes.FETCH_SUBSCRIBERS_OVERRIDE,
      data: payload.subscribers,
      count: payload.count
    }
  } else {
    return {
      type: ActionTypes.FETCH_SUBSCRIBERS,
      data: payload.subscribers,
      count: payload.count
    }
  }
}

export function fetchSubscribers (data, callback) {
  return (dispatch) => {
    callApi('subscribers/getAll', 'post', data).then(res => {
      callback()
      dispatch(updateSubscribers(res.payload, data))
    })
  }
}
