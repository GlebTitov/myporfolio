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

    <!-- Сетка проектов -->
    <transition-group name="project-list" tag="div" class="projects-grid">
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
    </transition-group>

    <!-- Сообщение если проектов не найдено -->
    <div v-if="filteredProjects.length === 0" class="no-projects">
      <p>Проекты в категории "{{ activeCategory }}" не найдены</p>
      <button @click="resetFilters" class="reset-btn">Показать все проекты</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import anime from 'animejs';

const router = useRouter();

// Состояние компонента
const activeCategory = ref('Все');

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

// Методы
const filterProjects = (category) => {
  // Проверяем, не выбрана ли уже эта категория
  if (activeCategory.value === category) return;

  // Устанавливаем новую активную категорию
  activeCategory.value = category;

  // Анимация кнопок фильтров
  anime({
    targets: '.filter-btn.active',
    scale: [1, 1.1, 1],
    duration: 500,
    easing: 'easeOutElastic(1, .5)'
  });
};

const resetFilters = () => {
  activeCategory.value = 'Все';
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
    easing: 'easeOutExpo'
  })
      .add({
        targets: '.title',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000
      })
      .add({
        targets: '.title-underline',
        width: [0, 80],
        opacity: [0, 1],
        duration: 800,
        offset: '-=600'
      })
      .add({
        targets: '.filter-btn',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(80),
        duration: 600,
        offset: '-=400'
      })
      .add({
        targets: '.project-card',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(80, {start: 300}),
        duration: 800,
        offset: '-=600'
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
  border-radius: 2px;
  opacity: 0;
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
  transition: all 0.3s ease;
  font-weight: 500;
  opacity: 0;
}

.filter-btn:hover {
  background: rgba(33, 148, 206, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(33, 148, 206, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #2194ce, #21ce93);
  border-color: transparent;
  box-shadow: 0 5px 15px rgba(33, 148, 206, 0.3);
}

/* Сетка проектов */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  min-height: 200px; /* Минимальная высота для предотвращения прыжков макета */
}

/* Анимации для списка проектов */
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.5s ease;
}

.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.project-list-move {
  transition: transform 0.5s;
}

/* Стили карточки проекта */
.project-card {
  background: rgba(15, 17, 36, 0.6);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
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
}

.project-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: rgba(15, 17, 36, 0.9);
  position: relative;
  z-index: 3;
}

.project-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 600;
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