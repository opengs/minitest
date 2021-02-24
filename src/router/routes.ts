import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'creator', name: 'creator', component: () => import('pages/Creator.vue') },
      { path: 'reader', name: 'reader', component: () => import('pages/Reader.vue') }
    ]
  }
]

export default routes
