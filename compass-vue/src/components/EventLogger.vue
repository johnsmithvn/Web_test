<template>
  <div v-if="isVisible" class="event-logger" :class="{ minimized: isMinimized }">
    <div class="logger-header">
      <h3>🔴 Live Events</h3>
      <div class="header-actions">
        <button @click="clearEvents" class="btn-clear" title="Clear">🗑️</button>
        <button @click="isMinimized = !isMinimized" class="btn-minimize" title="Minimize/Maximize">
          {{ isMinimized ? '⬆️' : '⬇️' }}
        </button>
        <button @click="isVisible = false" class="btn-close" title="Close">✖️</button>
      </div>
    </div>
    
    <div v-if="!isMinimized" class="logger-body">
      <div class="events-container" ref="eventsContainer">
        <div v-if="events.length === 0" class="empty-state">
          Waiting for events...
        </div>
        <div 
          v-for="(event, index) in events" 
          :key="index" 
          class="event-item"
          :class="{ 'event-new': event.isNew }"
        >
          <div class="event-header">
            <span class="event-time">{{ event.time }}</span>
            <span class="event-name">{{ event.name }}</span>
          </div>
          <div v-if="event.properties && Object.keys(event.properties).length > 0" class="event-props">
            <code>{{ formatProps(event.properties) }}</code>
          </div>
        </div>
      </div>
    </div>
    
    <div class="logger-footer">
      <span class="event-count">{{ events.length }} events</span>
    </div>
  </div>

  <!-- Toggle Button when hidden -->
  <button v-if="!isVisible" @click="isVisible = true" class="logger-toggle">
    📊 Show Events ({{ events.length }})
  </button>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';

const isVisible = ref(true);
const isMinimized = ref(false);
const events = ref([]);
const eventsContainer = ref(null);

function addEvent(eventName, properties = {}) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    fractionalSecondDigits: 3 
  });
  
  const event = {
    name: eventName,
    properties,
    time: timeStr,
    timestamp: now.getTime(),
    isNew: true
  };
  
  events.value.unshift(event);
  
  // Remove isNew flag after animation
  setTimeout(() => {
    event.isNew = false;
  }, 500);
  
  // Keep only last 50 events
  if (events.value.length > 50) {
    events.value = events.value.slice(0, 50);
  }
  
  // Auto scroll to top
  nextTick(() => {
    if (eventsContainer.value) {
      eventsContainer.value.scrollTop = 0;
    }
  });
}

function clearEvents() {
  events.value = [];
}

function formatProps(props) {
  return JSON.stringify(props, null, 2);
}

// Expose addEvent method to parent
defineExpose({
  addEvent
});
</script>

<style scoped>
.event-logger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 500px;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #42b883;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.event-logger.minimized {
  max-height: 60px;
}

.logger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px 6px 0 0;
  cursor: move;
}

.logger-header h3 {
  margin: 0;
  color: white;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-clear,
.btn-minimize,
.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.btn-clear:hover,
.btn-minimize:hover,
.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.logger-body {
  flex: 1;
  overflow: hidden;
}

.events-container {
  height: 380px;
  overflow-y: auto;
  padding: 10px;
}

.events-container::-webkit-scrollbar {
  width: 6px;
}

.events-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.events-container::-webkit-scrollbar-thumb {
  background: #42b883;
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-style: italic;
}

.event-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(66, 184, 131, 0.3);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.event-item.event-new {
  animation: highlight 0.5s ease-out;
  border-color: #42b883;
  background: rgba(66, 184, 131, 0.2);
}

@keyframes highlight {
  0% {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(66, 184, 131, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: none;
  }
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.event-time {
  color: #999;
  font-size: 0.8em;
  font-family: monospace;
}

.event-name {
  color: #42b883;
  font-weight: 600;
  font-size: 0.9em;
}

.event-props {
  margin-top: 6px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  max-height: 100px;
  overflow-y: auto;
}

.event-props code {
  color: #fff;
  font-size: 0.75em;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.logger-footer {
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(66, 184, 131, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-count {
  color: #42b883;
  font-size: 0.85em;
  font-weight: 600;
}

.logger-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9998;
  transition: all 0.3s;
}

.logger-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .event-logger {
    width: calc(100vw - 40px);
    max-width: 400px;
  }
  
  .events-container {
    height: 300px;
  }
}
</style>
