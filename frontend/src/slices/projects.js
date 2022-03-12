import { createSlice } from '@reduxjs/toolkit'
import projectApi from '../api/projectApi'

export const initialState = {
  loading: false,
  hasErrors: false,
  projects: [],
  projectUpdate: {},
  updateWor:'',
  updateSuccess: false,
}
// A slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.unshift(action.payload)
    },
    removeProject: (state,  action) => {
      let filteredProject = state.projects.filter((project) => project.ProjectKey !== action.payload)
      state.projects = filteredProject
    },
    GetByIdWorkflow: (state,  action) => {
    
      let filterProject = state.projects.filter((project) => project.ProjectKey !== action.payload)
      state.projects = filterProject
    },
    startLoading: (state) => {
      state.loading = true
    },
    getProjectsSuccess: (state, action) => {
      state.projects = action.payload
      console.log(state.projects.length);
      state.loading = false
      state.hasErrors = false
    },
    getProjectsFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    setProjectUpdate: (state, action) => {
      state.projectUpdate = action.payload
    },
    updateProject: (state, action) => {
      const { key, data } = action.payload
      console.log(data);
      let newProjects = state.projects.map(project => (project.ProjectKey === key ? {ProjectKey: key, ...data} : project))
      console.log(newProjects);
      state.projects = newProjects

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

// Actions generated from the slice
const { removeUpdateSuccess, deleteState, removeProject, startLoading, getProjectsFailure, getProjectsSuccess,GetByIdWorkflow } =
  projectsSlice.actions

const { actions } = projectsSlice

// export project selector to get the slice in any component
export const projectsSelector = (state) => state.projects
export const projectUpdateSelector = (state) => state.projectUpdate
// export The reducer
const projectReducer = projectsSlice.reducer
export default projectReducer
// Actions
export const fetchProjects = () => async (dispatch) => {
  dispatch(startLoading())
  projectApi
    .getAll()
    .then((res) => {
      console.log(res)
      if (res.Data) dispatch(getProjectsSuccess(res.Data))
      else dispatch(getProjectsSuccess([]))
    })
    .catch((err) => {
      console.log(err)
      dispatch(getProjectsFailure())
    })
}

export const createProject = (project) => async (dispatch) => {
  projectApi
  .create(project)
  .then((res) => {
    dispatch(actions.addProject(res.Data))
  })
  .catch((err) => {
    alert(err.response.data.Msg)
         //NEW
  })
}

export const deleteProject = (key) => async (dispatch) => {
  projectApi
  .delete(key)
  .then((res) => {
    // dispatch(removeUpdateSuccess(res.Msg))
    dispatch(removeProject(key))
  })
  .catch((err) => {
    console.log(err.response.data.Msg)
    alert(err.response.data.Msg)
            //NEW
  })
}
export const setState = () => async (dispatch) => {
  dispatch(deleteState())
}

export const setProjectUpdate = (Project) => async (dispatch) => {
  try {
    dispatch(actions.setProjectUpdate(Project))
  } catch (error) {
    dispatch(getProjectsFailure())
    
  }
}

export const updateProject = (data) => async (dispatch) => {
  projectApi
  .update(data)
  .then((res) => {
    console.log(res)
    dispatch(actions.updateProject(data))
    dispatch(actions.removeUpdateSuccess(res.Msg))
  })
  .catch((err) => {
    console.log(err)
    dispatch(getWorkflowFailure())
    alert(err.response.data.Msg)
      
  
  })
}

export const selectAllProjects = (state) => state.projects.projects
export const getDataByIdWorkflow = (key) => async (dispatch) => {
  projectApi
  .getDataByIdWorkflow(key)
  .then((res) => {
    console.log(res)
    dispatch(GetByIdWorkflow(key))
  })
  .catch((err) => {
    console.log(err)
    alert(err.response.data.Msg)
           
  })
}

