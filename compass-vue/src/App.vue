<script setup>
import { usePosthog } from './composables/useLeanbaseCompass';

const { posthog } = usePosthog();

function trackNavigation(page) {
  posthog.capture("qe_navigation_clicked", { 
    page,
    from: "vue" 
  });
}
</script>

<template>
  <div class="app">
    <!-- Header/Navigation -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🧭</span>
          <span class="logo-text">Compass Vue</span>
        </div>
        
        <nav class="nav-menu">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ active: $route.path === '/' }"
            @click="trackNavigation('home')"
          >
            🏠 Home
          </router-link>
          <router-link 
            to="/playground" 
            class="nav-link"
            :class="{ active: $route.path === '/playground' }"
            @click="trackNavigation('playground')"
          >
            🎮 Playground
          </router-link>
          <router-link 
            to="/payment" 
            class="nav-link"
            :class="{ active: $route.path === '/payment' }"
            @click="trackNavigation('payment')"
          >
            💳 Payment
          </router-link>
          <router-link 
            to="/billing" 
            class="nav-link"
            :class="{ active: $route.path === '/billing' }"
            @click="trackNavigation('billing')"
          >
            📋 Billing
          </router-link>
          <router-link 
            to="/about" 
            class="nav-link"
            :class="{ active: $route.path === '/about' }"
            @click="trackNavigation('about')"
          >
            ℹ️ About
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2026 Compass Vue + PostHog. All rights reserved.</p>
        <div class="footer-links">
          <a @click="posthog.capture('qe_footer_privacy')">Privacy</a>
          <a @click="posthog.capture('qe_footer_terms')">Terms</a>
          <a @click="posthog.capture('qe_footer_support')">Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.8em;
}

.nav-menu {
  display: flex;
  gap: 5px;
  align-items: center;
}

.nav-link {
  padding: 8px 16px;
  margin: 0 5px;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  background: #f0f0f0;
  color: #42b883;
}

.nav-link.active {
  background: #42b883;
  color: white;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px 16px 0 0;
  margin-top: 20px;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
}

.footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 30px 20px;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content p {
  margin-bottom: 15px;
  opacity: 0.9;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-links a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }

  .nav-menu {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 15px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 0.9em;
  }

  .main-content {
    padding: 20px;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .nav-link {
    padding: 6px 10px;
    margin: 0 2px;
    font-size: 0.8em;
  }
}
</style>
