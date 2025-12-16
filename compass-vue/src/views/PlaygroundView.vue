<template>
  <div>
    <h1>Vue Playground</h1>

    <h3>Autocapture targets</h3>
    <button @click="noop">Primary button</button>
    <router-link to="/about">Go /about</router-link>

    <div style="margin-top:8px;">
      <input v-model="text" placeholder="type here" />
      <input v-model="secret" type="password" placeholder="password should not leak" />
    </div>

    <div style="margin-top:8px;">
      <label><input type="checkbox" v-model="checked" /> Checkbox</label>
      <select v-model="sel">
        <option value="">Choose</option>
        <option value="x">X</option>
        <option value="y">Y</option>
      </select>
    </div>

    <form @submit.prevent="submit" style="margin-top:8px;">
      <input v-model="email" placeholder="email" />
      <button type="submit">Submit form</button>
    </form>

    <div
      role="button"
      tabindex="0"
      style="margin-top:10px;padding:10px;border:1px dashed #999;cursor:pointer;"
    >
      Dead click target (no handler)
    </div>

    <h3 style="margin-top:16px;">Manual events</h3>
    <button @click="capture('qe_manual_page')">qe_manual_page</button>
    <button @click="captureSearch">qe_search</button>
    <button @click="capturePurchase">qe_purchase</button>
    <button @click="throwErr">qe_vue_error</button>
    <button @click="burst">qe_burst_50</button>

    <h3 style="margin-top:16px;">Identity</h3>
    <button @click="identify">identify</button>
    <button @click="reset">reset</button>

    <h3 style="margin-top:16px;">Date & time</h3>
    <button @click="timeNow">qe_time_ping</button>
    <button @click="timeBoundary">qe_time_boundary (timestamp option)</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import posthog from "posthog-js";

const text = ref("");
const secret = ref("");
const checked = ref(false);
const sel = ref("");
const email = ref("");

const noop = () => {};

function capture(name, props = {}) {
  posthog.capture(name, { from: "vue", ...props });
}

function captureSearch() {
  capture("qe_search", { query: "manga", results: 42 });
}

function capturePurchase() {
  capture("qe_purchase", { currency: "VND", amount: 99000, sku: "sku_demo_01" });
}

function submit() {
  capture("qe_form_submit", { form: "vue_form" });
}

function throwErr() {
  capture("qe_vue_error", { where: "button" });
  throw new Error("QE intentional Vue error");
}

function burst() {
  for (let i = 0; i < 50; i++) capture("qe_burst_event", { i });
}

function identify() {
  posthog.identify("qe_user_vue_001", { email: "qe+vue@demo.local", name: "QE Vue" });
  capture("qe_after_identify");
}

function reset() {
  posthog.reset();
  capture("qe_after_reset");
}

function timeNow() {
  capture("qe_time_ping", { local: new Date().toString() });
}

// posthog-js thường support options.timestamp ở tham số thứ 3 (nếu build bạn có)
function timeBoundary() {
  const d = new Date();
  d.setHours(23, 59, 30, 0);
  posthog.capture("qe_time_boundary", { note: "try options.timestamp" }, { timestamp: d });
}
</script>
