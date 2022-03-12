import { createSlice } from '@reduxjs/toolkit'
import roleApi from '../api/roleApi'

export const initialState = {
  loading: false,
  hasErrors: false,
  roles: [],
  roleUpdate: {},
  updateMess: '',
  updateSuccess: false,
}

//slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    addRole: (state, action) => {
      state.roles.unshift(action.payload)
    },
    removeRole: (state, action) => {
      let filteredRole = state.roles.filter(
        (role) => role.Role_Id !== action.payload
      )
      state.roles = filteredRole
      state.updateSuccess = true
    },
    startLoading: (state) => {
      state.loading = true
    },
    getRoleSuccess: (state, action) => {
      state.roles = action.payload
      state.loading = false
      state.hasErrors = false
    },
    getRoleFailure: (state) => {
      state.loading = false
      state.hasErrors = true
    },
    setRoleUpdate: (state, action) => {
      state.roleUpdate = action.payload
    },
    updateRole: (state, action) => {
      const { id, data } = action.payload
      let newRoles = state.roles.map((role) =>
        role.Role_Id === id ? { Role_Id: id, ...data } : role
      )
      state.roles = newRoles
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
  addRole,
  getRoleSuccess,
  startLoading,
  getRoleFailure,
  removeRole,
} = rolesSlice.actions

const { actions } = rolesSlice

//export role
export const rolesSelector = (state) => state.roles
export const rolesUpdateSelector = (state) => state.roleUpdate

// export The reducer
const roleReducer = rolesSlice.reducer
export default roleReducer
//Actions
export const fetchRoles = () => async (dispatch) => {
  dispatch(startLoading())
  roleApi
    .getAllRole()
    .then((res) => {
      if (res.Data) {
        dispatch(getRoleSuccess(res.Data))
      }
      return res
    })
    .catch((err) => {
      dispatch(getRoleFailure())
      return err
    })
}
//create role
export const createRole = (Role) => async (dispatch) => {
  roleApi
    .createRole(Role)
    .then((res) => {
      dispatch(addRole(Role))
      return res
    })
    .catch((err) => {
      dispatch(getRoleFailure())
      alert(err.response.data.Msg)
    })
}
export const deleteRole = (id) => (dispatch) => {
  roleApi
    .delete(id)
    .then((res) => {
      dispatch(removeUpdateSuccess(res.Msg))
      dispatch(removeRole(id))
      return res
    })
    .catch((err) => {
      dispatch(getRoleFailure())
      alert(err)
    })
}
export const setState = () => async (dispatch) => {
  dispatch(deleteState())
}
export const setRoleUpdate = (role) => async (dispatch) => {
  try {
    dispatch(actions.setRoleUpdate(role))
  } catch (error) {
    dispatch(getRoleFailure())
  }
}

export const updateRole = (role) => async (dispatch) => {
  roleApi
    .updateRole(role)
    .then((res) => {
      dispatch(actions.updateRole(role))
      dispatch(actions.removeUpdateSuccess(res.Msg))
    })
    .catch((err) => {
      dispatch(getRoleFailure())
      alert(err.response.data.Msg)
    })
}
