import Main from '@/components/sections/Main.vue';
import Login from '@/components/Login.vue';

import { createWebHistory, createRouter } from 'vue-router';


const routes = [

    {
        path: '/',
        component: Main,
        name: 'HelloWorld',
    },
    {
        path: '/login',
        component: Login,
        name: 'Login',
        meta: { hideLayout: true}
    },
]; 

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;