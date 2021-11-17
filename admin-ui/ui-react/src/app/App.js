/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 14:03
 * @FILE: App.js
 * @Email: 958292256@qq.com
 */
import Navigation from '../components/Navigation'
import ConnectionModal from '../components/ConnectionModal'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectConnected,
  selectConnectSignal,
  selectDisconnectSignal,
  selectRootServerUrl,
  setConnected,
  setConnecting,
  setConnectionModelOpen,
  setConnectSignal,
  setDisconnectSignal
} from '../features/connection/connectionSlice'
import {
  setFetchServerStatus,
  setSockets,
  updateServerStatus
} from '../pages/sockets/socketSlice'
import { parse } from '../util'
import './app.scss'

let handleRootSocketOnOpen = () => void 0
let handleRootSocketOnMessage = () => void 0
let handleRootSocketOnError = () => void 0
let handleRootSocketOnClose = () => void 0

export const RootSocketContext = React.createContext([])

function App() {
  const dispatch = useDispatch()
  const rootServerUrl = useSelector(selectRootServerUrl)
  const connectSignal = useSelector(selectConnectSignal)
  const connected = useSelector(selectConnected)
  const disconnectSignal = useSelector(selectDisconnectSignal)

  const [rootSocketInstance, setRootSocketInstance] = useState(null)
  const rootSocketContext = useMemo(() => [rootSocketInstance, setRootSocketInstance], [rootSocketInstance])
  // const darkMode = useSelector(selectDarkMode)
  // const backgroundClassName = useSelector(selectBackgroundClassName)

  const connectToRootServer = useCallback((forceConnect = false) => {
    let socketInstance = null
    if (connectSignal && rootServerUrl || forceConnect) {
      try {
        socketInstance = new WebSocket(rootServerUrl + '')
        dispatch(setConnecting(true))
      } catch (e) {
        console.error(e)
        dispatch(setConnecting(false))
        dispatch(setConnected(false))
      }

      handleRootSocketOnOpen = () => {
        dispatch(setConnectSignal(false))
        dispatch(setConnecting(false))
        dispatch(setConnected(true))
        dispatch(setConnectionModelOpen(false))
        setRootSocketInstance(socketInstance)
      }

      handleRootSocketOnMessage = (e) => {
        const socketData = parse(e.data)
        const uuid = socketData.data.uuid
        switch (socketData.code) {
          // server create success.
          case 0b00000110:
            // refresh server list
            dispatch(setFetchServerStatus(true))
            break;

          // fetch all server instance list success
          case 0b00010001:
            const serverList = socketData.data
            dispatch(setFetchServerStatus(false))
            dispatch(setSockets(serverList))
            break

          // start new server success.
          case 0b00001001:
            // update which server running.
            dispatch(updateServerStatus({
              uuid,
              running: true
            }))
            break

          // server is already running.
          case 0b00000001:
            dispatch(updateServerStatus({
              uuid,
              running: true
            }))
            break

          // fetch server list fail
          case 0b00010010:
            dispatch(setFetchServerStatus(false))
            break

          // server create fail
          case 0b00000111:
            console.error(socketData)
            break

          // CODE_SOCKET_STOP_SUCCESS
          case 0b00001100:
            console.log(uuid)
            dispatch(updateServerStatus({
              uuid,
              running: false
            }))

            break

          // socket server stop fail.
          case 0b00001101:
            console.log(socketData.msg)
        }
      }

      handleRootSocketOnError = () => {
        dispatch(setConnecting(false))
        dispatch(setConnected(false))
      }

      handleRootSocketOnClose = () => {
        console.log('root socket closed.')
        dispatch(setConnected(false))
      }

      if (socketInstance) {
        socketInstance.addEventListener('open', handleRootSocketOnOpen)
        socketInstance.addEventListener('message', handleRootSocketOnMessage)
        socketInstance.addEventListener('error', handleRootSocketOnError)
        socketInstance.addEventListener('close', handleRootSocketOnClose)
      }
    }
  }, [connectSignal, rootServerUrl])

  useEffect(() => {
    // try first connection on mount.
    if (!connected) {
      connectToRootServer(true)
    }
  }, [connected])

  useEffect(() => {
    // connect after connect button click.
    if (!connected) {
      connectToRootServer()
    }
  }, [connectSignal, rootServerUrl, connected])

  useEffect(() => {
    // signal to stop root server.
    if (disconnectSignal && rootSocketInstance) {
      rootSocketInstance.close()
      setRootSocketInstance(null)
      dispatch(setDisconnectSignal(false))
      dispatch(setConnected(false))
    }
  }, [disconnectSignal, rootSocketInstance])

  return (
    <RootSocketContext.Provider value={rootSocketContext}>
      <Navigation />
      <ConnectionModal />
    </RootSocketContext.Provider>
  )
}

export default App
