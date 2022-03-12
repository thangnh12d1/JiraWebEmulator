import { Refresh } from '@material-ui/icons'
import axiosClient from './axiosClient'

const url = 'users/'
const urlCreateuser = 'users/sign-up'

const userApi = {
  getAll: () => axiosClient.get(url),
  login: (body) => axiosClient.post(url, body),
  create: (data) => axiosClient.post(urlCreateuser, data),
  update: ({ id, data }) =>
    axiosClient.put('/users/admin/update-user?id=' + id, data),
  delete: (id) => axiosClient.delete('/users/delete-user?id=' + id),
  logout: () => axiosClient.post('/users/logout'),
  refresh: (body) => axiosClient.post('users/refresh', body),
  infoUser: (id) => axiosClient.get('users/info-user-id?id=' + id),
  infoUserByToken: () => axiosClient.get('users/info-user'),
  // getMe = async (payload) => {
  //   const url = '/me';
  //   const response = await axiosClient.get(url, payload);
  //   return response.data;
  // }
}

export default userApi
