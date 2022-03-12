import workflowApi from '../api/workflowApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErrors: false,
  workflowprojects: [],
  workflowUpdate: {},
}
const workflowprojectsSlice = createSlice({
  name: 'workflowprojects',
  initialState,
  reducers: {
    addProjectToWorkflow: (state, action) => {
      state.workflowprojects.unshift(action.payload)
    },
    startLoading: (state) => {
      state.loading = true
    },
    getWorkflowsProjectsSuccess: (state, action) => {
      state.workflowprojects = action.payload
      state.loading = false
      state.hasErrors = false
    },
    getWorkflowProjectsFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    removeProject: (state, action) => {
      let filteredProject = state.workflowprojects.filter(
        (workflowprojects) => workflowprojects.ProjectKey !== action.payload
      )
      state.workflowprojects = filteredProject
    },
  },
})

const {
  addProjectToWorkflow,
  startLoading,
  removeProject,
  getWorkflowsProjectsSuccess,
  getWorkflowProjectsFailure,
} = workflowprojectsSlice.actions

const { actions } = workflowprojectsSlice
export const workflowProjectsSelector = (state) => state.workflowprojects

const workflowProjectsReducer = workflowprojectsSlice.reducer
export default workflowProjectsReducer
//
export const fetchWorkflowProjects = (id) => async (dispatch) => {
  dispatch(startLoading())
  workflowApi
    .getWorkflowProject(id)
    .then((res) => {
      if(!res.Data) dispatch(getWorkflowsProjectsSuccess([]))
      if (res.Data) dispatch(getWorkflowsProjectsSuccess(res.Data))
    })
    .catch((err) => {
      dispatch(getWorkflowProjectsFailure())
      return err
    })
}
//add project
export const AddProjectToWorkflow = (data) => async(dispatch)=>{
  workflowApi
  .addProjectToWorkflow(data)
  .then((res)=>{
    dispatch(addProjectToWorkflow(data))
    return res
  }).catch((err)=>{
    alert(err.response.data.Msg)
      dispatch(getWorkflowProjectsFailure())
  })
}
export const deleteProjectInWorkflow =(idworkflow, idproject) => async (dispatch) => {
    workflowApi
      .deleteProjectInWorkflow(idworkflow, idproject)
      .then((res) => {
        console.log(res)
        dispatch(removeProject(idproject))
      })
      .catch((err) => {
        console.log(err)
      })
  }
