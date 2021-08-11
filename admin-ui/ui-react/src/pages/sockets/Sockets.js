/**
 * @Author: yangqixin
 * @TIME: 2021/8/1 10:09
 * @FILE: Sockets.js
 * @Email: 958292256@qq.com
 */
import { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import NewSocket from './NewSocket'
import SocketCard from '../../components/SocketCard'
import { parse } from '../../util/index'
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

function Sockets() {
  const dispatch = useDispatch()
  const connectSignal = useSelector(selectConnectSignal)
  const disconnectSignal = useSelector(selectDisconnectSignal)
  const rootServerUrl = useSelector(selectRootServerUrl)
  const [rootSocketInstance, setRootSocketInstance] = useState(null)
  const [sockets, setSockets] = useState([])

  useEffect(() => {
    let handleRootSocketOnOpen = () => void 0
    let handleRootSocketOnMessage = () => void 0
    let handleRootSocketOnError = () => void 0
    let handleRootSocketOnClose = () => void 0
    let socketInstance = null

    if (connectSignal && rootServerUrl) {
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
        console.log(socketData)
        // server create success.
        if (socketData.code === 0b00000110) {
          setSockets(sockets => {
            sockets.push(socketData.data)
            return sockets.slice()
          })
        }
      }

      handleRootSocketOnError = () => {
        dispatch(setConnecting(false))
        dispatch(setConnected(false))
        setRootSocketInstance(null)
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

    return () => {
      if (socketInstance) {
        socketInstance.removeEventListener('open', handleRootSocketOnOpen)
        socketInstance.removeEventListener('message', handleRootSocketOnMessage)
        socketInstance.removeEventListener('error', handleRootSocketOnError)
        socketInstance.removeEventListener('close', handleRootSocketOnClose)
      }
    }
  }, [connectSignal, rootServerUrl])

  useEffect(() => {
    if (disconnectSignal) {
      rootSocketInstance.close()
      setRootSocketInstance(null)
      dispatch(setDisconnectSignal(false))
      dispatch(setConnected(false))
    }
  }, [disconnectSignal])


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
            <Grid key={i} item xs={12} sm={12} md={12} lg={12}>
              <SocketCard config={socket} rootWs={rootSocketInstance} />
            </Grid>
          ))
        }
      </Grid>
    </>
  )
}

export default Sockets
