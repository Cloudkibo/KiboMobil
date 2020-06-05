import * as ActionTypes from '../constants/constants'

export function teamsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_TEAMS_LIST:
      return Object.assign({}, state, {
        teams: action.teams,
        teamUniquePages: action.teamUniquePages,
        teamUniqueAgents: action.teamUniqueAgents,
        teamPages: [],
        teamAgents: []
      })
    default:
      return state
  }
}
