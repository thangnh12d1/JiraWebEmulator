import axiosClient from './axiosClient'

const workflowApi = {
  getAllWorkflow: () => axiosClient.get("/workflows/"),
  getById: (id) => axiosClient.get("/workflows?id=" + id),
  delete: (id) => axiosClient.delete("/workflow?id=" + id),
  createWorkflow: (data) => axiosClient.post("/workflow",data),
  updateWorkflow:({id,data}) => axiosClient.put("/workflow?id="+id,data),
  addProjectToWorkflow: (data) => axiosClient.post("workflows",data),
  getWorkflowProject: (id) => axiosClient.get("workflow/workflow-project?id="+id),
  deleteProjectInWorkflow: (idworkflow,idproject) => axiosClient.delete("workflows/delete-project?idworkflow="+idworkflow+"&idrow="+idproject),
    // login: (body) => axiosClient.post(url, body),
    // create: (data) => axiosClient.post(urlCreateuser, data),
    // update: ({id, data}) => axiosClient.put("/users/admin/update-user?id=" + id, data),
    // delete: (id) => axiosClient.delete("users/delete-user?id=" + id),
   //http://localhost:5001/api/workflows?id=102
    // getMe = async (payload) => {
    //   const url = '/me';
    //   const response = await axiosClient.get(url, payload);
    //   return response.data;
    // }
  }
  export default workflowApi
