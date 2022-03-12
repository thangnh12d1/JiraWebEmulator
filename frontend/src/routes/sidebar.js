/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/app/user-manager', // the url
    icon: 'OutlinePersonIcon', // the component being exported from icons/index.js
    name: 'User Manager', // name that appear in Sidebar
    globalRole: 'Admin',
  },
  {
    path: '/app/permission-manager',
    icon: 'ForbiddenIcon',
    name: 'Permission Project',
    globalRole: 'Trusted',
  },
  {
    path: '/app/role-manager',
    icon: 'UserIcon',
    name: 'Role Manager',
    globalRole: 'Trusted',
  },
  {
    path: '/app/workflows-manager',
    icon: 'PeopleIcon',
    name: 'Workflows Manager',
    globalRole: 'Trusted',
  },
  {
    path: '/app/customFields',
    icon: 'PagesIcon',
    name: 'CustomFields',
    globalRole: 'Trusted',
  },
  {
    path: '/app/issueTypes',
    icon: 'MoneyIcon',
    name: 'IssueTypes',
    globalRole: 'Trusted',
  },
  {
    path: '/app/status-manager',
    icon: 'PagesIcon',
    name: 'Status',
    globalRole: 'Trusted',
  },
  {
    path: '/app/Screens',
    icon: 'ModalsIcon',
    name: 'Screens',
    globalRole: 'Trusted',
  },
]
export default routes


