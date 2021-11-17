/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 14:06
 * @FILE: index.js
 * @Email: 958292256@qq.com
 * @description ConnectionModal 是用来创建和根 socket 的链接的。
 *              与根 socket 建立链接之后，可以创建具体的子 socket 和子 client。
 */
import { useState } from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {
  selectConnectionModelOpen,
  setConnectionModelOpen,
  selectConnecting,
  setConnectSignal,
  setRootServerUrl,
  selectConnected, setDisconnectSignal
} from '../../features/connection/connectionSlice'
import InputAdornment from '@material-ui/core/InputAdornment'

function ConnectionModal() {
  const dispatch = useDispatch()
  const connectionModelOpen = useSelector(selectConnectionModelOpen)
  const connecting = useSelector(selectConnecting)
  const connected = useSelector(selectConnected)
  const [rootServerHost, setRootServerHost] = useState('127.0.0.1')
  const [rootServerPort, setRootServerPort] = useState('8888')

  const handleClose = () => {
    dispatch(setConnectionModelOpen(false))
  }

  const handleRootServerHostChange = (e) => {
    setRootServerHost(e.target.value)
  }

  const handleRootServerPortChange = (e) => {
    setRootServerPort(e.target.value)
  }

  const handleSendConnectSignal = () => {
    if (connecting || connected) {
      return
    }
    dispatch(setRootServerUrl(`ws://${rootServerHost}:${rootServerPort}`))
    dispatch(setConnectSignal(true))
  }

  const handleSendDisconnectSignal = () => {
    dispatch(setDisconnectSignal(true))
  }
  return (
    <div>
      <Dialog
        open={connectionModelOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Connection</DialogTitle>
        <DialogContent>
          <TextField
            label="Host:"
            value={rootServerHost}
            onChange={handleRootServerHostChange}
            style={{ margin: 8 }}
            placeholder="127.0.0.1"
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">ws://</InputAdornment>
            }}
          />
          <TextField
            label="Port:"
            value={rootServerPort}
            onChange={handleRootServerPortChange}
            style={{ margin: 8 }}
            placeholder="8888"
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSendConnectSignal}
            color="primary"
            variant="outlined"
            disabed={connecting || connected ? 'disabled' : ''}
          >
            {connecting ? 'Connecting...' : 'Connect'}
          </Button>
          {
            connected && (
              <Button onClick={handleSendDisconnectSignal} color="primary" variant="outlined">
                Stop
              </Button>
            )
          }
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConnectionModal
