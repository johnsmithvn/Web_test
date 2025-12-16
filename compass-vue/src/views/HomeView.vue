<template>
  <div>
    <h1>Vue Test Home</h1>
    <button @click="manual">Manual capture</button>
    <button @click="identify">Identify</button>
    <router-link to="/about">Go /about</router-link>
  </div>
</template>

<script setup>
import posthog from "posthog-js";

function manual() {
  posthog.capture("qe_manual_event", { from: "vue" });
}

function identify() {
  posthog.identify("qe_user_003", { email: "qe+vue@demo.local", name: "QE Vue" });
  posthog.capture("qe_after_identify", { from: "vue" });
}
</script>
