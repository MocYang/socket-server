/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 14:18
 * @FILE: configSlice.js
 * @Email: 958292256@qq.com
 */
import { createSelector, createSlice } from "@reduxjs/toolkit"

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    darkMode: false,
    backgroundClassName: ''
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    }
  }
})

export const selectDarkMode = (state) => state.config.darkMode
export const selectBackgroundClassName = createSelector(
  [selectDarkMode],
  (darkMode) => darkMode ? '' : 'grey lighten-5'
)
export default configSlice.reducer
