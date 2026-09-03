import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  CategoryId,
  Priority,
  SerializedTodo,
  Todo,
  TodoDraft,
  TodoFilters,
} from '../types/todo.types'
import {
  addDays,
  isPast,
  isSameDay,
  isWithinDays,
  startOfDay,
} from '../utils/date'

const STORAGE_KEY = 'todo-pro:todos:v1'

const defaultDraft: TodoDraft = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'personal',
  dueDate: new Date(),
  time: '',
}

function makeSeedTasks(): Todo[] {
  const now = new Date()

  const createSeed = (draft: TodoDraft): Todo => ({
    ...draft,
    id: crypto.randomUUID(),
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
  })

  return [
    createSeed({
      title: 'Finish product design notes',
      description:
        'Turn the whiteboard ideas into a clear, small next-step list.',
      priority: 'high',
      category: 'work',
      dueDate: now,
      time: '09:30',
    }),
    createSeed({
      title: 'Morning walk',
      description: 'A little movement before the day gets busy.',
      priority: 'low',
      category: 'health',
      dueDate: now,
      time: '11:00',
    }),
    createSeed({
      title: 'Review TypeScript generics',
      description:
        'Practice constraints and inference with two exercises.',
      priority: 'medium',
      category: 'study',
      dueDate: addDays(now, 1),
      time: '16:00',
    }),
    createSeed({
      title: 'Call family',
      description: '',
      priority: 'low',
      category: 'personal',
      dueDate: addDays(now, 2),
      time: '19:00',
    }),
  ]
}

function asDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function deserializeTodo(value: unknown): Todo | null {
  if (!value || typeof value !== 'object') return null

  const raw = value as Partial<SerializedTodo>

  const createdAt = asDate(raw.createdAt)
  const updatedAt = asDate(raw.updatedAt)
  const dueDate =
    raw.dueDate === null ? null : asDate(raw.dueDate)

  const validPriority =
    raw.priority === 'low' ||
    raw.priority === 'medium' ||
    raw.priority === 'high'

  const validCategory = [
    'personal',
    'work',
    'study',
    'health',
    'other',
  ].includes(raw.category ?? '')

  if (
    typeof raw.id !== 'string' ||
    typeof raw.title !== 'string' ||
    typeof raw.isCompleted !== 'boolean' ||
    !validPriority ||
    !validCategory ||
    !createdAt ||
    !updatedAt
  ) {
    return null
  }

  return {
    id: raw.id,
    title: raw.title,
    description:
      typeof raw.description === 'string'
        ? raw.description
        : '',
    isCompleted: raw.isCompleted,
    priority: raw.priority as Priority,
    category: raw.category as CategoryId,
    dueDate,
    time: typeof raw.time === 'string' ? raw.time : '',
    createdAt,
    updatedAt,
  }
}

function readStoredTodos(): Todo[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return makeSeedTasks()
    }

    const decoded: unknown = JSON.parse(raw)

    if (!Array.isArray(decoded)) {
      return makeSeedTasks()
    }

    return decoded
      .map(deserializeTodo)
      .filter(
        (todo): todo is Todo => todo !== null,
      )
  } catch {
    return makeSeedTasks()
  }
}

function serializeTodos(
  todos: Todo[],
): SerializedTodo[] {
  return todos.map((todo) => ({
    ...todo,
    dueDate: todo.dueDate?.toISOString() ?? null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }))
}

function priorityWeight(priority: Priority): number {
  return {
    high: 0,
    medium: 1,
    low: 2,
  }[priority]
}

function normalizeDraft(
  draft: TodoDraft,
): TodoDraft {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    priority: draft.priority,
    category: draft.category,
    dueDate: draft.dueDate
      ? startOfDay(draft.dueDate)
      : null,
    time: draft.time,
  }
}

export function useTodoManager() {
  const [todos, setTodos] = useState<Todo[]>(
    readStoredTodos,
  )

  const [isReady, setIsReady] = useState(false)

  const [storageError, setStorageError] =
    useState(false)

  /*
   * Mark the manager as ready after the initial
   * client-side render.
   */
  useEffect(() => {
    setIsReady(true)
  }, [])

  /*
   * Persist the COMPLETE todos array whenever
   * anything changes.
   *
   * This includes:
   * - creating tasks
   * - editing tasks
   * - completing tasks
   * - uncompleting tasks
   * - deleting tasks
   * - clearing completed tasks
   */
  useEffect(() => {
    if (!isReady) return

    try {
      const serialized = serializeTodos(todos)

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(serialized),
      )

      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [isReady, todos])

  const addTodo = useCallback(
    (draft: TodoDraft): Todo | null => {
      const normalized = normalizeDraft(draft)

      if (!normalized.title) {
        return null
      }

      const now = new Date()

      const todo: Todo = {
        ...normalized,
        id: crypto.randomUUID(),
        isCompleted: false,
        createdAt: now,
        updatedAt: now,
      }

      setTodos((current) => [
        todo,
        ...current,
      ])

      return todo
    },
    [],
  )

  const updateTodo = useCallback(
    (id: string, draft: TodoDraft): void => {
      const normalized = normalizeDraft(draft)

      if (!normalized.title) {
        return
      }

      setTodos((current) =>
        current.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                ...normalized,
                updatedAt: new Date(),
              }
            : todo,
        ),
      )
    },
    [],
  )

  /*
   * IMPORTANT:
   *
   * isCompleted is the ONLY completion property.
   *
   * We update it immutably so React receives a
   * completely new todo object and re-renders.
   */
  const toggleTodo = useCallback(
    (id: string): void => {
      setTodos((current) =>
        current.map((todo) => {
          if (todo.id !== id) {
            return todo
          }

          return {
            ...todo,
            isCompleted: !todo.isCompleted,
            updatedAt: new Date(),
          }
        }),
      )
    },
    [],
  )

  const deleteTodo = useCallback(
    (id: string): void => {
      setTodos((current) =>
        current.filter(
          (todo) => todo.id !== id,
        ),
      )
    },
    [],
  )

  const clearCompleted = useCallback(
    (): void => {
      setTodos((current) =>
        current.filter(
          (todo) => !todo.isCompleted,
        ),
      )
    },
    [],
  )

  const getVisibleTodos = useCallback(
    (filters: TodoFilters): Todo[] => {
      const query = filters.search
        .trim()
        .toLocaleLowerCase()

      const today = new Date()

      const filtered = todos.filter((todo) => {
        const matchesView =
          filters.view === 'all' ||
          (
            filters.view === 'today' &&
            isSameDay(
              todo.dueDate,
              filters.selectedDate,
            )
          ) ||
          (
            filters.view === 'week' &&
            isWithinDays(
              todo.dueDate,
              filters.selectedDate,
              7,
            )
          ) ||
          (
            filters.view === 'upcoming' &&
            todo.dueDate !== null &&
            startOfDay(todo.dueDate) >=
              startOfDay(today)
          )

        const matchesSearch =
          !query ||
          `${todo.title} ${todo.description}`
            .toLocaleLowerCase()
            .includes(query)

        const matchesPriority =
          filters.priority === 'all' ||
          todo.priority === filters.priority

        const matchesCategory =
          filters.category === 'all' ||
          todo.category === filters.category

        const matchesCompletion =
  filters.completion === 'all' ||
  (filters.completion === 'completed' && todo.isCompleted) ||
  (filters.completion === 'open' && !todo.isCompleted)

        return (
          matchesView &&
          matchesSearch &&
          matchesPriority &&
          matchesCategory &&
          matchesCompletion
        )
      })

      return [...filtered].sort(
        (left, right) => {
          if (filters.sort === 'priority') {
            return (
              priorityWeight(left.priority) -
              priorityWeight(right.priority)
            )
          }

          if (filters.sort === 'created') {
            return (
              right.createdAt.getTime() -
              left.createdAt.getTime()
            )
          }

          if (!left.dueDate) return 1
          if (!right.dueDate) return -1

          return (
            left.dueDate.getTime() -
            right.dueDate.getTime()
          )
        },
      )
    },
    [todos],
  )

  const metrics = useMemo(() => {
    const today = new Date()

    const completed = todos.filter(
      (todo) => todo.isCompleted,
    ).length

    const dueToday = todos.filter(
      (todo) =>
        !todo.isCompleted &&
        isSameDay(todo.dueDate, today),
    ).length

    const overdue = todos.filter(
      (todo) =>
        !todo.isCompleted &&
        isPast(todo.dueDate),
    ).length

    return {
      total: todos.length,
      completed,
      dueToday,
      overdue,
    }
  }, [todos])

  return {
    todos,
    isReady,
    storageError,
    defaultDraft,
    metrics,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getVisibleTodos,
  }
}