import permissionApi from '../api/permissionApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErrors: false,
  permissionroles: [],
  permissionUpdate: {},
  updateMess: '',
  updateSuccess: false,
}
const permissionrolesSlice = createSlice({
  name: 'permissionroles',
  initialState,
  reducers: {
    addRoleToPermission: (state, action) => {
      state.permissionroles.unshift(action.payload)
    },
    startLoading: (state) => {
      state.loading = true
    },
    getPermissionsRolesSuccess: (state, action) => {
      state.permissionroles = action.payload
      state.loading = false
      state.hasErrors = false
    },
    getPermissionRolesFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    removeRole: (state, action) => {
      let filteredRole = state.permissionroles.filter(
        (permissionroles) => permissionroles.RoleId !== action.payload
      )
      state.permissionroles = filteredRole
      state.updateSuccess = true
    },
    removeUpdateSuccess: (state, action) => {
      state.updateMess = action.payload
      state.updateSuccess = true
    },
    deleteState: (state) => {
      state.updateSuccess = false
      state.updateMess = {}
    },
  },
})

const {
  deleteState,
  removeUpdateSuccess,
  addRoleToPermission,
  startLoading,
  removeRole,
  getPermissionsRolesSuccess,
  getPermissionRolesFailure,
} = permissionrolesSlice.actions

const { actions } = permissionrolesSlice
export const permissionRolesSelector = (state) => state.permissionroles

const permissionRolesReducer = permissionrolesSlice.reducer
export default permissionRolesReducer
//
export const fetchPermissionRoles = (id) => async (dispatch) => {
  dispatch(startLoading())
  permissionApi
    .getPrmissionRole(id)
    .then((res) => {
      if (!res.Data) dispatch(getPermissionsRolesSuccess([]))
      if (res.Data) dispatch(getPermissionsRolesSuccess(res.Data))
    })
    .catch((err) => {
      dispatch(getPermissionRolesFailure())
      return err
    })
}
//add role
export const AddRoleToPermission = (data) => async (dispatch) => {
  permissionApi
    .addRoleToPermission(data)
    .then((res) => {
      dispatch(addRoleToPermission(data))
      dispatch(removeUpdateSuccess(res.Msg))
    })
    .catch((err) => {
      alert(err.response.data.Msg)
      dispatch(getPermissionRolesFailure())
    })
}
export const deleteRoleInPermission =
  (idpermission, idrole) => async (dispatch) => {
    permissionApi
      .deleteRoleInPermission(idpermission, idrole)
      .then((res) => {
        dispatch(removeUpdateSuccess(res.Msg))
        dispatch(removeRole(idrole))
        
      })
      .catch((err) => {
        alert(err)
      })
  }
export const setState = () => async (dispatch) => {
  dispatch(deleteState())
}