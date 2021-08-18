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
    width: '100px'
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
    running,
    namespace: project
  } = config
  const classes = useStyles()
  const [message, setMessage] = useState('')
  const [ws, setWsInstance] = useState(null)
  const [messageQueue, setMessageQueue] = useState([])
  const [serverRunning] = useState(running || false)

  useEffect(() => {
    console.log(serverRunning)
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
          setMessageQueue(queue => {
            queue.push(msg.data)
            return queue.slice()
          })

          setMessage('')
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

  useEffect(() => {
    // handleStartServer()
  },[serverRunning])

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
      if (!ws) {
        alert('socket server is not running.')
        return
      }

      ws.send(serializer({
        code: 0b00001110,
        uuid,
        message
      }))
    }
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
            <Button size="medium" variant="outlined" onClick={handleStartServer}>Start</Button>
            <Button size="medium" variant="outlined" onClick={handleStopServer}>Stop</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={4}>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Send:
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
                    <TimelineItem key={i}>
                      <TimelineOppositeContent>
                        <Typography
                          color="textSecondary"
                          className={classes.timelineDate}
                        >
                          {message.date.split('T')[0]}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography>{message.message}</Typography>
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
