import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
const AUTH_STORAGE_KEY = 'todo-pro:auth:v1'
const SESSION_STORAGE_KEY = 'todo-pro:session:v1'
const PROFILE_STORAGE_KEY = 'todo-pro:profile:v1'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  createdAt: string
}

interface StoredAccount {
  id: string
  name: string
  email: string
  avatar: string
  passwordHash: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string

  login: (
    credentials: LoginCredentials,
  ) => Promise<void>

  register: (
    credentials: RegisterCredentials,
  ) => Promise<void>

  logout: () => void

  updateUser: (
    updates: Partial<
      Pick<AuthUser, 'name' | 'email' | 'avatar'>
    >,
  ) => void

  clearError: () => void
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined)

function safeParse<T>(value: string | null): T | null {
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function getAccount(): StoredAccount | null {
  if (typeof window === 'undefined') {
    return null
  }

  return safeParse<StoredAccount>(
    localStorage.getItem(AUTH_STORAGE_KEY),
  )
}

function getSession(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(SESSION_STORAGE_KEY)
}

function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

async function hashPassword(
  password: string,
): Promise<string> {
  if (
    typeof crypto === 'undefined' ||
    !crypto.subtle
  ) {
    throw new Error(
      'Secure password hashing is not available in this browser.',
    )
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(password)

  const hash = await crypto.subtle.digest(
    'SHA-256',
    data,
  )

  return Array.from(new Uint8Array(hash))
    .map((byte) =>
      byte.toString(16).padStart(2, '0'),
    )
    .join('')
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function accountToUser(
  account: StoredAccount,
): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    avatar: account.avatar,
    createdAt: account.createdAt,
  }
}

function saveAccount(account: StoredAccount) {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(account),
  )
}

function saveProfile(account: StoredAccount) {
  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
    }),
  )
}

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const account = getAccount()
      const session = getSession()

      if (
        account &&
        session &&
        session === account.id
      ) {
        setUser(accountToUser(account))
      } else {
        localStorage.removeItem(
          SESSION_STORAGE_KEY,
        )

        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError('')
  }, [])

  const login = useCallback(
    async ({
      email,
      password,
    }: LoginCredentials) => {
      setError('')
      setIsLoading(true)

      try {
        const cleanEmail =
          typeof email === 'string'
            ? email.trim().toLowerCase()
            : ''

        const cleanPassword =
          typeof password === 'string'
            ? password
            : ''

        if (!cleanEmail) {
          throw new Error(
            'Please enter your email address.',
          )
        }

        if (!isValidEmail(cleanEmail)) {
          throw new Error(
            'Please enter a valid email address.',
          )
        }

        if (!cleanPassword) {
          throw new Error(
            'Please enter your password.',
          )
        }

        const account = getAccount()

        if (!account) {
          throw new Error(
            'No account exists on this device. Create an account first.',
          )
        }

        if (account.email !== cleanEmail) {
          throw new Error(
            'The email or password is incorrect.',
          )
        }

        const passwordHash =
          await hashPassword(cleanPassword)

        if (
          passwordHash !== account.passwordHash
        ) {
          throw new Error(
            'The email or password is incorrect.',
          )
        }

        localStorage.setItem(
          SESSION_STORAGE_KEY,
          account.id,
        )

        saveProfile(account)

        setUser(accountToUser(account))
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to sign in.'

        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const register = useCallback(
    async ({
      name,
      email,
      password,
    }: RegisterCredentials) => {
      setError('')
      setIsLoading(true)

      try {
        const cleanName =
          typeof name === 'string'
            ? name.trim()
            : ''

        const cleanEmail =
          typeof email === 'string'
            ? email.trim().toLowerCase()
            : ''

        const cleanPassword =
          typeof password === 'string'
            ? password
            : ''

        if (!cleanName) {
          throw new Error(
            'Please enter your name.',
          )
        }

        if (cleanName.length < 2) {
          throw new Error(
            'Your name must contain at least 2 characters.',
          )
        }

        if (!cleanEmail) {
          throw new Error(
            'Please enter your email address.',
          )
        }

        if (!isValidEmail(cleanEmail)) {
          throw new Error(
            'Please enter a valid email address.',
          )
        }

        if (cleanPassword.length < 8) {
          throw new Error(
            'Your password must be at least 8 characters.',
          )
        }

        const existingAccount = getAccount()

        if (existingAccount) {
          throw new Error(
            'An account already exists on this device. Please sign in instead.',
          )
        }

        const passwordHash =
          await hashPassword(cleanPassword)

        const account: StoredAccount = {
          id: createId(),
          name: cleanName,
          email: cleanEmail,
          avatar: '',
          passwordHash,
          createdAt:
            new Date().toISOString(),
        }

        saveAccount(account)

        localStorage.setItem(
          SESSION_STORAGE_KEY,
          account.id,
        )

        saveProfile(account)

        setUser(accountToUser(account))
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to create your account.'

        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(
      SESSION_STORAGE_KEY,
    )

    setUser(null)
    setError('')
  }, [])

  const updateUser = useCallback(
    (
      updates: Partial<
        Pick<AuthUser, 'name' | 'email' | 'avatar'>
      >,
    ) => {
      setUser((currentUser) => {
        if (!currentUser) {
          return currentUser
        }

        const updatedUser: AuthUser = {
          ...currentUser,
          ...updates,
        }

        const account = getAccount()

        if (
          account &&
          account.id === currentUser.id
        ) {
          const updatedAccount: StoredAccount = {
            ...account,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
          }

          saveAccount(updatedAccount)
          saveProfile(updatedAccount)
        }

        return updatedUser
      })
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      register,
      logout,
      updateUser,
      clearError,
    }),
    [
      user,
      isLoading,
      error,
      login,
      register,
      logout,
      updateUser,
      clearError,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.',
    )
  }

  return context
}