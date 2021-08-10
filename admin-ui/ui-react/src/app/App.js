/**
 * @Author: yangqixin
 * @TIME: 2021/7/31 14:03
 * @FILE: App.js
 * @Email: 958292256@qq.com
 */
import Navigation from '../components/Navigation'
// import {
//   selectBackgroundClassName,
//   selectDarkMode
// } from '../features/config/configSlice'
// import {
//   selectServerUrl
// } from '../features/connection/connectionSlice'
import ConnectionModal from '../components/ConnectionModal'

import './app.scss'

function App() {
  // const darkMode = useSelector(selectDarkMode)
  // const backgroundClassName = useSelector(selectBackgroundClassName)

  return (
    <>
      <Navigation />
      <ConnectionModal />
    </>
  )
}

export default App
