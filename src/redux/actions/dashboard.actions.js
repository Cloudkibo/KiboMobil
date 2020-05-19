import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateDashboard (data) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD,
    data
  }
}

export function loadDashboardData () {
  return (dispatch) => {
    callApi('dashboard/stats')
      .then(res => {
        dispatch(updateDashboard(res.payload))
      })
  }
}
