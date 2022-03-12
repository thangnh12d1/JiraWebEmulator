import ProjectUserRoleApi from '../api/pro-user-roleApi'
import UserApi from '../api/userApi'

import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErroes: false,
  projectUserRoles: [],
  projectUserRoleUpdate: {},
  updateMess: '',
  updateSuccess: false,
}
const projectUserRolesSlice = createSlice({
  name: 'projectUserRoles',
  initialState,
  reducers: {
    addUserToProject: (state, action) => {
      state.projectUserRoles.unshift(action.payload)
    },
    removeUserProject: (state, action) => {
      let filteredUser = state.projectUserRoles.filter(
        (user) => user.UserId !== action.payload
      )
      state.projectUserRoles = filteredUser
      state.updateSuccess = true
    },
    startLoading: (state) => {
      state.loading = true
    },
    getFailure: (state) => {
      state.loading = false
      state.hasErrors = true
    },
    getProjectUserRoleSuccess: (state, action) => {
      state.projectUserRoles = action.payload
      state.loading = false
      state.hasErrors = false
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
  addUserToProject,
  startLoading,
  getFailure,
  getProjectUserRoleSuccess,
  removeUserProject,
} = projectUserRolesSlice.actions

export const projectUserRolesSelector = (state) => state.projectUserRoles
export const projectUserRolesUpdateSelector = (state) =>
  state.projectUserRoleUpdate

const projectUserRoleReducer = projectUserRolesSlice.reducer
export default projectUserRoleReducer

export const fetchProjectUserRole = (key) => async (dispatch) => {
  dispatch(startLoading())
  ProjectUserRoleApi.getAllUserRoleInProject(key)
    .then((res) => {
      if (!res.Data) dispatch(getProjectUserRoleSuccess([]))
      if (res.Data) dispatch(getProjectUserRoleSuccess(res.Data))
    })
    .catch((err) => {
      dispatch(getFailure())
      alert(err.response.data.Msg)
    })
}
//add user role to project
export const AddUserToProject = (data) => async (dispatch) => {
  ProjectUserRoleApi.addUserRoleToProject(data)
    .then(async (res) => {
      console.log(res.Msg)
      if (res.Msg == 'Add User Success') {
        await UserApi.infoUser(data.userId).then((user) => {
          console.log(user.Data)
          let newuser = {
            UserId: user.Data.User_Id,
            UserName: user.Data.User_Name,
            UserMail: user.Data.User_Email,
            RoleName: data.RoleName,
          }
          dispatch(addUserToProject(newuser))
          dispatch(removeUpdateSuccess(res.Msg))
        })
      }
      return res
    })
    .catch((err) => {
      dispatch(getFailure())
      alert(err.response.data.Msg)
    })
}

//delete
export const deleteUser = (data) => async (dispatch) => {
  ProjectUserRoleApi.deleteUserProject(data)
    .then((res) => {
      dispatch(removeUpdateSuccess(res.Msg))
      dispatch(removeUserProject(data.UserId))
    })
    .catch((err) => {
      dispatch(getFailure())
      alert(err.response.data.Msg)
    })
}

export const setState = () => async (dispatch) => {
  dispatch(deleteState())
}
