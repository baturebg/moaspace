import { Outlet } from 'react-router-dom'
import NetworkHeader from './NetworkHeader'
import NetworkFooter from './NetworkFooter'
import TabBar from './TabBar'
import styles from './NetworkShell.module.css'

export default function NetworkShell() {
  return (
    <div className={styles.shell}>
      <NetworkHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <NetworkFooter />
      <TabBar />
    </div>
  )
}
