import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Today.vue') },
      { path: 'today', component: () => import('pages/Today.vue') },
      { path: 'backlog', component: () => import('pages/Backlog.vue') },
      { path: 'statistics', component: () => import('pages/Statistics.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
