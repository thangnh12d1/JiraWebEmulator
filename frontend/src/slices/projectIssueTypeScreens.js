import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import projectIssueTypeScreenApi from '../api/projectIssueTypeScreenApi'

const initialState = {
  projectIssueTypeScreens: [],
  status: 'idle',
  error: null,
  success: null,
}

export const fetchProjectIssueTypeScreens = createAsyncThunk(
  'projectIssueTypeScreens/fetchProjectIssueTypeScreens',
  async () => {
    const response = await projectIssueTypeScreenApi
      .getAll()
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
    return response
  }
)

export const addNewProjectIssueTypeScreen = createAsyncThunk(
  'projectIssueTypeScreens/addNewProjectIssueTypeScreen',
  async (initialProjectIssueTypeScreen, { rejectWithValue }) => {
    console.log('add new ProjectIssueTypeScreen')
    console.log(initialProjectIssueTypeScreen)
    const response = await projectIssueTypeScreenApi
      .create(initialProjectIssueTypeScreen)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    return response
  }
)

export const updateProjectIssueTypeScreen = createAsyncThunk(
  'projectIssueTypeScreens/updateProjectIssueTypeScreen',
  async (initialProjectIssueTypeScreen, { rejectWithValue }) => {
    const { Id, ...fields } = initialProjectIssueTypeScreen
    const response = await projectIssueTypeScreenApi
      .update(Id, fields)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    return response
  }
)

export const deleteProjectIssueTypeScreen = createAsyncThunk(
  'projectIssueTypeScreens/deleteProjectIssueTypeScreen',
  async (initialProjectIssueTypeScreen, { rejectWithValue }) => {
    const { Id } = initialProjectIssueTypeScreen
    const response = await projectIssueTypeScreenApi
      .delete(Id)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    return response
  }
)

const projectIssueTypeScreensSlice = createSlice({
  name: 'projectIssueTypeScreens',
  initialState,
  reducers: {
    setErrorNull(state, action) {
      state.error = action.payload.error
    },
    setSuccessNull(state, action) {
      state.success = action.payload.success
    },
  },
  extraReducers: {
    [fetchProjectIssueTypeScreens.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchProjectIssueTypeScreens.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      if (action.payload.Data) {
        state.projectIssueTypeScreens = state.projectIssueTypeScreens.concat(action.payload.Data)
      }
    },
    [fetchProjectIssueTypeScreens.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [addNewProjectIssueTypeScreen.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg

    },
    [addNewProjectIssueTypeScreen.fulfilled]: (state, action) => {
      state.projectIssueTypeScreens.push(action.payload.Data)
      state.success = action.payload.Msg

    },
    [updateProjectIssueTypeScreen.rejected]: (state, action) => {
      state.error = action.payload.Msg
      //console.log(action.payload.Msg)
    },
    [updateProjectIssueTypeScreen.fulfilled]: (state, action) => {
      const newProjectIssueTypeScreen = action.payload.Data
      state.projectIssueTypeScreens = state.projectIssueTypeScreens.map((projectIssueTypeScreen) =>
        projectIssueTypeScreen.Id === newProjectIssueTypeScreen.Id ? newProjectIssueTypeScreen : projectIssueTypeScreen
      )
      state.success = action.payload.Msg

    },
    [deleteProjectIssueTypeScreen.rejected]: (state, action) => {
      state.error = action.payload.Msg
      //console.log(action.payload.Msg)
    },
    [deleteProjectIssueTypeScreen.fulfilled]: (state, action) => {
      const returnedProjectIssueTypeScreen = action.payload.Data
      state.projectIssueTypeScreens = state.projectIssueTypeScreens.filter(
        (projectIssueTypeScreen) => projectIssueTypeScreen?.Id !== returnedProjectIssueTypeScreen.Id
      )
      state.success = action.payload.Msg

    },
  },
})
export const { setErrorNull, setSuccessNull } = projectIssueTypeScreensSlice.actions

export default projectIssueTypeScreensSlice.reducer

export const selectAllProjectIssueTypeScreens = (state) => state.projectIssueTypeScreens.projectIssueTypeScreens

export const selectProjectIssueTypeScreenById = (state, projectIssueTypeScreenId) =>
  state.projectIssueTypeScreens.projectIssueTypeScreens.find(
    (projectIssueTypeScreen) => projectIssueTypeScreen.Id == projectIssueTypeScreenId
  )
