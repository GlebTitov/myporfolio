// src/AutoScrollNavigation.js
class AutoScrollNavigation {
    constructor(router, routes) {
        this.router = router;
        this.routes = routes.filter(route => !route.path.includes(':') && route.path !== '/:catchAll(.*)');
        this.currentPageIndex = 0;
        this.isTransitioning = false;
        this.transitionDelay = 1000; // ms
        this.scrollThreshold = 100; // Минимальное расстояние скролла для запуска перехода
        this.throttleDelay = 200; // ms для throttle функции скролла
        this.lastScrollTime = 0;
        this.lastScrollDirection = null;
        this.scrollCount = 0; // Счетчик попыток скролла вниз при достижении конца страницы
        this.scrollTriggerCount = 2; // Количество попыток скролла вниз для срабатывания перехода
        this.touchStartY = 0; // Для обработки свайпов на мобильных устройствах

        this.onScroll = this.onScroll.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.updateCurrentPageIndex = this.updateCurrentPageIndex.bind(this);
        this.getNextPage = this.getNextPage.bind(this);
        this.getPrevPage = this.getPrevPage.bind(this);
    }

    init() {
        // Обновляем текущий индекс страницы при изменении маршрута
        this.router.afterEach(this.updateCurrentPageIndex);

        // Устанавливаем текущий индекс страницы при инициализации
        this.updateCurrentPageIndex(this.router.currentRoute.value);

        // Добавляем обработчики событий
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('wheel', this.onWheel, { passive: false }); // Для более точного обнаружения направления прокрутки
        window.addEventListener('touchstart', this.onTouchStart, { passive: true });
        window.addEventListener('touchmove', this.onTouchMove, { passive: false });

        // Создаем индикаторы навигации
        this.createNavigationIndicators();

        console.log('AutoScrollNavigation initialized with routes:', this.routes);
    }

    destroy() {
        // Удаляем обработчики событий
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);

        // Удаляем индикаторы
        const nextIndicator = document.getElementById('next-page-indicator');
        const prevIndicator = document.getElementById('prev-page-indicator');
        const transitionIndicator = document.getElementById('page-transition-indicator');

        if (nextIndicator) document.body.removeChild(nextIndicator);
        if (prevIndicator) document.body.removeChild(prevIndicator);
        if (transitionIndicator) document.body.removeChild(transitionIndicator);
    }

    updateCurrentPageIndex(route) {
        const currentPath = route.path || route.fullPath;
        this.currentPageIndex = this.routes.findIndex(r => r.path === currentPath);

        // Сбрасываем счетчики при смене страницы
        this.scrollCount = 0;
        this.lastScrollDirection = null;

        // Обновляем индикаторы
        this.updateNavigationIndicators();

        // Плавно скроллим вверх при переходе на новую страницу
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    getNextPage() {
        if (this.currentPageIndex < this.routes.length - 1) {
            return this.routes[this.currentPageIndex + 1];
        }
        return null;
    }

    getPrevPage() {
        if (this.currentPageIndex > 0) {
            return this.routes[this.currentPageIndex - 1];
        }
        return null;
    }

    onScroll() {
        // Применяем throttling к обработке скролла
        const now = Date.now();
        if (now - this.lastScrollTime < this.throttleDelay) return;
        this.lastScrollTime = now;

        // Если переход уже в процессе, не обрабатываем скролл
        if (this.isTransitioning) return;

        // Обновляем индикаторы
        this.updateNavigationIndicators();
    }

    onWheel(event) {
        // Если переход уже в процессе, не обрабатываем событие
        if (this.isTransitioning) {
            event.preventDefault();
            return;
        }

        // Определяем направление прокрутки
        const direction = event.deltaY > 0 ? 'down' : 'up';

        // Проверяем, достиг ли пользователь конца или начала страницы
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = scrollPosition >= documentHeight - this.scrollThreshold;
        const isAtTop = window.scrollY <= this.scrollThreshold;

        // Если направление такое же, как предыдущее, увеличиваем счетчик
        if (direction === this.lastScrollDirection) {
            this.scrollCount++;
        } else {
            this.scrollCount = 1;
            this.lastScrollDirection = direction;
        }

        // Обработка особых случаев для малых страниц
        const hasMinimalScroll = documentHeight <= window.innerHeight + 100;

        // Если мы находимся внизу страницы и скроллим вниз ИЛИ страница слишком маленькая
        if ((isAtBottom && direction === 'down') || (hasMinimalScroll && direction === 'down')) {
            if (this.scrollCount >= this.scrollTriggerCount) {
                const nextPage = this.getNextPage();

                if (nextPage) {
                    event.preventDefault();
                    this.navigateToPage(nextPage);
                }
            }
        }
        // Если мы находимся вверху страницы и скроллим вверх
        else if ((isAtTop && direction === 'up') || (hasMinimalScroll && direction === 'up')) {
            if (this.scrollCount >= this.scrollTriggerCount) {
                const prevPage = this.getPrevPage();

                if (prevPage) {
                    event.preventDefault();
                    this.navigateToPage(prevPage, 'prev');
                }
            }
        } else {
            // Если не в конце/начале, сбрасываем счетчик
            this.scrollCount = 0;
        }
    }

    onTouchStart(event) {
        this.touchStartY = event.touches[0].clientY;
    }

    onTouchMove(event) {
        // Если переход уже в процессе, не обрабатываем событие
        if (this.isTransitioning) {
            event.preventDefault();
            return;
        }

        const touchY = event.touches[0].clientY;
        const diff = this.touchStartY - touchY;

        // Определяем направление свайпа
        const direction = diff > 0 ? 'down' : 'up';
        const absDiff = Math.abs(diff);

        // Проверяем достаточно ли силен свайп (более 50px)
        if (absDiff < 50) return;

        // Проверяем, достиг ли пользователь конца или начала страницы
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isAtBottom = scrollPosition >= documentHeight - this.scrollThreshold;
        const isAtTop = window.scrollY <= this.scrollThreshold;

        // Обработка особых случаев для малых страниц
        const hasMinimalScroll = documentHeight <= window.innerHeight + 100;

        // Если мы находимся внизу страницы и свайпаем вниз ИЛИ страница слишком маленькая
        if ((isAtBottom && direction === 'down') || (hasMinimalScroll && direction === 'down')) {
            const nextPage = this.getNextPage();

            if (nextPage) {
                event.preventDefault();
                this.navigateToPage(nextPage);
            }
        }
        // Если мы находимся вверху страницы и свайпаем вверх
        else if ((isAtTop && direction === 'up') || (hasMinimalScroll && direction === 'up')) {
            const prevPage = this.getPrevPage();

            if (prevPage) {
                event.preventDefault();
                this.navigateToPage(prevPage, 'prev');
            }
        }
    }

    navigateToPage(page, direction = 'next') {
        // Устанавливаем флаг, что переход начался
        this.isTransitioning = true;

        // Показываем индикатор перехода
        this.showTransitionIndicator(page, direction);

        // Создаем анимацию перехода
        document.body.classList.add(`page-transition-${direction}`);

        // Переходим на новую страницу после анимации
        setTimeout(() => {
            this.router.push(page.path);

            // Сбрасываем классы анимации
            setTimeout(() => {
                document.body.classList.remove(`page-transition-${direction}`);
                this.isTransitioning = false;
            }, 500);
        }, 800); // Увеличим задержку для более плавного перехода
    }

    createNavigationIndicators() {
        // Добавляем стили для анимации перехода
        const styleElement = document.createElement('style');
        styleElement.textContent = `
      /* Стили для индикаторов навигации */
      .page-navigation-indicator {
        position: fixed;
        width: 40px;
        height: 40px;
        background-color: rgba(33, 148, 206, 0.2);
        border: 2px solid rgba(33, 148, 206, 0.8);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 9998;
        transition: all 0.3s ease;
        opacity: 0;
      }
      
      .next-page-indicator {
        bottom: 20px;
        right: 20px;
      }
      
      .prev-page-indicator {
        top: 20px;
        right: 20px;
      }
      
      .page-navigation-indicator.visible {
        opacity: 1;
      }
      
      .page-navigation-indicator:hover {
        background-color: rgba(33, 148, 206, 0.4);
        transform: scale(1.1);
      }
      
      .next-page-indicator:after {
        content: '';
        width: 12px;
        height: 12px;
        border-right: 3px solid rgba(33, 148, 206, 1);
        border-bottom: 3px solid rgba(33, 148, 206, 1);
        transform: rotate(45deg) translateY(-2px);
      }
      
      .prev-page-indicator:after {
        content: '';
        width: 12px;
        height: 12px;
        border-right: 3px solid rgba(33, 148, 206, 1);
        border-bottom: 3px solid rgba(33, 148, 206, 1);
        transform: rotate(225deg) translateX(-2px);
      }
      
      /* Стили для индикатора перехода */
      .page-transition-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background-color: rgba(33, 148, 206, 0.8);
        color: #fff;
        padding: 10px 15px;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        display: flex;
        align-items: center;
      }
      
      .page-transition-indicator.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      
      .page-transition-indicator .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        margin-right: 8px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Анимации перехода между страницами */
      .page-transition-next {
        overflow-y: hidden;
      }
      
      .page-transition-prev {
        overflow-y: hidden;
      }
      
      @keyframes fadeInFromBottom {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInFromTop {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .route-enter-active {
        animation: fadeInFromBottom 0.6s ease-out;
      }
      
      .route-leave-active {
        animation: fadeInFromTop 0.6s ease-in reverse;
      }
    `;
        document.head.appendChild(styleElement);

        // Создаем индикатор для перехода на следующую страницу
        let nextIndicator = document.getElementById('next-page-indicator');
        if (!nextIndicator) {
            nextIndicator = document.createElement('div');
            nextIndicator.id = 'next-page-indicator';
            nextIndicator.className = 'page-navigation-indicator next-page-indicator';

// При клике переходим на следующую страницу
            nextIndicator.addEventListener('click', () => {
                const nextPage = this.getNextPage();
                if (nextPage && !this.isTransitioning) {
                    this.navigateToPage(nextPage);
                }
            });

            document.body.appendChild(nextIndicator);
        }

        // Создаем индикатор для перехода на предыдущую страницу
        let prevIndicator = document.getElementById('prev-page-indicator');
        if (!prevIndicator) {
            prevIndicator = document.createElement('div');
            prevIndicator.id = 'prev-page-indicator';
            prevIndicator.className = 'page-navigation-indicator prev-page-indicator';

            // При клике переходим на предыдущую страницу
            prevIndicator.addEventListener('click', () => {
                const prevPage = this.getPrevPage();
                if (prevPage && !this.isTransitioning) {
                    this.navigateToPage(prevPage, 'prev');
                }
            });

            document.body.appendChild(prevIndicator);
        }

        // Создаем индикатор перехода
        let transitionIndicator = document.getElementById('page-transition-indicator');
        if (!transitionIndicator) {
            transitionIndicator = document.createElement('div');
            transitionIndicator.id = 'page-transition-indicator';
            transitionIndicator.className = 'page-transition-indicator';

            // Добавляем спиннер
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            transitionIndicator.appendChild(spinner);

            document.body.appendChild(transitionIndicator);
        }
    }

    updateNavigationIndicators() {
        const nextIndicator = document.getElementById('next-page-indicator');
        const prevIndicator = document.getElementById('prev-page-indicator');

        if (!nextIndicator || !prevIndicator) return;

        // Проверяем, есть ли следующая и предыдущая страницы
        const hasNextPage = this.getNextPage() !== null;
        const hasPrevPage = this.getPrevPage() !== null;

        // Проверяем, находимся ли мы на странице с малой прокруткой
        const documentHeight = document.documentElement.scrollHeight;
        const hasMinimalScroll = documentHeight <= window.innerHeight + 100;

        // Проверяем, достигли ли мы конца страницы
        const scrollPosition = window.scrollY + window.innerHeight;
        const isNearBottom = scrollPosition >= documentHeight - this.scrollThreshold;

        // Показываем/скрываем индикаторы
        if (hasNextPage && (isNearBottom || hasMinimalScroll)) {
            nextIndicator.classList.add('visible');

            // Добавляем пульсацию, если находимся в самом низу
            if (isNearBottom) {
                nextIndicator.classList.add('pulse');
            } else {
                nextIndicator.classList.remove('pulse');
            }
        } else {
            nextIndicator.classList.remove('visible', 'pulse');
        }

        if (hasPrevPage && (window.scrollY <= this.scrollThreshold || hasMinimalScroll)) {
            prevIndicator.classList.add('visible');
        } else {
            prevIndicator.classList.remove('visible');
        }
    }

    showTransitionIndicator(page, direction) {
        const indicator = document.getElementById('page-transition-indicator');
        if (!indicator) return;

        // Преобразуем путь в понятное название
        let pageName = '';

        switch (page.name) {
            case 'Home':
                pageName = 'Главную';
                break;
            case 'About':
                pageName = 'О себе';
                break;
            case 'Projects':
                pageName = 'Проекты';
                break;
            case 'Contact':
                pageName = 'Контакты';
                break;
            default:
                pageName = page.name || 'страницу';
        }

        // Обновляем текст, добавляя его после спиннера
        // Сначала удаляем прежний текстовый узел, если он есть
        Array.from(indicator.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                indicator.removeChild(node);
            }
        });

        indicator.appendChild(document.createTextNode(` Переход на ${pageName}...`));

        // Показываем индикатор
        indicator.classList.add('visible');

        // Скрываем индикатор после перехода
        setTimeout(() => {
            indicator.classList.remove('visible');
        }, 800);
    }
}

export default AutoScrollNavigation;