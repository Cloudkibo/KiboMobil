import { combineReducers } from 'redux'

import {dashboardInfo} from './dashboard.reducer'
import {basicInfo} from './basicInfo.reducer'
import {pagesInfo} from './pages.reducer'
import {subscribersInfo} from './subscribers.reducer'
import {liveChat} from './liveChat.reducer.js'

const appReducer = combineReducers({
  dashboardInfo,
  basicInfo,
  pagesInfo,
  subscribersInfo,
  liveChat
})

export default appReducer
