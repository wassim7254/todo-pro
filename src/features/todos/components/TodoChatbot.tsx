import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  ListChecks,
  Sparkles,
  X,
} from 'lucide-react'
import {
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import type {
  Todo,
  TodoView,
} from '../types/todo.types'

interface TodoChatbotProps {
  open: boolean
  todos: Todo[]
  onClose: () => void
  onCreate: (draft: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    category:
      | 'personal'
      | 'work'
      | 'study'
      | 'health'
      | 'other'
    dueDate: Date
    time: string
  }) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onViewChange: (view: TodoView) => void
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type Category =
  | 'personal'
  | 'work'
  | 'study'
  | 'health'
  | 'other'

type Priority =
  | 'low'
  | 'medium'
  | 'high'

const CATEGORY_WORDS: Record<
  Category,
  string[]
> = {
  personal: ['personal'],
  work: ['work', 'job', 'office'],
  study: [
    'study',
    'school',
    'learn',
    'learning',
  ],
  health: [
    'health',
    'fitness',
    'gym',
    'walk',
  ],
  other: ['other'],
}

const PRIORITY_WORDS: Record<
  Priority,
  string[]
> = {
  high: [
    'high priority',
    'urgent',
    'important',
  ],
  medium: ['medium priority'],
  low: ['low priority'],
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[!?.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findTodo(
  todos: Todo[],
  query: string,
) {
  const normalizedQuery = normalize(query)

  return todos.find((todo) => {
    const title = normalize(todo.title)

    return (
      title === normalizedQuery ||
      title.includes(normalizedQuery) ||
      normalizedQuery.includes(title)
    )
  })
}

function parseCategory(
  text: string,
): Category {
  const normalized = normalize(text)

  for (const [category, words] of Object.entries(
    CATEGORY_WORDS,
  ) as Array<[Category, string[]]>) {
    if (
      words.some((word) =>
        normalized.includes(word),
      )
    ) {
      return category
    }
  }

  return 'personal'
}

function parsePriority(
  text: string,
): Priority {
  const normalized = normalize(text)

  for (const [priority, words] of Object.entries(
    PRIORITY_WORDS,
  ) as Array<[Priority, string[]]>) {
    if (
      words.some((word) =>
        normalized.includes(word),
      )
    ) {
      return priority
    }
  }

  return 'medium'
}

function parseDueDate(text: string) {
  const normalized = normalize(text)
  const today = new Date()

  if (
    normalized.includes('tomorrow')
  ) {
    const date = new Date(today)
    date.setDate(date.getDate() + 1)
    return date
  }

  if (
    normalized.includes('next week')
  ) {
    const date = new Date(today)
    date.setDate(date.getDate() + 7)
    return date
  }

  if (
    normalized.includes('today')
  ) {
    return today
  }

  return today
}

function removeTaskInstruction(
  text: string,
) {
  return text
    .replace(
      /^(add|create|make|new)\s+(a\s+)?(task|todo)\s*/i,
      '',
    )
    .replace(
      /\b(today|tomorrow|next week)\b/gi,
      '',
    )
    .replace(
      /\b(high|medium|low)\s+priority\b/gi,
      '',
    )
    .replace(
      /\b(urgent|important)\b/gi,
      '',
    )
    .replace(
      /\b(personal|work|office|study|school|health|gym|fitness)\b/gi,
      '',
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
    .replace(/^[-:]+|[-:]+$/g, '')
    .trim()
}

function makeId() {
  return `chat-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

export function TodoChatbot({
  open,
  todos,
  onClose,
  onCreate,
  onToggle,
  onDelete,
  onViewChange,
}: TodoChatbotProps) {
  const { t } = useTranslation()

  const [input, setInput] = useState('')

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Hey. I can control your Todo app locally. Try “add a task to study React tomorrow”, “complete Morning walk”, “show my tasks”, or “go to this week”.',
      },
    ])

  const openTodos = useMemo(
    () =>
      todos.filter(
        (todo) => !todo.isCompleted,
      ),
    [todos],
  )

  const addMessage = (
    role: Message['role'],
    content: string,
  ) => {
    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role,
        content,
      },
    ])
  }

  const handleCommand = (
    rawInput: string,
  ) => {
    const text = rawInput.trim()

    if (!text) {
      return
    }

    addMessage('user', text)
    setInput('')

    const normalized = normalize(text)

    /*
     * VIEW COMMANDS
     */

    if (
      normalized.includes('this week') ||
      normalized.includes('week view') ||
      normalized === 'week'
    ) {
      onViewChange('week')
      addMessage(
        'assistant',
        'Done. I switched you to This week.',
      )
      return
    }

    if (
      normalized.includes('upcoming') ||
      normalized.includes('upcoming tasks')
    ) {
      onViewChange('upcoming')
      addMessage(
        'assistant',
        'Done. I switched you to Upcoming.',
      )
      return
    }

    if (
      normalized.includes('all tasks') ||
      normalized.includes('all todos')
    ) {
      onViewChange('all')
      addMessage(
        'assistant',
        'Done. I opened all tasks.',
      )
      return
    }

    if (
      normalized === 'today' ||
      normalized.includes('today view') ||
      normalized.includes('my day')
    ) {
      onViewChange('today')
      addMessage(
        'assistant',
        'Done. You are back on My day.',
      )
      return
    }

    /*
     * LIST COMMAND
     */

    if (
      normalized.includes('show') ||
      normalized.includes('list') ||
      normalized.includes('what are my tasks') ||
      normalized.includes('what do i have')
    ) {
      if (!openTodos.length) {
        addMessage(
          'assistant',
          'You have no open tasks. Your board is clean.',
        )
        return
      }

      const preview = openTodos
        .slice(0, 8)
        .map(
          (todo, index) =>
            `${index + 1}. ${todo.title}`,
        )
        .join('\n')

      addMessage(
        'assistant',
        `You have ${openTodos.length} open task${
          openTodos.length === 1
            ? ''
            : 's'
        }:\n${preview}`,
      )

      return
    }

    /*
     * COMPLETE COMMAND
     */

    if (
      normalized.includes('complete ') ||
      normalized.includes('finish ') ||
      normalized.includes('done ')
    ) {
      const query = text
        .replace(
          /^(complete|finish|done)\s*/i,
          '',
        )
        .trim()

      const todo = findTodo(
        todos,
        query,
      )

      if (!todo) {
        addMessage(
          'assistant',
          `I couldn't find a task matching “${query}”.`,
        )
        return
      }

      if (!todo.isCompleted) {
        onToggle(todo.id)
      }

      addMessage(
        'assistant',
        `Done. “${todo.title}” is completed.`,
      )

      return
    }

    /*
     * DELETE COMMAND
     */

    if (
      normalized.includes('delete ') ||
      normalized.includes('remove ')
    ) {
      const query = text
        .replace(
          /^(delete|remove)\s*/i,
          '',
        )
        .trim()

      const todo = findTodo(
        todos,
        query,
      )

      if (!todo) {
        addMessage(
          'assistant',
          `I couldn't find a task matching “${query}”.`,
        )
        return
      }

      onDelete(todo.id)

      addMessage(
        'assistant',
        `Deleted “${todo.title}”.`,
      )

      return
    }

    /*
     * CREATE COMMAND
     */

    if (
      normalized.startsWith('add ') ||
      normalized.startsWith('create ') ||
      normalized.startsWith('make ') ||
      normalized.startsWith('new ') ||
      normalized.includes('add a task') ||
      normalized.includes('create a task')
    ) {
      const title =
        removeTaskInstruction(text)

      if (!title) {
        addMessage(
          'assistant',
          'Tell me what the task should be called. For example: “Add a task to study React tomorrow.”',
        )
        return
      }

      onCreate({
        title,
        description: '',
        priority: parsePriority(text),
        category: parseCategory(text),
        dueDate: parseDueDate(text),
        time: '',
      })

      addMessage(
        'assistant',
        `Created “${title}”.`,
      )

      return
    }

    /*
     * HELP
     */

    if (
      normalized === 'help' ||
      normalized.includes(
        'what can you do',
      )
    ) {
      addMessage(
        'assistant',
        'I can add tasks, complete tasks, delete tasks, list open tasks, and switch between Today, This week, Upcoming, and All tasks.',
      )
      return
    }

    addMessage(
      'assistant',
      'I’m not sure what you mean yet. Try “add a task”, “complete Morning walk”, “delete Call family”, “show my tasks”, or “go to upcoming”.',
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-50
              bg-black/20
              backdrop-blur-[3px]
            "
            onClick={onClose}
          />

          <motion.section
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.98,
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 30,
            }}
            className="
              fixed
              inset-x-3
              bottom-3
              z-[60]
              mx-auto
              flex
              h-[min(680px,calc(100vh-1.5rem))]
              max-w-[560px]
              flex-col
              overflow-hidden
              rounded-[30px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_30px_80px_rgba(38,31,45,0.25)]
            "
            role="dialog"
            aria-modal="true"
            aria-label={t(
              'assistant.title',
              {
                defaultValue:
                  'Todo AI assistant',
              },
            )}
          >
            {/* HEADER */}

            <header
              className="
                flex
                items-center
                justify-between
                border-b
                border-[var(--border)]
                px-5
                py-4
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    grid
                    size-11
                    place-items-center
                    rounded-[16px]
                    bg-[color-mix(in_srgb,var(--accent)_16%,var(--surface-muted))]
                    text-[var(--accent)]
                  "
                >
                  <Sparkles size={21} />
                </span>

                <div>
                  <h2 className="text-sm font-black text-[var(--text)]">
                    {t(
                      'assistant.title',
                      {
                        defaultValue:
                          'Todo AI',
                      },
                    )}
                  </h2>

                  <p className="text-xs font-semibold text-[var(--muted)]">
                    Local assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                className="
                  grid
                  size-10
                  place-items-center
                  rounded-[14px]
                  text-[var(--muted)]
                  transition
                  hover:bg-[var(--surface-muted)]
                  hover:text-[var(--text)]
                "
              >
                <X size={19} />
              </button>
            </header>

            {/* MESSAGES */}

            <div
              className="
                flex-1
                space-y-4
                overflow-y-auto
                px-4
                py-5
                sm:px-5
              "
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`
                    flex
                    gap-2.5
                    ${
                      message.role ===
                      'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }
                  `}
                >
                  {message.role ===
                    'assistant' && (
                    <span
                      className="
                        mt-1
                        grid
                        size-8
                        shrink-0
                        place-items-center
                        rounded-[11px]
                        bg-[var(--surface-muted)]
                        text-[var(--accent)]
                      "
                    >
                      <Bot size={16} />
                    </span>
                  )}

                  <div
                    className={`
                      max-w-[82%]
                      whitespace-pre-line
                      rounded-[20px]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      leading-5
                      ${
                        message.role ===
                        'user'
                          ? 'rounded-br-[7px] bg-[var(--primary)] text-[var(--background)]'
                          : 'rounded-bl-[7px] bg-[var(--surface-muted)] text-[var(--text)]'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* SUGGESTIONS */}

            <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 sm:px-5">
              {[
                'Show my tasks',
                'Add a task to study React tomorrow',
                'Go to upcoming',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    handleCommand(
                      suggestion,
                    )
                  }
                  className="
                    shrink-0
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[var(--muted)]
                    transition
                    hover:border-[var(--accent)]
                    hover:text-[var(--text)]
                  "
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* INPUT */}

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleCommand(input)
              }}
              className="
                border-t
                border-[var(--border)]
                bg-[var(--surface)]
                p-3
                sm:p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-[21px]
                  border
                  border-[var(--border)]
                  bg-[var(--surface-muted)]
                  p-1.5
                  pl-4
                "
              >
                <input
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value,
                    )
                  }
                  placeholder="Tell me what to do..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    py-2.5
                    text-sm
                    font-bold
                    text-[var(--text)]
                    outline-none
                    placeholder:text-[var(--muted)]
                  "
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="
                    grid
                    size-10
                    shrink-0
                    place-items-center
                    rounded-[15px]
                    bg-[var(--accent)]
                    text-[#302738]
                    transition
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ArrowUp
                    size={19}
                    strokeWidth={2.8}
                  />
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] font-semibold text-[var(--muted)]">
                This assistant currently works locally with your Todo data.
              </p>
            </form>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}