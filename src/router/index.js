import Vue from 'vue';
import Router from 'vue-router';

import store from '~/store';

import middlewarePipeline from './middlewarePipeline';
import auth from './middleware/auth';
import guest from './middleware/guest';
import home from './middleware/home';


Vue.use(Router);

// Массив с роутами отделен для легкого доступа
export const routers = [
  {
    path: '/',
    name: 'MainPage',
    component: () => import('~/components/MainPage'),
    meta: {
      middleware: [home],
      visible: false
    }
  },

  {
    path: '/login',
    name: 'Authorization',
    component: () => import('~/components/Authorization'),
    meta: {
      middleware: [guest],
      visible: false
    }
  },
  {
    path: '/regin',
    name: 'Registration',
    component: () => import('~/components/Registration'),
    meta: {
      middleware: [guest],
      visible: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('~/components/ForgotPassword'),
    meta: {
      middleware: [guest],
      visible: false
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('~/components/ResetPassword'),
    props: (route) => ({
      email: route.query.email,
      token: route.query.token
    }),
    meta: {
      middleware: [guest],
      visible: false
    }
  },


  {
    path: '/main',
    name: 'AdminPanel',
    component: () => import('~/components/AdminPanel/AdminPanel'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Панель",
      visible: true,
      rights: ['client', 'redactor'] // Указанны статусы которым доступ закрыт
    }
  },
  {
    path: '/cabinet',
    name: 'CabinetPage',
    component: () => import('~/components/CabinetPage/CabinetPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Кабинет",
      visible: false,
      rights: []
    },
  },


  


  {
    path: '/video',
    name: 'VideoPage',
    component: () => import('~/components/VideoPage/VideoPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Видео",
      visible: true,
      rights: []
    }
  },

  {
    path: '/video/:type',
    name: 'VideosPage',
    component: () => import('~/components/VideoPage/VideoPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Видео",
      visible: false,
      rights: []
    }
  },

  {
    path: '/tikets',
    name: 'TiketsPage',
    component: () => import('~/components/TiketsPage/TiketsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Тикеты",
      visible: true,
      rights: []
    }
  },
  /*{
    path: '/player',
    name: 'PlayerPage',
    component: () => import('~/components/PlayerPage/PlayerPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Плеер",
      visible: true,
      rights: []
    }
  },*/

  {
    path: '/articles',
    name: 'ArticlesPage',
    component: () => import('~/components/ArticlesPage/ArticlesPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Документация",
      visible: true,
      rights: [],
      type: 'sub',
      access: ['redactor','administrator']
    },
  },
  {
    path: '/articles/:id',
    name: 'ArticlePage',
    component: () => import('~/components/ArticlesPage/ArticlePage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Статья",
      visible: false,
      rights: [],
      type: 'sub'
    },
  },
  
  {
    path: '/users',
    name: 'UsersPage',
    component: () => import('~/components/UsersPage/UsersPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Пользователи",
      visible: true,
      rights: ['client', 'redactor', 'managing']
    }
  },
  {
    path: '/domains',
    name: 'DomainsPage',
    component: () => import('~/components/DomainsPage/DomainsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Домены",
      visible: true,
      rights: ['client', 'redactor', 'managing']
    }
  },
  {
    path: '/client-pay-stats',
    name: 'ClientPayStatsPage',
    component: () => import('~/components/ClientPayStatsPage/ClientPayStatsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Статистика оплат",
      visible: true,
      rights: []
    }
  },
  {
    path: '/admin-pay-stats',
    name: 'AdminPayStatsPage',
    component: () => import('~/components/AdminPayStatsPage/AdminPayStatsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Статистика оплат (Админ)",
      visible: true,
      rights: ['client', 'managing']
    }
  },
  {
    path: '/ads',
    name: 'AdsPage',
    component: () => import('~/components/AdsPage/AdsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Рекламный кабинет",
      visible: true,
      rights: ['client', 'redactor', 'managing']
    }
  },


  // translations

  {
    path: '/translations',
    name: 'TranslationPage',
    component: () => import('~/components/TranslationPage/TranslationPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Переводы",
      visible: true,
      rights: ['client', 'redactor', 'managing']
    }
  },
  {
    path: '/domain-types',
    name: 'DomainTypesPage',
    component: () => import('~/components/DomainTypesPage/DomainTypesPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Настройки",
      visible: true,
      rights: ['client', 'redactor', 'managing'],
      type: 'sub',
      access: ['redactor','administrator']
    }
  },
    // {
    //   path: '/domain-tags',
    //   name: 'DomainTagsPage',
    //   component: () => import('~/components/DomainTagsPage/DomainTagsPage'),
    //   props: true,
    //   meta: {
    //     middleware: [auth],
    //     title: "Теги доменов",
    //     visible: false,
    //     rights: ['client', 'redactor', 'managing']
    //   }
    // },
    // {
    //   path: '/domains-tags-assign',
    //   name: 'DomainTagsAssignPage',
    //   component: () => import('~/components/DomainTagsAssignPage/DomainTagsAssignPage'),
    //   props: true,
    //   meta: {
    //     middleware: [auth],
    //     title: "Назначение тегов доменам",
    //     visible: true,
    //     rights: ['client', 'redactor', 'managing']
    //   }
    // },

  {
    path: '/cdns',
    name: 'CDNsPage',
    component: () => import('~/components/CDNsPage/CDNsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Управление CDN",
      visible: false,
      rights: ['client', 'redactor', 'managing']
    }
  },

  {
    path: '/geo-groups',
    name: 'GeoGroupsPage',
    component: () => import('~/components/GeoGroupsPage/GeoGroupsPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Гео-группы",
      visible: false,
      rights: ['client', 'redactor', 'managing']
    }
  },

  {
    path: '/prices',
    name: 'PricesPage',
    component: () => import('~/components/PricesPage/PricesPage'),
    props: true,
    meta: {
      middleware: [auth],
      title: "Управление ценами",
      visible: false,
      rights: ['client', 'redactor', 'managing']
    }
  },


  {
    path: '/*',
    name: 'Error',
    component: () => import('~/components/CompositeBlocks/Error404Page'),
    props: true,
    meta: {
      // middleware: [auth],
      title: "Ошибка 404",
      visible: false,
      rights: []
    }
  }
  
]

export const router = new Router({
  mode: 'history',
  base: '/',
  hashbang: false,
  routes: routers
});

// Выполнение промежуточного ПО
router.beforeEach((to, from, next) => {
  // console.log(to.path);
  store.commit('setRoute', to.path);
  if(!to.meta.middleware){ return next()} // Проверка на наличие Middleware
  const middleware = to.meta.middleware; // Выборка Middleware
  const context = {to, from, next, store}; // Установка нового context
  return middleware[0]({ ...context, next: middlewarePipeline(context, middleware, 1) }); // Передача на конвеер
});



