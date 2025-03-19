import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';

// Ленивая загрузка остальных компонентов для оптимизации
const About = () => import('./components/About.vue');
const Projects = () => import('./components/Projects.vue');
const ProjectDetails = () => import('./components/ProjectDetails.vue');
const Contact = () => import('./components/Contact.vue');

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/projects',
        name: 'Projects',
        component: Projects
    },
    {
        path: '/project/:id',
        name: 'ProjectDetails',
        component: ProjectDetails,
        props: true
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact
    },
    // // Перенаправление на главную страницу при переходе по несуществующему маршруту
    {
        path: '/:catchAll(.*)',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

export default router;