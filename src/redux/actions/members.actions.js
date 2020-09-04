import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateMembersList (data) {
  return {
    type: ActionTypes.LOAD_MEMBERS,
    data: data.payload
  }
}

export function loadMembersList () {
  return (dispatch) => {
    callApi(dispatch, 'company/members').then(res => dispatch(updateMembersList(res)))
  }
}
