/**
 * @Author: yangqixin
 * @TIME: 2021/8/15 14:22
 * @FILE: socketSlice.js
 * @Email: 958292256@qq.com
 */

import { createSlice } from '@reduxjs/toolkit'

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    sockets: [],
    // signal to fetch server list
    fetchServerStatus: false
  },
  reducers: {
    setSockets: (state, action) => {
      state.sockets = action.payload
    },
    setFetchServerStatus:(state, action) => {
      state.fetchServerStatus = action.payload
    },
    // update a started server's running status.
    updateServerStatus: (state, action) => {
      const { uuid, running } = action.payload
      state.sockets = state.sockets.map(server => ({
        ...server,
        running: server.uuid === uuid ? running : server.running
      }))
    }
  }
})

export const {
  setSockets,
  setFetchServerStatus,
  updateServerStatus
} = socketSlice.actions

export const selectSocketList = (store) => store.socket.sockets
export const selectFetchServerStatus = (store) => store.socket.fetchServerStatus

export default socketSlice.reducer
