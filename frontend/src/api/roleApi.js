import axiosClient from './axiosClient'

const roleApi = {
  getAllRole: () => axiosClient.get("/roles/"),
  delete: (id) => axiosClient.delete("/roles?id=" + id),
  createRole: (data) => axiosClient.post("/roles",data),
  updateRole:({id,data}) => axiosClient.put("/roles?id="+id,data)
 
  }
  export default roleApi
