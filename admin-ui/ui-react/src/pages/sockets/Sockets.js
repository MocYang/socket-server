/**
 * @Author: yangqixin
 * @TIME: 2021/8/1 10:09
 * @FILE: Sockets.js
 * @Email: 958292256@qq.com
 */
import { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import NewSocket from './NewSocket'
import SocketCard from '../../components/SocketCard'
import { parse, serializer } from '../../util/index'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectConnectSignal,
  selectRootServerUrl,
  setConnecting,
  setConnected,
  setConnectionModelOpen,
  selectDisconnectSignal,
  setDisconnectSignal,
  setConnectSignal
} from '../../features/connection/connectionSlice'

let handleRootSocketOnOpen = () => void 0
let handleRootSocketOnMessage = () => void 0
let handleRootSocketOnError = () => void 0
let handleRootSocketOnClose = () => void 0

function Sockets() {
  const dispatch = useDispatch()
  const connectSignal = useSelector(selectConnectSignal)
  const disconnectSignal = useSelector(selectDisconnectSignal)
  const rootServerUrl = useSelector(selectRootServerUrl)
  const [rootSocketInstance, setRootSocketInstance] = useState(null)
  const [sockets, setSockets] = useState([])

  // time to fetch server list.
  const [getServerListSignal, setGetServerListSignal] = useState(false)

  useEffect(() => {
    return () => {
      // unsubscribe only run before unmount.
      if (rootSocketInstance) {
        rootSocketInstance.removeEventListener('open', handleRootSocketOnOpen)
        rootSocketInstance.removeEventListener('message', handleRootSocketOnMessage)
        rootSocketInstance.removeEventListener('error', handleRootSocketOnError)
        rootSocketInstance.removeEventListener('close', handleRootSocketOnClose)
      }
    }
  }, [])

  useEffect(() => {
    let socketInstance = null

    if (connectSignal && rootServerUrl) {
      console.log('new server runs....')
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
        setGetServerListSignal(true)
      }

      handleRootSocketOnMessage = (e) => {
        const socketData = parse(e.data)
        switch (socketData.code) {
          // server create success.
          case 0b00000110:
            break;
          // fetch all server instance list success
          case 0b00010001:
            const serverList = socketData.data
            console.log(serverList)
            setSockets(serverList)

            // turn off signal, in order not to get data twice.
            setGetServerListSignal(false)
            break
          // TODO: handle all error case.
        }
      }

      handleRootSocketOnError = () => {
        dispatch(setConnecting(false))
        dispatch(setConnected(false))
      }

      handleRootSocketOnClose = () => {
        console.log('root socket closed.')
        dispatch(setConnected(false))
        setRootSocketInstance(null)
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
    // signal to stop root server.
    if (disconnectSignal) {
      rootSocketInstance.close()
      setRootSocketInstance(null)
      dispatch(setDisconnectSignal(false))
      dispatch(setConnected(false))
    }
  }, [disconnectSignal])

  useEffect(() => {
    if (getServerListSignal && rootSocketInstance) {
      // after root server start. fetch all server list.
      rootSocketInstance.send(serializer({
        code: 0b00010000 // CODE_GET_SERVER_LIST
      }))
    }
  }, [getServerListSignal, rootSocketInstance])

  const handleRefreshServerList = () =>{
    rootSocketInstance.send(serializer({
      code: 0b00010000 // CODE_GET_SERVER_LIST
    }))
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {/*新建一个socket server*/}
          <NewSocket rootWs={rootSocketInstance} />
        </Grid>

        {/*显示已有的socket server*/}
        {
          sockets.map((socket, i) => (
            <Grid key={socket.id} item xs={12} sm={12} md={12} lg={12}>
              <SocketCard config={socket} rootWs={rootSocketInstance} />
            </Grid>
          ))
        }

        <Grid item >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRefreshServerList}
          >
            Refresh
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default Sockets
