/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 13:37
 * @FILE: index.js
 * @Email: 958292256@qq.com
 */
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import {
  setConnectionModelOpen,
  selectRootServerUrl,
  selectConnected
} from '../../features/connection/connectionSlice'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

AppBarComponent.propTypes = {
  position: PropTypes.string,
  className: PropTypes.string,
  onNavigationOpen: PropTypes.func
}

export default function AppBarComponent(props) {
  const { position, className, onNavigationOpen } = props
  const dispatch = useDispatch()
  const rootServerUrl = useSelector(selectRootServerUrl)
  const rootServerConnected = useSelector(selectConnected)

  const classes = useStyles()
  const handleOpenConnectionModel = () => {
    dispatch(setConnectionModelOpen(true))
  }
  return (
    <AppBar position={position} className={className}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          onClick={onNavigationOpen}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={classes.title}>
          Socket Admin
        </Typography>

        <div className="d-flex">
          <div>
            <div>Server URL: {rootServerUrl}</div>
            <div>Status: {rootServerConnected ? 'RUNNING' : 'STOP'}</div>
          </div>
        </div>

        <Button color="inherit" onClick={handleOpenConnectionModel}>
          update
        </Button>
      </Toolbar>
    </AppBar>
  )
}
