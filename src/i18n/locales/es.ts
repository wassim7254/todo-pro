const es = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    reset: 'Restablecer',
    confirm: 'Confirmar',
    search: 'Buscar',
    back: 'Atrás',
    continue: 'Continuar',
    loading: 'Cargando...',
    enabled: 'Activado',
    disabled: 'Desactivado',
    yes: 'Sí',
    no: 'No',
    signOut: 'Cerrar sesión',
  },

  languages: {
    title: 'Idioma',
    english: 'Inglés',
    german: 'Alemán',
    turkish: 'Turco',
    french: 'Francés',
    spanish: 'Español',
    arabic: 'Árabe',
  },

  navigation: {
    dashboard: 'Panel',
    settings: 'Configuración',
    profile: 'Perfil',
    tasks: 'Tareas',
    today: 'Hoy',
    week: 'Esta semana',
    upcoming: 'Próximamente',
    all: 'Todas las tareas',
    logout: 'Cerrar sesión',
  },

  auth: {
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    welcome: 'Bienvenido de nuevo',
    email: 'Correo electrónico',
    password: 'Contraseña',
    username: 'Nombre de usuario',
    name: 'Nombre',
    rememberMe: 'Recordarme',
    loginSubtitle:
      'Inicia sesión para continuar gestionando tus tareas.',
  },

  app: {
    logoSubtitle: 'una forma más tranquila de organizarte',

    notifications: 'Notificaciones',

    addTask: 'Añadir tarea',

    myDay: 'Mi día',
    thisWeek: 'Esta semana',
    upcoming: 'Próximamente',
    allTasks: 'Todas las tareas',

    goodMorning: 'Buenos días',
    goodAfternoon: 'Buenas tardes',
    goodEvening: 'Buenas noches',

    nudgeOne: 'un pequeño recordatorio para hoy',
    nudgeMany: 'pequeños recordatorios para hoy',

    openDay: 'Tu día está maravillosamente despejado',

    storageError:
      'Tus cambios están seguros durante esta sesión, pero el navegador no pudo guardarlos localmente.',

    search: 'Buscar en tus tareas',

    filters: 'Mostrar filtros',

    priority: 'Prioridad',
    status: 'Estado',
    sortBy: 'Ordenar por',

    anyPriority: 'Cualquier prioridad',

    high: 'Alta',
    medium: 'Media',
    low: 'Baja',

    openTasks: 'Tareas abiertas',
    completedTasks: 'Completadas',
    everything: 'Todas',

    dueDate: 'Fecha de vencimiento',
    recentlyAdded: 'Añadidas recientemente',

    allCategories: 'Todas las categorías',

    clearFilters: 'Limpiar filtros',

    focus: 'Tu enfoque',

    tasksInViewOne: 'tarea en esta vista',
    tasksInViewMany: 'tareas en esta vista',

    roomToBreathe: 'Un poco de espacio para respirar',

    clearDone: 'Limpiar completadas',

    noMatches: 'Nada coincide con esta vista',

    noMatchesDescription:
      'Prueba a ajustar la búsqueda o los filtros para encontrar lo que necesitas.',

    listClear: 'Tu lista está maravillosamente despejada',

    listClearDescription:
      'Añade el siguiente paso cuando estés listo.',

    createTask: 'Crear una tarea',

    slowSteady: 'Despacio, con constancia, terminado.',

    openTaskOnPlateOne:
      'Tienes {{count}} tarea pendiente hoy.',

    openTaskOnPlateMany:
      'Tienes {{count}} tareas pendientes hoy.',

    atAGlance: 'De un vistazo',

    open: 'Abiertas',
    complete: 'Completadas',
    overdue: 'Atrasadas',
  },

  categories: {
    personal: 'Personal',
    work: 'Trabajo',
    study: 'Estudio',
    health: 'Salud',
    other: 'Otro',
  },

  profile: {
    account: 'Tu cuenta',

    title: 'Tu perfil',

    profile: 'Perfil',

    savedLocally:
      'Tu perfil se guarda localmente en este dispositivo.',

    email: 'Correo electrónico',

    name: 'Nombre',

    emailPlaceholder: 'tu@email.com',

    namePlaceholder: 'Tu nombre',

    changePicture: 'Cambiar foto de perfil',

    imageHint:
      'JPG, PNG o WebP · máximo 2 MB',

    saveProfile: 'Guardar perfil',

    profileSaved: 'Perfil guardado',

    signOut: 'Cerrar sesión',

    logout: 'Cerrar sesión',

    profileStored:
      'Tu perfil actualmente solo está guardado en este navegador. La autenticación real se puede conectar más adelante.',

    addEmail:
      'Añade tu dirección de correo electrónico',

    yourProfile: 'Tu perfil',

    imageTooLarge:
      'Elige una imagen de menos de 2 MB.',
  },

  task: {
    newIntention: 'Una nueva intención',

    taskDetails: 'Detalles de la tarea',

    addTask: 'Añadir una tarea',

    editTask: 'Editar tarea',

    oneThing: 'Una cosa a la vez',

    whatNeedsAttention:
      '¿Qué necesita tu atención?',

    titlePlaceholder:
      'ej. Preparar el resumen del proyecto',

    context: 'Un poco de contexto (opcional)',

    contextPlaceholder:
      'Añade notas útiles, enlaces o el primer paso…',

    date: 'Fecha',

    time: 'Hora',

    category: 'Categoría',

    priority: 'Prioridad',

    priorityLabel:
      'Prioridad {{priority}}',

    markDone: 'Marcar como completada',

    edit: 'Editar tarea',

    saveChanges: 'Guardar cambios',

    createTask: 'Crear tarea',

    deleteTask: 'Eliminar tarea',

    markIncomplete:
      'Marcar {{title}} como incompleta',

    markComplete:
      'Marcar {{title}} como completada',
  },

  tasks: {
    addTask: 'Añadir tarea',

    editTask: 'Editar tarea',

    complete: 'Completar',

    completed: 'Completada',

    deleteTask: 'Eliminar tarea',

    noTasks:
      'Todavía no hay tareas aquí.',

    overdue: 'Atrasada',

    dueToday: 'Vence hoy',

    tomorrow: 'Mañana',
  },

  settings: {
    title: 'Configuración',

    subtitle:
      'Personaliza tu experiencia de Todo.',

    appearance: 'Apariencia',

    language: 'Idioma',

    theme: 'Tema',

    light: 'Claro',

    dark: 'Oscuro',

    system: 'Sistema',

    accentColor: 'Color de acento',

    presets: 'Colores predefinidos',

    peach: 'Melocotón',

    pink: 'Rosa',

    lavender: 'Lavanda',

    blue: 'Azul',

    mint: 'Menta',

    yellow: 'Amarillo',

    custom: 'Personalizado',

    density: 'Densidad',

    comfortable: 'Cómoda',

    compact: 'Compacta',

    corners: 'Esquinas',

    rounded: 'Redondeadas',

    sharp: 'Rectas',

    regional: 'Región',

    dateFormat: 'Formato de fecha',

    timeFormat: 'Formato de hora',

    firstDayOfWeek:
      'Primer día de la semana',

    sunday: 'Domingo',

    monday: 'Lunes',

    saturday: 'Sábado',

    twelveHour: '12 horas',

    twentyFourHour: '24 horas',

    notifications: 'Notificaciones',

    taskReminders:
      'Recordatorios de tareas',

    dueDates: 'Fechas de vencimiento',

    overdue: 'Tareas atrasadas',

    dailySummary: 'Resumen diario',

    weeklySummary: 'Resumen semanal',

    tasks: 'Tareas',

    defaultPriority:
      'Prioridad predeterminada',

    defaultCategory:
      'Categoría predeterminada',

    confirmDelete:
      'Confirmar antes de eliminar',

    archiveCompleted:
      'Archivar tareas completadas',

    showCompleted:
      'Mostrar tareas completadas',

    sort: 'Orden predeterminado',

    due: 'Fecha de vencimiento',

    created: 'Fecha de creación',

    accessibility: 'Accesibilidad',

    reduceMotion: 'Reducir movimiento',

    largerText: 'Texto más grande',

    highContrast: 'Alto contraste',

    keyboardNavigation:
      'Navegación con teclado',

    reset: 'Restablecer configuración',

    resetConfirm:
      '¿Restablecer toda la configuración a sus valores predeterminados?',
  },

  filters: {
    allCategories: 'Todas las categorías',

    priority: 'Prioridad',

    status: 'Estado',

    sortBy: 'Ordenar por',

    anyPriority: 'Cualquier prioridad',

    high: 'Alta',

    medium: 'Media',

    low: 'Baja',

    openTasks: 'Tareas abiertas',

    completedTasks: 'Completadas',

    everything: 'Todas',

    dueDate: 'Fecha de vencimiento',

    recentlyAdded: 'Añadidas recientemente',
  },

  actions: {
    clearFilters: 'Limpiar filtros',

    createTask: 'Crear una tarea',

    addTask: 'Añadir tarea',

    save: 'Guardar',

    cancel: 'Cancelar',

    delete: 'Eliminar',

    edit: 'Editar',

    close: 'Cerrar',

    profile: 'Perfil',

    signOut: 'Cerrar sesión',

    saveProfile: 'Guardar perfil',

    changePicture: 'Cambiar foto de perfil',
  },

  search: {
    placeholder: 'Buscar en tus tareas',
  },

  greeting: {
    morning: 'Buenos días',

    afternoon: 'Buenas tardes',

    evening: 'Buenas noches',

    nudges: 'pequeños recordatorios para hoy',

    openDay:
      'Tu día está maravillosamente despejado',
  },
}

export default es