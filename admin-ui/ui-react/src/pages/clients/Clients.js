/**
 * @Author: yangqixin
 * @TIME: 2021/8/1 10:08
 * @FILE: Clients.js
 * @Email: 958292256@qq.com
 */
import { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import NewClient from './NewClient'
import ClientCard from '../../components/SocketCard'
function Clients() {
  const [ws, setWsInstance] = useState(null)
  const [clients, setClients]= useState([])
  // TODO: fetch exist clients
  const handleNewClient = (config) => {
    setClients(clients => [...clients, config])
  }
  return (
    <div className="clients">
      <Grid xs={12}>
        <header>Client</header>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <NewClient ws={ws} handleNewClient={handleNewClient}/>
        </Grid>

        {
          clients.map((client, i) => (
            <Grid key={i} item xs={12} sm={12} md={12} lg={12}>
              <ClientCard config={client}/>
            </Grid>
          ))
        }

      </Grid>
    </div>
  )
}

export default Clients
