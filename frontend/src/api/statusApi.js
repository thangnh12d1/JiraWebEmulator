import axiosClient from './axiosClient'

const statusApi = {
  getAllStatus: () => axiosClient.get("/statuss/"),
  delete: (id) => axiosClient.delete("/statuss?id=" + id),
  createStatus: (data) => axiosClient.post("/statuss",data),
  updateStatus:({id,data}) => axiosClient.put("/statuss?id="+id,data)
    // login: (body) => axiosClient.post(url, body),
    // create: (data) => axiosClient.post(urlCreateuser, data),
    // update: ({id, data}) => axiosClient.put("/users/admin/update-user?id=" + id, data),
    // delete: (id) => axiosClient.delete("users/delete-user?id=" + id),
   //http://localhost:5001/api/Statuss?id=102
    // getMe = async (payload) => {
    //   const url = '/me';
    //   const response = await axiosClient.get(url, payload);
    //   return response.data;
    // }
  }
  export default statusApi
