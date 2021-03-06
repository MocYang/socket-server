/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/11 11:13
 * @File: index.js
 * @Description
 */
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Box from '@material-ui/core/Box'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import Grid from '@material-ui/core/Grid'

import { serializer, parse } from '../../util'
import TextField from '@material-ui/core/TextField'
import { updateServerStatus } from '../../pages/sockets/socketSlice'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  root: {
    minWidth: '100%',
    minHeight: '100%'
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
  },
  textarea: {
    width: '100%'
  },

  messageTimelineBox: {
    width: '100%',
    height: '100%'
  },

  timeline: {
    alignItems: 'flex-start'
  },

  timelineDate: {
    width: '100%',
    margin: 0
  }
})

SocketCard.propTyeps = {
  config: PropTypes.object.isRequired,
  rootWs: PropTypes.object.isRequired
}

let handleWsOpen = () => void null
let handleWsOnMessage = () => void null
let handleWsOnError = () => void null
let handleWsOnClose = () => void null

export default function SocketCard({
  config,
  rootWs
}) {
  const {
    protocol = 'ws',
    host,
    port,
    status,
    uuid,
    message: rawMessage,  // ????????????????????????????????????
    running: serverRunning,
    namespace: project
  } = config
  const dispatch = useDispatch()
  const classes = useStyles()
  const [message, setMessage] = useState(rawMessage || '')
  const [ws, setWsInstance] = useState(null)
  const [messageQueue, setMessageQueue] = useState([])
  const [autoSendTicker, setAutoSendTicker] = useState(10000) // 10s per message

  useEffect(() => {
    if (serverRunning) {
      const address = `${protocol}://${host}:${port}`
      const wsInstance = new WebSocket(address)
      handleWsOpen = () => {
        console.log(`${address} is running...`)
        setWsInstance(wsInstance)
      }

      handleWsOnMessage = (e) => {
        const msg = parse(e.data)
        console.log('receive message from server: ', msg)
        // CODE_SERVER_RECEIVE_ADMIN_MESSAGE
        if (msg.code === 0b00001111) {
          setMessageQueue(queue => [msg.data, ...queue])

          // setMessage('')
        }
      }

      handleWsOnError = (e) => {
        console.log(e)
        // setServerRunning(false)
      }

      handleWsOnClose = (e) => {
        console.log(e)
        // setServerRunning(false)
      }
      wsInstance.addEventListener('open', handleWsOpen)
      wsInstance.addEventListener('message', handleWsOnMessage)
      wsInstance.addEventListener('error', handleWsOnError)
      wsInstance.addEventListener('close', handleWsOnClose)
    }

    return () => {
      if (ws) {
        ws.removeEventListener('open', handleWsOpen)
        ws.removeEventListener('message', handleWsOnMessage)
        ws.removeEventListener('error', handleWsOnError)
        ws.removeEventListener('close', handleWsOnClose)
      }
    }
  }, [serverRunning])

  // TODO:  sync message that had send to server. show current send message on panel.
  const handleStartServer = () => {
    rootWs.send(serializer({
      code: 0b00001000,
      data: { uuid }
    }))
  }

  const handleStopServer = () => {
    rootWs.send(serializer({
      code: 0b00001011,
      data: { uuid }
    }))
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message) {
      if (!serverRunning) {
        alert('socket server is not running.')
        return
      }

      ws.send(serializer({
        code: 0b00001110,   // admin send to server, that this message should broadcast to all client.
        data: {
          uuid,
          message
        }
      }))
    }
  }

  const handleAutoSendMessage = () => {
    if (!ws) {
      alert('socket server is not running.')
      return
    }
    if (!autoSendTicker) {
      alert('ticker is not set.')
      return
    }
    ws.send(serializer({
      code: 0b00010100,
      data: {
        uuid,
        auto: true,
        ticker: autoSendTicker,
        message
      }
    }))
  }

  const handleCancelAutoSendMessage = () => {
    ws.send(serializer({
      code: 0b00010101
    }))
  }

  const formatISOTime = (ISOString) => {
    return ISOString.split('T').join(' ').split('.')[0]
  }

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={4}>
        <Card className={classes.root}>
          <CardHeader title={'WebSocket Server'} />
          <CardContent>
            <Typography className={classes.pos} color="textSecondary">
              Host: {host}
            </Typography>
            <Typography variant="body2" component="p">
              Port: {port}
            </Typography>
            <Typography variant="body2" component="p">
              Status: {status}
            </Typography>
            <Typography variant="body2" component="p">
              project: {project}
            </Typography>
            <Typography variant="body2" component="p">
              status: {serverRunning ? 'RUNNING' : 'STOP'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="medium"
              variant="outlined"
              onClick={handleStartServer}
              disabled={!!serverRunning}
            >
              Start
            </Button>
            <Button size="medium" variant="outlined" onClick={handleStopServer}>Stop</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={4}>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Send Message:
            </Typography>
            <Typography>
              <TextareaAutosize
                className={classes.textarea}
                minRows={10}
                value={message}
                onChange={handleMessageChange}
                placeholder="message..."
              />
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" variant="outlined" onClick={handleSendMessage}>Send</Button>
            <Button size="medium" variant="outlined" onClick={handleAutoSendMessage}>Auto Send</Button>
            <TextField
              label=""
              value={autoSendTicker}
              onChange={(e) => setAutoSendTicker(Number(e.target.value))}
              style={{ margin: 8 }}
              placeholder="100000"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
            <Button size="medium" variant="outlined" onClick={handleCancelAutoSendMessage}>Cancel Auto</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={4}>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              History:
            </Typography>
            <Box className={classes.messageTimelineBox}>
              <Timeline align="left" className={classes.timeline}>
                {
                  messageQueue.map((message, i) => (
                    <TimelineItem key={message.sendTime}>
                      <TimelineOppositeContent>
                        <Typography
                          color="textSecondary"
                          className={classes.timelineDate}
                        >
                          {formatISOTime(message?.sendTime)}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography>{message?.message}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))
                }
              </Timeline>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
