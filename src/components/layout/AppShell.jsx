import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import TabBar from './TabBar'
import styles from './AppShell.module.css'

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <TabBar />
    </div>
  )
}
