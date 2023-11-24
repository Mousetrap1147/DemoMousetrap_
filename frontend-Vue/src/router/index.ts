import { createRouter, createWebHistory } from 'vue-router';
// import testRoutes from './testRoutes';

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/about', component: () => import('../views/AboutView.vue') },
  // ...testRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;