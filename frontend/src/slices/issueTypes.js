import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import issueTypeApi from '../api/issueTypeApi'

const initialState = {
  issueTypes: [],
  status: 'idle',
  error: null,
  success: null,
}

export const fetchIssueTypes = createAsyncThunk(
  'issueTypes/fetchIssueTypes',
  async () => {
    const response = await issueTypeApi
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

export const addNewIssueType = createAsyncThunk(
  'issueTypes/addNewIssueType',
  async (initialIssueType, { rejectWithValue }) => {
    console.log('add new IssueType')
    console.log(initialIssueType)
    const response = await issueTypeApi
      .create(initialIssueType)
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

export const updateIssueType = createAsyncThunk(
  'issueTypes/updateIssueType',
  async (initialIssueType, { rejectWithValue }) => {
    const { Id, ...fields } = initialIssueType
    const response = await issueTypeApi
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

export const deleteIssueType = createAsyncThunk(
  'issueTypes/deleteIssueType',
  async (initialIssueType, { rejectWithValue }) => {
    const { Id } = initialIssueType
    const response = await issueTypeApi
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

const issueTypesSlice = createSlice({
  name: 'issueTypes',
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
    [fetchIssueTypes.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchIssueTypes.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      if (action.payload.Data) {
        state.issueTypes = state.issueTypes.concat(action.payload.Data)
      }
      
    },
    [fetchIssueTypes.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [addNewIssueType.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg

    },
    [addNewIssueType.fulfilled]: (state, action) => {
      state.issueTypes.push(action.payload.Data)
      state.success = action.payload.Msg

    },
    [updateIssueType.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg

    },
    [updateIssueType.fulfilled]: (state, action) => {
      const newIssueType = action.payload.Data
      state.issueTypes = state.issueTypes.map((issueType) =>
        issueType.Id === newIssueType.Id ? newIssueType : issueType
      )
      state.success = action.payload.Msg

    },
    [deleteIssueType.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg

    },
    [deleteIssueType.fulfilled]: (state, action) => {
      const returnedIssueType = action.payload.Data
      state.issueTypes = state.issueTypes.filter(
        (issueType) => issueType.Id !== returnedIssueType.Id
      )
      state.success = action.payload.Msg

    },
  },
})
export const { setErrorNull, setSuccessNull } = issueTypesSlice.actions
export default issueTypesSlice.reducer

export const selectAllIssueTypes = (state) => state.issueTypes.issueTypes

export const selectIssueTypeById = (state, issueTypeId) =>
  state.issueTypes.issueTypes.find(
    (issueType) => issueType.Id == issueTypeId
  )
