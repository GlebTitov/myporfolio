<template>
  <div class="contact">
    <h1 class="heading" ref="heading">Связаться со мной</h1>

    <div class="contact-content">
      <!-- 3D интерактивная форма -->
      <div class="form-container" ref="formContainer">
        <form class="contact-form" @submit.prevent="submitForm" ref="contactForm">
          <div class="form-group" ref="nameGroup">
            <label for="name">Имя</label>
            <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                :class="{ 'has-value': formData.name }"
            >
          </div>

          <div class="form-group" ref="emailGroup">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                :class="{ 'has-value': formData.email }"
            >
          </div>

          <div class="form-group" ref="subjectGroup">
            <label for="subject">Тема</label>
            <input
                type="text"
                id="subject"
                v-model="formData.subject"
                required
                :class="{ 'has-value': formData.subject }"
            >
          </div>

          <div class="form-group" ref="messageGroup">
            <label for="message">Сообщение</label>
            <textarea
                id="message"
                v-model="formData.message"
                required
                rows="5"
                :class="{ 'has-value': formData.message }"
            ></textarea>
          </div>

          <button type="submit" class="submit-btn" ref="submitBtn">Отправить</button>
        </form>
      </div>

      <!-- 3D карта/глобус -->
      <div class="globe-container" ref="globeContainer"></div>
    </div>

    <!-- Социальные сети -->
    <div class="social-section" ref="socialSection">
      <h2>Найдите меня в социальных сетях</h2>
      <div class="social-icons">
        <a href="#" target="_blank" class="social-icon" ref="socialIcons">
          <i class="fab fa-github"></i>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons">
          <i class="fab fa-behance"></i>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons">
          <i class="fab fa-dribbble"></i>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons">
          <i class="fab fa-twitter"></i>
        </a>
      </div>
    </div>

    <!-- Модальное окно успешной отправки -->
    <div class="success-modal" v-if="showSuccessModal" ref="successModal">
      <div class="modal-content">
        <h3>Спасибо за сообщение!</h3>
        <p>Я свяжусь с вами в ближайшее время.</p>
        <button @click="closeModal" class="close-btn">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import anime from 'animejs';

// Рефы для DOM-элементов
const heading = ref(null);
const formContainer = ref(null);
const contactForm = ref(null);
const nameGroup = ref(null);
const emailGroup = ref(null);
const subjectGroup = ref(null);
const messageGroup = ref(null);
const submitBtn = ref(null);
const globeContainer = ref(null);
const socialSection = ref(null);
const socialIcons = ref([]);
const successModal = ref(null);

// Состояние формы
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const showSuccessModal = ref(false);

// Функции для работы с Three.js
let scene, camera, renderer, globe;
let cleanupGlobe = null;

// Методы для формы
const submitForm = () => {
  // Имитация отправки формы
  console.log('Форма отправлена:', formData.value);

  // Анимация отправки формы
  anime({
    targets: submitBtn.value,
    scale: [1, 0.8, 1],
    duration: 600,
    easing: 'easeInOutQuad'
  });

  // Показываем модальное окно успеха
  setTimeout(() => {
    showSuccessModal.value = true;

    // Анимируем появление модального окна
    anime({
      targets: successModal.value,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 600,
      easing: 'easeOutElastic(1, .6)'
    });

    // Сбрасываем форму
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }, 800);
};

const closeModal = () => {
  // Анимируем закрытие модального окна
  anime({
    targets: successModal.value,
    opacity: 0,
    scale: 0.8,
    duration: 300,
    easing: 'easeInOutQuad',
    complete: () => {
      showSuccessModal.value = false;
    }
  });
};

// Инициализация 3D глобуса
const initGlobe = () => {
  if (!globeContainer.value) return;

  // Настройка сцены
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, globeContainer.value.clientWidth / globeContainer.value.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(globeContainer.value.clientWidth, globeContainer.value.clientHeight);
  globeContainer.value.appendChild(renderer.domElement);

  // Позиционирование камеры
  camera.position.z = 2;

  // Создание глобуса
  const radius = 1;
  const segments = 64;
  const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);

  // Создаем материал для глобуса
  const globeMaterial = new THREE.MeshPhongMaterial({
    color: 0x2194ce,
    emissive: 0x112244,
    specular: 0xffffff,
    shininess: 25,
    wireframe: true
  });

  globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  // Точка на глобусе (ваше местоположение)
  const locationGeometry = new THREE.SphereGeometry(0.03, 16, 16);
  const locationMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
  const locationPoint = new THREE.Mesh(locationGeometry, locationMaterial);

  // Позиционируем точку на глобусе (замените координаты на ваши)
  // Здесь используем примерные координаты для Москвы
  const latitude = 55.7558; // в градусах
  const longitude = 37.6173; // в градусах

  // Конвертируем географические координаты в 3D-координаты на сфере
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  locationPoint.position.x = -radius * Math.sin(phi) * Math.cos(theta);
  locationPoint.position.y = radius * Math.cos(phi);
  locationPoint.position.z = radius * Math.sin(phi) * Math.sin(theta);

  globe.add(locationPoint);

  // Добавляем свет
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Анимация глобуса
  const animate = () => {
    const animationId = requestAnimationFrame(animate);

    globe.rotation.y += 0.002;

    renderer.render(scene, camera);

    return animationId;
  };

  let animationId = animate();

  // Обработка изменения размера окна
  const handleResize = () => {
    if (!globeContainer.value) return;

    camera.aspect = globeContainer.value.clientWidth / globeContainer.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(globeContainer.value.clientWidth, globeContainer.value.clientHeight);
  };

  window.addEventListener('resize', handleResize);

  // Функция очистки
  return () => {
    window.removeEventListener('resize', handleResize);

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    if (globe) {
      scene.remove(globe);
      globeGeometry.dispose();
      globeMaterial.dispose();

      locationGeometry.dispose();
      locationMaterial.dispose();
    }

    if (renderer && renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    if (renderer) {
      renderer.dispose();
    }
  };
};

// Применение 3D эффекта к форме
const apply3DFormEffect = () => {
  if (!contactForm.value) return;

  // Добавляем обработчики событий для создания 3D эффекта при наведении мыши
  const formElement = contactForm.value;

  const handleMouseMove = (e) => {
    const rect = formElement.getBoundingClientRect();
    const x = e.clientX - rect.left; // X позиция внутри элемента
    const y = e.clientY - rect.top;  // Y позиция внутри элемента

    // Рассчитываем углы наклона
    const tiltX = (y / rect.height - 0.5) * 5; // Максимум 5 градусов наклона
    const tiltY = (0.5 - x / rect.width) * 5;

    // Применяем наклон и другие 3D трансформации к форме
    anime({
      targets: formElement,
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 300,
      easing: 'easeOutQuad'
    });
  };

  const handleMouseLeave = () => {
    // Возвращаем форму в исходное положение при уходе курсора
    anime({
      targets: formElement,
      rotateX: 0,
      rotateY: 0,
      duration: 600,
      easing: 'easeOutElastic(1, .5)'
    });
  };

  formElement.addEventListener('mousemove', handleMouseMove);
  formElement.addEventListener('mouseleave', handleMouseLeave);

  // Функция очистки
  return () => {
    formElement.removeEventListener('mousemove', handleMouseMove);
    formElement.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Анимация элементов страницы
const animatePageElements = () => {
  if (!heading.value) return;

  // Анимация заголовка
  anime({
    targets: heading.value,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutExpo'
  });

  // Анимация формы
  if (contactForm.value) {
    anime.timeline()
        .add({
          targets: [nameGroup.value, emailGroup.value, subjectGroup.value, messageGroup.value, submitBtn.value],
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(150),
          duration: 800,
          easing: 'easeOutCubic'
        });
  }

  // Анимация социальных иконок
  if (socialSection.value) {
    anime({
      targets: socialSection.value,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
      delay: 500
    });

    anime({
      targets: '.social-icon',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(100, {start: 800}),
      duration: 800,
      easing: 'easeOutElastic(1, .5)'
    });
  }
};

// Инициализация при монтировании компонента
onMounted(() => {
  // Анимируем элементы страницы
  animatePageElements();

  // Инициализируем 3D глобус
  cleanupGlobe = initGlobe();

  // Применяем 3D эффект к форме
  const cleanupFormEffect = apply3DFormEffect();

  // Очистка при размонтировании
  onBeforeUnmount(() => {
    if (cleanupGlobe) cleanupGlobe();
    if (cleanupFormEffect) cleanupFormEffect();
  });
});
</script>

<style scoped>
.contact {
  color: white;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.heading {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
}

.form-container {
  perspective: 1000px; /* Для 3D эффекта */
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  transform: translateZ(0);
  transition: transform 0.3s ease;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group input.has-value,
.form-group textarea.has-value {
  background: rgba(255, 255, 255, 0.15);
  border-color: #2194ce;
  outline: none;
}

.submit-btn {
  background: #2194ce;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateZ(30px); /* Для 3D эффекта */
}

.submit-btn:hover {
  background: #1a7dae;
  transform: translateZ(35px) scale(1.05); /* Для 3D эффекта */
}

.globe-container {
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.social-section {
  text-align: center;
  margin-top: 3rem;
}

.social-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #2194ce;
  transform: translateY(-5px);
}

/* Модальное окно успешной отправки */
.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(33, 148, 206, 0.9);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content p {
  margin-bottom: 1.5rem;
}

.close-btn {
  background: white;
  color: #2194ce;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }

  .globe-container {
    height: 300px;
    order: -1;
  }

  .social-icons {
    flex-wrap: wrap;
  }
}
</style>