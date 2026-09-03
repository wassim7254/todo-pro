import {
  CalendarDays,
  ChevronUp,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { TodoView } from '../types/todo.types'

interface BottomNavigationProps {
  activeView: TodoView
  onViewChange: (view: TodoView) => void
  onCreateTask: () => void
}

export function BottomNavigation({
  activeView,
  onViewChange,
  onCreateTask,
}: BottomNavigationProps) {
  const { t } = useTranslation()

  const [showPlanningMenu, setShowPlanningMenu] =
    useState(false)

  const planningRef = useRef<HTMLDivElement>(null)

  const isActive = (view: TodoView) =>
    activeView === view

  useEffect(() => {
    if (!showPlanningMenu) {
      return
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        planningRef.current &&
        !planningRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowPlanningMenu(false)
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )
    }
  }, [showPlanningMenu])

  const goToSettings = () => {
    setShowPlanningMenu(false)

    window.history.pushState(
      {},
      '',
      '/settings',
    )

    window.dispatchEvent(
      new PopStateEvent('popstate'),
    )
  }

  const selectPlanningView = (
    view: 'week' | 'upcoming',
  ) => {
    onViewChange(view)
    setShowPlanningMenu(false)
  }

  const planningActive =
    activeView === 'week' ||
    activeView === 'upcoming'

  return (
    <nav
      aria-label={t('navigation.title', {
        defaultValue: 'Main navigation',
      })}
      className="
        fixed
        inset-x-0
        bottom-0
        z-40
        px-3
        pb-[max(0.7rem,env(safe-area-inset-bottom))]
        pt-2
        lg:hidden
      "
    >
      <div
        className="
          relative
          mx-auto
          max-w-[540px]
        "
      >
        {/* =====================================================
            VERY LIGHT PASTEL BACKGROUND
            ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -inset-x-2
            -bottom-1
            top-0
            overflow-hidden
            rounded-[34px]
            border-2
            border-[#25212b]
            bg-[#fffdf8]
            shadow-[6px_7px_0_#25212b]
          "
        >
          {/* soft pastel background blobs */}

          <span
            className="
              absolute
              -left-10
              -top-10
              size-32
              rounded-full
              bg-[#eee8ff]
            "
          />

          <span
            className="
              absolute
              left-[19%]
              -bottom-12
              size-32
              rounded-full
              bg-[#e8faf5]
            "
          />

          <span
            className="
              absolute
              left-[42%]
              -top-12
              size-28
              rounded-full
              bg-[#fff3d5]
            "
          />

          <span
            className="
              absolute
              right-[20%]
              -bottom-12
              size-32
              rounded-full
              bg-[#e8f6ff]
            "
          />

          <span
            className="
              absolute
              -right-8
              -top-8
              size-28
              rounded-full
              bg-[#ffeaf1]
            "
          />

          {/* subtle pastel center glow */}

          <span
            className="
              absolute
              left-1/2
              top-1/2
              size-28
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#faf4ff]
            "
          />

          {/* =================================================
              HAND-DRAWN DOODLES
              ================================================= */}

          <svg
            aria-hidden="true"
            viewBox="0 0 540 76"
            className="
              absolute
              inset-0
              h-full
              w-full
              opacity-75
            "
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* top-left star */}

            <path
              d="M38 14 L41 21 L48 23 L41 26 L38 34 L35 26 L28 23 L35 21 Z"
              stroke="#8a78d8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* tiny pink flower */}

            <circle
              cx="88"
              cy="17"
              r="3"
              fill="#ffd9e6"
              stroke="#e9789d"
              strokeWidth="1.7"
            />

            <circle
              cx="88"
              cy="9"
              r="3"
              fill="#fff0f5"
              stroke="#e9789d"
              strokeWidth="1.7"
            />

            <circle
              cx="88"
              cy="25"
              r="3"
              fill="#fff0f5"
              stroke="#e9789d"
              strokeWidth="1.7"
            />

            <circle
              cx="80"
              cy="17"
              r="3"
              fill="#fff0f5"
              stroke="#e9789d"
              strokeWidth="1.7"
            />

            <circle
              cx="96"
              cy="17"
              r="3"
              fill="#fff0f5"
              stroke="#e9789d"
              strokeWidth="1.7"
            />

            {/* little mint squiggle */}

            <path
              d="M138 17 C145 9 151 25 158 17 C165 9 171 25 178 17"
              stroke="#4bb49f"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* yellow plus */}

            <path
              d="M229 12 V27 M221.5 19.5 H236.5"
              stroke="#d2a42d"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* blue circle */}

            <circle
              cx="294"
              cy="18"
              r="7"
              stroke="#70a9d8"
              strokeWidth="2"
            />

            <circle
              cx="294"
              cy="18"
              r="2"
              fill="#70a9d8"
            />

            {/* pink sparkle */}

            <path
              d="M378 12 L380 18 L386 20 L380 22 L378 28 L376 22 L370 20 L376 18 Z"
              stroke="#e9789d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* little doodle face */}

            <circle
              cx="470"
              cy="20"
              r="10"
              fill="#fff3d5"
              stroke="#6f624b"
              strokeWidth="1.8"
            />

            <circle
              cx="466"
              cy="18"
              r="1.3"
              fill="#6f624b"
            />

            <circle
              cx="474"
              cy="18"
              r="1.3"
              fill="#6f624b"
            />

            <path
              d="M466 23 Q470 27 475 23"
              stroke="#6f624b"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* bottom-left mint star */}

            <path
              d="M18 54 L20 59 L25 61 L20 63 L18 69 L16 63 L11 61 L16 59 Z"
              stroke="#43aa96"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* bottom-right lavender star */}

            <path
              d="M520 51 L522 56 L527 58 L522 60 L520 66 L518 60 L513 58 L518 56 Z"
              stroke="#8978d8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* small blue dots */}

            <circle
              cx="120"
              cy="59"
              r="3"
              fill="#bfe3f8"
            />

            <circle
              cx="128"
              cy="63"
              r="2"
              fill="#bfe3f8"
            />

            {/* small yellow dots */}

            <circle
              cx="405"
              cy="60"
              r="3"
              fill="#f4df9f"
            />

            <circle
              cx="414"
              cy="55"
              r="2"
              fill="#f4df9f"
            />
          </svg>
        </div>

        {/* =====================================================
            NAVIGATION
            ===================================================== */}

        <div
          className="
            relative
            flex
            h-[70px]
            items-center
            justify-between
            rounded-[30px]
            border-2
            border-[#25212b]
            bg-[#ffffff]/80
            px-2
            backdrop-blur-md
          "
        >
          {/* TODAY */}

          <button
            type="button"
            aria-label={t('app.today', {
              defaultValue: 'Today',
            })}
            aria-pressed={isActive('today')}
            onClick={() => {
              setShowPlanningMenu(false)
              onViewChange('today')
            }}
            className={`
              relative
              grid
              size-12
              shrink-0
              place-items-center
              rounded-[19px]
              border-2
              transition-all
              duration-150
              active:translate-x-[2px]
              active:translate-y-[3px]
              ${
                isActive('today')
                  ? `
                    border-[#25212b]
                    bg-[#eee8ff]
                    text-[#7764e8]
                    shadow-[3px_3px_0_#25212b]
                  `
                  : `
                    border-transparent
                    bg-[#ffffff]/75
                    text-[#726c78]
                    hover:border-[#25212b]
                    hover:bg-[#eee8ff]
                    hover:text-[#7764e8]
                  `
              }
            `}
          >
            <Sparkles
              size={22}
              strokeWidth={
                isActive('today') ? 2.8 : 2.2
              }
            />

            {isActive('today') && (
              <span
                className="
                  absolute
                  bottom-1.5
                  size-1.5
                  rounded-full
                  bg-[#ee6f96]
                "
              />
            )}
          </button>

          {/* PLANNING */}

          <div
            ref={planningRef}
            className="relative"
          >
            {showPlanningMenu && (
              <div
                className="
                  absolute
                  bottom-[63px]
                  left-1/2
                  w-[200px]
                  -translate-x-1/2
                  overflow-hidden
                  rounded-[23px]
                  border-2
                  border-[#25212b]
                  bg-[#fffdf8]
                  p-1.5
                  shadow-[5px_5px_0_#25212b]
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    selectPlanningView('week')
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-[17px]
                    border-2
                    border-transparent
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-black
                    text-[#302b38]
                    transition-all
                    hover:border-[#25212b]
                    hover:bg-[#eee8ff]
                    active:translate-x-[2px]
                    active:translate-y-[2px]
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      shrink-0
                      place-items-center
                      rounded-[13px]
                      border-2
                      border-[#25212b]
                      bg-[#e8f6ff]
                      text-[#5d91bd]
                    "
                  >
                    <CalendarDays
                      size={17}
                      strokeWidth={2.6}
                    />
                  </span>

                  <span>
                    {t('navigation.week', {
                      defaultValue:
                        'This week',
                    })}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectPlanningView(
                      'upcoming',
                    )
                  }
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-[17px]
                    border-2
                    border-transparent
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    font-black
                    text-[#302b38]
                    transition-all
                    hover:border-[#25212b]
                    hover:bg-[#ffeaf1]
                    active:translate-x-[2px]
                    active:translate-y-[2px]
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      shrink-0
                      place-items-center
                      rounded-[13px]
                      border-2
                      border-[#25212b]
                      bg-[#ffeaf1]
                      text-[#e9789d]
                    "
                  >
                    <ChevronUp
                      size={18}
                      strokeWidth={2.7}
                    />
                  </span>

                  <span>
                    {t('navigation.upcoming', {
                      defaultValue:
                        'Upcoming',
                    })}
                  </span>
                </button>
              </div>
            )}

            <button
              type="button"
              aria-label={t(
                'navigation.planning',
                {
                  defaultValue:
                    'Week and upcoming tasks',
                },
              )}
              aria-expanded={
                showPlanningMenu
              }
              onClick={() =>
                setShowPlanningMenu(
                  (open) => !open,
                )
              }
              className={`
                relative
                grid
                size-12
                shrink-0
                place-items-center
                rounded-[19px]
                border-2
                transition-all
                duration-150
                active:translate-x-[2px]
                active:translate-y-[3px]
                ${
                  planningActive
                    ? `
                      border-[#25212b]
                      bg-[#fff3d5]
                      text-[#bd8b18]
                      shadow-[3px_3px_0_#25212b]
                    `
                    : `
                      border-transparent
                      bg-[#ffffff]/75
                      text-[#726c78]
                      hover:border-[#25212b]
                      hover:bg-[#e8f6ff]
                      hover:text-[#5d91bd]
                    `
                }
              `}
            >
              <CalendarDays
                size={22}
                strokeWidth={
                  planningActive ? 2.8 : 2.2
                }
              />

              {planningActive && (
                <span
                  className="
                    absolute
                    bottom-1.5
                    size-1.5
                    rounded-full
                    bg-[#d9a62e]
                  "
                />
              )}
            </button>
          </div>

          {/* CREATE */}

          <button
            type="button"
            aria-label={t('task.addTask', {
              defaultValue:
                'Create a task',
            })}
            onClick={() => {
              setShowPlanningMenu(false)
              onCreateTask()
            }}
            className="
              relative
              -mt-7
              grid
              size-[60px]
              shrink-0
              place-items-center
              rounded-[22px]
              border-2
              border-[#25212b]
              bg-[#f49ab8]
              text-[#30232d]
              shadow-[4px_5px_0_#25212b]
              transition-all
              duration-150
              hover:-translate-y-1
              hover:bg-[#f7aac4]
              hover:shadow-[4px_7px_0_#25212b]
              active:translate-x-[2px]
              active:translate-y-[3px]
              active:scale-[0.97]
              active:shadow-[1px_2px_0_#25212b]
            "
          >
            <Plus
              size={29}
              strokeWidth={2.9}
            />

            <span
              aria-hidden="true"
              className="
                absolute
                -right-1
                -top-1
                size-3
                rounded-full
                border-2
                border-[#25212b]
                bg-[#dff7f1]
              "
            />
          </button>

          {/* ALL */}

          <button
            type="button"
            aria-label={t('app.all', {
              defaultValue: 'All tasks',
            })}
            aria-pressed={isActive('all')}
            onClick={() => {
              setShowPlanningMenu(false)
              onViewChange('all')
            }}
            className={`
              relative
              grid
              size-12
              shrink-0
              place-items-center
              rounded-[19px]
              border-2
              transition-all
              duration-150
              active:translate-x-[2px]
              active:translate-y-[3px]
              ${
                isActive('all')
                  ? `
                    border-[#25212b]
                    bg-[#dff7f1]
                    text-[#29947f]
                    shadow-[3px_3px_0_#25212b]
                  `
                  : `
                    border-transparent
                    bg-[#ffffff]/75
                    text-[#726c78]
                    hover:border-[#25212b]
                    hover:bg-[#dff7f1]
                    hover:text-[#29947f]
                  `
              }
            `}
          >
            <ListChecks
              size={22}
              strokeWidth={
                isActive('all') ? 2.8 : 2.2
              }
            />

            {isActive('all') && (
              <span
                className="
                  absolute
                  bottom-1.5
                  size-1.5
                  rounded-full
                  bg-[#35a995]
                "
              />
            )}
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            aria-label={t(
              'settings.title',
              {
                defaultValue: 'Settings',
              },
            )}
            onClick={goToSettings}
            className="
              grid
              size-12
              shrink-0
              place-items-center
              rounded-[19px]
              border-2
              border-transparent
              bg-[#ffffff]/75
              text-[#726c78]
              transition-all
              duration-150
              hover:border-[#25212b]
              hover:bg-[#fff0f5]
              hover:text-[#e9789d]
              active:translate-x-[2px]
              active:translate-y-[3px]
            "
          >
            <Settings
              size={22}
              strokeWidth={2.2}
            />
          </button>
        </div>
      </div>
    </nav>
  )
}