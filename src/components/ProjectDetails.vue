<template>
  <div class="project-details">
    <h1 class="title" ref="projectTitle">{{ project?.title }}</h1>

    <!-- Гифка проекта вместо 3D модели -->
    <div class="project-showcase">
      <div class="gif-container" ref="gifContainer">
        <div class="gif-wrapper" :class="getCategoryClass(project?.category)">
          <div class="overlay"></div>
        </div>
      </div>

      <div class="project-meta" ref="projectMeta">
        <div class="meta-item">
          <span class="meta-icon">📂</span>
          <span class="meta-label">Категория:</span>
          <span class="meta-value">{{ project?.category }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">📅</span>
          <span class="meta-label">Дата:</span>
          <span class="meta-value">{{ project?.date }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">👤</span>
          <span class="meta-label">Клиент:</span>
          <span class="meta-value">{{ project?.client }}</span>
        </div>
        <div class="tech-tags">
          <span v-for="(tech, index) in project?.technologies" :key="index" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- Описание и особенности проекта -->
    <div class="project-content">
      <div class="project-description" ref="projectDescription">
        <h2>О проекте</h2>
        <p>{{ project?.description }}</p>
      </div>

      <div class="project-features" ref="projectFeatures">
        <h2>Ключевые особенности</h2>
        <ul>
          <li v-for="(feature, index) in project?.features" :key="index">
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Галерея изображений проекта -->
    <div class="project-gallery" ref="galleryContainer">
      <h2>Галерея</h2>
      <div class="gallery-grid">
        <div
            v-for="(image, index) in project?.gallery"
            :key="index"
            class="gallery-item"
            @click="openImage(index)"
        >
          <img :src="image" :alt="`${project?.title} - изображение ${index + 1}`">
          <div class="gallery-item-overlay">
            <span class="view-icon">👁️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для просмотра изображений -->
    <div class="image-modal" v-if="isModalOpen" @click="closeModal">
      <div class="modal-content">
        <img :src="currentImage" alt="Увеличенное изображение">
        <button class="close-btn" @click="closeModal">&times;</button>
        <button class="nav-btn prev" @click.stop="prevImage">&lt;</button>
        <button class="nav-btn next" @click.stop="nextImage">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import anime from 'animejs';

// Получаем route и router
const route = useRoute();
const router = useRouter();
const projectId = computed(() => Number(route.params.id));

// Refs для DOM элементов
const projectTitle = ref(null);
const gifContainer = ref(null);
const projectMeta = ref(null);
const projectDescription = ref(null);
const projectFeatures = ref(null);
const galleryContainer = ref(null);

// Данные проектов
const projects = ref([
  {
    id: 1,
    title: '3D конфигуратор продукта',
    description: 'Интерактивный 3D конфигуратор для настройки продукта с реалистичной визуализацией и возможностью экспорта выбранной конфигурации.',
    category: '3D',
    date: '2023',
    client: 'FutureTech Inc.',
    features: [
      'Интерактивная 3D визуализация',
      'Настройка цветов и материалов в реальном времени',
      'Экспорт конфигурации в PDF',
      'Сохранение и загрузка пользовательских настроек'
    ],
    technologies: ['Three.js', 'WebGL', 'Vue.js', 'GLSL'],
    gallery: [
      '/images/project1/image1.jpg',
      '/images/project1/image2.jpg',
      '/images/project1/image3.jpg',
      '/images/project1/image4.jpg'
    ],
    relatedIds: [2, 5]
  },
  {
    id: 2,
    title: 'Интернет-магазин',
    description: 'Современный интернет-магазин с интерактивными элементами и 3D предпросмотром товаров.',
    category: 'Web',
    date: '2023',
    client: 'RetailX',
    features: [
      'Адаптивный дизайн',
      '3D предпросмотр товаров',
      'Интеграция с платежными системами',
      'Продвинутый поиск товаров'
    ],
    technologies: ['Vue.js', 'Three.js', 'Node.js', 'MongoDB'],
    gallery: [
      '/images/project2/image1.jpg',
      '/images/project2/image2.jpg',
      '/images/project2/image3.jpg'
    ],
    relatedIds: [1, 6]
  },
  {
    id: 3,
    title: 'Мобильное приложение',
    description: 'Дизайн и прототип мобильного приложения для управления умным домом.',
    category: 'UI/UX',
    date: '2022',
    client: 'SmartHome Solutions',
    features: [
      'Интуитивный пользовательский интерфейс',
      'Анимированные переходы между экранами',
      'Интерактивный прототип',
      'Управление всеми устройствами умного дома'
    ],
    technologies: ['Figma', 'After Effects', 'Principle', 'Lottie'],
    gallery: [
      '/images/project3/image1.jpg',
      '/images/project3/image2.jpg',
      '/images/project3/image3.jpg'
    ],
    relatedIds: [4, 6]
  },
  {
    id: 4,
    title: 'Игровой интерфейс',
    description: 'Анимированный интерфейс для игрового проекта с уникальными эффектами и интерактивными элементами.',
    category: 'Animation',
    date: '2023',
    client: 'GameStudio XYZ',
    features: [
      'Динамические анимации элементов интерфейса',
      'Система уведомлений с эффектами частиц',
      'Адаптивное масштабирование для разных разрешений',
      'Оптимизация производительности'
    ],
    technologies: ['After Effects', 'Lottie', 'GSAP', 'Unity'],
    gallery: [
      '/images/project4/image1.jpg',
      '/images/project4/image2.jpg',
      '/images/project4/image3.jpg'
    ],
    relatedIds: [3, 5]
  },
  {
    id: 5,
    title: '3D визуализация архитектуры',
    description: 'Реалистичная 3D визуализация архитектурного проекта с возможностью виртуального тура.',
    category: '3D',
    date: '2023',
    client: 'ArchVision Design',
    features: [
      'Фотореалистичная визуализация интерьера и экстерьера',
      'Интерактивный виртуальный тур',
      'Настройка освещения в реальном времени',
      'Высококачественные материалы и текстуры'
    ],
    technologies: ['Three.js', 'Blender', 'GLSL', 'React'],
    gallery: [
      '/images/project5/image1.jpg',
      '/images/project5/image2.jpg',
      '/images/project5/image3.jpg'
    ],
    relatedIds: [1, 4]
  },
  {
    id: 6,
    title: 'Корпоративный сайт',
    description: 'Разработка корпоративного сайта с 3D элементами и уникальными анимациями для технологической компании.',
    category: 'Web',
    date: '2022',
    client: 'InnovateTech Corp',
    features: [
      'Параллакс эффекты при скролле',
      'Интеграция 3D моделей в веб-интерфейс',
      'Полная адаптивность для мобильных устройств',
      'Оптимизация SEO и производительности'
    ],
    technologies: ['Vue.js', 'GSAP', 'Three.js', 'SASS'],
    gallery: [
      '/images/project6/image1.jpg',
      '/images/project6/image2.jpg',
      '/images/project6/image3.jpg'
    ],
    relatedIds: [2, 3]
  }
]);

// Текущий проект
const project = computed(() => projects.value.find(p => p.id === projectId.value));

// Состояние галереи изображений
const isModalOpen = ref(false);
const currentImageIndex = ref(0);
const currentImage = computed(() => {
  if (project.value && project.value.gallery.length > 0) {
    return project.value.gallery[currentImageIndex.value];
  }
  return '';
});

// Методы для галереи изображений
const openImage = (index) => {
  currentImageIndex.value = index;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = 'auto';
};

const nextImage = (e) => {
  e.stopPropagation();
  if (project.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % project.value.gallery.length;
  }
};

const prevImage = (e) => {
  e.stopPropagation();
  if (project.value) {
    currentImageIndex.value = (currentImageIndex.value - 1 + project.value.gallery.length) % project.value.gallery.length;
  }
};

// Получение класса для гифки в зависимости от категории (взято из компонента Projects)
const getCategoryClass = (category) => {
  switch(category) {
    case '3D': return 'gif-3d';
    case 'Web': return 'gif-web';
    case 'UI/UX': return 'gif-uiux';
    case 'Animation': return 'gif-animation';
    default: return 'gif-default';
  }
};

// Анимация элементов страницы
const animateElements = () => {
  if (!projectTitle.value) return;

  // Анимация заголовка
  anime({
    targets: projectTitle.value,
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'easeOutExpo'
  });

  // Анимация мета-информации
  if (projectMeta.value) {
    anime({
      targets: projectMeta.value.querySelectorAll('.meta-item, .tech-tag'),
      opacity: [0, 1],
      translateX: [20, 0],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeOutCubic'
    });
  }

  // Анимация описания и особенностей
  if (projectDescription.value && projectFeatures.value) {
    anime({
      targets: [projectDescription.value, projectFeatures.value],
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(200),
      duration: 800,
      easing: 'easeOutCubic'
    });
  }

  // Анимация галереи
  if (galleryContainer.value) {
    anime({
      targets: galleryContainer.value.querySelectorAll('.gallery-item'),
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeOutCubic'
    });
  }
};

// Наблюдаем за изменением projectId
watch(() => projectId.value, () => {
  if (!project.value) {
    // Если проект не найден, перенаправляем на страницу проектов
    router.push('/projects');
    return;
  }

  // Запускаем анимацию элементов
  animateElements();
}, { immediate: true });

// При монтировании компонента
onMounted(() => {
  if (project.value) {
    animateElements();
  } else {
    // Если проект не найден, перенаправляем на страницу проектов
    router.push('/projects');
  }
});
</script>

<style scoped>
.project-details {
  color: white;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2.8rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(to right, #2194ce, #21ceb8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Основной контейнер с гифкой и мета-информацией */
.project-showcase {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: center;
  background: rgba(15, 20, 30, 0.4);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.gif-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.gif-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  transition: transform 0.5s ease;
}

.gif-wrapper:hover {
  transform: scale(1.05);
}

/* Гифки для разных категорий (скопировано из компонента Projects) */
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

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-icon {
  font-size: 1.2rem;
}

.meta-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.meta-value {
  color: #2194ce;
  font-weight: 500;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tech-tag {
  background: linear-gradient(135deg, rgba(33, 148, 206, 0.2), rgba(33, 206, 184, 0.2));
  border: 1px solid rgba(33, 148, 206, 0.5);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  display: inline-block;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 148, 206, 0.2);
  background: linear-gradient(135deg, rgba(33, 148, 206, 0.3), rgba(33, 206, 184, 0.3));
}

/* Контент проекта: описание и особенности */
.project-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-description, .project-features {
  background: rgba(15, 20, 30, 0.4);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.project-content h2 {
  color: #2194ce;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.project-content h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #2194ce, #21ceb8);
  border-radius: 2px;
}

.project-description p {
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}

.project-features ul {
  list-style-type: none;
  padding: 0;
}

.project-features li {
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
}

.project-features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2194ce;
  font-size: 1.2rem;
}

/* Галерея проекта */
.project-gallery {
  margin-bottom: 3rem;
  background: rgba(15, 20, 30, 0.4);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.project-gallery h2 {
  color: #2194ce;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.project-gallery h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, #2194ce, #21ceb8);
  border-radius: 2px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.gallery-item {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/10;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(33, 148, 206, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.view-icon {
  font-size: 2rem;
  color: white;
}

/* Модальное окно для просмотра изображений */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(33, 148, 206, 0.3);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(33, 148, 206, 0.6);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

/* Адаптивная верстка */
@media (max-width: 992px) {
  .project-showcase,
  .project-content {
    grid-template-columns: 1fr;
  }

  .gif-container {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }

  .project-showcase,
  .project-description,
  .project-features,
  .project-gallery {
    padding: 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .gif-container {
    height: 300px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .project-details {
    padding: 1rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .gif-container {
    height: 250px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>