<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Welcome to Compass 🧭</h1>
      <p class="subtitle">A Vue 3 + PostHog Analytics Demo App</p>
      <div class="cta-buttons">
        <button @click="startDemo" class="btn-primary">Start Demo</button>
        <button @click="learnMore" class="btn-secondary">Learn More</button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>Features</h2>
      <div class="features-grid">
        <div class="feature-card" @click="captureFeatureClick('vue-routing')">
          <span class="feature-icon">🚀</span>
          <h3>Vue 3 Routing</h3>
          <p>Single Page Application with Vue Router</p>
          <button class="btn-small">Explore</button>
        </div>
        <div class="feature-card" @click="captureFeatureClick('posthog-tracking')">
          <span class="feature-icon">📊</span>
          <h3>PostHog Analytics</h3>
          <p>Track user interactions and events</p>
          <button class="btn-small">View Events</button>
        </div>
        <div class="feature-card" @click="captureFeatureClick('payment-demo')">
          <span class="feature-icon">💳</span>
          <h3>Payment Demo</h3>
          <p>Fake billing and payment interface</p>
          <button class="btn-small" @click.stop="navigateTo('/payment')">Try Payment</button>
        </div>
        <div class="feature-card" @click="captureFeatureClick('billing-portal')">
          <span class="feature-icon">📋</span>
          <h3>Billing Portal</h3>
          <p>Invoice history and payment methods</p>
          <button class="btn-small" @click.stop="navigateTo('/billing')">Go to Billing</button>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button @click="captureManualEvent" class="action-btn">
          📍 Manual Event
        </button>
        <button @click="captureUserIdentify" class="action-btn">
          👤 Identify User
        </button>
        <button @click="capturePageScroll" class="action-btn">
          📜 Scroll Event
        </button>
        <button @click="captureFormSubmit" class="action-btn">
          📝 Form Submit
        </button>
        <button @click="captureSearch" class="action-btn">
          🔍 Search
        </button>
        <button @click="captureSubscribe" class="action-btn">
          💌 Subscribe
        </button>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <h2>Analytics Stats</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Events</h3>
          <p class="stat-value">{{ stats.totalEvents }}</p>
        </div>
        <div class="stat-card">
          <h3>User ID</h3>
          <p class="stat-value">{{ currentDistinctId }}</p>
        </div>
        <div class="stat-card">
          <h3>Session</h3>
          <p class="stat-value">{{ sessionId }}</p>
        </div>
        <div class="stat-card">
          <h3>Last Action</h3>
          <p class="stat-value">{{ lastAction }}</p>
        </div>
      </div>
    </section>

    <!-- Event Log -->
    <section class="event-log">
      <h2>Recent Events</h2>
      <div class="log-container">
        <div v-if="eventLog.length === 0" class="empty-log">
          No events yet. Try clicking buttons above!
        </div>
        <div v-for="(log, index) in eventLog" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-props">{{ log.props }}</span>
        </div>
      </div>
    </section>

    <!-- Navigation Links -->
    <div class="nav-footer">
      <router-link to="/playground" class="nav-footer-link">🎮 Playground</router-link>
      <router-link to="/about" class="nav-footer-link">ℹ️ About</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePosthog } from "../composables/useLeanbaseCompass";

const router = useRouter();
const { posthog } = usePosthog();

const stats = ref({
  totalEvents: 0,
});

const eventLog = ref([]);
const sessionId = ref("sess_" + Math.random().toString(36).substr(2, 9));
const lastAction = ref("Page Loaded");

const currentDistinctId = computed(() => {
  try {
    return posthog.get_distinct_id?.() || "(anonymous)";
  } catch {
    return "(unknown)";
  }
});

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

function logEvent(eventName, props = {}) {
  const log = {
    time: formatTime(),
    event: eventName,
    props: JSON.stringify(props),
  };
  eventLog.value.unshift(log);
  if (eventLog.value.length > 10) {
    eventLog.value.pop();
  }
  stats.value.totalEvents++;
  lastAction.value = eventName;
}

function startDemo() {
  posthog.capture("qe_demo_started", {
    from: "home",
    timestamp: new Date().toISOString(),
  });
  logEvent("Demo Started");
  alert("🚀 Demo session started!");
}

function learnMore() {
  posthog.capture("qe_learn_more_clicked", {
    from: "home",
  });
  logEvent("Learn More Clicked");
  alert("📚 Visit our documentation for more info");
}

function captureFeatureClick(feature) {
  posthog.capture("qe_feature_card_clicked", {
    feature,
    from: "home",
  });
  logEvent(`Feature: ${feature}`);
}

function captureManualEvent() {
  posthog.capture("qe_manual_event_home", {
    from: "home",
    action: "manual",
  });
  logEvent("Manual Event");
}

function captureUserIdentify() {
  const userId = "qe_user_" + Math.floor(Math.random() * 1000);
  posthog.identify(userId, {
    email: "demo@example.com",
    name: "Demo User",
    source: "home",
    identified_at: new Date().toISOString(),
  });
  posthog.capture("qe_user_identified", {
    user_id: userId,
    from: "home",
  });
  logEvent("User Identified", { user_id: userId });
}

function capturePageScroll() {
  posthog.capture("qe_page_scrolled", {
    scroll_depth: Math.floor(Math.random() * 100),
    from: "home",
  });
  logEvent("Page Scrolled");
  window.scrollBy({ top: 200, behavior: "smooth" });
}

function captureFormSubmit() {
  posthog.capture("qe_form_submitted_home", {
    form_name: "demo_form",
    fields_filled: Math.floor(Math.random() * 5) + 1,
    from: "home",
  });
  logEvent("Form Submitted");
}

function captureSearch() {
  const queries = ["vue", "posthog", "analytics", "demo"];
  const query = queries[Math.floor(Math.random() * queries.length)];
  posthog.capture("qe_search_performed", {
    query,
    results: Math.floor(Math.random() * 100),
    from: "home",
  });
  logEvent("Search Performed", { query });
}

function captureSubscribe() {
  posthog.capture("qe_subscribe_clicked", {
    from: "home",
    newsletter: true,
  });
  logEvent("Subscribe Clicked");
  alert("✅ Thanks for subscribing!");
}

function navigateTo(path) {
  posthog.capture("qe_navigation_button", {
    destination: path,
    from: "home",
  });
  router.push(path);
}

onMounted(() => {
  posthog.capture("$pageview", {
    page: "home",
    session_id: sessionId.value,
  });
  logEvent("Page Loaded");
});
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 3em;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2em;
  margin-bottom: 30px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  font-size: 1em;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

h2 {
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.features {
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.feature-icon {
  font-size: 2.5em;
  display: block;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 15px 0;
  color: #333;
}

.feature-card p {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95em;
}

.btn-small {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-small:hover {
  background: #764ba2;
}

.quick-actions {
  margin-bottom: 50px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.action-btn {
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.95em;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn:active {
  transform: scale(0.98);
}

.stats {
  margin-bottom: 50px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-left: 4px solid #667eea;
}

.stat-card h3 {
  color: #666;
  font-size: 0.95em;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 1.8em;
  font-weight: 700;
  color: #667eea;
  word-break: break-all;
}

.event-log {
  margin-bottom: 50px;
}

.log-container {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

.empty-log {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

.log-item {
  display: grid;
  grid-template-columns: 80px 150px 1fr;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9em;
  align-items: start;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #999;
  font-weight: 500;
}

.log-event {
  color: #667eea;
  font-weight: 600;
}

.log-props {
  color: #666;
  word-break: break-word;
}

.nav-footer {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
}

.nav-footer-link {
  padding: 12px 24px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  border: 2px solid #667eea;
  transition: all 0.3s;
}

.nav-footer-link:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2em;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .log-item {
    grid-template-columns: 1fr;
  }

  .features-grid,
  .actions-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
