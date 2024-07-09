import Main from '@/components/sections/Main.vue';
import Leave from '@/components/sections/Leave.vue';
import History from '@/components/sections/History.vue';
import AdminHistory from '@/components/sections/admin/AdminHistory.vue';
import AdminLeave from '@/components/sections/admin/AdminLeave.vue';
import AdminUser from '@/components/sections/admin/AdminUser.vue';

import Login from '@/components/Login.vue';
import Error from '@/components/Error.vue';

import { createWebHistory, createRouter } from 'vue-router';

const routes = [

    {
        path: '/',
        component: Main,
        name: 'Main',
    },
    {
        path: '/login',
        component: Login,
        name: 'Login',
        meta: {hideLayout: true}
    },
    {
        path: '/leave',
        component: Leave,
        name: 'Leave',
    },
    { 
        path: '/history',
        component: History,
        name: 'History',
    },
    {
        path: '/admin/history',
        component: AdminHistory,
        name: 'AdminHistory',
    },
    {
        path: '/admin/leave',
        component: AdminLeave,
        name: 'AdminLeave',
    },
    {
        path: '/admin/user',
        component: AdminUser,
        name: 'AdminUser',
    },
    {
      path: '/:pathMatch(.*)*',  // 모든 경로와 매칭됩니다.
      component: Error,
      name: 'Error',
      meta: {hideLayout: true}
    },
]; 

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;