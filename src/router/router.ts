import Main from '@/components/sections/Main.vue';
import { createWebHistory, createRouter } from 'vue-router';


const routes = [

    {
        path: '/',
        component: Main,
        name: 'HelloWorld',
    },
]; 

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;