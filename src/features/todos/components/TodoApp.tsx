import { motion } from 'framer-motion'
import {
  Bell,
  CalendarDays,
  CircleAlert,
  ListFilter,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import {
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { categories } from '../data/categories'
import { useSettings } from '../../../context/SettingsContext'
import { useAuth } from '../../../context/AuthContext'
import { useTodoManager } from '../hooks/useTodoManager'

import type {
  Todo,
  TodoFilters,
  TodoView,
} from '../types/todo.types'

import {
  addDays,
  formatLongDate,
} from '../utils/date'

import { BottomNavigation } from './BottomNavigation'
import { CalendarStrip } from './CalendarStrip'
import { TaskList } from './TaskList'
import { TaskSheet } from './TaskSheet'
import { TodoChatbot } from './TodoChatbot'

type SheetState =
  | { mode: 'create' }
  | { mode: 'detail'; todoId: string }
  | null

type SupportedLanguage =
  | 'en'
  | 'de'
  | 'tr'
  | 'fr'
  | 'es'
  | 'ar'

const LANGUAGE_STORAGE_KEY =
  'todo-pro:language'

const SUPPORTED_LANGUAGES: Array<{
  code: SupportedLanguage
  label: string
}> = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
]

/* ============================================================
   PLAYFUL DECORATIONS
============================================================ */

function DoodleStar({ className = '' }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none text-[#d9a62e] ${className}`}
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 0.9, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      ✦
    </motion.span>
  )
}

function DoodleSmile({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none text-[#35a995]/30 ${className}`}
    >
      ☻
    </span>
  )
}

function Sticker({
  children,
  className = '',
  rotate = 0,
}: {
  children: React.ReactNode
  className?: string
  rotate?: number
}) {
  return (
    <span
      style={{ rotate: `${rotate}deg` }}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border-2
        border-foreground/10
        bg-card
        px-3
        py-1.5
        text-[10px]
        font-black
        uppercase
        tracking-[0.13em]
        shadow-[3px_3px_0_rgba(0,0,0,0.08)]
        ${className}
      `}
    >
      {children}
    </span>
  )
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="app-bg min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="
            app-surface
            min-h-[calc(100vh-2rem)]
            overflow-hidden
            rounded-[34px]
            border-2
            border-foreground
            p-5
            shadow-[8px_8px_0_rgba(0,0,0,0.06)]
            sm:p-7
            lg:p-10
          "
        >
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 w-28 rounded-full bg-muted" />
                <div className="mt-3 h-4 w-44 rounded-full bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="size-11 rounded-[18px] bg-muted" />
                <div className="size-11 rounded-[18px] bg-muted" />
              </div>
            </div>
            <div className="mt-10 h-52 rounded-[32px] bg-muted" />
            <div className="mt-7 h-32 rounded-[28px] bg-muted" />
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-44 rounded-[28px] bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/* ============================================================
   MAIN APP
============================================================ */

export function TodoApp() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { settings, updateTasks } = useSettings()
  const manager = useTodoManager()

  const [view, setView] = useState<TodoView>('today')
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<TodoFilters['priority']>('all')
  const [category, setCategory] = useState<TodoFilters['category']>('all')
  const [completion, setCompletion] = useState<TodoFilters['completion']>(
    settings.tasks.showCompleted ? 'all' : 'open',
  )
  const [sort, setSort] = useState<TodoFilters['sort']>(settings.tasks.sort)
  const [showFilters, setShowFilters] = useState(false)
  const [sheet, setSheet] = useState<SheetState>(null)
  const [showAi, setShowAi] = useState(false)

  const displayName = user?.name?.trim() || 'there'
  const avatar = user?.avatar || ''
  const avatarInitial = displayName.charAt(0).toUpperCase() || 'T'

  const openProfile = () => navigate('/profile')
  const openSettings = () => navigate('/settings')

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(language)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  const filters = useMemo<TodoFilters>(
    () => ({ view, selectedDate, search, priority, category, completion, sort }),
    [view, selectedDate, search, priority, category, completion, sort],
  )

  const visibleTodos = manager.getVisibleTodos(filters)
  const selectedTodo = sheet?.mode === 'detail' 
    ? manager.todos.find((todo) => todo.id === sheet.todoId) ?? null 
    : null

  const openTodos = manager.todos.filter((todo) => !todo.isCompleted).length
  const completionRatio = manager.metrics.total > 0 
    ? Math.round((manager.metrics.completed / manager.metrics.total) * 100) 
    : 0

  const hasActiveFilters = Boolean(
    search || priority !== 'all' || category !== 'all' || 
    completion !== (settings.tasks.showCompleted ? 'all' : 'open'),
  )

  const changeView = (nextView: TodoView) => {
    setView(nextView)
    if (nextView === 'today') setSelectedDate(new Date())
  }

  const openTask = (todo: Todo) => setSheet({ mode: 'detail', todoId: todo.id })
  const createTask = () => {
    setShowAi(false)
    setSheet({ mode: 'create' })
  }

  const clearFilters = () => {
    setSearch('')
    setPriority('all')
    setCategory('all')
    setCompletion(settings.tasks.showCompleted ? 'all' : 'open')
    setSort(settings.tasks.sort)
  }

  const createTaskFromAi = (draft: any) => manager.addTodo(draft)

  const currentLanguage = SUPPORTED_LANGUAGES.some((item) => item.code === i18n.language)
    ? (i18n.language as SupportedLanguage)
    : 'en'

  const viewLabels: Record<TodoView, string> = {
    today: t('navigation.today', { defaultValue: 'Today' }),
    week: t('navigation.week', { defaultValue: 'This week' }),
    upcoming: t('navigation.upcoming', { defaultValue: 'Upcoming' }),
    all: t('navigation.all', { defaultValue: 'All tasks' }),
  }

  const categoryStyles: Record<string, { dot: string; active: string; accent: string }> = {
    personal: { dot: 'bg-[#ee6f96]', active: 'border-[#ee6f96]/35 bg-[#ee6f96]/10 text-[#ee6f96]', accent: '#ee6f96' },
    work: { dot: 'bg-[#7764e8]', active: 'border-[#7764e8]/35 bg-[#7764e8]/10 text-[#7764e8]', accent: '#7764e8' },
    study: { dot: 'bg-[#35a995]', active: 'border-[#35a995]/35 bg-[#35a995]/10 text-[#35a995]', accent: '#35a995' },
    health: { dot: 'bg-[#ed8664]', active: 'border-[#ed8664]/35 bg-[#ed8664]/10 text-[#ed8664]', accent: '#ed8664' },
    other: { dot: 'bg-[#d9a62e]', active: 'border-[#d9a62e]/35 bg-[#d9a62e]/10 text-[#d9a62e]', accent: '#d9a62e' },
  }

  if (!manager.isReady) return <LoadingState />

  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto min-h-screen max-w-[1440px] px-0 lg:px-5 lg:py-5 xl:px-7">
        <main
          className="
            app-surface
            relative
            min-h-screen
            overflow-hidden
            border-x
            border-foreground
            px-4
            pb-28
            pt-5
            sm:px-7
            sm:pt-7
            lg:min-h-0
            lg:rounded-[38px]
            lg:border-2
            lg:px-9
            lg:py-9
            lg:shadow-[10px_10px_0_rgba(0,0,0,0.05)]
            xl:px-11
          "
        >
          {/* ==================================================
              DECORATIVE BACKGROUND
          =================================================== */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-20 size-72 rounded-full bg-[#ee6f96]/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-[520px] size-72 rounded-full bg-[#35a995]/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute right-1/4 top-[850px] size-60 rounded-full bg-[#7764e8]/8 blur-3xl" />

          {/* ==================================================
              HEADER
          =================================================== */}
          <header className="relative z-10 mb-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-[30px] font-black leading-none tracking-[-0.075em] text-foreground sm:text-[34px]">
                      {t('app.logo', { defaultValue: 'Todo' })}
                      <span className="text-[#ee6f96]">.</span>
                    </h1>
                  </motion.div>
                  <span className="rotate-[-7deg] rounded-[10px] border-2 border-[#7764e8]/20 bg-[#7764e8]/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#7764e8]">
                    PRO
                  </span>
                </div>
                <p className="mt-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
                  {t('app.tagline', { defaultValue: 'a quieter way to plan' })}
                </p>
              </div>

              {/* DESKTOP CONTROLS */}
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  className="
                    group relative grid size-12 place-items-center rounded-[18px] 
                    border-2 border-foreground/10 bg-card text-[#7764e8] 
                    shadow-[3px_3px_0_rgba(0,0,0,0.08)]
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,0.12)] active:translate-y-0
                  "
                >
                  <Bell size={19} className="transition-transform group-hover:rotate-[-8deg]" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-[#ee6f96] ring-2 ring-card" />
                </button>

                <select
                  value={currentLanguage}
                  onChange={(event) => void changeLanguage(event.target.value as SupportedLanguage)}
                  className="
                    h-12 max-w-[128px] rounded-[18px] border-2 border-foreground/10 
                    bg-card px-3 text-xs font-black text-foreground shadow-[3px_3px_0_rgba(0,0,0,0.08)]
                    outline-none transition hover:border-foreground/30 focus:border-[#35a995]
                  "
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={openProfile}
                  className="
                    group relative grid size-12 place-items-center overflow-hidden rounded-[18px] 
                    border-2 border-foreground/10 bg-card shadow-[3px_3px_0_rgba(0,0,0,0.08)]
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,0.12)] active:translate-y-0
                  "
                >
                  {avatar ? <img src={avatar} alt="" className="size-full object-cover" /> : <span className="text-sm font-black">{avatarInitial}</span>}
                </button>

                <button
                  type="button"
                  onClick={openSettings}
                  className="
                    group grid size-12 place-items-center rounded-[18px] 
                    border-2 border-foreground/10 bg-card text-[#d9a62e]
                    shadow-[3px_3px_0_rgba(0,0,0,0.08)]
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,0.12)] active:translate-y-0
                  "
                >
                  <Settings size={19} className="transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </div>

              {/* MOBILE CONTROLS */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <select
                  value={currentLanguage}
                  onChange={(event) => void changeLanguage(event.target.value as SupportedLanguage)}
                  className="h-10 w-[54px] appearance-none rounded-[15px] border-2 border-foreground/10 bg-card px-1 text-center text-[10px] font-black text-foreground outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.code.toUpperCase()}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={openProfile}
                  className="grid size-10 place-items-center overflow-hidden rounded-[15px] border-2 border-foreground/10 bg-card transition active:scale-95"
                >
                  {avatar ? <img src={avatar} alt="" className="size-full object-cover" /> : <span className="text-xs font-black">{avatarInitial}</span>}
                </button>
                <button
                  type="button"
                  onClick={openSettings}
                  className="grid size-10 place-items-center rounded-[15px] border-2 border-foreground/10 bg-card text-[#d9a62e] transition active:scale-95"
                >
                  <Settings size={17} />
                </button>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <div className="mt-7 hidden sm:block">
              <div className="inline-flex rounded-[22px] border-2 border-foreground/10 bg-muted/60 p-1.5 shadow-[3px_3px_0_rgba(0,0,0,0.04)]">
                {([ 'today', 'week', 'upcoming', 'all' ] as TodoView[]).map((item) => {
                  const active = view === item
                  const accent = item === 'today' ? 'from-[#ee6f96] to-[#ed8664]' : item === 'week' ? 'from-[#7764e8] to-[#9b82f4]' : item === 'upcoming' ? 'from-[#35a995] to-[#52c6ae]' : 'from-[#d9a62e] to-[#edc65d]'
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeView(item)}
                      className={`
                        relative overflow-hidden rounded-[16px] px-5 py-2.5 text-sm font-black transition-all duration-200 active:scale-[0.98]
                        ${active ? `bg-gradient-to-r ${accent} text-white shadow-[3px_3px_0_rgba(0,0,0,0.10)]` : `text-muted-foreground hover:bg-card hover:text-foreground`}
                      `}
                    >
                      {active && (
                        <>
                          <span aria-hidden="true" className="absolute -right-3 -top-4 size-10 rounded-full bg-white/20 blur-md" />
                          <span aria-hidden="true" className="absolute bottom-1 left-2 size-1 rounded-full bg-white/60" />
                        </>
                      )}
                      <span className="relative">{viewLabels[item]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </header>

          {/* ==================================================
              HERO / DAILY NOTE
          =================================================== */}
          <section
            className="
              relative
              mb-7
              overflow-hidden
              rounded-[34px]
              border-2
              border-foreground
              bg-gradient-to-br
              from-[#7764e8]/15
              via-card
              to-[#ee6f96]/15
              p-5
              shadow-[6px_6px_0_rgba(0,0,0,0.08)]
              sm:p-8
            "
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[#ee6f96]/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-[#35a995]/15 blur-3xl" />

            <DoodleStar className="pointer-events-none absolute right-9 top-8 hidden size-9 rotate-12 text-[#ee6f96]/60 sm:block" />
            <DoodleSmile className="pointer-events-none absolute bottom-5 right-10 hidden size-16 -rotate-6 text-[#35a995]/40 sm:block" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <Sticker className="border-[#7764e8]/20 text-[#7764e8]" rotate={-2}>
                  {formatLongDate(selectedDate, settings)}
                </Sticker>
                <span aria-hidden="true" className="size-2 rotate-45 rounded-[3px] bg-[#ee6f96]" />
                <Sticker className="border-[#35a995]/20 text-[#35a995]" rotate={2}>
                  {viewLabels[view]}
                </Sticker>
              </div>

              <div className="max-w-3xl">
                <h2 className="mt-5 text-[34px] font-black leading-[0.98] tracking-[-0.07em] text-foreground sm:text-[52px] lg:text-[58px]">
                  {t(getGreetingKey())},{' '}
                  <span className="relative inline-block">
                    {displayName}
                    <span aria-hidden="true" className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-[#ee6f96]/25" />
                  </span>
                  <span className="text-[#ee6f96]">.</span>
                </h2>

                <p className="mt-4 max-w-xl text-sm font-black leading-6 text-muted-foreground sm:text-base uppercase tracking-tight">
                  {manager.metrics.dueToday
                    ? t('greeting.nudges', { count: manager.metrics.dueToday })
                    : t('greeting.open', { defaultValue: 'Your day is beautifully open.' })}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="flex items-center gap-2.5 rounded-[17px] border-2 border-foreground/10 bg-[#35a995]/10 px-4 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.07)]">
                  <span className="size-2.5 rounded-full bg-[#35a995]" />
                  <span className="text-xs font-black text-foreground">{openTodos}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{t('productivity.open', { defaultValue: 'open' })}</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-[17px] border-2 border-foreground/10 bg-[#7764e8]/10 px-4 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.07)]">
                  <span className="size-2.5 rounded-full bg-[#7764e8]" />
                  <span className="text-xs font-black text-foreground">{completionRatio}%</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{t('productivity.complete', { defaultValue: 'complete' })}</span>
                </div>

                {manager.metrics.dueToday > 0 && (
                  <div className="flex items-center gap-2.5 rounded-[17px] border-2 border-foreground/10 bg-[#ed8664]/10 px-4 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.07)]">
                    <span className="size-2.5 rounded-full bg-[#ed8664]" />
                    <span className="text-xs font-black text-foreground">{manager.metrics.dueToday}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">{t('productivity.due', { defaultValue: 'due' })}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ==================================================
              MAIN GRID
          =================================================== */}
          <div className="relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1fr)_285px]">
            <div className="min-w-0">
              {/* CALENDAR SECTION */}
              <section className="relative overflow-hidden rounded-[30px] border-2 border-foreground bg-card shadow-[5px_5px_0_rgba(0,0,0,0.08)]">
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-[#35a995]/10 blur-2xl" />
                <div className="relative flex items-center justify-between px-5 pt-5 sm:px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#35a995]" />
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#35a995]">
                        {t('calendar.thisWeek', { defaultValue: 'This week' })}
                      </p>
                    </div>
                    <p className="mt-1.5 text-base font-black tracking-[-0.025em] text-foreground">
                      {formatLongDate(selectedDate, settings)}
                    </p>
                  </div>
                  <div className="grid size-11 place-items-center rounded-[15px] border-2 border-foreground/10 bg-[#35a995]/10 text-[#35a995] shadow-[2px_2px_0_rgba(0,0,0,0.07)]">
                    <CalendarDays size={19} />
                  </div>
                </div>
                <div className="relative px-2 pb-2 pt-3 sm:px-3">
                  <CalendarStrip
                    selectedDate={selectedDate}
                    todos={manager.todos}
                    onSelectDate={(date) => { setSelectedDate(date); setView('today'); }}
                    onPreviousWeek={() => setSelectedDate((date) => addDays(date, -7))}
                    onNextWeek={() => setSelectedDate((date) => addDays(date, 7))}
                  />
                </div>
              </section>

              {/* SEARCH / FILTERS */}
              <section className="mt-7">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7764e8]">
                      {t('tasks.label', { defaultValue: 'Your tasks' })}
                    </p>
                    <h2 className="mt-1 text-2xl font-black tracking-[-0.055em] text-foreground">
                      {viewLabels[view]}
                    </h2>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="text-[11px] font-black text-muted-foreground uppercase">
                      {visibleTodos.length} {t('tasks.visible', { defaultValue: 'visible' })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <label className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7764e8]" size={18} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t('search.placeholder', { defaultValue: 'Search your tasks' })}
                      className="
                        h-[54px] w-full rounded-[21px] border-2 border-foreground/10 
                        bg-card py-3 pl-11 pr-4 text-sm font-black text-foreground 
                        shadow-[3px_3px_0_rgba(0,0,0,0.05)] outline-none transition 
                        focus:border-[#7764e8] focus:ring-4 focus:ring-[#7764e8]/10
                      "
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowFilters((isOpen) => !isOpen)}
                    className={`
                      grid size-[54px] shrink-0 place-items-center rounded-[21px] border-2 transition-all duration-200 active:scale-95
                      ${showFilters || hasActiveFilters 
                        ? 'border-foreground bg-[#7764e8]/10 text-[#7764e8] shadow-[3px_3px_0_rgba(0,0,0,0.08)]' 
                        : 'border-foreground/10 bg-card text-muted-foreground hover:bg-muted'}
                    `}
                  >
                    <SlidersHorizontal size={19} />
                  </button>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    className="mt-3 overflow-hidden rounded-[25px] border-2 border-foreground/10 bg-muted/40 p-3 sm:p-4 shadow-[3px_3px_0_rgba(0,0,0,0.04)]"
                  >
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="text-xs font-black text-muted-foreground uppercase">
                        {t('filters.priority', { defaultValue: 'Priority' })}
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as TodoFilters['priority'])}
                          className="mt-1.5 w-full rounded-[16px] border-2 border-foreground/10 bg-card px-3 py-2.5 text-sm font-black outline-none focus:border-foreground"
                        >
                          <option value="all">Any priority</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </label>
                      <label className="text-xs font-black text-muted-foreground uppercase">
                        {t('filters.status', { defaultValue: 'Status' })}
                        <select
                          value={completion}
                          onChange={(e) => setCompletion(e.target.value as TodoFilters['completion'])}
                          className="mt-1.5 w-full rounded-[16px] border-2 border-foreground/10 bg-card px-3 py-2.5 text-sm font-black outline-none focus:border-foreground"
                        >
                          <option value="open">Open tasks</option>
                          <option value="completed">Completed tasks</option>
                          <option value="all">Everything</option>
                        </select>
                      </label>
                      <label className="text-xs font-black text-muted-foreground uppercase">
                        {t('filters.sortBy', { defaultValue: 'Sort by' })}
                        <select
                          value={sort}
                          onChange={(e) => {
                            const nextSort = e.target.value as TodoFilters['sort']
                            setSort(nextSort); updateTasks({ sort: nextSort });
                          }}
                          className="mt-1.5 w-full rounded-[16px] border-2 border-foreground/10 bg-card px-3 py-2.5 text-sm font-black outline-none focus:border-foreground"
                        >
                          <option value="due">Due date</option>
                          <option value="priority">Priority</option>
                          <option value="created">Recently added</option>
                        </select>
                      </label>
                    </div>
                  </motion.div>
                )}

                <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setCategory('all')}
                    className={`
                      shrink-0 rounded-full border-2 px-4 py-2.5 text-xs font-black transition-all
                      ${category === 'all' ? 'border-foreground bg-gradient-to-r from-[#7764e8] to-[#ee6f96] text-white shadow-[3px_3px_0_rgba(0,0,0,0.1)]' : 'border-foreground/10 bg-card text-muted-foreground hover:bg-muted'}
                    `}
                  >
                    {t('filters.allCategories', { defaultValue: 'All categories' })}
                  </button>
                  {categories.map((item) => {
                    const active = category === item.id
                    const styles = categoryStyles[item.id] ?? categoryStyles.other
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(active ? 'all' : item.id)}
                        className={`
                          inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-xs font-black transition-all
                          ${active ? `${styles.active} border-foreground shadow-[3px_3px_0_rgba(0,0,0,0.05)]` : 'border-foreground/10 bg-card text-muted-foreground hover:bg-muted'}
                        `}
                      >
                        <span className={`size-2.5 rounded-full ${styles.dot}`} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-foreground/10 bg-[#ee6f96]/10 px-3.5 py-2 text-xs font-black text-[#ee6f96] transition hover:bg-[#ee6f96]/20 active:scale-95"
                  >
                    <X size={13} />
                    {t('actions.clearFilters', { defaultValue: 'Clear filters' })}
                  </button>
                )}
              </section>

              <section className="mt-7">
                <TaskList
                  todos={visibleTodos}
                  hasActiveFilters={hasActiveFilters}
                  onToggle={manager.toggleTodo}
                  onOpen={openTask}
                  onCreate={createTask}
                  onClearCompleted={manager.clearCompleted}
                />
              </section>
            </div>

            {/* SIDEBAR */}
            <aside className="hidden xl:block">
              <div className="relative overflow-hidden rounded-[30px] border-2 border-foreground bg-gradient-to-br from-[#7764e8]/12 via-card to-[#ee6f96]/12 p-5 shadow-[5px_5px_0_rgba(0,0,0,0.07)]">
                <DoodleStar className="pointer-events-none absolute right-5 top-5 size-6 rotate-12 text-[#ee6f96]/50" />
                <div className="relative flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-[16px] bg-gradient-to-br from-[#7764e8] to-[#ee6f96] text-white shadow-[3px_3px_0_rgba(0,0,0,0.16)]">
                    <Sparkles size={20} />
                  </span>
                  <span className="rounded-full border-2 border-foreground/10 bg-card px-3 py-1.5 text-xs font-black text-[#7764e8] shadow-[2px_2px_0_rgba(0,0,0,0.05)]">
                    {completionRatio}%
                  </span>
                </div>
                <h2 className="relative mt-6 text-2xl font-black tracking-[-0.055em] text-foreground">
                  {t('productivity.title', { defaultValue: 'Productivity' })}
                </h2>
                <p className="relative mt-2 text-sm font-black text-muted-foreground uppercase tracking-tight">
                  {t('productivity.task', { count: manager.metrics.dueToday })}
                </p>
                <div className="relative mt-5 h-3 overflow-hidden rounded-full border-2 border-foreground/10 bg-[#7764e8]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRatio}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[#7764e8] via-[#ee6f96] to-[#ed8664]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">0%</span>
                  <span className="text-lg font-black text-[#35a995]/60">✦</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">100%</span>
                </div>
              </div>

              <div className="mt-5 rounded-[30px] border-2 border-foreground bg-card p-5 shadow-[5px_5px_0_rgba(0,0,0,0.045)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#d9a62e]">Today</p>
                    <h2 className="mt-1 text-base font-black tracking-[-0.03em] text-foreground">
                      {t('productivity.glance', { defaultValue: 'At a glance' })}
                    </h2>
                  </div>
                  <span className="grid size-9 place-items-center rounded-[12px] bg-[#d9a62e]/10 text-[#d9a62e] border-2 border-[#d9a62e]/20">
                    <ListFilter size={16} />
                  </span>
                </div>
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between rounded-[17px] border-2 border-foreground/10 bg-[#35a995]/5 px-3 py-3">
                    <span className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground">
                      <span className="size-2.5 rounded-full bg-[#35a995]" />
                      {t('productivity.open', { defaultValue: 'Open' })}
                    </span>
                    <span className="font-black text-foreground">{openTodos}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[17px] border-2 border-foreground/10 bg-[#7764e8]/5 px-3 py-3">
                    <span className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground">
                      <span className="size-2.5 rounded-full bg-[#7764e8]" />
                      {t('productivity.complete', { defaultValue: 'Complete' })}
                    </span>
                    <span className="font-black text-foreground">{manager.metrics.completed}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[17px] border-2 border-foreground/10 bg-[#ed8664]/5 px-3 py-3">
                    <span className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground">
                      <span className="size-2.5 rounded-full bg-[#ed8664]" />
                      {t('productivity.overdue', { defaultValue: 'Overdue' })}
                    </span>
                    <span className="font-black text-foreground">{manager.metrics.overdue}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAi(true)}
                className="
                  group relative mt-5 flex w-full items-center gap-3 overflow-hidden rounded-[27px] 
                  border-2 border-foreground bg-gradient-to-br from-[#7764e8]/12 via-card to-[#35a995]/12 
                  p-4 text-left shadow-[4px_4px_0_rgba(0,0,0,0.1)]
                  transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(0,0,0,0.15)] active:translate-y-0
                "
              >
                <DoodleStar className="pointer-events-none absolute -right-1 -top-2 size-7 rotate-12 text-[#ee6f96]/40" />
                <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-gradient-to-br from-[#7764e8] to-[#ee6f96] text-white shadow-[3px_3px_0_rgba(0,0,0,0.14)]">
                  <Sparkles size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-foreground">
                    {t('ai.title', { defaultValue: 'Ask Todo AI' })}
                  </span>
                  <span className="mt-0.5 block text-xs font-bold text-muted-foreground uppercase tracking-tight">
                    {t('ai.subtitle', { defaultValue: 'Plan, create or manage tasks.' })}
                  </span>
                </span>
                <span className="ml-auto text-lg font-black text-[#7764e8] transition-transform group-hover:translate-x-1">→</span>
              </button>
            </aside>
          </div>
        </main>
      </div>

      <BottomNavigation activeView={view} onViewChange={changeView} onCreateTask={createTask} onOpenAi={() => setShowAi(true)} />

      {sheet && (
        <TaskSheet
          mode={sheet.mode}
          todo={selectedTodo}
          defaultDraft={manager.defaultDraft}
          onClose={() => setSheet(null)}
          onCreate={manager.addTodo}
          onUpdate={manager.updateTodo}
          onDelete={manager.deleteTodo}
          onToggle={manager.toggleTodo}
        />
      )}

      {showAi && (
        <TodoChatbot
          open={showAi}
          todos={manager.todos}
          onClose={() => setShowAi(false)}
          onCreate={createTaskFromAi}
          onToggle={manager.toggleTodo}
          onDelete={manager.deleteTodo}
          onViewChange={changeView}
        />
      )}
    </div>
  )
}

function getGreetingKey(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'greeting.morning'
  if (hour < 18) return 'greeting.afternoon'
  return 'greeting.evening'
}