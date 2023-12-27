export const NKRouter = {
  // NOTE Where are you should look for

  auth: {
    login: () => '/auth/login',
    forgotPassword: () => '/auth/forgot-password',
  },

  admin: {
    dashboard: () => '/dashboard',
    plan: {
      list: () => '/admin/plan',
    },
    equipment: {
      list: () => '/admin/equipment',
      detail: (id: string) => `/admin/equipment/${id}/detail`,
      edit: (id: string) => `/admin/equipment/${id}/edit`,
    },

    user: {
      list: () => '/admin/user',
      detail: (id: string) => `/admin/user/${id}/detail`,
      edit: (id: string) => `/admin/user/${id}/edit`,
    },
    department: {
      list: () => '/admin/department',
      detail: (id: string) => `/admin/department/${id}/detail`,
      edit: (id: string) => `/admin/department/${id}/edit`,
    },
  },

  brand: {
    list: () => '/dashboard/brand',
    detail: (id: string) => `/dashboard/brand/${id}/detail`,
    edit: (id: string) => `/dashboard/brand/${id}/edit`,
    create: () => '/dashboard/brand/create',
  },

  department: {
    list: () => '/dashboard/department',
    detail: (id: string) => `/dashboard/department/${id}/detail`,
    edit: (id: string) => `/dashboard/department/${id}/edit`,
    create: () => '/dashboard/department/create',
  },

  repairRequest: {
    list: () => '/dashboard/repair-request',
    detail: (id: string) => `/dashboard/repair-request/${id}/detail`,
    edit: (id: string) => `/dashboard/repair-request/${id}/edit`,
    create: () => '/dashboard/repair-request/create',
  },

  equipment: {
    list: () => '/dashboard/equipment',
    detail: (id: string) => `/dashboard/equipment/${id}/detail`,
    edit: (id: string) => `/dashboard/equipment/${id}/edit`,
    create: () => '/dashboard/equipment/create',
    category: {
      list: () => '/dashboard/equipment-category',
      create: () => '/dashboard/equipment-category/create',
      edit: (id: string) => `/dashboard/equipment-category/${id}/edit`,
      detail: (id: string) => `/dashboard/equipment-category/${id}/detail`,
    },
  },

  supply: {
    list: () => '/dashboard/supply',
    detail: (id: string) => `/dashboard/supply/${id}/detail`,
    edit: (id: string) => `/dashboard/supply/${id}/edit`,
    create: () => '/dashboard/supply/create',
    category: {
      list: () => '/dashboard/supply-category',
      create: () => '/dashboard/supply-category/create',
      edit: (id: string) => `/dashboard/supply-category/${id}/edit`,
      detail: (id: string) => `/dashboard/supply-category/${id}/detail`,
    },
  },

  importPlan: {
    list: () => '/dashboard/import-plan',
    detail: (id: string) => `/dashboard/import-plan/${id}/detail`,
    edit: (id: string) => `/dashboard/import-plan/${id}/edit`,
    create: () => '/dashboard/import-plan/create',
    item: {
      list: (id: string) => `/dashboard/import-plan/${id}/item`,
      detail: (id: string, itemId: string) => `/dashboard/import-plan/${id}/item/${itemId}/detail`,
      edit: (id: string, itemId: string) => `/dashboard/import-plan/${id}/item/${itemId}/edit`,
      create: (id: string) => `/dashboard/import-plan/${id}/item/create`,
    },
  },
  importRequest: {
    list: () => '/dashboard/import-request',
    detail: (id: string) => `/dashboard/import-request/${id}/detail`,
    edit: (id: string) => `/dashboard/import-request/${id}/edit`,
    create: () => '/dashboard/import-request/create',
    item: {
      list: (id: string) => `/dashboard/import-request/${id}/item`,
      detail: (id: string, itemId: string) => `/dashboard/import-request/${id}/item/${itemId}/detail`,
      edit: (id: string, itemId: string) => `/dashboard/import-request/${id}/item/${itemId}/edit`,
      create: (id: string) => `/dashboard/import-request/${id}/item/create`,
    },
  },

  importInventory: {
    list: () => '/dashboard/import-inventory',
    detail: (id: string) => `/dashboard/import-inventory/${id}/detail`,
    edit: (id: string) => `/dashboard/import-inventory/${id}/edit`,
    create: () => '/dashboard/import-inventory/create',
    item: {
      list: (id: string) => `/dashboard/import-inventory/${id}/item`,
      detail: (id: string, itemId: string) => `/dashboard/import-inventory/${id}/item/${itemId}/detail`,
      edit: (id: string, itemId: string) => `/dashboard/import-inventory/${id}/item/${itemId}/edit`,
      create: (id: string) => `/dashboard/import-inventory/${id}/item/create`,
    },
  },
  exportInventory: {
    list: () => '/dashboard/export-inventory',
    detail: (id: string) => `/dashboard/export-inventory/${id}/detail`,
    edit: (id: string) => `/dashboard/export-inventory/${id}/edit`,
    create: () => '/dashboard/export-inventory/create',
    item: {
      list: (id: string) => `/dashboard/export-inventory/${id}/item`,
      detail: (id: string, itemId: string) => `/dashboard/export-inventory/${id}/item/${itemId}/detail`,
      edit: (id: string, itemId: string) => `/dashboard/export-inventory/${id}/item/${itemId}/edit`,
      create: (id: string) => `/dashboard/export-inventory/${id}/item/create`,
    },
  },

  repairReport: {
    list: () => '/dashboard/repair-report',
    detail: (id: string) => `/dashboard/repair-report/${id}/detail`,
    edit: (id: string) => `/dashboard/repair-report/${id}/edit`,
    create: () => '/dashboard/repair-report/create',
    item: {
      list: (id: string) => `/dashboard/repair-report/${id}/item`,
      detail: (id: string, itemId: string) => `/dashboard/repair-report/${id}/item/${itemId}/detail`,
      edit: (id: string, itemId: string) => `/dashboard/repair-report/${id}/item/${itemId}/edit`,
      create: (id: string) => `/dashboard/repair-report/${id}/item/create`,
    },
  },

  repairProvider: {
    list: () => '/dashboard/repair-provider',
  },

  notification: {
    list: () => '/dashboard/notification',
  },
  chat: {
    main: () => '/dashboard/chat',
  },

  // NOTE Where are you NOT should look for (it's will be removed in the future)

  dashboard: () => '/dashboard',
  menu: {
    list: () => '/dashboard/menu',
  },
  account: {
    profile: () => '/dashboard/account/profile',
    changePassword: () => '/dashboard/account/change-password',
    updateProfile: () => '/dashboard/account/update-profile',
  },

  setting: {},
  user: {
    user: {
      list: () => '/dashboard/user',
      create: () => '/dashboard/user/create',
      detail: (id: string) => `/dashboard/user/${id}/detail`,
      edit: (id: string) => `/dashboard/user/${id}/edit`,
    },
    userRole: {
      list: () => '/dashboard/user-role',
      create: () => '/dashboard/user-role/create',
      edit: (id: string) => `/dashboard/user-role/${id}/edit`,
      detail: (id: string) => `/dashboard/user-role/${id}/detail`,
    },
  },
  userPost: {
    list: () => '/dashboard/user-post',
    create: () => '/dashboard/user-post/create',
    detail: (id: string) => `/dashboard/user-post/${id}/detail`,
    edit: (id: string) => `/dashboard/user-post/${id}/edit`,
  },
  feedback: {
    list: () => '/dashboard/feedback',
    detail: (id: string) => `/dashboard/feedback/${id}/detail`,
    edit: (id: string) => `/dashboard/feedback/${id}/edit`,
    create: () => '/dashboard/feedback/create',
    userFeedback: {
      list: () => '/dashboard/user-feedback',
      detail: (id: string) => `/dashboard/user-feedback/${id}/detail`,
      edit: (id: string) => `/dashboard/user-feedback/${id}/edit`,
    },
  },

  expert: {
    account: {
      profile: () => '/expert/dashboard/account/profile',
    },
    chart: {
      list: () => '/expert/dashboard/chart',
    },
    booking: {
      list: () => '/expert/dashboard/booking',
      detail: (id: string) => `/expert/dashboard/booking/${id}/detail`,
      edit: (id: string) => `/expert/dashboard/booking/${id}/edit`,
    },
  },
  booking: {
    list: () => '/dashboard/booking',
    detail: (id: string) => `/dashboard/booking/${id}/detail`,
    edit: (id: string) => `/dashboard/booking/${id}/edit`,
    create: () => '/dashboard/booking/create',
  },
  podcast: {
    list: () => '/dashboard/podcast',
    create: () => '/dashboard/podcast/create',
    edit: (id: string) => `/dashboard/podcast/${id}/edit`,
    detail: (id: string) => `/dashboard/podcast/${id}/detail`,
    category: {
      list: () => '/dashboard/podcast-category',
      create: () => '/dashboard/podcast-category/create',
      edit: (id: string) => `/dashboard/podcast-category/${id}/edit`,
      detail: (id: string) => `/dashboard/podcast-category/${id}/detail`,
    },
    author: {
      list: () => '/dashboard/podcast-author',
      create: () => '/dashboard/podcast-author/create',
      edit: (id: string) => `/dashboard/podcast-author/${id}/edit`,
      detail: (id: string) => `/dashboard/podcast-author/${id}/detail`,
    },
  },
  order: {
    list: () => '/dashboard/order',
    detail: (id: string) => `/dashboard/order/${id}/detail`,
    discount: {
      list: () => '/dashboard/discount',
      create: () => '/dashboard/discount/create',
      edit: (id: string) => `/dashboard/discount/${id}/edit`,
      detail: (id: string) => `/dashboard/discount/${id}/detail`,
    },
  },
  userTicket: {
    list: () => '/dashboard/user-ticket',
    detail: (id: string) => `/dashboard/user-ticket/${id}/detail`,
  },
  feedbackAnonymous: {
    list: () => '/dashboard/feedback-anonymous',
    detail: (id: string) => `/dashboard/feedback-anonymous/${id}/detail`,
    edit: (id: string) => `/dashboard/feedback-anonymous/${id}/edit`,
  },
  product: {
    list: () => '/dashboard/product',
    create: () => '/dashboard/product/create',
    edit: (id: string) => `/dashboard/product/${id}/edit`,
    detail: (id: string) => `/dashboard/product/${id}/detail`,
    category: {
      list: () => '/dashboard/product-category',
      create: () => '/dashboard/product-category/create',
      edit: (id: string) => `/dashboard/product-category/${id}/edit`,
      detail: (id: string) => `/dashboard/product-category/${id}/detail`,
    },
  },

  userGroup: {
    list: () => '/dashboard/user-group',
    detail: (id: string) => `/dashboard/user-group/${id}/detail`,
  },

  advertising: {
    list: () => '/dashboard/advertising',
    detail: (id: string) => `/dashboard/advertising/${id}/detail`,
    edit: (id: string) => `/dashboard/advertising/${id}/edit`,
    create: () => '/dashboard/advertising/create',
  },
  userSubscription: {
    list: () => '/dashboard/user-subscription',
    detail: (id: string) => `/dashboard/user-subscription/${id}/detail`,
  },
  subscription: {
    list: () => '/dashboard/subscription',
    create: () => '/dashboard/subscription/create',
    edit: (id: string) => `/dashboard/subscription/${id}/edit`,
    detail: (id: string) => `/dashboard/subscription/${id}/detail`,
  },
};
