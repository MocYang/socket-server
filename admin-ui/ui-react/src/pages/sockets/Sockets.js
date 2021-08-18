/**
 * @Author: yangqixin
 * @TIME: 2021/8/1 10:09
 * @FILE: Sockets.js
 * @Email: 958292256@qq.com
 */
import { useContext, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import NewSocket from './NewSocket'
import SocketCard from '../../components/SocketCard'
import { serializer } from '../../util/index'
import { RootSocketContext } from '../../app/App'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectFetchServerStatus,
  selectSocketList,
  setFetchServerStatus
} from './socketSlice'

function Sockets() {
  const dispatch = useDispatch()
  const [rootSocketInstance] = useContext(RootSocketContext)

  const sockets = useSelector(selectSocketList)

  // time to fetch server list.
  const fetchServerStatus = useSelector(selectFetchServerStatus)

  useEffect(() => {
    // fetch server list on every mounted.
    dispatch(setFetchServerStatus(true))

    return () => {
      dispatch(setFetchServerStatus(false))
    }
  }, [])

  useEffect(() => {
    if (fetchServerStatus && rootSocketInstance) {
      rootSocketInstance.send(serializer({
        code: 0b00010000 // CODE_GET_SERVER_LIST
      }))
    }
  }, [fetchServerStatus, rootSocketInstance])

  const handleRefreshServerList = () => {
    dispatch(setFetchServerStatus(true))
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
          sockets.map((socket) => (
            <Grid key={socket.id} item xs={12} sm={12} md={12} lg={12}>
              <SocketCard config={socket} rootWs={rootSocketInstance} />
            </Grid>
          ))
        }

        <Grid item>
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
