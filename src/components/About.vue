<template>
  <div class="about">
    <h1 class="heading" ref="heading">Обо мне</h1>

    <!-- 3D модель, представляющая вас -->
    <div class="model-container" ref="modelContainer"></div>

    <div class="content-container">
      <!-- Биография -->
      <div class="bio" ref="bio">
        <p>Краткая биография и информация о себе, которая появляется при скролле.</p>
      </div>

      <!-- Анимированный график навыков -->
      <div class="skills-section">
        <h2 ref="skillsHeading">Мои навыки</h2>
        <div class="skills-container" ref="skillsContainer">
          <div class="skill" v-for="skill in skills" :key="skill.name">
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-bar-container">
              <div class="skill-bar" :data-percentage="skill.level"></div>
            </div>
            <span class="skill-percentage">{{ skill.level }}%</span>
          </div>
        </div>
      </div>

      <!-- Интерактивная 3D временная шкала -->
      <div class="timeline-section">
        <h2 ref="timelineHeading">Мой опыт</h2>
        <div class="timeline-container" ref="timelineContainer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import anime from 'animejs';

export default {
  name: 'About',
  data() {
    return {
      skills: [
        { name: 'Three.js', level: 90 },
        { name: 'Vue.js', level: 85 },
        { name: 'WebGL', level: 75 },
        { name: 'JavaScript', level: 95 },
        { name: 'Anime.js', level: 80 },
        { name: '3D моделирование', level: 70 }
      ],
      experience: [
        {
          year: '2022-2024',
          title: 'Старший 3D разработчик',
          company: 'TechViz Studio',
          description: 'Разработка 3D визуализаций для веб-проектов.'
        },
        {
          year: '2020-2022',
          title: 'Фронтенд-разработчик',
          company: 'WebCraft Solutions',
          description: 'Создание интерактивных веб-приложений.'
        },
        {
          year: '2018-2020',
          title: 'Дизайнер UI/UX',
          company: 'Creative Minds',
          description: 'Дизайн пользовательских интерфейсов.'
        }
      ]
    }
  },
  mounted() {
    this.initScrollAnimation();
    this.initModel();
    this.initSkillsAnimation();
    this.initTimeline();
  },
  methods: {
    initScrollAnimation() {
      // Наблюдатель за скроллом для анимаций
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 1000,
              easing: 'easeOutExpo'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      // Добавляем элементы для наблюдения
      observer.observe(this.$refs.heading);
      observer.observe(this.$refs.bio);
      observer.observe(this.$refs.skillsHeading);
      observer.observe(this.$refs.timelineHeading);
    },

    initModel() {
      // Инициализация 3D модели персонажа
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, this.$refs.modelContainer.clientWidth / this.$refs.modelContainer.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      renderer.setSize(this.$refs.modelContainer.clientWidth, this.$refs.modelContainer.clientHeight);
      this.$refs.modelContainer.appendChild(renderer.domElement);

      // Добавление освещения
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 10);
      scene.add(directionalLight);

      // Позиционирование камеры
      camera.position.z = 5;
      camera.position.y = 1;

      // Загрузка 3D модели (можно заменить на любую свою GLTF модель)
      const loader = new GLTFLoader();
      let model;

      loader.load('/models/character.glb', (gltf) => {
        model = gltf.scene;
        model.scale.set(2, 2, 2);
        scene.add(model);
      }, undefined, (error) => {
        console.error('Ошибка загрузки GLTF модели', error);

        // Резервный вариант, если модель не загрузилась
        const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
        const material = new THREE.MeshPhongMaterial({
          color: 0x2194ce,
          wireframe: false
        });
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
      });

      // Анимация модели
      const animate = () => {
        requestAnimationFrame(animate);

        if (model) {
          model.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Обработка изменения размера контейнера
      window.addEventListener('resize', () => {
        camera.aspect = this.$refs.modelContainer.clientWidth / this.$refs.modelContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(this.$refs.modelContainer.clientWidth, this.$refs.modelContainer.clientHeight);
      });
    },

    initSkillsAnimation() {
      // Наблюдатель для анимации навыков
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Анимируем каждый навык
          anime({
            targets: '.skill-bar',
            width: function(el) {
              return el.dataset.percentage + '%';
            },
            easing: 'easeInOutQuad',
            duration: 1500,
            delay: anime.stagger(100)
          });

          observer.unobserve(entries[0].target);
        }
      }, { threshold: 0.5 });

      observer.observe(this.$refs.skillsContainer);
    },

    initTimeline() {
      // Создание 3D временной шкалы опыта работы
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, this.$refs.timelineContainer.clientWidth / this.$refs.timelineContainer.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      renderer.setSize(this.$refs.timelineContainer.clientWidth, this.$refs.timelineContainer.clientHeight);
      this.$refs.timelineContainer.appendChild(renderer.domElement);

      camera.position.z = 10;

      // Создание линии времени
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(5, 0, 0)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);

      // Создание точек опыта
      const experiencePoints = [];

      this.experience.forEach((exp, index) => {
        const position = (index - (this.experience.length - 1) / 2) * 3;

        // Создаем сферу для каждого опыта
        const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x2194ce });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(position, 0, 0);

        experiencePoints.push({
          mesh: sphere,
          data: exp,
          position
        });

        scene.add(sphere);

        // Добавляем текст с годом
        const yearDiv = document.createElement('div');
        yearDiv.className = 'timeline-year';
        yearDiv.textContent = exp.year;
        yearDiv.style.position = 'absolute';
        yearDiv.style.color = 'white';
        yearDiv.style.userSelect = 'none';
        this.$refs.timelineContainer.appendChild(yearDiv);

        const updatePosition = () => {
          const vector = new THREE.Vector3(position, -1, 0);
          vector.project(camera);

          const x = (vector.x * 0.5 + 0.5) * this.$refs.timelineContainer.clientWidth;
          const y = (-vector.y * 0.5 + 0.5) * this.$refs.timelineContainer.clientHeight;

          yearDiv.style.left = `${x}px`;
          yearDiv.style.top = `${y}px`;
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
      });

      // Добавляем свет
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(0, 0, 5);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      // Обработка наведения на точки опыта
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      let hoveredPoint = null;
      let infoPanel = null;

      const onMouseMove = (event) => {
        // Получаем позицию мыши
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Проверяем пересечения
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        let found = false;

        for (let i = 0; i < intersects.length; i++) {
          const point = experiencePoints.find(p => p.mesh === intersects[i].object);

          if (point) {
            // При наведении на точку опыта
            if (hoveredPoint !== point) {
              hoveredPoint = point;

              // Увеличиваем точку
              anime({
                targets: point.mesh.scale,
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 300,
                easing: 'easeOutQuad'
              });

              // Показываем информацию
              if (infoPanel) {
                this.$refs.timelineContainer.removeChild(infoPanel);
              }

              infoPanel = document.createElement('div');
              infoPanel.className = 'timeline-info';
              infoPanel.innerHTML = `
                <h3>${point.data.title}</h3>
                <h4>${point.data.company}</h4>
                <p>${point.data.description}</p>
              `;

              this.$refs.timelineContainer.appendChild(infoPanel);

              // Позиционируем информационную панель
              const vector = new THREE.Vector3(point.position, 1, 0);
              vector.project(camera);

              const x = (vector.x * 0.5 + 0.5) * this.$refs.timelineContainer.clientWidth;
              const y = (-vector.y * 0.5 + 0.5) * this.$refs.timelineContainer.clientHeight;

              infoPanel.style.position = 'absolute';
              infoPanel.style.left = `${x - 100}px`;
              infoPanel.style.top = `${y - 120}px`;
              infoPanel.style.background = 'rgba(0, 0, 0, 0.8)';
              infoPanel.style.color = 'white';
              infoPanel.style.padding = '10px';
              infoPanel.style.borderRadius = '5px';
              infoPanel.style.width = '200px';
            }

            found = true;
            break;
          }
        }

        if (!found && hoveredPoint) {
          // Возвращаем точку к исходному размеру
          anime({
            targets: hoveredPoint.mesh.scale,
            x: 1,
            y: 1,
            z: 1,
            duration: 300,
            easing: 'easeOutQuad'
          });

          hoveredPoint = null;

          // Удаляем информационную панель
          if (infoPanel) {
            this.$refs.timelineContainer.removeChild(infoPanel);
            infoPanel = null;
          }
        }
      };

      renderer.domElement.addEventListener('mousemove', onMouseMove);

      // Анимация
      const animate = () => {
        requestAnimationFrame(animate);

        experiencePoints.forEach(point => {
          point.mesh.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
      };

      animate();

      // Обработка изменения размера контейнера
      window.addEventListener('resize', () => {
        camera.aspect = this.$refs.timelineContainer.clientWidth / this.$refs.timelineContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(this.$refs.timelineContainer.clientWidth, this.$refs.timelineContainer.clientHeight);
      });
    }
  }
}
</script>

<style scoped>
.about {
  min-height: 100vh;
  padding: 2rem;
  color: white;
}

.heading {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
}

.model-container {
  height: 400px;
  margin: 0 auto 3rem;
  max-width: 800px;
}

.content-container {
  max-width: 1000px;
  margin: 0 auto;
}

.bio {
  margin-bottom: 3rem;
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0;
}

.skills-section {
  margin-bottom: 4rem;
}

.skills-container {
  margin-top: 2rem;
}

.skill {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.skill-name {
  width: 150px;
  font-weight: bold;
}

.skill-bar-container {
  flex-grow: 1;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin: 0 20px;
}

.skill-bar {
  height: 100%;
  width: 0%;
  background-color: #2194ce;
  border-radius: 5px;
}

.skill-percentage {
  width: 50px;
  text-align: right;
}

.timeline-section {
  margin-top: 4rem;
}

.timeline-container {
  height: 500px;
  position: relative;
}
</style>