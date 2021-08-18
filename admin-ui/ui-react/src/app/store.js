import { configureStore } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import configReducer from '../features/config/configSlice'
import connectionReducer from '../features/connection/connectionSlice'
import socketReducer from '../pages/sockets/socketSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    config: configReducer,
    connection: connectionReducer,
    socket: socketReducer
  }
})
