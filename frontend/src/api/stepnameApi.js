import axiosClient from './axiosClient'

const stepnameApi = {
  getAllStepname: () => axiosClient.get("/stepnames/"),
  delete: (id) => axiosClient.delete("/stepnames?id=" + id),
  createStepname: (data) => axiosClient.post("/stepnames",data),
  updateStepname:({id,data}) => axiosClient.put("/stepnames?id="+id,data),
  getDataByIdWorkflow: (id) => axiosClient.get("/stepnames?id=" + id),
  addTransitionToStepname: (data) => axiosClient.post("stepname",data),
  getStepnameTransition: (id) => axiosClient.get("stepname/stepname-transition?id="+id),
  deleteTransitionInStepname: (idstepname,idtransition) => axiosClient.delete("stepname/delete-transition?idstepname="+idstepname+"&idproject="+idtransition),
    // login: (body) => axiosClient.post(url, body),
    // create: (data) => axiosClient.post(urlCreateuser, data),
    // update: ({id, data}) => axiosClient.put("/users/admin/update-user?id=" + id, data),
    // delete: (id) => axiosClient.delete("users/delete-user?id=" + id),
   //http://localhost:5001/api/stepnames?id=102
    // getMe = async (payload) => {
    //   const url = '/me';
    //   const response = await axiosClient.get(url, payload);
    //   return response.data;
    // }
  }
  export default stepnameApi
