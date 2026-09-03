import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import i18n from '../i18n'

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'system'

export type Density =
  | 'comfortable'
  | 'compact'

export type Corners =
  | 'rounded'
  | 'sharp'

export type AccentPreset =
  | 'peach'
  | 'pink'
  | 'lavender'
  | 'blue'
  | 'mint'
  | 'yellow'
  | 'custom'

export interface AppSettings {
  theme: ThemeMode
  accentPreset: AccentPreset
  customAccent: string

  density: Density
  corners: Corners

  language: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  firstDayOfWeek:
    | 'sunday'
    | 'monday'

  notifications: {
    taskReminders: boolean
    dueDates: boolean
    overdue: boolean
    dailySummary: boolean
    weeklySummary: boolean
  }

  tasks: {
    defaultPriority:
      | 'low'
      | 'medium'
      | 'high'

    defaultCategory:
      | 'personal'
      | 'work'
      | 'study'
      | 'health'
      | 'other'

    confirmDelete: boolean
    archiveCompleted: boolean
    showCompleted: boolean

    sort:
      | 'due'
      | 'priority'
      | 'created'
  }

  accessibility: {
    reduceMotion: boolean
    largerText: boolean
    highContrast: boolean
    keyboardNavigation: boolean
  }
}

const STORAGE_KEY =
  'todo-pro:settings:v1'

export const defaultSettings: AppSettings = {
  theme: 'system',

  accentPreset: 'peach',
  customAccent: '#ffb86b',

  density: 'comfortable',
  corners: 'rounded',

  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  firstDayOfWeek: 'sunday',

  notifications: {
    taskReminders: true,
    dueDates: true,
    overdue: true,
    dailySummary: false,
    weeklySummary: false,
  },

  tasks: {
    defaultPriority: 'medium',
    defaultCategory: 'personal',
    confirmDelete: true,
    archiveCompleted: false,
    showCompleted: true,
    sort: 'due',
  },

  accessibility: {
    reduceMotion: false,
    largerText: false,
    highContrast: false,
    keyboardNavigation: true,
  },
}

interface SettingsContextValue {
  settings: AppSettings

  updateSettings: (
    patch: Partial<AppSettings>,
  ) => void

  updateNotifications: (
    patch: Partial<
      AppSettings['notifications']
    >,
  ) => void

  updateTasks: (
    patch: Partial<AppSettings['tasks']>,
  ) => void

  updateAccessibility: (
    patch: Partial<
      AppSettings['accessibility']
    >,
  ) => void

  resetSettings: () => void
}

const SettingsContext =
  createContext<SettingsContextValue>({
    settings: defaultSettings,
    updateSettings: () => {},
    updateNotifications: () => {},
    updateTasks: () => {},
    updateAccessibility: () => {},
    resetSettings: () => {},
  })

function loadSettings(): AppSettings {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return defaultSettings
    }

    const parsed = JSON.parse(raw)

    return {
      ...defaultSettings,
      ...parsed,

      notifications: {
        ...defaultSettings.notifications,
        ...(parsed.notifications ?? {}),
      },

      tasks: {
        ...defaultSettings.tasks,
        ...(parsed.tasks ?? {}),
      },

      accessibility: {
        ...defaultSettings.accessibility,
        ...(parsed.accessibility ?? {}),
      },
    }
  } catch {
    return defaultSettings
  }
}

function getAccent(
  settings: AppSettings,
) {
  const accents: Record<
    AccentPreset,
    string
  > = {
    peach: '#ffb86b',
    pink: '#f39ab8',
    lavender: '#8d7cf5',
    blue: '#70a7ff',
    mint: '#72cbbb',
    yellow: '#e9c46a',
    custom: settings.customAccent,
  }

  return accents[
    settings.accentPreset
  ]
}

export function SettingsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [settings, setSettings] =
    useState<AppSettings>(
      () => loadSettings(),
    )

  /*
   * Persist settings.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings),
      )
    } catch {
      // Ignore storage errors.
    }
  }, [settings])

  /*
   * Apply language and direction.
   */
  useEffect(() => {
    void i18n.changeLanguage(
      settings.language,
    )

    const root =
      document.documentElement

    root.lang = settings.language

    root.dir =
      settings.language === 'ar'
        ? 'rtl'
        : 'ltr'

    try {
      localStorage.setItem(
        'todo-pro:language',
        settings.language,
      )
    } catch {
      // Ignore storage errors.
    }
  }, [settings.language])

  /*
   * Apply visual settings.
   */
  useEffect(() => {
    const root =
      document.documentElement

    root.dataset.theme =
      settings.theme

    root.dataset.density =
      settings.density

    root.dataset.corners =
      settings.corners

    root.classList.toggle(
      'accessibility-large-text',
      settings.accessibility
        .largerText,
    )

    root.classList.toggle(
      'accessibility-high-contrast',
      settings.accessibility
        .highContrast,
    )

    root.classList.toggle(
      'reduce-motion',
      settings.accessibility
        .reduceMotion,
    )

    root.classList.toggle(
      'keyboard-navigation',
      settings.accessibility
        .keyboardNavigation,
    )

    root.style.setProperty(
      '--accent',
      getAccent(settings),
    )

    root.style.setProperty(
      '--spacing-scale',
      settings.density ===
        'compact'
        ? '0.82'
        : '1',
    )

    root.style.setProperty(
      '--density-padding',
      settings.density ===
        'compact'
        ? '0.82'
        : '1',
    )

    root.style.setProperty(
      '--radius',
      settings.corners ===
        'sharp'
        ? '0.25rem'
        : '1.25rem',
    )
  }, [settings])

  /*
   * Resolve system theme.
   */
  useEffect(() => {
    const root =
      document.documentElement

    const media =
      window.matchMedia(
        '(prefers-color-scheme: dark)',
      )

    const updateTheme = () => {
      const resolvedTheme =
        settings.theme === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : settings.theme

      root.dataset.resolvedTheme =
        resolvedTheme
    }

    updateTheme()

    media.addEventListener(
      'change',
      updateTheme,
    )

    return () => {
      media.removeEventListener(
        'change',
        updateTheme,
      )
    }
  }, [settings.theme])

  const value =
    useMemo<SettingsContextValue>(
      () => ({
        settings,

        updateSettings: (patch) => {
          setSettings((current) => ({
            ...current,
            ...patch,
          }))
        },

        updateNotifications: (
          patch,
        ) => {
          setSettings((current) => ({
            ...current,

            notifications: {
              ...current.notifications,
              ...patch,
            },
          }))
        },

        updateTasks: (patch) => {
          setSettings((current) => ({
            ...current,

            tasks: {
              ...current.tasks,
              ...patch,
            },
          }))
        },

        updateAccessibility: (
          patch,
        ) => {
          setSettings((current) => ({
            ...current,

            accessibility: {
              ...current.accessibility,
              ...patch,
            },
          }))
        },

        resetSettings: () => {
          setSettings({
            ...defaultSettings,

            notifications: {
              ...defaultSettings.notifications,
            },

            tasks: {
              ...defaultSettings.tasks,
            },

            accessibility: {
              ...defaultSettings.accessibility,
            },
          })
        },
      }),
      [settings],
    )

  return (
    <SettingsContext.Provider
      value={value}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}