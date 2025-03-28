<template>
  <div id="app">
    <!-- Добавляем глобальный фон -->
    <div class="global-background" ref="globalBackgroundScene"></div>
    <!-- Навигация -->
    <nav class="navigation" :class="{ 'scrolled': hasScrolled }">
      <div class="logo">
        <router-link to="/">ИП</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/" exact>Главная</router-link>
        <router-link to="/about">О себе</router-link>
        <router-link to="/projects">Проекты</router-link>
        <router-link to="/contact">Контакты</router-link>
      </div>
      <div class="menu-toggle" @click="toggleMobileMenu">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </nav>

    <!-- Мобильное меню -->
    <div class="mobile-menu" :class="{ 'active': mobileMenuActive }">
      <router-link to="/" @click="closeMobileMenu">Главная</router-link>
      <router-link to="/about" @click="closeMobileMenu">О себе</router-link>
      <router-link to="/projects" @click="closeMobileMenu">Проекты</router-link>
      <router-link to="/contact" @click="closeMobileMenu">Контакты</router-link>
    </div>

    <!-- Основной контент -->
    <div class="content">
      <router-view></router-view>
    </div>

    <!-- Футер -->
    <footer class="footer">
      <div class="copyright">
        © {{ new Date().getFullYear() }} Портфолио 3D разработчика. Все права защищены.
      </div>
      <div class="social-icons">
        <a href="#" target="_blank" class="social-icon">
          <i class="fab fa-github"></i>
        </a>
        <a href="#" target="_blank" class="social-icon">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="#" target="_blank" class="social-icon">
          <i class="fab fa-behance"></i>
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import anime from 'animejs';
import PortfolioThreeJS from './PortfolioThreeJS';

export default {
  name: 'App',
  data() {
    return {
      hasScrolled: false,
      mobileMenuActive: false,
      portfolioBackground: null
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);

    // Анимация навигации при загрузке
    anime({
      targets: '.nav-links a',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100, {start: 300}),
      easing: 'easeOutExpo'
    });

    // Инициализация глобального фона
    this.initGlobalBackground();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);

    // Очистка ресурсов фона
    if (this.portfolioBackground) {
      this.portfolioBackground.dispose();
    }
  },
  methods: {
    handleScroll() {
      this.hasScrolled = window.scrollY > 50;
    },
    toggleMobileMenu() {
      this.mobileMenuActive = !this.mobileMenuActive;

      // Анимация открытия/закрытия мобильного меню
      if (this.mobileMenuActive) {
        anime({
          targets: '.mobile-menu a',
          opacity: [0, 1],
          translateX: [50, 0],
          delay: anime.stagger(100),
          easing: 'easeOutExpo'
        });
      }
    },
    closeMobileMenu() {
      this.mobileMenuActive = false;
    },
    initGlobalBackground() {
      // Инициализация глобального фона
      const backgroundElement = this.$refs.globalBackgroundScene;
      if (backgroundElement) {
        const portfolio3D = new PortfolioThreeJS();
        portfolio3D.initBackgroundScene(backgroundElement);
        this.portfolioBackground = portfolio3D;
      }
    }
  }
}
</script>

<style>
/* Общие стили */
/* Добавляем стиль для глобального фона */
.global-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #0f1124;
  color: #ffffff;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Навигация */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: all 0.4s ease;
}

.navigation.scrolled {
  background-color: rgba(15, 17, 36, 0.95);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  padding: 15px 40px;
}

.logo a {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  opacity: 0; /* Начальное состояние для анимации */
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #2194ce;
  transition: width 0.3s ease;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

/* Мобильное меню */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 70%;
  height: 100vh;
  background-color: rgba(15, 17, 36, 0.95);
  display: flex;
  flex-direction: column;
  padding: 80px 40px;
  z-index: 999;
  transition: right 0.4s ease;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu a {
  color: #ffffff;
  text-decoration: none;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  opacity: 0; /* Начальное состояние для анимации */
}

/* Основной контент */
.content {
  flex-grow: 1;
  margin-top: 80px;
}

/* Футер */
.footer {
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(15, 17, 36, 0.8);
}

.social-icons {
  display: flex;
  gap: 20px;
}

.social-icon {
  color: #ffffff;
  font-size: 22px;
  transition: color 0.3s ease;
}

.social-icon:hover {
  color: #2194ce;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .menu-toggle.active .bar:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-toggle.active .bar:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle.active .bar:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .footer {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>