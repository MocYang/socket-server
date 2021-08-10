/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 14:52
 * @FILE: index.js
 * @Email: 958292256@qq.com
 */
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AppsIcon from '@material-ui/icons/Apps'
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import AppBarComponent from '../AppBar'
import AppMainComponent from '../../routes/index'

const drawerWidth = 200

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))

function ListItemLink(props) {
  // TODO: 添加当前路由激活的 link 状态
  const {to, title} = props
  const Icon = props.Icon

  const CustomLink = useMemo(() =>
      React.forwardRef(function Comp(linkProps, ref) {
        return <Link ref={ref} to={to} {...linkProps} />
      }),
    [to]
  )
  return (
    <ListItem button title={title} component={CustomLink}>
      <ListItemIcon><Icon /></ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  )
}

export default function Navigation() {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(open => !open)
  }

  const navItems = useMemo(() => {
    return [
      {
        id: 1,
        title: 'Dashboard',
        Icon: AppsIcon,
        to: '/dashboard',
        exact: true
      },
      {
        id: 2,
        title: 'Sockets',
        Icon: SettingsEthernetIcon,
        to: '/sockets'
      },
      {
        id: 3,
        title: 'Clients',
        Icon: PeopleAltIcon,
        to: 'clients'
      }
    ]
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBarComponent
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
        onNavigationOpen={toggleDrawer}
      />

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>

        <Divider />

        <List component="nav">
          {
            navItems.map(item => (
              <ListItemLink key={item.id} {...item} />
            ))
          }
        </List>

        <Divider />
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <AppMainComponent />
      </main>
    </div>
  )
}

