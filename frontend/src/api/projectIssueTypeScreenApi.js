import axiosClient from "./axiosClient";

const url = 'project-issue-type-screens/'

const projectIssueTypeScreenApi = {
  getAll: () => axiosClient.get(url),
  create: (data) => axiosClient.post(url, data),
  update: (id, data) => axiosClient.put(url + id, data),
  delete: (id) => axiosClient.delete(url + id),
}

export default projectIssueTypeScreenApi;