import axiosClient from './axiosClient'

const permissionApi = {
    getAllPermission: () => axiosClient.get("permission/"),
    getPrmissionRole: (id) => axiosClient.get("permission/permission-role?id="+id),
    deleteRoleInPermission: (idpermission,idrole) => axiosClient.delete("permission/delete-role?idpermission="+idpermission+"&idrow="+idrole),
    addRoleToPermission: (data) => axiosClient.post("permission",data)
}
export default permissionApi