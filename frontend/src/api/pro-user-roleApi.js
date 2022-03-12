import axiosClient from './axiosClient'

const ProjectUserRoleApi = {
  getAllUserRoleInProject: (key) =>
    axiosClient.get('/project-user-role?key=' + key),
  addUserRoleToProject: (data) => axiosClient.post('/project-user-role', data),
  updateRoleUserInProject: (data) =>
    axiosClient.put('/project-user-role', data),
  deleteUserProject: (data) =>
    axiosClient.delete(
      '/project-user-role?ProjectKey=' +
        data.ProjectKey +
        '&UserId=' +
        data.UserId
    ),
  
}
export default ProjectUserRoleApi