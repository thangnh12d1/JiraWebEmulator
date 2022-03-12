import axiosClient from './axiosClient'

const transitionApi = {
  getAllTransition: () => axiosClient.get("/transitions/"),
  delete: (id) => axiosClient.delete("/transitions?id=" + id),
  createTransition: (data) => axiosClient.post("/transitions",data),
  updateTransition:({id,data}) => axiosClient.put("/transitions?id="+id,data),
  getDataByIdWorkflow: (id) => axiosClient.get("/transitions?id=" + id),
  addStatusToTransition: (data) => axiosClient.post("transition",data),
  getTransitionStatus: (id) => axiosClient.get("transition/transition-status?id="+id),
  deleteStatusInTransition: (idtransition,idstatus2) => axiosClient.delete("transition/delete-transition?idtransition="+idtransition+"&idstatus="+idstatus2),
  // login: (body) => axiosClient.post(url, body),
    // create: (data) => axiosClient.post(urlCreateuser, data),
    // update: ({id, data}) => axiosClient.put("/users/admin/update-user?id=" + id, data),
    // delete: (id) => axiosClient.delete("users/delete-user?id=" + id),
   //http://localhost:5001/api/transitions?id=102
    // getMe = async (payload) => {
    //   const url = '/me';
    //   const response = await axiosClient.get(url, payload);
    //   return response.data;
    // }
  }
  export default transitionApi
