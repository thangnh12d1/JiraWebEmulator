import axiosClient from "./axiosClient";

const url = 'issues/'

const issueApi = {
  getAll: () => axiosClient.get(url),
  init: () => axiosClient.get(url + "init"),
  create: (data) => axiosClient.post(url, data),
  update: (id, data) => axiosClient.put(url + id, data),
  delete: (id) => axiosClient.delete(url + id),
  getCustomFields: (id) => axiosClient.get(url +"getCustomFields/" + id),
  getUserList: (project) => axiosClient.get(url +"getUserList/" + project),
}

export default issueApi;