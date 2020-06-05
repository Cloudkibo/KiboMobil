import { combineReducers } from 'redux'

import {dashboardInfo} from './dashboard.reducer'
import {basicInfo} from './basicInfo.reducer'
import {pagesInfo} from './pages.reducer'
import {subscribersInfo} from './subscribers.reducer'
import {liveChat} from './liveChat.reducer.js'
import {membersInfo} from './members.reducer.js'
import {teamsInfo} from './teams.reducer.js'

const appReducer = combineReducers({
  dashboardInfo,
  basicInfo,
  pagesInfo,
  subscribersInfo,
  liveChat,
  membersInfo,
  teamsInfo
})

export default appReducer
