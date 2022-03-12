import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
import UsersManager from '../pages/UsersManager'
import CreateUser from '../pages/CreateUser'
import PermissionManager from '../pages/PermissionManager'
import DetailPermission from '../pages/DetailPermission'
import RolesManager from '../pages/RolesManager'
import CreateRole from '../pages/CreateRole'
import ProjectUserRole from '../pages/ProjectUserRole'
import TransitionItemForProject from '../pages/TransitionManagerForProject'
import { Issues } from '../pages/Issues'
import { ViewIssue } from '../pages/ViewIssue'
import { IssuesByProject } from '../pages/IssuesByProject'
import { Screens } from '../pages/Screens'
import { ScreenCustomFields } from '../pages/ScreenCustomFields'
import Workflows from '../pages/Workflows'
import { CustomFields } from '../pages/CustomFields'
import { IssueTypes } from '../pages/IssueTypes'
import Status from '../pages/StatusManager'
import AddWorkflow from '../pages/AddWorkflow'
import CreateWorkflow from '../pages/CreateWorkflow'
import Transition from '../pages/TransitionManager'
import { ProjectIssueTypeScreens } from '../pages/ProjectIssueTypeScreens'
import CreateStatus from '../pages/CreateStatus'
import Profile from '../pages/Profile'
import AddTransition from '../pages/AddTransition'
import Projects from '../pages/Projects'
import viewDiagram from '../pages/viewDiagram'

// const Modals = lazy(() => import('../pages/Modals'))
// const Tables = lazy(() => import('../pages/Tables'))
// // const Page404 = lazy(() => import('../pages/404'))
// const Blank = lazy(() => import('../pages/Blank'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/user-manager', // the url
    component: UsersManager, // view rendered
    globalRole: 'Admin',
  },
  {
    path: '/user-manager/create-user',
    component: CreateUser,
    globalRole: 'Admin',
  },
  {
    path: '/permission-manager',
    component: PermissionManager,
    globalRole: 'Trusted',
  },
  {
    path: '/permission-manager/detail-permission',
    component: DetailPermission,
    globalRole: 'Trusted',
  },
  {
    path: '/role-manager',
    component: RolesManager,
    globalRole: 'Trusted',
  },
  {
    path: '/role-manager/create-role',
    component: CreateRole,
    globalRole: 'Trusted',
  },
  {
    path: '/projects',
    component: Projects,
    globalRole: 'Member',
  },
  {
    path: '/project-user/:keyProject-:nameProject',
    component: ProjectUserRole,
    globalRole: 'Member',
  },
  {
    path: '/transitionsforproject-manager',
    component: TransitionItemForProject,
    globalRole: 'Member',
  },
  {
    path: '/workflows-manager/transitions-manager/create-transitions',
    component: AddTransition,
    globalRole: 'Trusted',
  },
  {
    path: '/workflows-manager/transitions-manager/view-diagram',
    component: viewDiagram,
    globalRole: 'Trusted',
  },
  {
    path: '/issues',
    component: Issues,
    globalRole: 'Member',
  },
  {
    path: '/IssuesByProject/:project',
    component: IssuesByProject,
    globalRole: 'Member',
  },
  {
    path: '/viewIssue/:key',
    component: ViewIssue,
    globalRole: 'Member',
  },
  {
    path: '/Screens',
    component: Screens,
    globalRole: 'Trusted',
  },
  {
    path: '/screenCustomFields/:screenId',
    component: ScreenCustomFields,
    globalRole: 'Trusted',
  },
  {
    path: '/customFields',
    component: CustomFields,
    globalRole: 'Trusted',
  },
  {
    path: '/issueTypes',
    component: IssueTypes,
    globalRole: 'Trusted',
  },
  {
    path: '/issueTypes/projectIssueTypeScreens/:issueTypeId',
    component: ProjectIssueTypeScreens,
    globalRole: 'Member',
  },
  {
    path: '/status-manager',
    component: Status,
    globalRole: 'Trusted',
  },
  {
    path: '/status-manager/create-status',
    component: CreateStatus,
    globalRole: 'Trusted',
  },
  {
    path: '/workflows-manager',
    component: Workflows,
    globalRole: 'Trusted',
  },
  {
    path: '/workflows-manager/add-workflows',
    component: AddWorkflow,
    globalRole: 'Trusted',
  },
  {
    path: '/workflows-manager/create-workflows',
    component: CreateWorkflow,
    globalRole: 'Trusted',
  },
  {
    path: '/workflows-manager/transitions-manager',
    component: Transition,
    globalRole: 'Trusted',
  },
  {
    path: '/profile',
    component: Profile,
    globalRole: 'Member',
  },
]

export default routes
