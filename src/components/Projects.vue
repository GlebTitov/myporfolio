<template>
  <div class="projects">
    <h1 class="heading" ref="heading">Мои проекты</h1>

    <!-- Фильтры категорий -->
    <div class="filters" ref="filters">
      <button
          v-for="category in categories"
          :key="category"
          @click="filterProjects(category)"
          :class="{ active: activeCategory === category }"
          class="filter-btn"
      >
        {{ category }}
      </button>
    </div>

    <!-- Переключатель режима отображения -->
    <div class="view-toggle" ref="viewToggle">
      <button
          @click="viewMode = 'grid'"
          :class="{ active: viewMode === 'grid' }"
      >
        Сетка
      </button>
      <button
          @click="viewMode = 'list'"
          :class="{ active: viewMode === 'list' }"
      >
        Список
      </button>
    </div>

    <!-- 3D галерея проектов -->
    <div v-if="viewMode === 'grid'" class="projects-grid" ref="projectsContainer"></div>

    <!-- Список проектов -->
    <div v-else class="projects-list">
      <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="list-item"
          ref="listItems"
      >
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <router-link :to="'/project/' + project.id" class="view-btn">Подробнее</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import anime from 'animejs';

const router = useRouter();

// Рефы для DOM элементов
const heading = ref(null);
const filters = ref(null);
const viewToggle = ref(null);
const projectsContainer = ref(null);
const listItems = ref([]);

// Состояние компонента
const viewMode = ref('grid');
const activeCategory = ref('Все');
const categories = ref(['Все', '3D', 'Web', 'UI/UX', 'Animation']);

// Данные проектов
const projects = ref([
  {
    id: 1,
    title: '3D конфигуратор продукта',
    description: 'Интерактивный 3D конфигуратор для настройки продукта.',
    category: '3D',
    image: 'project1.jpg'
  },
  {
    id: 2,
    title: 'Интернет-магазин',
    description: 'Современный интернет-магазин с интерактивными элементами.',
    category: 'Web',
    image: 'project2.jpg'
  },
  {
    id: 3,
    title: 'Мобильное приложение',
    description: 'Дизайн и прототип мобильного приложения.',
    category: 'UI/UX',
    image: 'project3.jpg'
  },
  {
    id: 4,
    title: 'Игровой интерфейс',
    description: 'Анимированный интерфейс для игрового проекта.',
    category: 'Animation',
    image: 'project4.jpg'
  },
  {
    id: 5,
    title: '3D визуализация архитектуры',
    description: 'Реалистичная 3D визуализация архитектурного проекта.',
    category: '3D',
    image: 'project5.jpg'
  },
  {
    id: 6,
    title: 'Корпоративный сайт',
    description: 'Разработка корпоративного сайта с 3D элементами.',
    category: 'Web',
    image: 'project6.jpg'
  }
]);

// Вычисляемое свойство для отфильтрованных проектов
const filteredProjects = computed(() => {
  if (activeCategory.value === 'Все') {
    return projects.value;
  }
  return projects.value.filter(project => project.category === activeCategory.value);
});

// Переменные для Three.js
let scene, camera, renderer, projectMeshes = [];

// Методы
const filterProjects = (category) => {
  activeCategory.value = category;

  // Анимируем кнопки фильтров
  anime({
    targets: '.filter-btn',
    scale: function(el) {
      return el.classList.contains('active') ? [0.9, 1] : 1;
    },
    duration: 300,
    easing: 'easeOutElastic(1, .5)'
  });

  if (viewMode.value === 'grid') {
    updateGrid();
  } else {
    animateListItems();
  }
};

const goToProject = (id) => {
  router.push(`/project/${id}`);
};

// Инициализация 3D галереи
const init3DGallery = () => {
  if (!projectsContainer.value) return;

  // Очищаем контейнер перед повторной инициализацией
  while (projectsContainer.value.firstChild) {
    projectsContainer.value.removeChild(projectsContainer.value.firstChild);
  }

  // Настройка сцены
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, projectsContainer.value.clientWidth / projectsContainer.value.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(projectsContainer.value.clientWidth, projectsContainer.value.clientHeight);
  projectsContainer.value.appendChild(renderer.domElement);

  camera.position.z = 10;

  // Добавляем освещение
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Создаем проектные карточки в 3D
  projectMeshes = [];

  // Создаем сетку для размещения проектов
  const gridSize = Math.ceil(Math.sqrt(filteredProjects.value.length));
  const gridGap = 3;
  const totalWidth = (gridSize - 1) * gridGap;
  const startOffset = -totalWidth / 2;

  filteredProjects.value.forEach((project, index) => {
    // Вычисляем позицию в сетке
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Создаем текстуру для проекта
    const texture = new THREE.TextureLoader().load(project.image);
    const geometry = new THREE.BoxGeometry(2, 2, 0.1);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: texture,
      bumpScale: 0.05,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = startOffset + col * gridGap;
    mesh.position.y = -(startOffset + row * gridGap);
    mesh.userData = { id: project.id };

    projectMeshes.push(mesh);
    scene.add(mesh);

    // Добавляем название проекта под карточкой
    const titleDiv = document.createElement('div');
    titleDiv.className = 'project-title';
    titleDiv.textContent = project.title;
    titleDiv.style.position = 'absolute';
    titleDiv.style.color = 'white';
    titleDiv.style.textAlign = 'center';
    titleDiv.style.width = '150px';
    titleDiv.style.pointerEvents = 'none';
    projectsContainer.value.appendChild(titleDiv);

    const updatePosition = () => {
      const vector = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * projectsContainer.value.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * projectsContainer.value.clientHeight;

      titleDiv.style.left = `${x - 75}px`;
      titleDiv.style.top = `${y + 50}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
  });

  // Добавляем интерактивность
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let hoveredMesh = null;

  const onMouseMove = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    let found = false;

    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;
      if (projectMeshes.includes(object)) {
        if (hoveredMesh !== object) {
          // Возвращаем предыдущий объект к исходному размеру
          if (hoveredMesh) {
            anime({
              targets: hoveredMesh.scale,
              x: 1,
              y: 1,
              z: 1,
              duration: 300,
              easing: 'easeOutQuad'
            });
          }

          hoveredMesh = object;

          // Увеличиваем новый объект
          anime({
            targets: hoveredMesh.scale,
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 300,
            easing: 'easeOutQuad'
          });

          // Меняем стиль курсора
          renderer.domElement.style.cursor = 'pointer';
        }

        found = true;
        break;
      }
    }

    if (!found && hoveredMesh) {
      // Возвращаем объект к исходному размеру
      anime({
        targets: hoveredMesh.scale,
        x: 1,
        y: 1,
        z: 1,
        duration: 300,
        easing: 'easeOutQuad'
      });

      hoveredMesh = null;
      renderer.domElement.style.cursor = 'default';
    }
  };

  const onClick = (event) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;
      if (projectMeshes.includes(object)) {
        router.push(`/project/${object.userData.id}`);
        break;
      }
    }
  };

  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onClick);

  // Анимация
  const animate = () => {
    requestAnimationFrame(animate);

    projectMeshes.forEach(mesh => {
      mesh.rotation.y += 0.005;
    });

    renderer.render(scene, camera);
  };

  animate();

  // Обработка изменения размера окна
  const handleResize = () => {
    if (!projectsContainer.value) return;

    camera.aspect = projectsContainer.value.clientWidth / projectsContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(projectsContainer.value.clientWidth, projectsContainer.value.clientHeight);
  };

  window.addEventListener('resize', handleResize);

  // Добавляем функцию для очистки
  return () => {
    window.removeEventListener('resize', handleResize);
    renderer.domElement.removeEventListener('mousemove', onMouseMove);
    renderer.domElement.removeEventListener('click', onClick);

    projectMeshes.forEach(mesh => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  };
};

// Обновление 3D сетки при изменении фильтров
const updateGrid = () => {
  if (viewMode.value === 'grid') {
    const cleanup = init3DGallery();
    // Запоминаем функцию очистки для вызова при будущих обновлениях
    return cleanup;
  }
};

// Анимация элементов списка
const animateListItems = () => {
  if (!listItems.value.length) return;

  anime({
    targets: listItems.value,
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(100),
    duration: 800,
    easing: 'easeOutExpo'
  });
};

// Анимация заголовка и фильтров
const animatePageElements = () => {
  if (!heading.value || !filters.value || !viewToggle.value) return;

  anime.timeline()
      .add({
        targets: heading.value,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo'
      })
      .add({
        targets: filters.value.children,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        offset: '-=600'
      })
      .add({
        targets: viewToggle.value.children,
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        offset: '-=700'
      });
};

// Наблюдаем за изменениями режима отображения
watch(viewMode, (newMode, oldMode) => {
  if (newMode === 'grid') {
    updateGrid();
  } else {
    // Даем время DOM обновиться, затем анимируем
    setTimeout(() => {
      animateListItems();
    }, 100);
  }
});

// При монтировании компонента
onMounted(() => {
  animatePageElements();

  if (viewMode.value === 'grid') {
    updateGrid();
  }
});
</script>

<style scoped>
.projects {
  padding: 2rem;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
}

.heading {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  opacity: 0;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(33, 148, 206, 0.1);
  border: 1px solid #2194ce;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
}

.filter-btn:hover, .filter-btn.active {
  background: #2194ce;
}

.view-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.view-toggle button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
}

.view-toggle button.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.projects-grid {
  height: 600px;
  position: relative;
}

.project-title {
  font-size: 1rem;
  font-weight: bold;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.list-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.list-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.list-item h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2194ce;
}

.list-item p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.view-btn {
  display: inline-block;
  background: #2194ce;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.view-btn:hover {
  background: #1a7dae;
}

@media (max-width: 768px) {
  .projects-list {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    height: 400px;
  }

  .filters {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
}
</style>