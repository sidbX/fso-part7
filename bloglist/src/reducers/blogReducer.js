import _ from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = []
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    initializeBlogs(state, action) {
      state = action.payload
      return state
    },
    addBlog(state, action) {
      state = state.concat(action.payload)
      return state
    },
    likeBlog(state, action) {
      _.remove(state, action.payload.blogToBeLiked)
      state.push(action.payload.updatedBlog)
    },
    deleteBlog(state, action) {
      _.remove(state, action.payload)
    },
  },
})

export default blogSlice.reducer
export const { initializeBlogs, addBlog, likeBlog, deleteBlog } =
  blogSlice.actions
