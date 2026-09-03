import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en'
import de from './locales/de'
import tr from './locales/tr'
import fr from './locales/fr'
import es from './locales/es'
import ar from './locales/ar'

const supportedLanguages = [
  'en',
  'de',
  'tr',
  'fr',
  'es',
  'ar',
] as const

export type SupportedLanguage =
  (typeof supportedLanguages)[number]

const LANGUAGE_STORAGE_KEY = 'todo-pro:language'

const savedLanguage =
  typeof window !== 'undefined'
    ? window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      )
    : null

const initialLanguage: SupportedLanguage =
  savedLanguage &&
  supportedLanguages.includes(
    savedLanguage as SupportedLanguage,
  )
    ? (savedLanguage as SupportedLanguage)
    : 'en'

/**
 * The project contains multiple generations of
 * translation keys.
 *
 * Older locale files use keys such as:
 *
 *   app.goodEvening
 *   app.allCategories
 *   app.clearFilters
 *
 * The current UI uses:
 *
 *   greeting.evening
 *   filters.allCategories
 *   actions.clearFilters
 *
 * This compatibility layer allows both generations
 * to work without rewriting every component.
 */
function createCompatibleLocale(locale: any) {
  const result = {
    ...locale,

    common: {
      ...(locale.common ?? {}),
    },

    app: {
      ...(locale.app ?? {}),
    },

    greeting: {
      ...(locale.greeting ?? {}),
    },

    navigation: {
      ...(locale.navigation ?? {}),
    },

    productivity: {
      ...(locale.productivity ?? {}),
    },

    filters: {
      ...(locale.filters ?? {}),
    },

    actions: {
      ...(locale.actions ?? {}),
    },

    search: {
      ...(locale.search ?? {}),
    },

    categories: {
      ...(locale.categories ?? {}),
    },

    task: {
      ...(locale.task ?? {}),
    },

    tasks: {
      ...(locale.tasks ?? {}),
    },

    profile: {
      ...(locale.profile ?? {}),
    },

    settings: {
      ...(locale.settings ?? {}),
    },

    languages: {
      ...(locale.languages ?? {}),
    },

    auth: {
      ...(locale.auth ?? {}),
    },

    language: {
      ...(locale.language ?? {}),
    },

    storage: {
      ...(locale.storage ?? {}),
    },
  }

  /*
   * ------------------------------------------------------------
   * APP
   * ------------------------------------------------------------
   */

  if (!result.app.logo) {
    result.app.logo = 'Todo'
  }

  if (!result.app.tagline) {
    result.app.tagline =
      result.app.logoSubtitle ?? ''
  }

  if (!result.app.notifications) {
    result.app.notifications =
      result.settings?.notifications ??
      'Notifications'
  }

  if (!result.app.addTask) {
    result.app.addTask =
      result.tasks?.addTask ??
      'Add task'
  }

  if (!result.app.myDay) {
    result.app.myDay =
      result.navigation?.today ??
      'Today'
  }

  if (!result.app.thisWeek) {
    result.app.thisWeek =
      result.navigation?.week ??
      'This week'
  }

  if (!result.app.upcoming) {
    result.app.upcoming =
      result.navigation?.upcoming ??
      'Upcoming'
  }

  if (!result.app.allTasks) {
    result.app.allTasks =
      result.navigation?.all ??
      'All tasks'
  }

  if (!result.app.search) {
    result.app.search =
      result.search?.placeholder ??
      result.common?.search ??
      'Search your tasks'
  }

  if (!result.app.allCategories) {
    result.app.allCategories =
      result.filters?.allCategories ??
      'All categories'
  }

  if (!result.app.clearFilters) {
    result.app.clearFilters =
      result.actions?.clearFilters ??
      'Clear filters'
  }

  /*
   * ------------------------------------------------------------
   * GREETING
   * ------------------------------------------------------------
   */

  if (!result.greeting.morning) {
    result.greeting.morning =
      result.app.goodMorning ??
      'Good morning'
  }

  if (!result.greeting.afternoon) {
    result.greeting.afternoon =
      result.app.goodAfternoon ??
      'Good afternoon'
  }

  if (!result.greeting.evening) {
    result.greeting.evening =
      result.app.goodEvening ??
      'Good evening'
  }

  if (!result.greeting.nudges) {
    result.greeting.nudges =
      result.app.nudgeMany ??
      result.app.nudgeOne ??
      'A gentle nudge for today'
  }

  if (!result.greeting.open) {
    result.greeting.openDay ??
      'Your day is beautifully open'
  }

  if (!result.greeting.openDay) {
    result.greeting.openDay =
      result.app.openDay ??
      'Your day is beautifully open'
  }

  /*
   * ------------------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------------------
   */

  if (!result.navigation.today) {
    result.navigation.today =
      result.app.myDay ??
      'Today'
  }

  if (!result.navigation.week) {
    result.navigation.week =
      result.app.thisWeek ??
      'This week'
  }

  if (!result.navigation.upcoming) {
    result.navigation.upcoming =
      result.app.upcoming ??
      'Upcoming'
  }

  if (!result.navigation.all) {
    result.navigation.all =
      result.app.allTasks ??
      'All tasks'
  }

  /*
   * ------------------------------------------------------------
   * PRODUCTIVITY
   * ------------------------------------------------------------
   */

  if (!result.productivity.title) {
    result.productivity.title =
      result.app.focus ??
      'Productivity'
  }

  if (!result.productivity.task) {
    result.productivity.task =
      result.app.tasksInViewMany ??
      'tasks'
  }

  if (!result.productivity.glance) {
    result.productivity.glance =
      result.app.atAGlance ??
      'At a glance'
  }

  if (!result.productivity.open) {
    result.productivity.open =
      result.app.open ??
      'Open'
  }

  if (!result.productivity.complete) {
    result.productivity.complete =
      result.app.complete ??
      'Complete'
  }

  if (!result.productivity.overdue) {
    result.productivity.overdue =
      result.app.overdue ??
      'Overdue'
  }

  /*
   * ------------------------------------------------------------
   * FILTERS
   * ------------------------------------------------------------
   */

  if (!result.filters.allCategories) {
    result.filters.allCategories =
      result.app.allCategories ??
      'All categories'
  }

  if (!result.filters.priority) {
    result.filters.priority =
      result.app.priority ??
      'Priority'
  }

  if (!result.filters.status) {
    result.filters.status =
      result.app.status ??
      'Status'
  }

  if (!result.filters.sortBy) {
    result.filters.sortBy =
      result.app.sortBy ??
      'Sort by'
  }

  if (!result.filters.anyPriority) {
    result.filters.anyPriority =
      result.app.anyPriority ??
      'Any priority'
  }

  if (!result.filters.high) {
    result.filters.high =
      result.app.high ??
      'High'
  }

  if (!result.filters.medium) {
    result.filters.medium =
      result.app.medium ??
      'Medium'
  }

  if (!result.filters.low) {
    result.filters.low =
      result.app.low ??
      'Low'
  }

  if (!result.filters.openTasks) {
    result.filters.openTasks =
      result.app.openTasks ??
      'Open tasks'
  }

  if (!result.filters.completedTasks) {
    result.filters.completedTasks =
      result.app.completedTasks ??
      'Completed'
  }

  if (!result.filters.everything) {
    result.filters.everything =
      result.app.everything ??
      'Everything'
  }

  if (!result.filters.dueDate) {
    result.filters.dueDate =
      result.app.dueDate ??
      'Due date'
  }

  if (!result.filters.recentlyAdded) {
    result.filters.recentlyAdded =
      result.app.recentlyAdded ??
      'Recently added'
  }

  /*
   * ------------------------------------------------------------
   * ACTIONS
   * ------------------------------------------------------------
   */

  if (!result.actions.clearFilters) {
    result.actions.clearFilters =
      result.app.clearFilters ??
      'Clear filters'
  }

  if (!result.actions.createTask) {
    result.actions.createTask =
      result.app.createTask ??
      result.tasks?.addTask ??
      'Create a task'
  }

  if (!result.actions.addTask) {
    result.actions.addTask =
      result.app.addTask ??
      result.tasks?.addTask ??
      'Add task'
  }

  if (!result.actions.save) {
    result.actions.save =
      result.common.save ??
      'Save'
  }

  if (!result.actions.cancel) {
    result.actions.cancel =
      result.common.cancel ??
      'Cancel'
  }

  if (!result.actions.delete) {
    result.actions.delete =
      result.common.delete ??
      'Delete'
  }

  if (!result.actions.edit) {
    result.actions.edit =
      result.common.edit ??
      'Edit'
  }

  if (!result.actions.close) {
    result.actions.close =
      result.common.close ??
      'Close'
  }

  if (!result.actions.profile) {
    result.actions.profile =
      result.profile?.profile ??
      result.profile?.title ??
      'Profile'
  }

  if (!result.actions.notifications) {
    result.actions.notifications =
      result.app.notifications ??
      'Notifications'
  }

  if (!result.actions.saveProfile) {
    result.actions.saveProfile =
      result.profile?.saveProfile ??
      result.common.save ??
      'Save profile'
  }

  if (!result.actions.signOut) {
    result.actions.signOut =
      result.profile?.signOut ??
      result.common.logout ??
      'Sign out'
  }

  /*
   * ------------------------------------------------------------
   * SEARCH
   * ------------------------------------------------------------
   */

  if (!result.search.placeholder) {
    result.search.placeholder =
      result.app.search ??
      result.common.search ??
      'Search your tasks'
  }

  if (!result.search.toggleFilters) {
    result.search.toggleFilters =
      result.app.filters ??
      'Toggle filters'
  }

  /*
   * ------------------------------------------------------------
   * CATEGORIES
   * ------------------------------------------------------------
   */

  if (!result.categories.personal) {
    result.categories.personal = 'Personal'
  }

  if (!result.categories.work) {
    result.categories.work = 'Work'
  }

  if (!result.categories.study) {
    result.categories.study = 'Study'
  }

  if (!result.categories.health) {
    result.categories.health = 'Health'
  }

  if (!result.categories.other) {
    result.categories.other = 'Other'
  }

  /*
   * ------------------------------------------------------------
   * TASK
   * ------------------------------------------------------------
   */

  if (!result.task && result.tasks) {
    result.task = {
      ...result.tasks,
    }
  }

  /*
   * ------------------------------------------------------------
   * STORAGE
   * ------------------------------------------------------------
   */

  if (!result.storage.error) {
    result.storage.error =
      result.app.storageError ??
      'Your changes could not be saved locally.'
  }

  /*
   * ------------------------------------------------------------
   * LANGUAGE LABELS
   *
   * These are intentionally kept in their native names.
   * This guarantees that the language selector never displays
   * missing translation keys such as language.de.
   * ------------------------------------------------------------
   */

  result.languages = {
    ...(result.languages ?? {}),
    english:
      result.languages?.english ??
      'English',
    german:
      result.languages?.german ??
      'Deutsch',
    turkish:
      result.languages?.turkish ??
      'Türkçe',
    french:
      result.languages?.french ??
      'Français',
    spanish:
      result.languages?.spanish ??
      'Español',
    arabic:
      result.languages?.arabic ??
      'العربية',
  }

  return result
}

const resources = {
  en: {
    translation: createCompatibleLocale(en),
  },

  de: {
    translation: createCompatibleLocale(de),
  },

  tr: {
    translation: createCompatibleLocale(tr),
  },

  fr: {
    translation: createCompatibleLocale(fr),
  },

  es: {
    translation: createCompatibleLocale(es),
  },

  ar: {
    translation: createCompatibleLocale(ar),
  },
}

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',

    supportedLngs: supportedLanguages,

    interpolation: {
      escapeValue: false,
    },

    returnNull: false,

    debug: false,
  })

export default i18n