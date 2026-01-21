<template>
  <div class="about-container">
    <!-- Hero Section -->
    <section class="about-hero">
      <h1>About Compass 🧭</h1>
      <p>Building better analytics experiences with Vue 3 + PostHog</p>
    </section>

    <!-- Content Sections -->
    <div class="content-grid">
      <!-- What is Compass -->
      <section class="content-section">
        <h2>What is Compass?</h2>
        <p>
          Compass is a demonstration application showcasing how to integrate PostHog analytics
          into a Vue 3 Single Page Application. It provides practical examples of event tracking,
          user identification, and analytics data management.
        </p>
        <button @click="captureEvent('about_what_is_compass')" class="read-more-btn">
          Learn More →
        </button>
      </section>

      <!-- Technology Stack -->
      <section class="content-section">
        <h2>Technology Stack</h2>
        <div class="tech-stack">
          <div class="tech-item">
            <span class="tech-icon">⚡</span>
            <strong>Vue 3</strong>
            <p>Progressive JavaScript Framework</p>
          </div>
          <div class="tech-item">
            <span class="tech-icon">⚙️</span>
            <strong>Vite</strong>
            <p>Next Generation Build Tool</p>
          </div>
          <div class="tech-item">
            <span class="tech-icon">📊</span>
            <strong>PostHog</strong>
            <p>Product Analytics & Feature Flags</p>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🛣️</span>
            <strong>Vue Router</strong>
            <p>Official Router for Vue.js</p>
          </div>
        </div>
        <button @click="captureEvent('about_tech_stack')" class="read-more-btn">
          View Docs →
        </button>
      </section>

      <!-- Features -->
      <section class="content-section">
        <h2>Key Features</h2>
        <ul class="features-list">
          <li @click="captureEvent('about_feature_routing')">
            <span class="feature-icon">🚀</span>
            <span>SPA Routing with Vue Router</span>
          </li>
          <li @click="captureEvent('about_feature_tracking')">
            <span class="feature-icon">📍</span>
            <span>Comprehensive Event Tracking</span>
          </li>
          <li @click="captureEvent('about_feature_identification')">
            <span class="feature-icon">👤</span>
            <span>User Identification & Properties</span>
          </li>
          <li @click="captureEvent('about_feature_billing')">
            <span class="feature-icon">💳</span>
            <span>Fake Payment & Billing System</span>
          </li>
          <li @click="captureEvent('about_feature_realtime')">
            <span class="feature-icon">⚡</span>
            <span>Real-time Event Logging</span>
          </li>
          <li @click="captureEvent('about_feature_responsive')">
            <span class="feature-icon">📱</span>
            <span>Responsive Design</span>
          </li>
        </ul>
      </section>

      <!-- How It Works -->
      <section class="content-section">
        <h2>How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h4>User Interaction</h4>
            <p>Users interact with the application (clicks, forms, navigation)</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h4>Event Capture</h4>
            <p>PostHog captures events and user actions</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h4>Data Collection</h4>
            <p>Events are processed and stored in PostHog</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h4>Analytics Dashboard</h4>
            <p>View insights and metrics in PostHog dashboard</p>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="content-section">
        <h2>Use Cases</h2>
        <div class="use-cases">
          <div class="use-case">
            <h4>Product Analysis</h4>
            <p>Understand user behavior and feature adoption</p>
            <button @click="captureEvent('about_usecase_product')" class="btn-small">
              Explore
            </button>
          </div>
          <div class="use-case">
            <h4>Funnel Analysis</h4>
            <p>Track conversion funnels and drop-off points</p>
            <button @click="captureEvent('about_usecase_funnel')" class="btn-small">
              Explore
            </button>
          </div>
          <div class="use-case">
            <h4>User Segmentation</h4>
            <p>Segment users based on behavior and properties</p>
            <button @click="captureEvent('about_usecase_segmentation')" class="btn-small">
              Explore
            </button>
          </div>
        </div>
      </section>

      <!-- Events We Track -->
      <section class="content-section full-width">
        <h2>Events We Track</h2>
        <div class="events-table">
          <div class="event-row header">
            <div class="event-name">Event Name</div>
            <div class="event-description">Description</div>
            <div class="event-example">Example</div>
          </div>
          <div class="event-row" v-for="event in trackedEvents" :key="event.name">
            <div class="event-name"><code>{{ event.name }}</code></div>
            <div class="event-description">{{ event.description }}</div>
            <div class="event-example">{{ event.example }}</div>
          </div>
        </div>
      </section>

      <!-- About PostHog -->
      <section class="content-section">
        <h2>About PostHog</h2>
        <p>
          PostHog is an open-source analytics platform that helps product teams understand
          user behavior and build better products. It provides event analytics, session replays,
          feature flags, and more.
        </p>
        <div class="posthog-links">
          <button @click="captureEvent('about_posthog_website')" class="link-btn">
            Visit PostHog →
          </button>
          <button @click="captureEvent('about_posthog_docs')" class="link-btn">
            Documentation →
          </button>
          <button @click="captureEvent('about_posthog_community')" class="link-btn">
            Community →
          </button>
        </div>
      </section>

      <!-- Contact -->
      <section class="content-section">
        <h2>Get In Touch</h2>
        <p>Questions or feedback about Compass?</p>
        <div class="contact-buttons">
          <button @click="captureEvent('about_contact_email')" class="contact-btn">
            📧 Send Email
          </button>
          <button @click="captureEvent('about_contact_github')" class="contact-btn">
            🐙 GitHub
          </button>
          <button @click="captureEvent('about_contact_twitter')" class="contact-btn">
            𝕏 Twitter
          </button>
        </div>
      </section>
    </div>

    <!-- Navigation -->
    <div class="nav-links">
      <router-link to="/" class="link">← Back Home</router-link>
      <router-link to="/playground" class="link">Playground →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePosthog } from "../composables/useLeanbaseCompass";

const { posthog } = usePosthog();

const trackedEvents = ref([
  {
    name: "$pageview",
    description: "Page navigation event",
    example: "{ path: '/about', route_name: 'about' }",
  },
  {
    name: "qe_manual_event",
    description: "User triggered manual event",
    example: "{ from: 'vue' }",
  },
  {
    name: "qe_user_identified",
    description: "User identification event",
    example: "{ user_id: 'qe_user_123' }",
  },
  {
    name: "qe_payment_attempt",
    description: "Payment form submission",
    example: "{ amount: 50000, method: 'credit_card' }",
  },
  {
    name: "qe_payment_success",
    description: "Successful payment",
    example: "{ amount: 50000, card_last_4: '4242' }",
  },
  {
    name: "qe_about_clicked",
    description: "About page button clicked",
    example: "{ from: 'vue' }",
  },
  {
    name: "qe_feature_card_clicked",
    description: "Feature card clicked",
    example: "{ feature: 'payment-demo' }",
  },
  {
    name: "qe_search_performed",
    description: "User performed search",
    example: "{ query: 'vue', results: 42 }",
  },
]);

function captureEvent(eventName) {
  posthog.capture(eventName, {
    from: "about",
    timestamp: new Date().toISOString(),
  });
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-hero {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 50px;
}

.about-hero h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.about-hero p {
  font-size: 1.1em;
  opacity: 0.9;
}

.content-grid {
  display: grid;
  gap: 40px;
  margin-bottom: 50px;
}

.content-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-section.full-width {
  grid-column: 1 / -1;
}

.content-section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.content-section p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 15px;
}

.read-more-btn,
.contact-btn,
.link-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  margin-top: 15px;
}

.read-more-btn:hover,
.contact-btn:hover,
.link-btn:hover {
  background: #764ba2;
  transform: translateX(2px);
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 25px 0;
}

.tech-item {
  text-align: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.3s;
}

.tech-item:hover {
  background: #e8f5e9;
  transform: translateY(-3px);
}

.tech-icon {
  font-size: 2em;
  display: block;
  margin-bottom: 10px;
}

.tech-item strong {
  display: block;
  color: #333;
  margin-bottom: 5px;
}

.tech-item p {
  font-size: 0.85em;
  color: #666;
  margin: 0;
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.features-list li:hover {
  background: #e8f5e9;
  transform: translateX(5px);
}

.feature-icon {
  font-size: 1.3em;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 25px 0;
}

.step {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  position: relative;
}

.step-number {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
  opacity: 0.8;
}

.step h4 {
  margin: 10px 0;
}

.step p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9em;
}

.use-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 25px 0;
}

.use-case {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.3s;
}

.use-case:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.use-case h4 {
  margin-top: 0;
  color: #333;
}

.use-case p {
  color: #666;
  margin-bottom: 15px;
}

.btn-small {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-small:hover {
  background: #764ba2;
}

.events-table {
  margin: 25px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.event-row {
  display: grid;
  grid-template-columns: 180px 1fr 150px;
  gap: 20px;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  align-items: start;
}

.event-row:last-child {
  border-bottom: none;
}

.event-row.header {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.event-row code {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.event-row.header code {
  background: rgba(0, 0, 0, 0.1);
}

.posthog-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.contact-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.nav-links {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 50px 0 30px;
}

.link {
  flex: 1;
  padding: 12px;
  text-align: center;
  background: #e8f5e9;
  color: #42b883;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
}

.link:hover {
  background: #42b883;
  color: white;
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 1.8em;
  }

  .event-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .contact-buttons {
    grid-template-columns: 1fr;
  }

  .nav-links {
    flex-direction: column;
  }
}
</style>
