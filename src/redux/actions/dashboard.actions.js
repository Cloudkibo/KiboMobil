import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateDashboardInfo (data) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD_INFO,
    data
  }
}

export function updateDashboard (data) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD,
    data
  }
}

export function loadDashboardData () {
  return (dispatch) => {
    callApi(dispatch, 'dashboard/stats')
      .then(res => {
        dispatch(updateDashboard(res.payload))
      })
  }
}

export function clearDashboardData () {
  return (dispatch) => {
    dispatch(updateDashboard(null))
  }
}
