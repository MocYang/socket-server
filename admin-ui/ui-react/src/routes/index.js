/**
 * @Author: yangqixin
 * @TIME: 7/11/21 10:38 PM
 * @FILE: index.js
 * @Email: 958292256@qq.com
 */

import { Switch, Route, Redirect } from 'react-router-dom'

import Dashboard from '../pages/dashboard/Dashboard'
import Sockets from '../pages/sockets/Sockets'
import Clients from '../pages/clients/Clients'

function Index() {
  return (
    <Switch>
      <Route exact path={'/'} render={ () => <Dashboard />} />

      <Route path={'/sockets'} render={() => <Sockets />} />

      <Route path={'/clients'} render={() => <Clients />} />

      <Redirect to={'/'} />
    </Switch>
  )
}

export default Index
