import React, {
  useEffect,
  useState,
} from 'react'
import { Profile } from './features/todos/components/Profile'
import {
  AuthProvider,
  useAuth,
} from './context/AuthContext'
import Logout from './features/todos/components/Logout'
import {
  SettingsProvider,
} from './context/SettingsContext'

import LoginScreen from './pages/LoginScreen'
import { TodoApp } from './features/todos/components/TodoApp'
import Settings from './pages/Settings'

function AppRouter() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth()

  const [path, setPath] = useState(
    () =>
      typeof window !== 'undefined'
        ? window.location.pathname
        : '/',
  )

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener(
      'popstate',
      handlePopState,
    )

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState,
      )
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      return
    }
    
    if (!isAuthenticated) {
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.history.replaceState(
          {},
          '',
          '/login',
        )
      }

      setPath('/login')

      return
    }

    if (
      typeof window !== 'undefined' &&
      window.location.pathname === '/login'
    ) {
      window.history.replaceState(
        {},
        '',
        '/',
      )

      setPath('/')
    }
  }, [
    isAuthenticated,
    isLoading,
  ])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  if (path === '/settings') {
    return <Settings />
  }
  if (path === '/profile') {
  return <Profile />
}
if (path === '/logout') {
  return <Logout />
}
  return <TodoApp />
}

function LoadingScreen() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-primary via-violet-500 to-pink-500 shadow-xl shadow-primary/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>

        <div className="mt-5 text-lg font-black">
          Todo
          <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Pro
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Getting everything ready…
        </p>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppRouter />
      </SettingsProvider>
    </AuthProvider>
  )
}