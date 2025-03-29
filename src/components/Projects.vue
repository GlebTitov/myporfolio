<template>
  <div class="projects-page">
    <!-- Заголовок с анимацией -->
    <div class="page-header">
      <h1 class="title">Мои проекты</h1>
      <div class="title-underline"></div>
    </div>

    <!-- Фильтры проектов -->
    <div class="filters-container">
      <div class="filter-buttons">
        <button
            v-for="category in categories"
            :key="category"
            :class="['filter-btn', { active: activeCategory === category }]"
            @click="filterProjects(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Сетка проектов с улучшенной анимацией переключения -->
    <div class="projects-container">
      <div class="projects-grid">
        <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
            @click="viewProjectDetails(project)"
        >
          <div class="project-card-inner">
            <!-- Карточка проекта с GIF-изображением -->
            <div class="project-image">
              <div class="gif-container" :class="getCategoryClass(project.category)">
                <div class="overlay"></div>
              </div>
              <span class="project-category">{{ project.category }}</span>
            </div>
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-action">
                <router-link :to="`/project/${project.id}`" class="details-btn">
                  Подробнее
                  <span class="arrow-icon">→</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Сообщение если проектов не найдено -->
    <div v-if="filteredProjects.length === 0" class="no-projects">
      <p>Проекты в категории "{{ activeCategory }}" не найдены</p>
      <button @click="resetFilters" class="reset-btn">Показать все проекты</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import anime from 'animejs';

const router = useRouter();

// Состояние компонента
const activeCategory = ref('Все');
const isFiltering = ref(false);

// Категории проектов
const categories = ref(['Все', '3D', 'Web', 'UI/UX', 'Animation']);

// Данные проектов
const projects = ref([
  {
    id: 1,
    title: '3D конфигуратор продукта',
    description: 'Интерактивный 3D конфигуратор для настройки продукта с возможностью менять цвета и материалы в реальном времени.',
    category: '3D',
    tags: ['three.js', 'WebGL', 'интерактивный дизайн']
  },
  {
    id: 2,
    title: 'Интернет-магазин',
    description: 'Современный интернет-магазин с адаптивным дизайном, корзиной покупок и интеграцией платежных систем.',
    category: 'Web',
    tags: ['Vue.js', 'адаптивный дизайн', 'e-commerce']
  },
  {
    id: 3,
    title: 'Мобильное приложение',
    description: 'Дизайн и прототип мобильного приложения для управления умным домом с интуитивным интерфейсом.',
    category: 'UI/UX',
    tags: ['Figma', 'прототипирование', 'UX-исследование']
  },
  {
    id: 4,
    title: 'Игровой интерфейс',
    description: 'Анимированный интерфейс для игрового проекта с эффектами частиц и плавными переходами между экранами.',
    category: 'Animation',
    tags: ['GSAP', 'игровой UI', 'анимация']
  },
  {
    id: 5,
    title: '3D визуализация архитектуры',
    description: 'Реалистичная 3D визуализация архитектурного проекта с виртуальным туром и настраиваемым освещением.',
    category: '3D',
    tags: ['blender', 'архитектурная визуализация', 'виртуальный тур']
  },
  {
    id: 6,
    title: 'Корпоративный сайт',
    description: 'Разработка корпоративного сайта с плавными анимациями, 3D элементами и оптимизированной производительностью.',
    category: 'Web',
    tags: ['Vue.js', 'three.js', 'корпоративный дизайн']
  },
  {
    id: 7,
    title: 'Анимированная инфографика',
    description: 'Серия анимированных инфографик для визуализации сложных данных и статистики с интерактивными элементами.',
    category: 'Animation',
    tags: ['SVG', 'D3.js', 'визуализация данных']
  },
  {
    id: 8,
    title: 'Дизайн мобильного приложения',
    description: 'Разработка дизайн-системы и пользовательского интерфейса для мобильного приложения финтех-сервиса.',
    category: 'UI/UX',
    tags: ['design system', 'мобильный UI', 'финтех']
  }
]);

// Фильтрованные проекты
const filteredProjects = computed(() => {
  if (activeCategory.value === 'Все') {
    return projects.value;
  }
  return projects.value.filter(p => p.category === activeCategory.value);
});

// Удалены методы анимации для transition-group, так как они больше не используются

// Методы
const filterProjects = async (category) => {
  // Проверяем, не выбрана ли уже эта категория и не выполняется ли фильтрация
  if (activeCategory.value === category || isFiltering.value) return;

  // Устанавливаем флаг, что фильтрация началась
  isFiltering.value = true;

  // Анимация активной кнопки фильтра - без эффекта пружины
  anime({
    targets: '.filter-btn',
    scale: function(el) {
      return el.classList.contains('active') ? 1 : 1;
    },
    duration: 300,
    easing: 'easeOutQuad'
  });

  // Эффект исчезновения текущих карточек
  const cards = document.querySelectorAll('.project-card');

  // Если карточки есть, делаем анимацию исчезновения
  if (cards.length > 0) {
    // Простое исчезновение текущих карточек
    await anime({
      targets: cards,
      opacity: 0,
      translateY: 10,
      easing: 'easeOutQuad',
      duration: 250,
    }).finished;
  }

  // Меняем категорию
  activeCategory.value = category;

  // Дожидаемся обновления DOM
  await nextTick();

  // Устанавливаем начальное состояние для новых карточек
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(15px)";
  });

  // Очень короткая задержка для гарантии применения стилей
  await new Promise(resolve => setTimeout(resolve, 10));

  // Простое, прямое появление новых карточек
  const newCards = document.querySelectorAll('.project-card');

  // Единая анимация появления карточек - без сложных эффектов и пружины
  anime({
    targets: newCards,
    opacity: 1,
    translateY: 0,
    duration: 400,
    easing: 'easeOutQuad',
    complete: () => {
      // Сброс флага фильтрации
      isFiltering.value = false;
    }
  });
};

const resetFilters = () => {
  filterProjects('Все');
};

const viewProjectDetails = (project) => {
  router.push(`/project/${project.id}`);
};

// Получение CSS класса для GIF в зависимости от категории
const getCategoryClass = (category) => {
  switch(category) {
    case '3D': return 'gif-3d';
    case 'Web': return 'gif-web';
    case 'UI/UX': return 'gif-uiux';
    case 'Animation': return 'gif-animation';
    default: return 'gif-default';
  }
};

// Анимации при монтировании компонента
onMounted(() => {
  // Анимация заголовка
  anime.timeline({
    easing: 'easeOutQuad'
  })
      .add({
        targets: '.title',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800
      })
      .add({
        targets: '.title-underline',
        width: [0, 100],
        opacity: [0, 1],
        duration: 600,
        offset: '-=400'
      })
      .add({
        targets: '.filter-btn',
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(80),
        duration: 500,
        offset: '-=300'
      })
      .add({
        targets: '.project-card',
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(40),
        duration: 500,
        offset: '-=300'
      });
});
</script>

<style scoped>
/* Основные стили страницы */
.projects-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #ffffff;
}

/* Стили заголовка */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #2194ce, #21ce93);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
}

.title-underline {
  height: 4px;
  width: 0;
  background: linear-gradient(to right, #2194ce, #21ce93);
  margin: 0 auto;
  border-radius: 4px;
  opacity: 0;
  box-shadow: 0 0 10px rgba(33, 148, 206, 0.5);
}

/* Стили фильтров */
.filters-container {
  margin-bottom: 3rem;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-btn {
  background: rgba(33, 148, 206, 0.1);
  border: 1px solid rgba(33, 148, 206, 0.4);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  font-weight: 500;
  opacity: 0;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2194ce, #21ce93);
  border-radius: 30px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.filter-btn::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #2194ce, #21ce93);
  border-radius: 32px;
  z-index: -2;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.filter-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(33, 148, 206, 0.3);
  color: white;
}

.filter-btn:hover::before {
  opacity: 0.2;
}

.filter-btn:hover::after {
  opacity: 0.2;
}

.filter-btn.active {
  background: linear-gradient(135deg, #2194ce, #21ce93);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(33, 148, 206, 0.4);
  transform: translateY(-2px);
}

.filter-btn.active::after {
  opacity: 0.6;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.03);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}

/* Контейнер для анимированной сетки проектов */
.projects-container {
  min-height: 400px; /* Минимальная высота для предотвращения скачков интерфейса */
  position: relative;
  overflow: hidden; /* Предотвращает видимость элементов за пределами контейнера */
}

/* Сетка проектов */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  will-change: transform, opacity;
  perspective: 1000px;
}

/* Стили карточки проекта */
.project-card {
  background: rgba(15, 17, 36, 0.6);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); /* Улучшенный timing function */
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05);
  height: 100%;
  display: flex;
  will-change: transform, opacity;
  transform-origin: center center;
  backdrop-filter: blur(5px);
}

.project-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(33, 148, 206, 0.3);
  border-color: rgba(33, 148, 206, 0.3);
}

.project-card-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.project-image {
  height: 250px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 1rem;
  overflow: hidden;
}

/* Стили для GIF-контейнеров */
.gif-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  z-index: 1;
  transition: transform 0.5s ease;
}

.project-card:hover .gif-container {
  transform: scale(1.05);
}

/* Оверлей для улучшения читаемости текста */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
  transition: background 0.3s ease;
}

.project-card:hover .overlay {
  background: rgba(0, 0, 0, 0.2);
}

/* GIF-фоны для разных категорий */
.gif-3d {
  background-image: url('../web_dev.gif');
}

.gif-web {
  background-image: url('https://media.giphy.com/media/3oKIPEqDGUULpEU0aQ/giphy.gif');
}

.gif-uiux {
  background-image: url('https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif');
}

.gif-animation {
  background-image: url('../ahrefs _ shot.gif');
}

.gif-default {
  background-image: url('https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif');
}

.project-category {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  position: relative;
  z-index: 3;
  transition: all 0.3s ease;
  backdrop-filter: blur(3px);
}

.project-card:hover .project-category {
  background: rgba(33, 148, 206, 0.7);
  transform: translateY(-5px);
}

.project-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: rgba(15, 17, 36, 0.9);
  position: relative;
  z-index: 3;
  transition: background 0.3s ease;
}

.project-card:hover .project-info {
  background: rgba(25, 27, 46, 0.9);
}

.project-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

.project-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(to right, #2194ce, #21ce93);
  transition: width 0.3s ease;
}

.project-card:hover .project-title::after {
  width: 60px;
}

.project-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.project-action {
  margin-top: auto;
}

.details-btn {
  display: inline-flex;
  align-items: center;
  color: #2194ce;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  gap: 0.5rem;
}

.details-btn:hover {
  color: #21ce93;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.details-btn:hover .arrow-icon {
  transform: translateX(5px);
}

/* Блок с отсутствием проектов */
.no-projects {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(15, 17, 36, 0.4);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-projects p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.reset-btn {
  background: linear-gradient(135deg, #2194ce, #21ce93);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(33, 148, 206, 0.3);
}

/* Адаптивная верстка */
@media (max-width: 1024px) {
  .title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .filter-buttons {
    gap: 0.6rem;
  }

  .filter-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .projects-page {
    padding: 1rem;
  }

  .title {
    font-size: 2.2rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>