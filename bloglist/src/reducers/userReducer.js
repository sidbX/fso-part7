import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      return action.payload
    },
    logout(state, action) {
      return null
    },
  },
})

export default userSlice.reducer
export const { login, logout } = userSlice.actions
