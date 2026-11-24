import { Suspense, useCallback, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { TransactionsProvider } from '../../context/TransactionsContext'
import { initials } from '../../utils/format'
import Logo from '../ui/Logo'
import { PageLoader } from '../ui/Loader'
import * as Icon from '../ui/Icons'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: Icon.Dashboard },
  { to: '/transactions', label: 'Transações', Icon: Icon.Transactions },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <TransactionsProvider>
      <div className="app-layout">
        <div className="mobile-topbar">
          <Logo size={30} />
          <button className="hamburger" onClick={() => setOpen(true)} aria-label="Abrir menu"><Icon.Menu /></button>
        </div>

        {open && <div className="sidebar-overlay" onClick={close} />}

        <aside className={`sidebar ${open ? 'open' : ''}`}>
          <div className="sidebar-logo"><Logo /></div>
          <nav className="nav-section" aria-label="Principal">
            <div className="nav-label">Menu</div>
            {NAV.map(({ to, label, Icon: I }) => (
              <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <I /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="avatar">{initials(user?.name)}</div>
              <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-email">{user?.email}</div>
              </div>
              <button className="logout-btn" onClick={logout} title="Sair" aria-label="Sair"><Icon.Logout /></button>
            </div>
          </div>
        </aside>

        <main className="main">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </TransactionsProvider>
  )
}
