
/**
 * 需要授权访问的路由
 */
const asyncRoutesChildren = [
  {
    path: '/',
    name: 'home',
    meta: {
      roles: ['admin', 'user', 'ZhangKaijie'],
      title: '主页',
      icon: 'home',
      keepAlive: true
    },
    component: () => import('../views/home/home.vue')
  },
  {
    path: '/later',
    name: 'later',
    meta: {
      roles: ['admin', 'user'],
      title: '稍后阅读',
      icon: 'watch_later',
      keepAlive: true
    },
    component: () => import('../views/menu1/menu1-2')
  },
  {
    path: '/subscribeList',
    name: 'subscribeList',
    meta: {
      roles: ['admin', 'user'],
      title: '订阅列表',
      itemLabel: 'FEEDS',
      icon: 'format_list_bulleted',
      isOpen: true
    },
    component: () => import('../views/menu1/menu1')
  },
  // children: [
  // {
  //   path: 'menu-1-1',
  //   name: 'menu-1-1',
  //   meta: {
  //     roles: ['admin', 'user'],
  //     title: '模块 1 - 1',
  //     icon: 'filter_1'
  //   },
  //   component: () => import('../components/Layout/layout'),
  //   children: [
  //     {
  //       path: 'menu-1-1-1',
  //       name: 'menu-1-1-1',
  //       meta: {
  //         roles: ['admin', 'user'],
  //         title: '模块 1 - 1 - 1',
  //         icon: 'flaky',
  //         keepAlive: true
  //       },
  //       component: () => import('../views/menu1/menu1')
  //     }
  //   ]
  // },
  // {
  //   path: 'menu-1-2',
  //   name: 'menu-1-2',
  //   meta: {
  //     roles: ['admin', 'user'],
  //     title: '模块 1 - 2',
  //     icon: 'filter_2',
  //     keepAlive: true
  //   },
  //   component: () => import('../views/menu1/menu1-2')
  // }
  // ]
  {
    path: '/menu-2',
    name: 'menu-2',
    meta: {
      roles: ['admin', 'user'],
      title: '订阅管理',
      icon: 'settings'
    },
    component: () => import('../views/menu2/menu-2-1')
  },
  {
    path: '/menu-3',
    name: 'menu-3',
    meta: {
      roles: ['admin', 'user'],
      title: '订阅市场',
      icon: 'apps',
      isOpen: true
    },
    component: () => import('../views/menu3/menu3')
  // children: [
  //   {
  //     path: 'menu3-1',
  //     name: 'getting-started',
  //     meta: {
  //       roles: ['admin', 'user'],
  //       title: '模块 3 - 1',
  //       icon: 'filter_2',
  //       isOpen: true
  //     },
  //     component: () => import('../components/Layout/layout'),
  //     children: [
  //       {
  //         path: 'menu3-1-1',
  //         name: 'menu3-1-1',
  //         meta: {
  //           roles: ['admin', 'user'],
  //           title: '模块 3 - 1 - 1',
  //           icon: 'filter_1',
  //           keepAlive: true
  //         },
  //         component: () => import('../views/menu3/menu3')
  //       }
  //     ]
  //       }
  //     ]
  },
  // {
  //   path: 'http://www.quasarchs.com/vue-components/button',
  //   name: 'external-link',
  //   meta: {
  //     roles: ['admin', 'user'],
  //     title: '外部链接/更多组件',
  //     icon: 'send'
  //   }
  // },
  {
    path: '/tableDetail/:id',
    name: 'tableDetail',
    meta: {
      roles: ['admin', 'user'],
      title: 'Treats 详情',
      icon: 'blur_linear',
      isHidden: true
    },
    component: () => import('../views/home/tableDetail')
  },
  {
    path: '*', // 此处需置于最底部
    redirect: '/NoFound404',
    meta: {
      roles: ['admin', 'user'],
      isHidden: true
    }
  }
]

const asyncRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/',
    component: () => import('../views/index'),
    meta: {
      // index 应该是所有的用户都可以访问
      roles: ['admin', 'editor', 'test']
    },
    children: asyncRoutesChildren
  }
]

export default asyncRoutes
