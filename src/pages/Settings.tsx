import {
  Accessibility,
  Bell,
  Check,
  ChevronLeft,
  Database,
  Globe2,
  Info,
  Laptop,
  Lock,
  Moon,
  Palette,
  RotateCcw,
  Shield,
  SlidersHorizontal,
  Sun,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useSettings,
  type AccentPreset,
} from '../context/SettingsContext'

import {
  SettingsLayout,
  type SettingsSection,
} from '../components/SettingsLayout'

const sections: SettingsSection[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
  },
  {
    id: 'languageRegion',
    label: 'Language & region',
    icon: Globe2,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: SlidersHorizontal,
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: Shield,
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: Accessibility,
  },
  {
    id: 'data',
    label: 'Data',
    icon: Database,
  },
  {
    id: 'about',
    label: 'About',
    icon: Info,
  },
]

function SettingRow({
  title,
  description,
  children,
  danger = false,
}: {
  title: string
  description?: string
  children?: ReactNode
  danger?: boolean
}) {
  return (
    <div
      className={[
        'flex flex-col gap-4 border-b border-[var(--border)] py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8',
        danger ? 'border-red-500/10' : '',
      ].join(' ')}
    >
      <div className="min-w-0">
        <h3
          className={[
            'text-sm font-extrabold',
            danger ? 'text-red-500' : 'text-[var(--text)]',
          ].join(' ')}
        >
          {title}
        </h3>

        {description && (
          <p className="mt-1 max-w-xl text-sm font-medium leading-5 text-[var(--muted)]">
            {description}
          </p>
        )}
      </div>

      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-7 w-12 shrink-0 rounded-full p-1 transition-all duration-200',
        checked
          ? 'bg-[var(--accent)]'
          : 'bg-black/10 dark:bg-white/15',
      ].join(' ')}
    >
      <span
        className={[
          'block size-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void
  children: ReactNode
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full min-w-[170px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-bold text-[var(--text)] outline-none transition focus:border-[var(--accent)] sm:w-auto"
    >
      {children}
    </select>
  )
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description?: string
  icon: typeof Palette
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent)] text-[#292635]">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-[-0.04em] text-[var(--text)] sm:text-2xl">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm font-medium text-[var(--muted)]">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  )
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition',
        active
          ? 'bg-[var(--accent)] text-[#292635] shadow-sm'
          : 'bg-black/[0.045] text-[var(--muted)] hover:bg-black/[0.07] dark:bg-white/[0.07] dark:hover:bg-white/[0.11]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default function Settings() {
  const { t } = useTranslation()

  const {
    settings,
    updateSettings,
    updateNotifications,
    updateTasks,
    updateAccessibility,
    resetSettings,
  } = useSettings()

  const [active, setActive] = useState('appearance')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const sectionLabels: Record<string, string> = {
    appearance: t('settings.appearance', 'Appearance'),
    languageRegion: t(
      'settings.languageRegion',
      'Language & region',
    ),
    notifications: t(
      'settings.notifications',
      'Notifications',
    ),
    tasks: t('settings.tasks', 'Tasks'),
    account: t('settings.account', 'Account'),
    privacy: t('settings.privacy', 'Privacy'),
    accessibility: t(
      'settings.accessibility',
      'Accessibility',
    ),
    data: t('settings.data', 'Data'),
    about: t('settings.about', 'About'),
  }

  const sectionsWithLabels = sections.map((section) => ({
    ...section,
    label: sectionLabels[section.id] ?? section.label,
  }))

  const goHome = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const resetEverything = () => {
    resetSettings()
    setShowResetConfirm(false)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
          <button
            type="button"
            onClick={goHome}
            aria-label="Back to Todo"
            className="grid size-10 shrink-0 place-items-center rounded-xl text-[var(--muted)] transition hover:bg-black/[0.04] hover:text-[var(--text)] dark:hover:bg-white/[0.06]"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
              Todo
            </p>

            <h1 className="truncate text-xl font-extrabold tracking-[-0.04em] sm:text-2xl">
              {t('settings.title', 'Settings')}
            </h1>
          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-extrabold text-[#292635] sm:flex">
            <Check size={14} />
            Saved automatically
          </div>
        </div>
      </header>

      <SettingsLayout
        sections={sectionsWithLabels}
        activeSection={active}
        onSectionChange={setActive}
      >
        <div className="overflow-hidden rounded-[1.7rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_15px_50px_rgba(45,41,48,0.055)]">
          <div className="p-5 sm:p-7 lg:p-8">
            {active === 'appearance' && <AppearanceSection />}
            {active === 'languageRegion' && <LanguageSection />}
            {active === 'notifications' && <NotificationsSection />}
            {active === 'tasks' && <TasksSection />}
            {active === 'account' && <AccountSection />}
            {active === 'privacy' && <PrivacySection />}
            {active === 'accessibility' && <AccessibilitySection />}
            {active === 'data' && <DataSection />}
            {active === 'about' && <AboutSection />}
          </div>
        </div>
      </SettingsLayout>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.7rem] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-3 grid size-11 place-items-center rounded-2xl bg-red-500/10 text-red-500">
                  <RotateCcw size={20} />
                </div>

                <h2 className="text-xl font-extrabold">
                  Reset settings?
                </h2>

                <p className="mt-2 text-sm font-medium leading-5 text-[var(--muted)]">
                  All appearance, language, notification,
                  task and accessibility preferences will
                  return to their defaults.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="grid size-9 place-items-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-xl bg-black/5 px-4 py-3 text-sm font-extrabold dark:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetEverything}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-extrabold text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function AppearanceSection() {
    const accents: {
      id: AccentPreset
      value: string
      label: string
    }[] = [
      { id: 'peach', value: '#ffb86b', label: 'Peach' },
      { id: 'pink', value: '#f39ab8', label: 'Pink' },
      { id: 'lavender', value: '#8d7cf5', label: 'Lavender' },
      { id: 'blue', value: '#70a7ff', label: 'Blue' },
      { id: 'mint', value: '#72cbbb', label: 'Mint' },
      { id: 'yellow', value: '#e9c46a', label: 'Yellow' },
    ]

    return (
      <Section
        title={sectionLabels.appearance}
        description="Customize how Todo looks and feels."
        icon={Palette}
      >
        <SettingRow
          title={t('settings.theme', 'Theme')}
          description="Choose between light, dark, or your device preference."
        >
          <div className="flex flex-wrap gap-2">
            <PillButton
              active={settings.theme === 'light'}
              onClick={() => updateSettings({ theme: 'light' })}
            >
              <span className="inline-flex items-center gap-2">
                <Sun size={15} />
                Light
              </span>
            </PillButton>

            <PillButton
              active={settings.theme === 'dark'}
              onClick={() => updateSettings({ theme: 'dark' })}
            >
              <span className="inline-flex items-center gap-2">
                <Moon size={15} />
                Dark
              </span>
            </PillButton>

            <PillButton
              active={settings.theme === 'system'}
              onClick={() => updateSettings({ theme: 'system' })}
            >
              <span className="inline-flex items-center gap-2">
                <Laptop size={15} />
                System
              </span>
            </PillButton>
          </div>
        </SettingRow>

        <SettingRow
          title={t('settings.accentColor', 'Accent color')}
          description="Pick the color used for buttons, highlights and controls."
        >
          <div className="flex flex-wrap gap-2">
            {accents.map((accent) => (
              <button
                key={accent.id}
                type="button"
                aria-label={accent.label}
                title={accent.label}
                onClick={() =>
                  updateSettings({
                    accentPreset: accent.id,
                  })
                }
                className={[
                  'relative grid size-10 place-items-center rounded-full border-2 transition hover:scale-105',
                  settings.accentPreset === accent.id
                    ? 'border-[var(--text)]'
                    : 'border-transparent',
                ].join(' ')}
                style={{
                  backgroundColor: accent.value,
                }}
              >
                {settings.accentPreset === accent.id && (
                  <Check size={17} className="text-[#292635]" />
                )}
              </button>
            ))}

            <label
              title="Custom color"
              className={[
                'grid size-10 cursor-pointer place-items-center overflow-hidden rounded-full border-2 transition',
                settings.accentPreset === 'custom'
                  ? 'border-[var(--text)]'
                  : 'border-[var(--border)]',
              ].join(' ')}
            >
              <input
                type="color"
                value={settings.customAccent}
                onChange={(event) =>
                  updateSettings({
                    accentPreset: 'custom',
                    customAccent: event.target.value,
                  })
                }
                className="size-14 cursor-pointer"
              />
            </label>
          </div>
        </SettingRow>

        <SettingRow
          title={t('settings.density', 'Density')}
          description="Control the amount of space between interface elements."
        >
          <div className="flex gap-2">
            <PillButton
              active={settings.density === 'comfortable'}
              onClick={() =>
                updateSettings({ density: 'comfortable' })
              }
            >
              Comfortable
            </PillButton>

            <PillButton
              active={settings.density === 'compact'}
              onClick={() => updateSettings({ density: 'compact' })}
            >
              Compact
            </PillButton>
          </div>
        </SettingRow>

        <SettingRow
          title={t('settings.corners', 'Corners')}
          description="Choose how rounded the cards and controls should be."
        >
          <div className="flex gap-2">
            <PillButton
              active={settings.corners === 'rounded'}
              onClick={() => updateSettings({ corners: 'rounded' })}
            >
              Rounded
            </PillButton>

            <PillButton
              active={settings.corners === 'sharp'}
              onClick={() => updateSettings({ corners: 'sharp' })}
            >
              Sharp
            </PillButton>
          </div>
        </SettingRow>
      </Section>
    )
  }

  function LanguageSection() {
    return (
      <Section
        title={sectionLabels.languageRegion}
        description="Choose how Todo displays language, dates and times."
        icon={Globe2}
      >
        <SettingRow
          title="Language"
          description="The interface language will update immediately."
        >
          <Select
            value={settings.language}
            onChange={(event) =>
              updateSettings({ language: event.target.value })
            }
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="tr">Türkçe</option>
          </Select>
        </SettingRow>

        <SettingRow
          title="Date format"
          description="Choose how dates are displayed."
        >
          <Select
            value={settings.dateFormat}
            onChange={(event) =>
              updateSettings({ dateFormat: event.target.value })
            }
          >
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </Select>
        </SettingRow>

        <SettingRow
          title="Time format"
          description="Choose between 12-hour and 24-hour time."
        >
          <Select
            value={settings.timeFormat}
            onChange={(event) =>
              updateSettings({
                timeFormat: event.target.value as '12h' | '24h',
              })
            }
          >
            <option value="12h">12-hour</option>
            <option value="24h">24-hour</option>
          </Select>
        </SettingRow>

        <SettingRow
          title="First day of week"
          description="Choose which day starts your calendar week."
        >
          <Select
            value={settings.firstDayOfWeek}
            onChange={(event) =>
              updateSettings({
                firstDayOfWeek: event.target.value as
                  | 'sunday'
                  | 'monday',
              })
            }
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </Select>
        </SettingRow>
      </Section>
    )
  }

  function NotificationsSection() {
    const items = [
      [
        'taskReminders',
        'Task reminders',
        'Get reminded about upcoming tasks.',
      ],
      [
        'dueDates',
        'Due dates',
        'Notify you when a task reaches its due date.',
      ],
      [
        'overdue',
        'Overdue tasks',
        'Keep overdue tasks visible with notifications.',
      ],
      [
        'dailySummary',
        'Daily summary',
        'Receive a daily overview of your tasks.',
      ],
      [
        'weeklySummary',
        'Weekly summary',
        'Receive a weekly productivity summary.',
      ],
    ] as const

    return (
      <Section
        title={sectionLabels.notifications}
        description="Control which task reminders you want to receive."
        icon={Bell}
      >
        {items.map(([key, title, description]) => (
          <SettingRow
            key={key}
            title={title}
            description={description}
          >
            <Toggle
              checked={settings.notifications[key]}
              onChange={(value) =>
                updateNotifications({
                  [key]: value,
                })
              }
            />
          </SettingRow>
        ))}
      </Section>
    )
  }

  function TasksSection() {
    return (
      <Section
        title={sectionLabels.tasks}
        description="Set the default behavior for your tasks."
        icon={SlidersHorizontal}
      >
        <SettingRow
          title="Default priority"
          description="Priority automatically used for new tasks."
        >
          <Select
            value={settings.tasks.defaultPriority}
            onChange={(event) =>
              updateTasks({
                defaultPriority: event.target.value as
                  | 'low'
                  | 'medium'
                  | 'high',
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </SettingRow>

        <SettingRow
          title="Default category"
          description="Category automatically used for new tasks."
        >
          <Select
            value={settings.tasks.defaultCategory}
            onChange={(event) =>
              updateTasks({
                defaultCategory: event.target.value as
                  | 'personal'
                  | 'work'
                  | 'study'
                  | 'health'
                  | 'other',
              })
            }
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </Select>
        </SettingRow>

        <SettingRow
          title="Confirm before deleting"
          description="Ask for confirmation before permanently deleting a task."
        >
          <Toggle
            checked={settings.tasks.confirmDelete}
            onChange={(value) =>
              updateTasks({ confirmDelete: value })
            }
          />
        </SettingRow>

        <SettingRow
          title="Archive completed tasks"
          description="Keep completed tasks out of your normal task list."
        >
          <Toggle
            checked={settings.tasks.archiveCompleted}
            onChange={(value) =>
              updateTasks({ archiveCompleted: value })
            }
          />
        </SettingRow>

        <SettingRow
          title="Show completed tasks"
          description="Display completed tasks in task views."
        >
          <Toggle
            checked={settings.tasks.showCompleted}
            onChange={(value) =>
              updateTasks({ showCompleted: value })
            }
          />
        </SettingRow>

        <SettingRow
          title="Task sort order"
          description="Choose how tasks are ordered."
        >
          <Select
            value={settings.tasks.sort}
            onChange={(event) =>
              updateTasks({
                sort: event.target.value as
                  | 'due'
                  | 'priority'
                  | 'created',
              })
            }
          >
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
            <option value="created">Created date</option>
          </Select>
        </SettingRow>
      </Section>
    )
  }

  function AccountSection() {
    return (
      <Section
        title={sectionLabels.account}
        description="Manage your local Todo account preferences."
        icon={User}
      >
        <div className="rounded-2xl bg-black/[0.025] p-4 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[var(--accent)]">
              <User size={20} />
            </div>

            <div>
              <p className="text-sm font-extrabold">
                Local account
              </p>

              <p className="text-xs font-medium text-[var(--muted)]">
                Account authentication is handled by the
                login page.
              </p>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  function PrivacySection() {
    return (
      <Section
        title={sectionLabels.privacy}
        description="Understand what this local Todo app stores."
        icon={Lock}
      >
        <SettingRow
          title="Storage"
          description="Your preferences and tasks are stored in this browser's local storage."
        >
          <span className="rounded-full bg-black/[0.045] px-3 py-1.5 text-xs font-extrabold dark:bg-white/[0.07]">
            Local
          </span>
        </SettingRow>

        <SettingRow
          title="Session information"
          description="No server session is required for local task storage."
        >
          <span className="text-sm font-bold text-[var(--muted)]">
            Browser session
          </span>
        </SettingRow>
      </Section>
    )
  }

  function AccessibilitySection() {
    return (
      <Section
        title={sectionLabels.accessibility}
        description="Make Todo easier and more comfortable to use."
        icon={Accessibility}
      >
        <SettingRow
          title="Reduce motion"
          description="Reduce interface animations and transitions."
        >
          <Toggle
            checked={settings.accessibility.reduceMotion}
            onChange={(value) =>
              updateAccessibility({ reduceMotion: value })
            }
          />
        </SettingRow>

        <SettingRow
          title="Larger text"
          description="Increase text size across the application."
        >
          <Toggle
            checked={settings.accessibility.largerText}
            onChange={(value) =>
              updateAccessibility({ largerText: value })
            }
          />
        </SettingRow>

        <SettingRow
          title="High contrast"
          description="Increase contrast between text, backgrounds and controls."
        >
          <Toggle
            checked={settings.accessibility.highContrast}
            onChange={(value) =>
              updateAccessibility({ highContrast: value })
            }
          />
        </SettingRow>

        <SettingRow
          title="Keyboard navigation"
          description="Keep keyboard-friendly navigation enabled."
        >
          <Toggle
            checked={settings.accessibility.keyboardNavigation}
            onChange={(value) =>
              updateAccessibility({
                keyboardNavigation: value,
              })
            }
          />
        </SettingRow>
      </Section>
    )
  }

  function DataSection() {
    const exportTasks = () => {
      const data = localStorage.getItem('todo-pro:todos:v1')
      const payload = data ?? '[]'

      const blob = new Blob([payload], {
        type: 'application/json',
      })

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = 'todo-pro-tasks.json'

      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()

      URL.revokeObjectURL(url)
    }

    const clearCompleted = () => {
      const raw = localStorage.getItem('todo-pro:todos:v1')

      if (!raw) return

      try {
        const todos = JSON.parse(raw)

        const remaining = todos.filter(
          (todo: { isCompleted: boolean }) =>
            !todo.isCompleted,
        )

        localStorage.setItem(
          'todo-pro:todos:v1',
          JSON.stringify(remaining),
        )

        window.location.reload()
      } catch {
        // Ignore invalid storage.
      }
    }

    const resetApp = () => {
      const confirmed = window.confirm(
        'Reset all Todo data? This will delete your tasks and settings.',
      )

      if (!confirmed) return

      localStorage.removeItem('todo-pro:settings:v1')
      localStorage.removeItem('todo-pro:todos:v1')

      window.location.reload()
    }

    return (
      <Section
        title={sectionLabels.data}
        description="Export, import and manage your Todo data."
        icon={Database}
      >
        <SettingRow
          title="Export tasks"
          description="Download all your tasks as a JSON file."
        >
          <button
            type="button"
            onClick={exportTasks}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-extrabold text-[#292635] transition hover:brightness-105 sm:w-auto"
          >
            Export
          </button>
        </SettingRow>

        <SettingRow
          title="Import tasks"
          description="Restore tasks from a Todo JSON backup."
        >
          <label className="block w-full cursor-pointer rounded-xl bg-black/[0.045] px-4 py-2.5 text-center text-sm font-extrabold transition hover:bg-black/[0.07] dark:bg-white/[0.07] dark:hover:bg-white/[0.11] sm:w-auto">
            Import

            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0]

                if (!file) return

                try {
                  const text = await file.text()
                  const parsed = JSON.parse(text)

                  if (!Array.isArray(parsed)) {
                    throw new Error('Invalid task format')
                  }

                  localStorage.setItem(
                    'todo-pro:todos:v1',
                    JSON.stringify(parsed),
                  )

                  window.location.reload()
                } catch {
                  window.alert(
                    'This is not a valid Todo task backup.',
                  )
                }
              }}
            />
          </label>
        </SettingRow>

        <SettingRow
          title="Clear completed"
          description="Remove every completed task permanently."
        >
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all completed tasks?')) {
                clearCompleted()
              }
            }}
            className="w-full rounded-xl bg-black/[0.045] px-4 py-2.5 text-sm font-extrabold dark:bg-white/[0.07] sm:w-auto"
          >
            Clear
          </button>
        </SettingRow>

        <SettingRow
          title="Reset settings"
          description="Return all preferences to their original defaults."
        >
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-extrabold text-red-500 sm:w-auto"
          >
            Reset settings
          </button>
        </SettingRow>

        <SettingRow
          title="Reset application"
          description="Delete tasks and preferences from this browser."
          danger
        >
          <button
            type="button"
            onClick={resetApp}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-extrabold text-white sm:w-auto"
          >
            <Trash2 size={16} />
            Reset everything
          </button>
        </SettingRow>
      </Section>
    )
  }

  function AboutSection() {
    return (
      <Section
        title={sectionLabels.about}
        description="Information about your Todo application."
        icon={Info}
      >
        <SettingRow
          title="Version"
          description="Current application version."
        >
          <span className="rounded-full bg-black/[0.045] px-3 py-1.5 text-xs font-extrabold dark:bg-white/[0.07]">
            1.0.0
          </span>
        </SettingRow>

        <SettingRow
          title="Product"
          description="A quieter way to plan."
        >
          <span className="font-extrabold">Todo</span>
        </SettingRow>

        <div className="mt-5 rounded-2xl bg-[var(--accent)]/15 p-4">
          <div className="flex gap-3">
            <Zap size={19} className="mt-0.5 shrink-0" />

            <p className="text-sm font-semibold leading-5">
              Your settings are saved automatically
              whenever you change them.
            </p>
          </div>
        </div>
      </Section>
    )
  }
}