import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showcannedResponses (data) {
    return {
      type: ActionTypes.GET_CANNED_RESPONSES,
      data
    }
  }
  
export function loadcannedResponses () {
    return (dispatch) => {
      callApi('cannedResponses')
        .then(res => {
          if (res.status === 'success') {
            dispatch(showcannedResponses(res.payload))
          } else {
            console.log('failed to fetch canned messages')
          }
        })
    }
  }

