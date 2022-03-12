import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import issueApi from '../api/issueApi'

const initialState = {
  issues: [],
  projectIssueTypeScreens: [],
  customFields: [],
  userList: [],
  status: 'idle',
  statusAddIssue: 'idle',
  error: null,
  success: null,
}

export const fetchIssues = createAsyncThunk('issues/fetchIssues', async () => {
  const response = await issueApi
    .getAll()
    .then(function (response) {
      console.log(response)
      return response
    })
    .catch(function (error) {
      console.log(error)
    })
  return response
})

export const fetchProjectIssueTypeScreens = createAsyncThunk(
  'issues/fetchProjectIssueTypeScreens',
  async () => {
    const response = await issueApi
      .init()
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

export const fetchCustomFields = createAsyncThunk(
  'issues/fetchCustomFields',
  async (initialIssue, { rejectWithValue }) => {
    const { Id } = initialIssue
    const response = await issueApi
      .getCustomFields(Id)
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

export const fetchUserList = createAsyncThunk(
  'issues/fetchUserList',
  async (initial, { rejectWithValue }) => {
    const { project } = initial
    const response = await issueApi
      .getUserList(project)
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

export const addNewIssue = createAsyncThunk(
  'issues/addNewIssue',
  async (initialIssue, { rejectWithValue }) => {
    console.log('add new Issue')
    console.log(initialIssue)
    const response = await issueApi
      .create(initialIssue)
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

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async (initialIssue, { rejectWithValue }) => {
    //const { Id, ...fields } = initialIssue
    //console.log(Id, fields)
    const response = await issueApi
      .update(initialIssue.Id, initialIssue)
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

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (initialIssue, { rejectWithValue }) => {
    const { Id } = initialIssue
    const response = await issueApi
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

const issuesSlice = createSlice({
  name: 'issues',
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
    [fetchIssues.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchIssues.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      if (action.payload.Data) {
        state.issues = state.issues.concat(action.payload.Data)
      }
    },
    [fetchIssues.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [fetchProjectIssueTypeScreens.pending]: (state) => {
      state.statusAddIssue = 'loading'
    },
    [fetchProjectIssueTypeScreens.fulfilled]: (state, action) => {
      state.statusAddIssue = 'succeeded'
      state.projectIssueTypeScreens = state.projectIssueTypeScreens.concat(
        action.payload.Data
      )
    },
    [fetchProjectIssueTypeScreens.rejected]: (state, action) => {
      state.statusAddIssue = 'failed'
      state.error = action.payload.Msg
    },
    [addNewIssue.rejected]: (state, action) => {
      state.error = action.payload.Msg
      //console.log(action.payload.Msg)
    },
    [addNewIssue.fulfilled]: (state, action) => {
      state.issues.push(action.payload.Data)
      state.success = action.payload.Msg
    },
    [updateIssue.rejected]: (state, action) => {
      state.error = action.payload.Msg
      //console.log(action.payload.Msg)
    },
    [updateIssue.fulfilled]: (state, action) => {
      // state.issues = []
      // state.status = 'idle'
      const newIssue = action.payload.Data
      state.issues = state.issues.map((issue) =>
        issue.Id === newIssue.Id ? newIssue : issue
      )
      state.success = action.payload.Msg
    },
    [deleteIssue.rejected]: (state, action) => {
      state.error = action.payload.Msg
      //console.log(action.payload.Msg)
    },
    [deleteIssue.fulfilled]: (state, action) => {
      const returnedIssue = action.payload.Data
      state.issues = state.issues.filter(
        (issue) => issue.Id !== returnedIssue.Id
      )
      state.success = action.payload.Msg
    },
    [fetchCustomFields.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [fetchCustomFields.fulfilled]: (state, action) => {
      if (action.payload.Data) {
        state.customFields = action.payload.Data
      } else {
        state.customFields = []
      }
    },
    [fetchUserList.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [fetchUserList.fulfilled]: (state, action) => {
      if (action.payload.Data) {
        state.userList = action.payload.Data
      }
    },
  },
})
export const { setErrorNull, setSuccessNull } = issuesSlice.actions

export default issuesSlice.reducer

export const selectAllIssues = (state) => state.issues.issues

export const selectUserList = (state) => state.issues.userList

export const selectAllProjectIssueTypeScreens = (state) =>
  state.issues.projectIssueTypeScreens

export const selectIssueById = (state, issueId) =>
  state.issues.issues.find((issue) => issue.Id == issueId)

export const selectIssueByKey = (state, key) =>
  state.issues.issues.find((issue) => issue.Key == key)
