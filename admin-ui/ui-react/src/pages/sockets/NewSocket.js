/**
 * @Author: yangqixin
 * @TIME: 2021/8/1 17:30
 * @FILE: NewSocket.js
 * @Email: 958292256@qq.com
 */
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

export default function NewSocket({ rootWs }) {
  const classes = useStyles()
  const [host, setHost] = useState('127.0.0.1')
  const [port, setPort] = useState('8081')
  const [hostError, setHostError] = useState(false)
  const [portError, setPortError] = useState(false)
  const [hostHelperText, setHostHelperText] = useState('')
  const [portHelperText, setPortHelperText] = useState('')
  const [project, setProject] = useState('')
  // tell the root server, is this socket server show start after initial.
  const [startServer, setStartServer] = useState(false)

  const handleHostInput = (e) => {
    setHost(e.target.value)
  }

  const handlePortInput = (e) => {
    setPort(e.target.value)
  }

  const handleProjectInput = (e) => {
    setProject(e.target.value)
  }

  const handleCreateSocket = () => {
    if (!host) {
      setHostError(true)
      setHostHelperText('Host cannot be empty.')
      return
    }
    setHostError(false)
    setHostHelperText('')

    if (!port) {
      setPortError(true)
      setPortHelperText('Port cannot be empty.')
      return
    }
    setPortError(false)
    setPortHelperText('')

    console.log(`create new websocket ws://${host}:${port}`)

    const config = {
      code: 0b00000101,
      data: {
        host,
        port,
        namespace: project
      }
    }
    rootWs.send(JSON.stringify(config))
  }
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <TextField
          label="Host:"
          error={hostError}
          value={host}
          onChange={handleHostInput}
          style={{ margin: 8 }}
          placeholder="127.0.0.1"
          helperText={hostHelperText}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">ws://</InputAdornment>
          }}
        />
        <TextField
          label="Port:"
          error={portError}
          value={port}
          onChange={handlePortInput}
          style={{ margin: 8 }}
          placeholder="8080"
          helperText={portHelperText}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          label="Project:"
          value={project}
          onChange={handleProjectInput}
          style={{ margin: 8 }}
          placeholder="project"
          helperText={portHelperText}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleCreateSocket}>Create</Button>
      </CardActions>
    </Card>
  )
}
