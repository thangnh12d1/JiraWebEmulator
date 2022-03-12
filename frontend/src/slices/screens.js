import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import screenApi from '../api/screenApi'

const initialState = {
  screens: [],
  status: 'idle',
  error: null,
  success: null,
}

export const fetchScreens = createAsyncThunk(
  'screens/fetchScreens',
  async () => {
    const response = await screenApi
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

export const addNewScreen = createAsyncThunk(
  'screens/addNewScreen',
  async (initialScreen, { rejectWithValue }) => {
    console.log('add new Screen')
    console.log(initialScreen)
    const response = await screenApi
      .create(initialScreen)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    //console.log(response.screen)
    return response
  }
)

export const updateScreen = createAsyncThunk(
  'screens/updateScreen',
  async (initialScreen, { rejectWithValue }) => {
    const { Id, ...fields } = initialScreen
    const response = await screenApi
      .update(Id, fields)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    //console.log(response.screen)
    return response
  }
)

export const deleteScreen = createAsyncThunk(
  'screens/deleteScreen',
  async (initialScreen, { rejectWithValue }) => {
    const { Id } = initialScreen
    //console.log(Id)
    const response = await screenApi
      .delete(Id)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    //console.log(response.screen)
    return response
  }
)

const screensSlice = createSlice({
  name: 'screens',
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
    [fetchScreens.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchScreens.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      if (action.payload.Data) {
        state.screens = state.screens.concat(action.payload.Data)
      }
    },
    [fetchScreens.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [addNewScreen.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg
    },
    [addNewScreen.fulfilled]: (state, action) => {
      state.screens.push(action.payload.Data)
      state.success = action.payload.Msg
    },
    [updateScreen.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg
    },
    [updateScreen.fulfilled]: (state, action) => {
      const newScreen = action.payload.Data
      state.screens = state.screens.map((screen) =>
        screen.Id === newScreen.Id ? newScreen : screen
      )
      state.success = action.payload.Msg
    },
    [deleteScreen.rejected]: (state, action) => {
      //console.log(action.payload.Msg)
      state.error = action.payload.Msg
    },
    [deleteScreen.fulfilled]: (state, action) => {
      const returnedScreen = action.payload.Data
      state.screens = state.screens.filter(
        (screen) => screen.Id !== returnedScreen.Id
      )
      state.success = action.payload.Msg
    },
  },
})
export const { setErrorNull, setSuccessNull } = screensSlice.actions

export default screensSlice.reducer

export const selectAllScreens = (state) => state.screens.screens

export const selectScreenById = (state, screenId) =>
  state.screens.screens.find((screen) => screen.Id == screenId)
