const ar = {
  categories: {
  personal: 'شخصي',
  work: 'العمل',
  study: 'الدراسة',
  health: 'الصحة',
  other: 'أخرى',
},
  greeting: {
  morning: 'صباح الخير',
  afternoon: 'مساء الخير',
  evening: 'مساء الخير',
  nudges: 'تذكيرات لطيفة لهذا اليوم',
  openDay: 'يومك مفتوح بشكل جميل',
},

productivity: {
  title: 'الإنتاجية',
  task: 'مهمة',
  glance: 'نظرة سريعة',
  open: 'مفتوحة',
  complete: 'مكتملة',
  overdue: 'متأخرة',
},

filters: {
  allCategories: 'كل الفئات',
  priority: 'الأولوية',
  status: 'الحالة',
  sortBy: 'ترتيب حسب',
  anyPriority: 'أي أولوية',
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
},

actions: {
  clearFilters: 'مسح عوامل التصفية',
  createTask: 'إنشاء مهمة',
  addTask: 'إضافة مهمة',
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  edit: 'تعديل',
  close: 'إغلاق',
},

search: {
  placeholder: 'ابحث في مهامك',
},

app: {
  logo: 'Todo',
  tagline: 'طريقة أكثر هدوءًا للتخطيط',
},

  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    reset: 'إعادة تعيين',
    confirm: 'تأكيد',
    search: 'بحث',
    back: 'رجوع',
    continue: 'متابعة',
    loading: 'جارٍ التحميل...',
    enabled: 'مفعّل',
    disabled: 'معطّل',
    yes: 'نعم',
    no: 'لا',
  },

  navigation: {
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    tasks: 'المهام',
    today: 'اليوم',
    week: 'هذا الأسبوع',
    upcoming: 'القادمة',
    all: 'كل المهام',
  },

  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    welcome: 'مرحبًا بعودتك',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    username: 'اسم المستخدم',
    name: 'الاسم',
    rememberMe: 'تذكرني',
    loginSubtitle: 'سجّل الدخول لمتابعة إدارة مهامك.',
  },

  profile: {
    profile: 'الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    account: 'الحساب',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    changePassword: 'تغيير كلمة المرور',
    initialsFallback: 'الأحرف الأولى من اسمك',
  },

  settings: {
    title: 'الإعدادات',
    subtitle: 'خصص تجربة Todo الخاصة بك.',

    appearance: 'المظهر',
    languageRegion: 'اللغة والمنطقة',
    notifications: 'الإشعارات',
    tasks: 'المهام',
    account: 'الحساب',
    privacy: 'الخصوصية والأمان',
    accessibility: 'إمكانية الوصول',
    data: 'البيانات',
    about: 'حول التطبيق',

    theme: 'السمة',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',

    accentColor: 'اللون الأساسي',
    presets: 'الألوان الجاهزة',
    peach: 'خوخي',
    pink: 'وردي',
    lavender: 'لافندر',
    blue: 'أزرق',
    mint: 'نعناعي',
    yellow: 'أصفر',
    custom: 'مخصص',

    density: 'كثافة الواجهة',
    compact: 'مضغوط',
    comfortable: 'مريح',

    corners: 'شكل الزوايا',
    rounded: 'دائري',
    sharp: 'حاد',

    language: 'اللغة',
    dateFormat: 'تنسيق التاريخ',
    timeFormat: 'تنسيق الوقت',
    firstDay: 'أول يوم في الأسبوع',

    monday: 'الاثنين',
    sunday: 'الأحد',
    saturday: 'السبت',

    taskReminders: 'تذكيرات المهام',
    dueDateNotifications: 'إشعارات موعد الاستحقاق',
    overdueNotifications: 'إشعارات المهام المتأخرة',
    dailySummary: 'الملخص اليومي',
    weeklySummary: 'الملخص الأسبوعي',

    defaultPriority: 'الأولوية الافتراضية',
    defaultCategory: 'الفئة الافتراضية',
    confirmDelete: 'التأكيد قبل الحذف',
    archiveCompleted: 'أرشفة المهام المكتملة تلقائيًا',
    showCompleted: 'إظهار المهام المكتملة',
    sortOrder: 'ترتيب المهام',

    profilePicture: 'صورة الملف الشخصي',
    emailAddress: 'البريد الإلكتروني',

    sessionInformation: 'معلومات الجلسة',
    loginActivity: 'نشاط تسجيل الدخول',
    deleteAccount: 'حذف الحساب',

    reduceMotion: 'تقليل الحركة',
    largerText: 'نص أكبر',
    highContrast: 'تباين عالٍ',
    keyboardNavigation: 'التنقل باستخدام لوحة المفاتيح',

    exportTasks: 'تصدير المهام',
    importTasks: 'استيراد المهام',
    clearCompleted: 'حذف المهام المكتملة',
    resetApplication: 'إعادة تعيين التطبيق',
    deleteAllData: 'حذف جميع البيانات',

    appVersion: 'إصدار التطبيق',
    credits: 'الاعتمادات',
    terms: 'الشروط',
    privacyPolicy: 'الخصوصية',

    changesSaved: 'تم حفظ التغييرات',
    dangerZone: 'منطقة خطرة',
  },

  tasks: {
    addTask: 'إضافة مهمة',
    editTask: 'تعديل المهمة',
    complete: 'إكمال',
    completed: 'مكتملة',
    deleteTask: 'حذف المهمة',
    noTasks: 'لا توجد مهام هنا بعد.',
    overdue: 'متأخرة',
    dueToday: 'مستحقة اليوم',
    tomorrow: 'غدًا',
  },
}

export default ar