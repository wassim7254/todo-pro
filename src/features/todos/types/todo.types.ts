export const CATEGORY_IDS = ['personal', 'work', 'study', 'health', 'other'] as const

export type CategoryId = (typeof CATEGORY_IDS)[number]
export type Priority = 'low' | 'medium' | 'high'
export type TodoView = 'today' | 'week' | 'upcoming' | 'all'
export type TodoSort = 'due' | 'priority' | 'created'

export interface Todo {
  id: string
  title: string
  description: string
  isCompleted: boolean
  priority: Priority
  category: CategoryId
  dueDate: Date | null
  time: string
  createdAt: Date
  updatedAt: Date
}

export interface TodoDraft {
  title: string
  description: string
  priority: Priority
  category: CategoryId
  dueDate: Date | null
  time: string
}

export interface TodoFilters {
  view: TodoView
  selectedDate: Date
  search: string
  priority: Priority | 'all'
  category: CategoryId | 'all'
  completion: 'open' | 'completed' | 'all'
  sort: TodoSort
}

export interface SerializedTodo extends Omit<Todo, 'createdAt' | 'updatedAt' | 'dueDate'> {
  createdAt: string
  updatedAt: string
  dueDate: string | null
}
