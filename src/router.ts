import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from "@/entities";


const isAuthenticated = async (to, from, next) => {
  const authStore = useAuthStore();

  try {
    const res = await authStore.checkAuth();

    if (!!res?.data?.user?.id) {
      next();
    } else {
      // There was an error so redirect
      window.location.href = '/login';
    }
  } catch (e) {
    console.log('e', e);
  }
};

const routes = [
  {
    path: '/',
    component: () => import('@/pages/avito-view/AvitoView.vue'),
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/editor',
    component: () => import('@/pages/avito-editor/AvitoEditor.vue'),
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/create',
    component: () => import('@/pages/avito-create/AvitoCreate.vue'),
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/avito-analytics',
    component: () => import('@/pages/avito-analytics/AvitoAnalytics.vue'),
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/avito-analytics/create',
    component: () => import('@/pages/avito-analytics/create-avito-analytics-request/CreateAvitoAnalyticsRequest.vue'),
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/avito-analytics/:id',
    component: () => import('@/pages/avito-analytics/avito-analytics-details/AvitoAnalyticsDetails.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/firms',
    component: () => import('@/pages/firms-view/FirmsView.vue'),
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  {
    path: '/firm/:id',
    component: () => import('@/pages/firm-view/FirmView.vue'),
    props: true,
    beforeEnter: (to, from, next) => {
      isAuthenticated(to, from, next);
    },
  },
  { path: '/login', component: () => import('@/pages/login-view/LoginView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
