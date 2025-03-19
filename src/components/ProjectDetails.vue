<template>
  <div class="project-details">
    <h1 class="title" ref="projectTitle">{{ project?.title }}</h1>

    <!-- 3D модель проекта -->
    <div class="model-container" ref="modelContainer"></div>

    <div class="project-info" ref="projectInfo">
      <div class="details">
        <div class="category">
          <span class="label">Категория:</span>
          <span class="value">{{ project?.category }}</span>
        </div>
        <div class="date">
          <span class="label">Дата:</span>
          <span class="value">{{ project?.date }}</span>
        </div>
        <div class="client">
          <span class="label">Клиент:</span>
          <span class="value">{{ project?.client }}</span>
        </div>
      </div>

      <div class="description">
        <h2>Описание</h2>
        <p>{{ project?.description }}</p>
      </div>

      <div class="features">
        <h2>Ключевые особенности</h2>
        <ul>
          <li v-for="(feature, index) in project?.features" :key="index">
            {{ feature }}
          </li>
        </ul>
      </div>

      <div class="tech-stack">
        <h2>Технологии</h2>
        <div class="tech-tags">
          <span v-for="(tech, index) in project?.technologies" :key="index" class="tech-tag">
            {{ tech }}
          </span>
        </div>
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

    <!-- Связанные проекты -->
    <div class="related-projects" ref="relatedProjectsContainer">
      <h2>Похожие проекты</h2>
      <div class="related-carousel"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import anime from 'animejs';

// Получаем route и router
const route = useRoute();
const router = useRouter();
const projectId = computed(() => Number(route.params.id));

// Refs для DOM элементов
const projectTitle = ref(null);
const modelContainer = ref(null);
const projectInfo = ref(null);
const galleryContainer = ref(null);
const relatedProjectsContainer = ref(null);

// Данные проектов (в реальном приложении могут быть получены из API)
const projects = ref([
  {
    id: 1,
    title: '3D конфигуратор продукта',
    description: 'Интерактивный 3D конфигуратор для настройки продукта с реалистичной визуализацией и возможностью экспорта выбранной конфигурации.',
    category: '3D',
    date: '2023',
    client: 'FutureTech Inc.',
    modelUrl: '/models/configurator.glb', // путь к 3D модели
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
    relatedIds: [2, 5] // ID связанных проектов
  },
  {
    id: 2,
    title: 'Интернет-магазин',
    description: 'Современный интернет-магазин с интерактивными элементами и 3D предпросмотром товаров.',
    category: 'Web',
    date: '2023',
    client: 'RetailX',
    modelUrl: '/models/shop.glb',
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
    modelUrl: '/models/mobile_app.glb',
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
    modelUrl: '/models/game_ui.glb',
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
    modelUrl: '/models/architecture.glb',
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
    modelUrl: '/models/corporate_site.glb',
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

// Переменные для Three.js
let scene, camera, renderer, model;

// Методы для галереи изображений
const openImage = (index) => {
  currentImageIndex.value = index;
  isModalOpen.value = true;
  // Предотвращаем прокрутку страницы
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

// Инициализация 3D модели
const initModel = () => {
  if (!modelContainer.value || !project.value) return;

  // Очищаем контейнер перед повторной инициализацией
  while (modelContainer.value.firstChild) {
    modelContainer.value.removeChild(modelContainer.value.firstChild);
  }

  // Настройка сцены
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, modelContainer.value.clientWidth / modelContainer.value.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(modelContainer.value.clientWidth, modelContainer.value.clientHeight);
  renderer.setClearColor(0x000000, 0);
  modelContainer.value.appendChild(renderer.domElement);

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  // Позиционирование камеры
  camera.position.z = 5;

  // Загрузка 3D модели
  const loader = new GLTFLoader();

  // Пытаемся загрузить модель из URL проекта
  loader.load(project.value.modelUrl, (gltf) => {
    model = gltf.scene;
    model.scale.set(2, 2, 2);
    scene.add(model);
  }, undefined, (error) => {
    console.error('Ошибка загрузки GLTF модели', error);

    // Резервный вариант - создаем простую геометрию
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x2194ce,
      wireframe: false,
      flatShading: true
    });
    model = new THREE.Mesh(geometry, material);
    scene.add(model);
  });

  // Анимация
  const animate = () => {
    requestAnimationFrame(animate);

    if (model) {
      model.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
  };

  animate();

  // Обработка изменения размера окна
  const handleResize = () => {
    if (!modelContainer.value) return;
    camera.aspect = modelContainer.value.clientWidth / modelContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelContainer.value.clientWidth, modelContainer.value.clientHeight);
  };

  window.addEventListener('resize', handleResize);

  // Функция очистки
  return () => {
    window.removeEventListener('resize', handleResize);
    if (model) {
      scene.remove(model);
      model.geometry?.dispose();
      model.material?.dispose();
    }
    if (renderer) {
      renderer.dispose();
    }
  };
};

// Анимация элементов страницы
const animateElements = () => {
  if (!projectTitle.value || !projectInfo.value) return;

  // Анимация заголовка
  anime({
    targets: projectTitle.value,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutExpo'
  });

  // Анимация информации о проекте
  anime({
    targets: projectInfo.value.children,
    opacity: [0, 1],
    translateY: [30, 0],
    delay: anime.stagger(200, {start: 300}),
    duration: 800,
    easing: 'easeOutCubic'
  });

  // Анимация галереи
  if (galleryContainer.value) {
    anime({
      targets: galleryContainer.value,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 600
    });
  }
};

// Настройка связанных проектов в 3D карусели
const setupRelatedProjects = () => {
  if (!relatedProjectsContainer.value || !project.value) return;

  // Получаем связанные проекты по ID
  const relatedProjects = projects.value.filter(p =>
      project.value.relatedIds.includes(p.id)
  );

  // Находим контейнер для карусели
  const carouselContainer = relatedProjectsContainer.value.querySelector('.related-carousel');

  // Очищаем контейнер перед повторной инициализацией
  while (carouselContainer.firstChild) {
    carouselContainer.removeChild(carouselContainer.firstChild);
  }

  // Настройка сцены
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, carouselContainer.clientWidth / carouselContainer.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(carouselContainer.clientWidth, carouselContainer.clientHeight);
  carouselContainer.appendChild(renderer.domElement);

  camera.position.z = 5;

  // Добавляем освещение
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Создаем карточки для каждого связанного проекта
  const projectObjects = [];
  const textureLoader = new THREE.TextureLoader();

  relatedProjects.forEach((relatedProject, index) => {
    const geometry = new THREE.BoxGeometry(1.5, 1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x2194ce,
      bumpScale: 0.05
    });

    // Пытаемся загрузить изображение из галереи как текстуру
    if (relatedProject.gallery && relatedProject.gallery.length > 0) {
      textureLoader.load(relatedProject.gallery[0], (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (index - (relatedProjects.length - 1) / 2) * 2;
    mesh.userData = { id: relatedProject.id };

    projectObjects.push(mesh);
    scene.add(mesh);

    // Добавляем название проекта под карточкой
    const titleDiv = document.createElement('div');
    titleDiv.className = 'related-project-title';
    titleDiv.textContent = relatedProject.title;
    titleDiv.style.position = 'absolute';
    titleDiv.style.color = 'white';
    titleDiv.style.textAlign = 'center';
    titleDiv.style.pointerEvents = 'none';
    carouselContainer.appendChild(titleDiv);

    // Функция для обновления позиции текста
    const updatePosition = () => {
      const vector = new THREE.Vector3(mesh.position.x, -1, mesh.position.z);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * carouselContainer.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * carouselContainer.clientHeight;

      titleDiv.style.left = `${x - 75}px`;
      titleDiv.style.width = '150px';
      titleDiv.style.top = `${y + 20}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
  });

  // Добавляем интерактивность - при клике переход на страницу проекта
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onClick = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;
      if (object.userData && object.userData.id) {
        router.push(`/project/${object.userData.id}`);
        break;
      }
    }
  };

  renderer.domElement.addEventListener('click', onClick);

  // Анимация
  const animate = () => {
    requestAnimationFrame(animate);

    projectObjects.forEach(mesh => {
      mesh.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
  };

  animate();

  // Обработка изменения размера окна
  const handleResize = () => {
    camera.aspect = carouselContainer.clientWidth / carouselContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(carouselContainer.clientWidth, carouselContainer.clientHeight);
  };

  window.addEventListener('resize', handleResize);

  // Функция очистки
  return () => {
    window.removeEventListener('resize', handleResize);
    renderer.domElement.removeEventListener('click', onClick);

    projectObjects.forEach(mesh => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });

    renderer.dispose();
  };
};

// Наблюдаем за изменением projectId
watch(() => projectId.value, () => {
  if (!project.value) {
    // Если проект не найден, перенаправляем на страницу проектов
    router.push('/projects');
    return;
  }

  // Запускаем инициализацию при изменении проекта
  const cleanupModel = initModel();
  const cleanupRelated = setupRelatedProjects();
  animateElements();

  // Возвращаем функцию очистки
  return () => {
    if (cleanupModel) cleanupModel();
    if (cleanupRelated) cleanupRelated();
  };
}, { immediate: true });

// При монтировании компонента
onMounted(() => {
  if (project.value) {
    initModel();
    setupRelatedProjects();
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
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.model-container {
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.details .label {
  font-weight: bold;
  color: #2194ce;
  margin-right: 0.5rem;
}

.description h2, .features h2, .tech-stack h2 {
  color: #2194ce;
  margin-bottom: 1rem;
}

.features ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.features li {
  margin-bottom: 0.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: rgba(33, 148, 206, 0.2);
  border: 1px solid #2194ce;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.project-gallery {
  margin-bottom: 3rem;
}

.project-gallery h2 {
  color: #2194ce;
  margin-bottom: 1.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery-item {
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
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
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.related-projects {
  margin-top: 4rem;
}

.related-projects h2 {
  color: #2194ce;
  margin-bottom: 1.5rem;
}

.related-carousel {
  height: 300px;
  position: relative;
}

.related-project-title {
  font-size: 1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .project-info {
    grid-template-columns: 1fr;
  }

  .model-container {
    height: 300px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>