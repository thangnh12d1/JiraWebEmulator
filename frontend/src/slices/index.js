
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './users'
import projectReducer from './projects'
import screenReducer from './screens'
import customFieldReducer from './customFields'
import screenCustomFieldReducer from './screenCustomFields'
import projectIssueTypeScreenReducer from './projectIssueTypeScreens'
import issueTypeReducer from './issueTypes'
import issueReducer from './issues'
import roleReducer from './roles'

import permissionsReducer from './permission'
import permissionRolesReducer from './per-role'
import projectUserRoleReducer from './pro-user-role'

import workflowReducer from './workflows'
import transitionReducer from './transition'
import workflowProjectsReducer from './wor-pro'

import statusReducer from './statuss'
import transitionStatussReducer from './tra-sta'
import inforuserReducer from './infouser'
const rootReducer = combineReducers({
  users: userReducer,
  projects: projectReducer,
  screens: screenReducer,
  customFields: customFieldReducer,
  screenCustomFields: screenCustomFieldReducer,
  projectIssueTypeScreens: projectIssueTypeScreenReducer,
  issueTypes: issueTypeReducer,
  issues: issueReducer,
  roles: roleReducer,
  permissions: permissionsReducer,
  permissionroles: permissionRolesReducer,
  projectUserRoles: projectUserRoleReducer,
  workflows: workflowReducer,
  transitions: transitionReducer,
  workflowprojects: workflowProjectsReducer, 
  statuss: statusReducer,
  transitionstatuss: transitionStatussReducer,
  inforuser:inforuserReducer

})
export default rootReducer

