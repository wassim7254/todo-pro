import React, {
  useEffect,
  useState,
} from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'register'

export default function LoginScreen() {
  const {
    login,
    register,
    isLoading,
    error,
    clearError,
  } = useAuth()

  const [mode, setMode] =
    useState<Mode>('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [formError, setFormError] =
    useState('')

  useEffect(() => {
    setFormError('')
    clearError()
  }, [mode, clearError])

  const switchMode = (nextMode: Mode) => {
    if (isLoading) return

    setMode(nextMode)
    setFormError('')
    clearError()

    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setFormError('')
    clearError()

    const cleanEmail =
      email.trim().toLowerCase()

    if (mode === 'register') {
      if (!name.trim()) {
        setFormError(
          'Please enter your name.',
        )
        return
      }

      if (!cleanEmail) {
        setFormError(
          'Please enter your email address.',
        )
        return
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          cleanEmail,
        )
      ) {
        setFormError(
          'Please enter a valid email address.',
        )
        return
      }

      if (password.length < 8) {
        setFormError(
          'Your password must be at least 8 characters.',
        )
        return
      }

      if (password !== confirmPassword) {
        setFormError(
          'Your passwords do not match.',
        )
        return
      }

      try {
        await register({
          name: name.trim(),
          email: cleanEmail,
          password,
        })
      } catch {
        // AuthContext displays the error.
      }

      return
    }

    if (!cleanEmail) {
      setFormError(
        'Please enter your email address.',
      )
      return
    }

    if (!password) {
      setFormError(
        'Please enter your password.',
      )
      return
    }

    try {
      await login({
        email: cleanEmail,
        password,
      })
    } catch {
      // AuthContext displays the error.
    }
  }

  const visibleError = formError || error

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl" />

        <div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-pink-500/10 blur-3xl" />

        <div className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-border bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
          {/* Desktop brand panel */}
          <section className="relative hidden min-h-[700px] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-pink-500/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-pink-500 shadow-lg shadow-primary/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>

                <div>
                  <div className="text-xl font-black tracking-tight">
                    Todo
                    <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                      Pro
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Your day, beautifully organized.
                  </p>
                </div>
              </div>

              <div className="mt-24 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  Simple. Focused. Powerful.
                </div>

                <h1 className="text-5xl font-black leading-[1.04] tracking-[-0.04em] xl:text-6xl">
                  Make room for
                  <span className="block bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
                    what matters.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
                  Organize your tasks, plan your
                  week, and stay focused without
                  making productivity complicated.
                </p>
              </div>
            </div>

            <div className="relative space-y-3">
              <Feature
                icon={<Check className="h-4 w-4" />}
                title="Stay on top of your day"
                description="See what's important at a glance."
              />

              <Feature
                icon={
                  <Sparkles className="h-4 w-4" />
                }
                title="Beautifully organized"
                description="Categories, priorities and smart views."
              />

              <Feature
                icon={<Zap className="h-4 w-4" />}
                title="AI-ready productivity"
                description="Manage your tasks faster with your assistant."
              />
            </div>
          </section>

          {/* Login panel */}
          <section className="flex min-h-[700px] items-center justify-center p-6 sm:p-10 lg:p-12">
            <motion.div
              key={mode}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="w-full max-w-md"
            >
              {/* Mobile logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-pink-500 shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="text-lg font-black">
                    Todo
                    <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                      Pro
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Your day, beautifully organized.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-sm font-bold text-primary">
                  {mode === 'login'
                    ? 'Welcome back'
                    : 'Welcome to Todo Pro'}
                </p>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {mode === 'login'
                    ? 'Sign in to Todo Pro'
                    : 'Create your account'}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {mode === 'login'
                    ? 'Pick up exactly where you left off.'
                    : 'Build a calmer, more organized day.'}
                </p>
              </div>

              {/* Tabs */}
              <div className="mb-7 grid grid-cols-2 rounded-2xl border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() =>
                    switchMode('login')
                  }
                  className={`h-11 rounded-xl text-sm font-bold transition ${
                    mode === 'login'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() =>
                    switchMode('register')
                  }
                  className={`h-11 rounded-xl text-sm font-bold transition ${
                    mode === 'register'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Create account
                </button>
              </div>

              {visibleError && (
                <div
                  role="alert"
                  className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400"
                >
                  {visibleError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === 'register' && (
                  <InputField
                    id="name"
                    label="Name"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="Your name"
                    autoComplete="name"
                    icon={
                      <User className="h-4 w-4" />
                    }
                    disabled={isLoading}
                  />
                )}

                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  icon={
                    <Mail className="h-4 w-4" />
                  }
                  disabled={isLoading}
                />

                <PasswordField
                  id="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  visible={showPassword}
                  onToggle={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  disabled={isLoading}
                />

                {mode === 'register' && (
                  <PasswordField
                    id="confirm-password"
                    label="Confirm password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    visible={
                      showConfirmPassword
                    }
                    onToggle={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      {mode === 'login'
                        ? 'Signing in…'
                        : 'Creating account…'}
                    </>
                  ) : (
                    <>
                      {mode === 'login'
                        ? 'Sign in'
                        : 'Create account'}

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  {mode === 'login'
                    ? "Don't have an account?"
                    : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() =>
                      switchMode(
                        mode === 'login'
                          ? 'register'
                          : 'login',
                      )
                    }
                    className="font-bold text-primary hover:underline"
                  >
                    {mode === 'login'
                      ? 'Create one'
                      : 'Sign in'}
                  </button>
                </p>
              </div>

              <p className="mt-8 text-center text-[11px] leading-5 text-muted-foreground">
                Your account is stored locally on
                this device.
              </p>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
  disabled,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: string
  icon: React.ReactNode
  disabled: boolean
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-bold"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-13 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  onToggle: () => void
  autoComplete: string
  disabled: boolean
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-bold"
      >
        {label}
      </label>

      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="At least 8 characters"
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-13 w-full rounded-2xl border border-border bg-background pl-11 pr-12 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={
            visible
              ? 'Hide password'
              : 'Show password'
          }
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}