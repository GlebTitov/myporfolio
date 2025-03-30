<template>
  <div class="contact">
    <h1 class="heading" ref="heading">Связаться со мной</h1>

    <div class="contact-content">
      <!-- Форма контактов с минималистичным дизайном -->
      <div class="form-container" ref="formContainer">
        <form class="contact-form" @submit.prevent="submitForm" ref="contactForm">
          <div class="form-group" ref="nameGroup">
            <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="Имя"
                :class="{ 'has-value': formData.name }"
            >
          </div>

          <div class="form-group" ref="emailGroup">
            <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Email"
                :class="{ 'has-value': formData.email }"
            >
          </div>

          <div class="form-group" ref="messageGroup">
            <textarea
                id="message"
                v-model="formData.message"
                required
                rows="4"
                placeholder="Ваше сообщение"
                :class="{ 'has-value': formData.message }"
            ></textarea>
          </div>

          <button type="submit" class="submit-btn" ref="submitBtn" :disabled="isSubmitting">
            <span>{{ isSubmitting ? 'Отправка...' : 'Отправить' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      <!-- 3D глобус (сохраняем как было) -->
      <div class="globe-container" ref="globeContainer"></div>
    </div>

    <!-- Социальные сети с современным дизайном -->
    <div class="social-section" ref="socialSection">
      <h2>Мои социальные сети</h2>
      <div class="social-icons">
        <a href="#" target="_blank" class="social-icon" ref="socialIcons" aria-label="GitHub">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons" aria-label="Behance">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1.5 8.67h8"></path>
            <path d="M8.5 15.43h-7"></path>
            <path d="M13.4 12a3.5 3.5 0 0 0 1.7-3 3.46 3.46 0 0 0-3.5-3.45H6.45v13h5.28a3.58 3.58 0 0 0 3.82-3.55 3 3 0 0 0-2.15-3"></path>
            <circle cx="16.5" cy="6.5" r=".5"></circle>
            <path d="M18.5 8.67h4"></path>
            <ellipse cx="20.5" cy="12" rx="2" ry="2.5"></ellipse>
          </svg>
        </a>
        <a href="#" target="_blank" class="social-icon" ref="socialIcons" aria-label="Dribbble">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
          </svg>
        </a>
      </div>

      <div class="contact-direct">
        <a href="mailto:gleb@example.com" class="contact-item">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>gleb@example.com</span>
        </a>
        <a href="tel:+79001234567" class="contact-item">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>+7 (900) 123-45-67</span>
        </a>
      </div>
    </div>

    <!-- Модальное окно успешной отправки -->
    <div class="success-modal" v-if="showSuccessModal" ref="successModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <svg class="success-icon" viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h3>Сообщение отправлено!</h3>
        <p>Спасибо за обращение. Я свяжусь с вами в ближайшее время.</p>
        <button @click="closeModal" class="close-btn">Закрыть</button>
      </div>
    </div>

    <!-- Модальное окно ошибки отправки -->
    <div class="error-modal" v-if="showErrorModal" ref="errorModal" @click="closeErrorModal">
      <div class="modal-content" @click.stop>
        <svg class="error-icon" viewBox="0 0 24 24" width="48" height="48" stroke="#e74c3c" stroke-width="2" fill="none">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <h3>Ошибка отправки</h3>
        <p>К сожалению, возникла проблема при отправке сообщения. Пожалуйста, попробуйте позже или свяжитесь со мной напрямую по почте или телефону.</p>
        <button @click="closeErrorModal" class="close-btn">Закрыть</button>
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
const messageGroup = ref(null);
const submitBtn = ref(null);
const globeContainer = ref(null);
const socialSection = ref(null);
const socialIcons = ref([]);
const successModal = ref(null);
const errorModal = ref(null);

// Состояние формы
const formData = ref({
  name: '',
  email: '',
  message: ''
});

const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const isSubmitting = ref(false);

// Telegram бот и чат ID
const TELEGRAM_BOT_TOKEN = '7797120866:AAExHbmEFxejBazrkSjBQtbSU6cmMeNCUHQ';
const TELEGRAM_CHAT_ID = '-1002686345108';

// Методы для формы
const submitForm = async () => {
  // Устанавливаем флаг отправки
  isSubmitting.value = true;

  // Анимация кнопки отправки
  anime({
    targets: submitBtn.value,
    scale: [1, 0.9, 1],
    duration: 400,
    easing: 'easeInOutQuad'
  });

  try {
    // Формируем текст сообщения для Telegram
    const messageText = `📬 Новая заявка с сайта!\n\n👤 Имя: ${formData.value.name}\n📧 Email: ${formData.value.email}\n\n💬 Сообщение:\n${formData.value.message}`;

    // Отправляем сообщение в Telegram
    const response = await sendToTelegram(messageText);

    if (!response.ok) {
      throw new Error('Не удалось отправить сообщение в Telegram');
    }

    // Показываем модальное окно успеха
    showSuccessModal.value = true;

    // Анимируем появление модального окна
    anime({
      targets: successModal.value,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 500,
      easing: 'easeOutExpo'
    });

    // Сбрасываем форму
    formData.value = {
      name: '',
      email: '',
      message: ''
    };
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);

    // Показываем модальное окно с ошибкой
    showErrorModal.value = true;

    // Анимируем появление модального окна с ошибкой
    anime({
      targets: errorModal.value,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 500,
      easing: 'easeOutExpo'
    });
  } finally {
    // Сбрасываем флаг отправки
    isSubmitting.value = false;
  }
};

// Функция для отправки сообщения в Telegram
const sendToTelegram = async (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('text', message);
  formData.append('parse_mode', 'HTML');

  return fetch(url, {
    method: 'POST',
    body: formData
  });
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

const closeErrorModal = () => {
  // Анимируем закрытие модального окна ошибки
  anime({
    targets: errorModal.value,
    opacity: 0,
    scale: 0.8,
    duration: 300,
    easing: 'easeInOutQuad',
    complete: () => {
      showErrorModal.value = false;
    }
  });
};

// Функции для работы с Three.js
let scene, camera, renderer, globe;
let cleanupGlobe = null;

// Инициализация 3D глобуса (сохраняем оригинальную функцию)
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

// Применение эффекта наведения к форме
const apply3DFormEffect = () => {
  if (!contactForm.value) return;

  // Добавляем обработчики событий для создания эффекта при наведении мыши
  const formElement = contactForm.value;

  const handleMouseMove = (e) => {
    const rect = formElement.getBoundingClientRect();
    const x = e.clientX - rect.left; // X позиция внутри элемента
    const y = e.clientY - rect.top;  // Y позиция внутри элемента

    // Рассчитываем углы наклона (уменьшены для более тонкого эффекта)
    const tiltX = (y / rect.height - 0.5) * 2;
    const tiltY = (0.5 - x / rect.width) * 2;

    // Применяем наклон к форме
    anime({
      targets: formElement,
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 300,
      easing: 'easeOutQuad'
    });
  };

  const handleMouseLeave = () => {
    // Возвращаем форму в исходное положение
    anime({
      targets: formElement,
      rotateX: 0,
      rotateY: 0,
      duration: 400,
      easing: 'easeOutQuad'
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
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutExpo'
  });

  // Анимация формы
  if (contactForm.value) {
    anime.timeline()
        .add({
          targets: [nameGroup.value, emailGroup.value, messageGroup.value, submitBtn.value],
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(100),
          duration: 600,
          easing: 'easeOutCubic'
        });
  }

  // Анимация социальных иконок
  if (socialSection.value) {
    anime({
      targets: socialSection.value,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: 'easeOutCubic',
      delay: 300
    });

    anime({
      targets: '.social-icon',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(60, {start: 500}),
      duration: 500,
      easing: 'easeOutBack'
    });

    anime({
      targets: '.contact-item',
      opacity: [0, 1],
      translateX: [-20, 0],
      delay: anime.stagger(100, {start: 700}),
      duration: 500,
      easing: 'easeOutCubic'
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
  font-weight: 700;
  background: linear-gradient(90deg, #2194ce, #21ceb8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 4rem;
}

.form-container {
  perspective: 1000px; /* Для 3D эффекта */
}

.contact-form {
  background: rgba(25, 30, 50, 0.8);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform-style: preserve-3d;
  transform: translateZ(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group input.has-value,
.form-group textarea.has-value {
  background: rgba(255, 255, 255, 0.1);
  border-color: #2194ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(33, 148, 206, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-btn {
  background: linear-gradient(90deg, #2194ce, #21ceb8);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  width: 100%;
  letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 148, 206, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) svg {
  transform: translateX(4px);
}

.globe-container {
  height: 450px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(25, 30, 50, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.social-section {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(25, 30, 50, 0.5);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.social-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2194ce;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-icon:hover {
  background: #2194ce;
  transform: translateY(-5px);
  color: white;
  box-shadow: 0 5px 15px rgba(33, 148, 206, 0.3);
}

.social-icon svg {
  width: 1.2rem;
  height: 1.2rem;
}

.contact-direct {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: fit-content;
  margin: 0 auto;
}

.contact-item:hover {
  background: rgba(33, 148, 206, 0.2);
  transform: translateY(-2px);
}

.contact-item svg {
  width: 1.2rem;
  height: 1.2rem;
  color: #2194ce;
}

/* Модальное окно успешной отправки */
.success-modal, .error-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: rgba(25, 30, 50, 0.9);
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.success-icon {
  color: #21ceb8;
  margin-bottom: 1rem;
}

.error-icon {
  margin-bottom: 1rem;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: white;
}

.modal-content p {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.close-btn {
  background: linear-gradient(90deg, #2194ce, #21ceb8);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 148, 206, 0.4);
}

@media (max-width: 992px) {
  .contact-content {
    grid-template-columns: 1fr;
  }

  .globe-container {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .heading {
    font-size: 2rem;
  }

  .contact-form {
    padding: 1.5rem;
  }

  .social-icons {
    flex-wrap: wrap;
  }

  .contact-item {
    width: 100%;
  }

  .globe-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .heading {
    font-size: 1.8rem;
  }

  .contact-content {
    gap: 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-content h3 {
    font-size: 1.5rem;
  }

  .submit-btn {
    padding: 0.75rem 1.5rem;
  }
}
</style>