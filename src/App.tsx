import {
  useEffect,
  useState,
} from 'react'

import { Download } from 'lucide-react'

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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  const [isInstalled, setIsInstalled] =
    useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (
      event: Event,
    ) => {
      event.preventDefault()

      setInstallPrompt(
        event as BeforeInstallPromptEvent,
      )
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    const standalone =
      window.matchMedia(
        '(display-mode: standalone)',
      ).matches ||
      (
        window.navigator as Navigator & {
          standalone?: boolean
        }
      ).standalone === true

    if (standalone) {
      setIsInstalled(true)
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt,
    )

    window.addEventListener(
      'appinstalled',
      handleAppInstalled,
    )

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled,
      )
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()

    const { outcome } =
      await installPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setInstallPrompt(null)
  }

  if (!installPrompt || isInstalled) {
    return null
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="
        fixed
        right-4
        top-4
        z-[100]
        flex
        items-center
        gap-2
        rounded-2xl
        border-2
        border-foreground
        bg-[#ffd1dc]
        px-4
        py-3
        text-sm
        font-black
        text-foreground
        shadow-[4px_4px_0_#27222b]
        transition-all
        hover:-translate-y-0.5
        hover:shadow-[5px_5px_0_#27222b]
        active:translate-x-1
        active:translate-y-1
        active:shadow-[1px_1px_0_#27222b]
      "
    >
      <Download className="h-4 w-4" strokeWidth={2.5} />
      Install App
    </button>
  )
}

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
        <InstallAppButton />

        <AppRouter />
      </SettingsProvider>
    </AuthProvider>
  )
}