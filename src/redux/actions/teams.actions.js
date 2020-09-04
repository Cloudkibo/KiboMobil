import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showTeamsList (data) {
  return {
    type: ActionTypes.SHOW_TEAMS_LIST,
    teams: data.teams,
    teamUniquePages: data.teamUniquePages,
    teamUniqueAgents: data.teamUniqueAgents
  }
}

export function loadTeamsList (data) {
  return (dispatch) => {
    callApi(dispatch, 'teams', 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showTeamsList(res.payload))
        }
      })
  }
}
