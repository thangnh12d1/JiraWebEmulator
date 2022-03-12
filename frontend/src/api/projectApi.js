import axiosClient from "./axiosClient";

const url = 'projects/'

const projectApi = {
  getAll: () => axiosClient.get(url),
  create: (data) => axiosClient.post(url, data),
  update: ({key, data}) => axiosClient.put(url + key, data),
  delete: (key) => axiosClient.delete(url + key),
  getDataByIdWorkflow: (key) => axiosClient.get(url + key),
  GetProjectKey: () => axiosClient.get('projects/projectkey'),
}

export default projectApi;