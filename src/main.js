import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import AutoScrollNavigation from './AutoScrollNavigation';

const app = createApp(App);

// Подключаем роутер
app.use(router);

// Добавляем переходы между маршрутами
router.beforeEach((to, from, next) => {
    // Добавляем классы для анимации перехода, если переходим между разными маршрутами
    if (from.name !== null) {
        // Определяем направление перехода
        const toIndex = router.options.routes.findIndex(r => r.path === to.path);
        const fromIndex = router.options.routes.findIndex(r => r.path === from.path);

        if (toIndex > fromIndex) {
            document.body.classList.add('route-transition-next');
        } else {
            document.body.classList.add('route-transition-prev');
        }
    }

    next();
});

router.afterEach(() => {
    // Удаляем классы после завершения перехода
    document.body.classList.remove('route-transition-next', 'route-transition-prev');
});

// Монтируем приложение
app.mount('#app');

// Инициализация автоматической навигации после загрузки приложения
router.isReady().then(() => {
    // Инициализируем автоскролл только если есть более одной страницы
    if (router.options.routes.length > 1) {
        const autoScroll = new AutoScrollNavigation(router, router.options.routes);
        autoScroll.init();

        // Добавляем его в window для доступа из других компонентов
        window.autoScroll = autoScroll;
    }
});