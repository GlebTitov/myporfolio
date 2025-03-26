<template>
  <div class="about">
    <h1 class="heading" ref="heading">Обо мне</h1>

    <div class="content-wrapper">
      <!-- Lottie анимация -->
      <div class="profile-visual">
        <div class="gif-container">
          <img src="/src/developer-animation.gif" alt="Developer Animation" class="profile-gif">
        </div>
      </div>

      <div class="info-section">
        <!-- Биография -->
        <div class="bio" ref="bio">
          <p>Привет! Я фронтенд-разработчик с особой страстью к 3D-визуализации и интерактивным веб-приложениям. Моя цель — создавать впечатляющие цифровые опыты, объединяя творчество и технологии.</p>
          <p>Специализируюсь на использовании современных технологий для создания уникальных пользовательских интерфейсов и 3D-визуализаций.</p>
        </div>

        <!-- Навыки -->
        <div class="skills-section">
          <h2 ref="skillsHeading">Навыки</h2>
          <div class="skills-container" ref="skillsContainer">
            <div class="skill" v-for="skill in skills" :key="skill.name">
              <div class="skill-info">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar-container">
                <div class="skill-bar" :data-percentage="skill.level"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Карьерный путь -->
    <div class="experience-section">
      <h2 ref="timelineHeading">Опыт работы</h2>
      <div class="timeline" ref="timelineContainer">
        <div class="timeline-item" v-for="(job, index) in experience" :key="index">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3>{{ job.title }}</h3>
            <div class="timeline-meta">
              <span class="company">{{ job.company }}</span>
              <span class="year">{{ job.year }}</span>
            </div>
            <p>{{ job.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import anime from 'animejs';

// Данные о навыках
const skills = [
  { name: 'Three.js', level: 90 },
  { name: 'Vue.js', level: 85 },
  { name: 'WebGL', level: 75 },
  { name: 'JavaScript', level: 95 },
  { name: 'CSS/SCSS', level: 88 },
  { name: '3D моделирование', level: 70 }
];

// Опыт работы
const experience = [
  {
    year: '2022-2024',
    title: 'Старший 3D разработчик',
    company: 'TechViz Studio',
    description: 'Разработка интерактивных 3D визуализаций для веб-проектов. Создание конфигураторов продуктов и виртуальных туров.'
  },
  {
    year: '2020-2022',
    title: 'Frontend-разработчик',
    company: 'WebCraft Solutions',
    description: 'Разработка интерактивных веб-приложений с использованием Vue.js и Three.js. Оптимизация производительности и пользовательского опыта.'
  },
  {
    year: '2018-2020',
    title: 'UI/UX дизайнер',
    company: 'Creative Minds',
    description: 'Создание пользовательских интерфейсов и проектирование опыта взаимодействия для веб-приложений и мобильных платформ.'
  }
];

// Рефы для DOM элементов
const heading = ref(null);
const bio = ref(null);
const skillsHeading = ref(null);
const skillsContainer = ref(null);
const timelineHeading = ref(null);
const timelineContainer = ref(null);

// Метод для анимации навыков
const animateSkills = () => {
  anime({
    targets: '.skill-bar',
    width: function(el) {
      return el.dataset.percentage + '%';
    },
    easing: 'easeInOutQuad',
    duration: 1500,
    delay: anime.stagger(100)
  });
};

// Метод для анимации элементов страницы при скролле
const initScrollAnimation = () => {
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

        // Для контейнера с навыками запускаем анимацию полосок
        if (entry.target === skillsContainer.value) {
          animateSkills();
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Добавляем элементы для наблюдения
  if (heading.value) observer.observe(heading.value);
  if (bio.value) observer.observe(bio.value);
  if (skillsHeading.value) observer.observe(skillsHeading.value);
  if (skillsContainer.value) observer.observe(skillsContainer.value);
  if (timelineHeading.value) observer.observe(timelineHeading.value);
  if (timelineContainer.value) observer.observe(timelineContainer.value);

  return observer;
};

let observer;

onMounted(() => {
  // Инициализируем анимацию при прокрутке
  observer = initScrollAnimation();

  // Инициализируем анимацию при загрузке
  anime({
    targets: heading.value,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutExpo'
  });
});

onBeforeUnmount(() => {
  // Очистка наблюдателя при удалении компонента
  if (observer) {
    observer.disconnect();
  }
});

// При смене маршрута дополнительная очистка
onBeforeRouteLeave(() => {
  console.log('Leaving About page');
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.about {
  padding: 2rem;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
}

.heading {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  position: relative;
  opacity: 0; /* Для анимации появления */
}

.heading::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #2194ce;
  border-radius: 3px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.profile-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gif-container {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.profile-gif {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bio {
  opacity: 0; /* Для анимации появления */
}

.bio p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2194ce;
  opacity: 0; /* Для анимации появления */
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  opacity: 0; /* Для анимации появления */
}

.skill {
  width: 100%;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-weight: bold;
}

.skill-bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  width: 0%; /* Начальное значение для анимации */
  background: linear-gradient(90deg, #2194ce, #21aece);
  border-radius: 4px;
  transition: width 1.5s ease-out;
}

.experience-section {
  margin-top: 4rem;
}

.timeline {
  position: relative;
  margin-top: 2rem;
  padding-left: 2rem;
  opacity: 0; /* Для анимации появления */
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
}

.timeline-marker {
  position: absolute;
  left: -2.5rem;
  top: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #2194ce;
  box-shadow: 0 0 0 4px rgba(33, 148, 206, 0.3);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.timeline-content h3 {
  margin-top: 0;
  color: #2194ce;
  margin-bottom: 0.5rem;
}

.timeline-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.company {
  font-weight: bold;
}

.year {
  padding: 0.2rem 0.6rem;
  background: rgba(33, 148, 206, 0.2);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .profile-visual {
    margin-bottom: 2rem;
  }

  .lottie-container {
    max-width: 100%;
  }

  .timeline {
    padding-left: 1.5rem;
  }

  .timeline-marker {
    left: -2rem;
  }
}
</style>