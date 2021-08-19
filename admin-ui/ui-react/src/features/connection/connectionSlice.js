/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 14:26
 * @FILE: connectionSlice.js
 * @Email: 958292256@qq.com
 */

import { createSlice } from '@reduxjs/toolkit'

export const connectionSlice = createSlice({
  name: 'connection',
  initialState: {
    rootServerUrl: 'ws://127.0.0.1:8080',
    connectSignal: false,
    disconnectSignal: false,
    connecting: false,            // require to establish connection.
    connected: false,             // server running.
    connectionModalOpen: true
  },
  reducers: {
    setRootServerUrl: (state, action) => {
      state.rootServerUrl = action.payload
    },
    setConnectionModelOpen: (state, action) => {
      state.connectionModalOpen = action.payload
    },
    setConnecting: (state,action) => {
      state.connecting = action.payload
    },
    setConnectSignal: (state,action) => {
      state.connectSignal = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setDisconnectSignal: (state, action) => {
      state.disconnectSignal = action.payload
    }
  }
})

export const {
  setConnectionModelOpen,
  setConnectSignal,
  setConnecting,
  setConnected,
  setRootServerUrl,
  setDisconnectSignal
} = connectionSlice.actions

export const selectConnectionModelOpen = (state) => state.connection.connectionModalOpen
export const selectConnecting = (state) => state.connection.connecting
export const selectConnected = (state) => state.connection.connected
export const selectConnectSignal = (state) => state.connection.connectSignal
export const selectRootServerUrl = (state) => state.connection.rootServerUrl
export const selectDisconnectSignal = (state) => state.connection.disconnectSignal

export default connectionSlice.reducer
