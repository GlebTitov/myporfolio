<template>
  <div class="home">
    <!-- 3D интро с анимированным заголовком -->
    <div class="intro" ref="introContainer">
      <h1 class="title" ref="title">Глеб Титов</h1>
      <p class="subtitle" ref="subtitle">Фронтенд-разработчик и 3D-энтузиаст</p>
    </div>

    <!-- 3D фон с плавно движущимися элементами -->
    <div class="background" ref="backgroundScene"></div>

    <!-- Краткое представление -->
    <div class="about-intro" ref="aboutIntro">
      <p>Я создаю интерактивные 3D веб-опыты, соединяя креативность с технологиями</p>
    </div>

    <!-- Обо мне секция -->
    <div class="about-section" ref="aboutSection">
      <h2 class="section-title">Обо мне</h2>
      <div class="about-content">
        <div class="about-image">
          <div class="profile-container" ref="profileContainer"></div>
        </div>
        <div class="about-text" ref="aboutText">
          <p>Привет! Я Глеб, фронтенд-разработчик с особой страстью к 3D-визуализации и интерактивным веб-интерфейсам. Я специализируюсь на создании современных, отзывчивых и визуально привлекательных веб-приложений с использованием Vue.js, Three.js и других передовых технологий.</p>
          <p>В свободное время я увлекаюсь баскетболом, что помогает мне развивать командное мышление и стратегические навыки, которые я применяю и в разработке. Также я люблю путешествовать на автомобиле, открывая новые места и находя вдохновение для своих проектов.</p>
          <p>Мой подход к разработке сочетает технические знания с творческим видением, что позволяет создавать уникальные пользовательские интерфейсы, которые не только функциональны, но и запоминаются.</p>
          <div class="skills">
            <h3>Мои навыки:</h3>
            <ul class="skills-list" ref="skillsList">
              <li>Vue.js & Vuex</li>
              <li>Three.js & WebGL</li>
              <li>JavaScript (ES6+)</li>
              <li>HTML5 & CSS3/SCSS</li>
              <li>Responsive Design</li>
              <li>3D-моделирование</li>
              <li>Интерактивная анимация</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D предпросмотр избранных проектов с улучшенным визуалом -->
    <div class="featured-projects" ref="featuredProjects">
      <h2 class="section-title">Избранные проекты</h2>
      <div class="projects-showcase" ref="projectsShowcase"></div>
      <div class="project-details" ref="projectDetails">
        <div class="project-info hidden" ref="projectInfo">
          <h3 ref="projectTitle">Название проекта</h3>
          <p ref="projectDescription">Описание проекта появится здесь при выборе проекта</p>
          <a href="#" class="project-link" ref="projectLink">Посмотреть проект</a>
        </div>
      </div>
    </div>

    <!-- Контактная секция -->
    <div class="contact-section" ref="contactSection">
      <h2 class="section-title">Связаться со мной</h2>
      <p>Если вы заинтересованы в сотрудничестве или у вас есть вопросы, не стесняйтесь связаться со мной:</p>
      <div class="contact-links" ref="contactLinks">
        <a href="mailto:gleb@example.com" class="contact-item">
          <i class="contact-icon email-icon"></i>
          gleb@example.com
        </a>
        <a href="https://github.com/glebtitov" target="_blank" class="contact-item">
          <i class="contact-icon github-icon"></i>
          GitHub
        </a>
        <a href="https://linkedin.com/in/glebtitov" target="_blank" class="contact-item">
          <i class="contact-icon linkedin-icon"></i>
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import anime from 'animejs';

export default {
  name: 'Home',
  data() {
    return {
      projects: [
        {
          title: '3D Интерактивная галерея',
          image: 'project1.jpg',
          description: 'Иммерсивная 3D галерея с интерактивными элементами и динамической навигацией.',
          link: '#project1'
        },
        {
          title: 'WebGL Эксперимент',
          image: 'project2.jpg',
          description: 'Визуальный эксперимент с использованием WebGL для создания динамических визуальных эффектов.',
          link: '#project2'
        },
        {
          title: 'Vue Dashboard',
          image: 'project3.jpg',
          description: 'Современная интерактивная панель управления, разработанная с использованием Vue.js и D3.',
          link: '#project3'
        }
      ],
      currentProject: null,
      isIntersecting: {},
      observer: null
    }
  },
  mounted() {
    this.initThreeJS();
    this.animateIntro();
    this.createFeaturedProjects();
    this.createProfileVisualization();
    this.initIntersectionObserver();
    this.animateSkillsList();
  },
  methods: {
    initThreeJS() {
      // Инициализация Three.js для фона с улучшенной визуализацией
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.backgroundScene.appendChild(renderer.domElement);

      // Создание более разнообразных и визуально интересных 3D объектов в фоне
      const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.DodecahedronGeometry(1, 0)
      ];

      const materials = [
        new THREE.MeshPhongMaterial({
          color: 0x2194ce,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        }),
        new THREE.MeshPhongMaterial({
          color: 0x21ce93,
          wireframe: true,
          transparent: true,
          opacity: 0.7
        }),
        new THREE.MeshPhongMaterial({
          color: 0xce2179,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        })
      ];

      // Создаем больше объектов с разнообразными формами и цветами
      for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 30;
        mesh.position.y = (Math.random() - 0.5) * 30;
        mesh.position.z = (Math.random() - 0.5) * 15 - 10;
        mesh.scale.setScalar(Math.random() * 0.8 + 0.6);
        mesh.userData = {
          rotationSpeed: {
            x: Math.random() * 0.01 - 0.005,
            y: Math.random() * 0.01 - 0.005,
            z: Math.random() * 0.01 - 0.005
          },
          movementAmplitude: Math.random() * 0.05 + 0.02,
          movementFrequency: Math.random() * 0.002 + 0.001,
          phase: Math.random() * Math.PI * 2
        };

        scene.add(mesh);
      }

      // Улучшенное освещение
      const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
      light1.position.set(1, 1, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0x8080ff, 0.5);
      light2.position.set(-1, -1, 5);
      scene.add(light2);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      camera.position.z = 5;

      // Анимация фоновых объектов с более плавными и разнообразными движениями
      const animate = () => {
        requestAnimationFrame(animate);

        scene.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            const userData = child.userData;

            // Более плавное вращение
            child.rotation.x += userData.rotationSpeed.x;
            child.rotation.y += userData.rotationSpeed.y;
            child.rotation.z += userData.rotationSpeed.z;

            // Более естественное колебательное движение по разным осям
            const time = Date.now() * userData.movementFrequency;
            child.position.y += Math.sin(time + userData.phase) * userData.movementAmplitude;
            child.position.x += Math.sin(time * 0.8 + userData.phase) * userData.movementAmplitude * 0.5;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      // Обработка изменения размера окна
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    },

    animateIntro() {
      // Улучшенная анимация заголовка с Anime.js
      const timeline = anime.timeline({
        easing: 'easeOutExpo'
      });

      timeline
          .add({
            targets: this.$refs.title,
            opacity: [0, 1],
            translateY: [70, 0],
            rotateX: [90, 0],
            duration: 1500
          })
          .add({
            targets: this.$refs.subtitle,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1200,
            offset: '-=1000'
          })
          .add({
            targets: this.$refs.aboutIntro,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1200,
            offset: '-=800'
          });

      // Создаем эффект "печатающегося текста" для подзаголовка
      const subtitleText = "Фронтенд-разработчик и 3D-энтузиаст";
      this.$refs.subtitle.innerHTML = "";
      let i = 0;

      setTimeout(() => {
        const typeInterval = setInterval(() => {
          if (i < subtitleText.length) {
            this.$refs.subtitle.innerHTML += subtitleText.charAt(i);
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, 50);
      }, 500);
    },

    createProfileVisualization() {
      // Создание 3D визуализации для профиля
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      // Устанавливаем размер для квадратной визуализации
      const size = Math.min(this.$refs.profileContainer.clientWidth, 300);
      renderer.setSize(size, size);
      this.$refs.profileContainer.appendChild(renderer.domElement);

      // Позиционирование камеры
      camera.position.z = 5;

      // Создаем сферу с интересной геометрией для представления профиля
      const geometry = new THREE.SphereGeometry(2, 32, 32);

      // Модифицируем геометрию для более интересного эффекта
      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const x = geometry.attributes.position.getX(i);
        const y = geometry.attributes.position.getY(i);
        const z = geometry.attributes.position.getZ(i);

        const noise = 0.2 * Math.sin(5 * x) * Math.sin(5 * y) * Math.sin(5 * z);

        geometry.attributes.position.setX(i, x * (1 + noise));
        geometry.attributes.position.setY(i, y * (1 + noise));
        geometry.attributes.position.setZ(i, z * (1 + noise));
      }

      geometry.computeVertexNormals();

      // Создаем градиентный материал
      const material = new THREE.MeshPhongMaterial({
        color: 0x2194ce,
        specular: 0x555555,
        shininess: 30,
        wireframe: false,
        transparent: true,
        opacity: 0.9
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Добавляем свет
      const light1 = new THREE.DirectionalLight(0xffffff, 1);
      light1.position.set(5, 5, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0x8080ff, 0.5);
      light2.position.set(-5, -5, 5);
      scene.add(light2);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
      scene.add(ambientLight);

      // Анимация профиля
      const animate = () => {
        requestAnimationFrame(animate);

        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
    },

    createFeaturedProjects() {
      // Создание улучшенного 3D предпросмотра проектов
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, this.$refs.projectsShowcase.clientWidth / this.$refs.projectsShowcase.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      renderer.setSize(this.$refs.projectsShowcase.clientWidth, this.$refs.projectsShowcase.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.projectsShowcase.appendChild(renderer.domElement);

      // Добавляем управление камерой для интерактивности
      camera.position.z = 5;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hoveredObject = null;
      let selectedObject = null;

      const projectObjects = [];

      // Имитация загрузки текстур
      const textures = [
        { color: 0x3498db },  // Синий
        { color: 0x2ecc71 },  // Зеленый
        { color: 0xe74c3c }   // Красный
      ];

      this.projects.forEach((project, index) => {
        // Создаем интересную геометрию для карточек проектов
        const geometry = new THREE.BoxGeometry(2.5, 1.6, 0.2);

        // Создаем материал с градиентом и подсветкой
        const material = new THREE.MeshPhongMaterial({
          color: textures[index].color,
          specular: 0xffffff,
          shininess: 100,
          emissive: 0x111111,
          transparent: true,
          opacity: 0.9
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (index - 1) * 3.2;
        mesh.userData = {
          title: project.title,
          index,
          description: project.description,
          link: project.link,
          originalPosition: mesh.position.clone(),
          originalRotation: mesh.rotation.clone(),
          hoverState: false
        };

        // Добавляем текст проекта
        const textGeometry = new THREE.PlaneGeometry(2, 0.5);
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 512;
        textCanvas.height = 128;
        const context = textCanvas.getContext('2d');
        context.fillStyle = 'white';
        context.font = 'bold 36px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(project.title, 256, 64);

        const textTexture = new THREE.Texture(textCanvas);
        textTexture.needsUpdate = true;

        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.z = 0.11;
        textMesh.position.y = -0.5;

        mesh.add(textMesh);

        projectObjects.push(mesh);
        scene.add(mesh);
      });

      // Добавляем улучшенное освещение
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(0, 0, 5);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      // Обработка нажатий на проекты
      window.addEventListener('click', (event) => {
        if (hoveredObject) {
          this.showProjectDetails(hoveredObject.userData);
          selectedObject = hoveredObject;

          // Анимируем выбранный проект
          anime({
            targets: hoveredObject.position,
            y: hoveredObject.position.y + 0.2,
            duration: 300,
            easing: 'easeOutQuad'
          });
        }
      });

      // Обработка движений мыши для эффекта наведения
// Updated mousemove event handler in createFeaturedProjects method
      window.addEventListener('mousemove', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();

        // Check if mouse is within the renderer's bounds
        if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        ) {
          // Calculate normalized mouse coordinates
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          // Update the raycaster with mouse position
          raycaster.setFromCamera(mouse, camera);

          // Cast ray and get intersections with project objects
          const intersects = raycaster.intersectObjects(projectObjects, true); // Added 'true' to also check child objects

          if (intersects.length > 0) {
            // Get the top-level parent object if we hit a child
            let hitObject = intersects[0].object;

            // If we hit a child (text mesh), get its parent
            while (hitObject.parent && projectObjects.indexOf(hitObject) === -1) {
              hitObject = hitObject.parent;
            }

            // Only process if it's one of our project objects
            if (projectObjects.includes(hitObject)) {
              if (hoveredObject !== hitObject) {
                // Reset previous hover state
                if (hoveredObject && hoveredObject !== selectedObject) {
                  this.resetProjectHover(hoveredObject);
                }

                // Set new hover state
                hoveredObject = hitObject;
                this.setProjectHover(hoveredObject);
              }
            }
          } else {
            // No intersection - reset hover if needed
            if (hoveredObject && hoveredObject !== selectedObject) {
              this.resetProjectHover(hoveredObject);
              hoveredObject = null;
            }
          }
        } else {
          // Mouse outside renderer - reset hover if needed
          if (hoveredObject && hoveredObject !== selectedObject) {
            this.resetProjectHover(hoveredObject);
            hoveredObject = null;
          }
        }
      });
      // Анимация проектов
      const animate = () => {
        requestAnimationFrame(animate);

        projectObjects.forEach(mesh => {
          if (!mesh.userData.hoverState && mesh !== selectedObject) {
            mesh.rotation.y = Math.sin(Date.now() * 0.001 + mesh.userData.index * 0.5) * 0.15;
            mesh.position.y = mesh.userData.originalPosition.y + Math.sin(Date.now() * 0.002 + mesh.userData.index) * 0.05;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      // Обработка изменения размера окна
      window.addEventListener('resize', () => {
        camera.aspect = this.$refs.projectsShowcase.clientWidth / this.$refs.projectsShowcase.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(this.$refs.projectsShowcase.clientWidth, this.$refs.projectsShowcase.clientHeight);
      });
    },

    setProjectHover(object) {
      object.userData.hoverState = true;

      // Анимируем эффект наведения
      anime({
        targets: object.position,
        y: object.userData.originalPosition.y + 0.3,
        z: object.userData.originalPosition.z + 0.5,
        duration: 300,
        easing: 'easeOutQuad'
      });

      anime({
        targets: object.rotation,
        y: 0,
        duration: 300,
        easing: 'easeOutQuad'
      });

      // Изменяем материал для эффекта наведения
      object.material.emissive.set(0x333333);
    },

    resetProjectHover(object) {
      object.userData.hoverState = false;

      // Восстанавливаем позицию
      anime({
        targets: object.position,
        y: object.userData.originalPosition.y,
        z: object.userData.originalPosition.z,
        duration: 300,
        easing: 'easeOutQuad'
      });

      // Восстанавливаем материал
      object.material.emissive.set(0x111111);
    },

    showProjectDetails(projectData) {
      // Показываем детали проекта при клике
      const projectInfo = this.$refs.projectInfo;
      const projectTitle = this.$refs.projectTitle;
      const projectDescription = this.$refs.projectDescription;
      const projectLink = this.$refs.projectLink;

      // Сначала скрываем информацию
      anime({
        targets: projectInfo,
        opacity: 0,
        translateY: 20,
        duration: 200,
        easing: 'easeOutQuad',
        complete: () => {
          // Обновляем содержимое
          projectTitle.textContent = projectData.title;
          projectDescription.textContent = projectData.description;
          projectLink.href = projectData.link;

          // Показываем обновленную информацию
          anime({
            targets: projectInfo,
            opacity: 1,
            translateY: 0,
            duration: 500,
            easing: 'easeOutQuad'
          });

          projectInfo.classList.remove('hidden');
        }
      });
    },

    animateSkillsList() {
      // Анимация списка навыков
      anime({
        targets: this.$refs.skillsList.children,
        translateX: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
      });
    },

    initIntersectionObserver() {
      // Создаем наблюдатель пересечений для анимации элементов при прокрутке
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isIntersecting[entry.target.id]) {
            this.isIntersecting[entry.target.id] = true;

            // Анимируем элемент при первом появлении
            anime({
              targets: entry.target,
              translateY: [50, 0],
              opacity: [0, 1],
              duration: 800,
              easing: 'easeOutExpo'
            });
          }
        });
      }, options);

      // Элементы для наблюдения
      const sections = [
        this.$refs.aboutSection,
        this.$refs.aboutText,
        this.$refs.featuredProjects,
        this.$refs.contactSection,
        this.$refs.contactLinks
      ];

      sections.forEach((section, index) => {
        section.id = `section-${index}`;
        this.observer.observe(section);
      });
    }
  },
  beforeDestroy() {
    // Очистка ресурсов перед уничтожением компонента
    if (this.observer) {
      this.observer.disconnect();
    }

    window.removeEventListener('resize', null);
    window.removeEventListener('mousemove', null);
    window.removeEventListener('click', null);
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
  position: relative;
  color: white;
  font-family: 'Poppins', Arial, sans-serif;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.intro {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 1rem;
  position: relative;
  overflow: hidden;
}

.title {
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  opacity: 0;
  text-shadow: 0 0 15px rgba(33, 148, 206, 0.6);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.8rem;
  opacity: 0;
  margin-bottom: 2rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
}

.about-intro {
  text-align: center;
  padding: 2rem;
  opacity: 0;
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1.6;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #2194ce, #21ce93);
  border-radius: 3px;
}

.about-section {
  padding: 6rem 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.about-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.about-image {
  flex: 0 0 300px;
  margin-bottom: 2rem;
}

.profile-container {
  width: 300px;
  height: 300px;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(33, 148, 206, 0.3);
}

.about-text {
  flex: 1;
  min-width: 300px;
  text-align: left;
  line-height: 1.8;
}

.about-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.skills {
  margin-top: 2rem;
}

.skills h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2194ce;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.skills-list li {
  background: rgba(33, 148, 206, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(33, 148, 206, 0.3);
}

.featured-projects {
  padding: 6rem 2rem;
  text-align: center;
}

.projects-showcase {
  height: 500px;
  margin-top: 2rem;
  position: relative;
}

.project-details {
  margin-top: 2rem;
  min-height: 150px;
  display: flex;
  justify-content: center;
}

.project-info {
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  text-align: left;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(33, 148, 206, 0.3);
  transition: all 0.3s ease;
}

.project-info.hidden {
  opacity: 0;
  transform: translateY(20px);
}

.project-info h3 {
  color: #2194ce;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.project-link {
  display: inline-block;
  margin-top: 1rem;
  background: linear-gradient(90deg, #2194ce, #21ce93);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.project-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(33, 148, 206, 0.4);
}

.contact-section {
  padding: 6rem 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.contact-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.contact-item:hover {
  background: rgba(33, 148, 206, 0.2);
  transform: translateY(-3px);
}

.contact-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  position: relative;
}

.footer {
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .title {
    font-size: 3.5rem;
  }

  .subtitle {
    font-size: 1.4rem;
  }

  .about-intro {
    font-size: 1.4rem;
  }

  .contact-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>