<template>
  <div>
    <h1>About</h1>
    <button @click="clicky">Capture on about</button>
    <router-link to="/">Back</router-link>
  </div>
</template>

<script setup>
import posthog from "posthog-js";
const clicky = () => posthog.capture("qe_about_clicked", { from: "vue" });
</script>
