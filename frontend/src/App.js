/* eslint-disable no-unused-vars */
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import React, { useState, useEffect, lazy } from 'react'
// import Projects from './pages/Projects'
// import PermissionManager from './pages/PermissionManager';
// import DetailPermission from './pages/DetailPermission';
// import ProjectUserRole from './pages/ProjectUserRole';
// import { Screens } from './pages/Screens'
// import { UpdateScreenForm } from './components/Screen/UpdateScreenForm'
// import { AddScreenForm } from './components/Screen/AddScreenForm'
// import { CustomFields } from './pages/CustomFields'
// import { IssueTypes } from './pages/IssueTypes'
// import { Issues } from './pages/Issues'
// import { IssuesByProject } from './pages/IssuesByProject'
// import { UpdateCustomFieldForm } from './components/CustomField/UpdateCustomFieldForm'
// import { AddCustomFieldForm } from './components/CustomField/AddCustomFieldForm'
// import { AddIssueTypeForm } from './components/IssueType/AddIssueTypeForm'
// import { AddIssueForm } from './components/Issue/AddIssueForm'
// import { UpdateIssueForm } from './components/Issue/UpdateIssueForm'
// import { UpdateIssueTypeForm } from './components/IssueType/UpdateIssueTypeForm'
// import Users from './pages/UsersManager'
// import Roles from './pages/RolesManager'
// import CreateRole from './pages/CreateRole'
// import { ScreenCustomFields } from './pages/ScreenCustomFields'
// import { ProjectIssueTypeScreens } from './pages/ProjectIssueTypeScreens'
// import Workflows from './pages/Workflows';
// import CreateWorkflow from './pages/CreateWorkflow';
// // import CreateTransition from './pages/CreateTransition';
// import AddWorkflow from './pages/AddWorkflow';
// import CreateStatus from './pages/CreateStatus';
// import Status from './pages/StatusManager';
// import Transition from './pages/TransitionManager';
// import AddTransition from './pages/AddTransition';
// import UpdateWorkflowModal from './pages/UpdateWorkflow';
// import Profile from './pages/Profile'
// import TransitionItemForProject from './pages/TransitionManagerForProject'
import { ToastProvider } from 'react-toast-notifications';
const Layout2 = lazy(() => import('./containers/Layout'))

function App() {
  return (
    <ToastProvider
      //autoDismiss
      autoDismissTimeout={3000}
      // components={{ Toast: Snack }}
      // placement="bottom-center"
    >
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect exact from="/" to="/login" />  
          <Route path="/app" render={()=>{
            return localStorage.getItem("accessToken")? <Layout2/> : <Redirect to="/"/>
          }}/>
        </Switch>
      </Router>
    </ToastProvider>
  )
}

export default App
