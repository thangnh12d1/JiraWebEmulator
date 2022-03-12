import permissionApi from '../api/permissionApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErrors: false,
  permissions: [],
  permissionUpdate: {},
}
//A slice
const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true
    },

    getPermissionsSuccess: (state, action) => {
      state.permissions = action.payload
      state.loading = false
      state.hasErrors = false
    },

    getPermissionsFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    setPermissionUpdate: (state, action) => {
      state.permissionUpdate = action.payload
    },
    updatePermission: (state, action) => {
      const { id, data } = action.payload
      let newPermissions = state.permissions.map((permission) =>
        permission.PermissionId === id
          ? { PermissionId: id, ...data }
          : permission
      )
      state.permissions = newPermissions
    },
  },
})

const { startLoading, getPermissionsSuccess, getPermissionsFailure } =
  permissionsSlice.actions
const { actions } = permissionsSlice

export const permissionsSelector = (state) => state.permissions
export const permissionsUpdateSelector = (state) => state.permissionUpdate

// export const permissionUpdateSelector = (state) => state.permissionUpdate

const permissionsReducer = permissionsSlice.reducer
export default permissionsReducer

//actions
export const fetchPermissions = () => async (dispatch) => {
  dispatch(startLoading())
  permissionApi
    .getAllPermission()
    .then((res) => {
      if (res.Data) dispatch(getPermissionsSuccess(res.Data))
    })
    .catch((err) => {
      dispatch(getPermissionsFailure())
      return err
    })
}

export const setPermissionUpdate = (permission) => async (dispatch) => {
  try {
    dispatch(actions.setPermissionUpdate(permission))
  } catch (error) {
    dispatch(getPermissionsFailure())
  }
}

export const updateUser = (data) => async (dispatch) => {
  userApi
    .update(data)
    .then((res) => {
      dispatch(actions.updateUser(data))
      return res
    })
    .catch((err) => {
      dispatch(getPermissionsFailure())
      return err
    })
}
