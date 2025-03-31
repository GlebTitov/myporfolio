<template>
  <div class="home">
    <!-- Контейнер для фоновой сцены -->
    <div class="background" ref="backgroundScene"></div>

    <!-- 3D интро с анимированным заголовком -->
    <div class="intro" ref="introContainer">
      <h1 class="title" ref="title">Глеб Титов</h1>
      <p class="subtitle" ref="subtitle">Фронтенд-разработчик и 3D-энтузиаст</p>
      <!-- Добавленный индикатор прокрутки -->
      <div class="scroll-indicator" ref="scrollIndicator">
        <div class="scroll-arrow"></div>
      </div>
      <img src="../Icon2.gif" alt="Web Development Animation" class="intro-gif">
    </div>

    <!-- Краткое представление -->
    <div class="about-intro" ref="aboutIntro">
      <p>Я создаю интерактивные 3D веб-опыты, соединяя креативность с технологиями</p>
    </div>

    <!-- Обо мне секция -->
    <div class="about-section" ref="aboutSection">
      <h2 class="section-title">Обо мне</h2>
      <div class="about-content">
        <div class="about-image">
          <!-- Заменяем 3D контейнер на контейнер с изображением -->
          <div class="profile-container" ref="profileContainer">
            <img src="../Web_Design_Development.gif" alt="Web Developer" class="developer-image" />
          </div>
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

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import anime from 'animejs';
import PortfolioThreeJS from '../PortfolioThreeJS';

// Рефы
const introContainer = ref(null);
const title = ref(null);
const subtitle = ref(null);
const scrollIndicator = ref(null);
const backgroundScene = ref(null);
const aboutIntro = ref(null);
const aboutSection = ref(null);
const aboutText = ref(null);
const profileContainer = ref(null);
const skillsList = ref(null);
const featuredProjects = ref(null);
const projectsShowcase = ref(null);
const projectDetails = ref(null);
const projectInfo = ref(null);
const projectTitle = ref(null);
const projectDescription = ref(null);
const projectLink = ref(null);
const contactSection = ref(null);
const contactLinks = ref(null);

// Реактивные данные
const projects = reactive([
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
]);

// Состояние
const state = reactive({
  portfolio3D: null,
  currentProject: null,
  isIntersecting: {},
  observer: null
});

// Методы
const showProjectDetails = (projectData) => {
  // Показываем детали проекта при клике
  const projectInfoEl = projectInfo.value;
  const projectTitleEl = projectTitle.value;
  const projectDescriptionEl = projectDescription.value;
  const projectLinkEl = projectLink.value;

  // Сначала скрываем информацию
  anime({
    targets: projectInfoEl,
    opacity: 0,
    translateY: 20,
    duration: 200,
    easing: 'easeOutQuad',
    complete: () => {
      // Обновляем содержимое
      projectTitleEl.textContent = projectData.title;
      projectDescriptionEl.textContent = projectData.description;
      projectLinkEl.href = projectData.link;

      // Показываем обновленную информацию
      anime({
        targets: projectInfoEl,
        opacity: 1,
        translateY: 0,
        duration: 500,
        easing: 'easeOutQuad'
      });

      projectInfoEl.classList.remove('hidden');
    }
  });
};

const initIntersectionObserver = () => {
  // Создаем наблюдатель пересечений для анимации элементов при прокрутке
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  state.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.isIntersecting[entry.target.id]) {
        state.isIntersecting[entry.target.id] = true;

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
    aboutSection.value,
    aboutText.value,
    featuredProjects.value,
    contactSection.value,
    contactLinks.value
  ];

  sections.forEach((section, index) => {
    if (section) {
      section.id = `section-${index}`;
      state.observer.observe(section);
    }
  });
};

// Инициализация портфолио с использованием класса PortfolioThreeJS
const initPortfolio = () => {
  // Создаем экземпляр класса
  const portfolio3D = new PortfolioThreeJS();
  state.portfolio3D = portfolio3D;

  // Инициализируем фоновую сцену с правильным контейнером
  if (backgroundScene.value) {
    portfolio3D.initBackgroundScene(backgroundScene.value);
  }

  // Создаем частицы для интро
  if (introContainer.value) {
    portfolio3D.createParticles(introContainer.value);
  }

  // Анимируем появление заголовка и подзаголовка
  portfolio3D.animateIntro({
    title: title.value,
    subtitle: subtitle.value,
    aboutIntro: aboutIntro.value,
    scrollIndicator: scrollIndicator.value
  });

  // Анимируем изображение профиля
  if (profileContainer.value) {
    anime({
      targets: profileContainer.value,
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 1000,
      easing: 'easeOutExpo'
    });
  }

  // Инициализируем 3D предпросмотр проектов
  if (projectsShowcase.value) {
    portfolio3D.initProjectsShowcase(projectsShowcase.value, projects);

    // Добавляем обработчик события выбора проекта
    projectsShowcase.value.addEventListener('project-selected', (event) => {
      showProjectDetails(event.detail);
    });
  }

  // Анимируем список навыков
  if (skillsList.value) {
    portfolio3D.animateSkillsList(skillsList.value);
  }

  // Инициализируем наблюдатель пересечений
  initIntersectionObserver();
};

// Хуки жизненного цикла
onMounted(() => {
  initPortfolio();
});

onBeforeUnmount(() => {
  // Очистка ресурсов перед уничтожением компонента
  if (state.observer) {
    state.observer.disconnect();
  }

  // Очистка через метод класса
  if (state.portfolio3D) {
    state.portfolio3D.dispose();
  }
});
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
  pointer-events: none;
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
  margin-bottom: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
}

.intro-gif {
  width: 400px;
  height: auto;
  margin-bottom: 2rem;
  mix-blend-mode: screen;
  background-color: transparent;
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

.developer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.scroll-indicator {
  margin: 10px 0 20px;
  opacity: 0;
  position: relative;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
  margin: 0 auto;
  animation: scroll-arrow 2s infinite;
}

@keyframes scroll-arrow {
  0% {
    transform: rotate(45deg) translate(-5px, -5px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) translate(5px, 5px);
    opacity: 0;
  }
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) rotate(0);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
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

  .intro-gif {
    width: 320px;
  }

  .contact-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>