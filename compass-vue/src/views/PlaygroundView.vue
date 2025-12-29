

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

    <h3 style="margin-top:16px;">Update person properties</h3>

    <div style="margin-top:8px; padding:10px; border:1px solid #eee; border-radius:8px;">
      <div style="font-size:12px; opacity:0.8; margin-bottom:8px;">
        current distinct_id: <b>{{ currentDistinctId }}</b>
      </div>

      <!-- update email/phone/name -->
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <input v-model="personEmail" placeholder="update email" />
        <input v-model="personPhone" placeholder="update phone" />
        <input v-model="personName" placeholder="update name" />
      </div>

      <!-- add new attribute -->
      <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
        <input v-model="newAttrKey" placeholder="new attribute key (add)" />
        <input v-model="newAttrValue" placeholder="new attribute value (add)" />
      </div>

      <!-- update existing attribute -->
      <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
        <input v-model="updAttrKey" placeholder="existing attribute key (update)" />
        <input v-model="updAttrValue" placeholder="existing attribute value (update)" />
      </div>

      <div style="margin-top:10px; display:flex; gap:8px; align-items:center;">
        <button @click="submitPersonUpdate">Submit person update</button>
        <span style="font-size:12px; opacity:0.75;">(sẽ gửi các field đang có giá trị)</span>
      </div>
    </div>

    <h3 style="margin-top:16px;">Date & time</h3>
    <button @click="timeNow">qe_time_ping</button>
    <button @click="timeBoundary">qe_time_boundary (timestamp option)</button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { usePosthog } from "../composables/useLeanbaseCompass";

const text = ref("");
const secret = ref("");
const checked = ref(false);
const sel = ref("");
const email = ref("");

const { posthog } = usePosthog();

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
  for (let i = 0; i < 5; i++) capture("qe_burst_event", { i });
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

/** =========================
 * Person properties update UI
 * ========================= */
const personEmail = ref("");
const personPhone = ref("");
const personName = ref("");

const newAttrKey = ref("");
const newAttrValue = ref("");

const updAttrKey = ref("");
const updAttrValue = ref("");

const currentDistinctId = computed(() => {
  try {
    return posthog.get_distinct_id?.() || "(unknown)";
  } catch {
    return "(unknown)";
  }
});

// parse value input: try JSON -> boolean/number -> string
function parseValue(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "";

  // JSON object/array/number/string (e.g. {"a":1}, [1,2], 123, "x")
  try {
    return JSON.parse(s);
  } catch {}

  const lower = s.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;

  // number
  if (!Number.isNaN(Number(s)) && s !== "") return Number(s);

  return s;
}

function submitPersonUpdate() {
  const props = {};

  if (personEmail.value.trim()) props.email = personEmail.value.trim();
  if (personPhone.value.trim()) props.phone = personPhone.value.trim();
  if (personName.value.trim()) props.name = personName.value.trim();

  if (newAttrKey.value.trim()) {
    props[newAttrKey.value.trim()] = parseValue(newAttrValue.value);
  }
  if (updAttrKey.value.trim()) {
    props[updAttrKey.value.trim()] = parseValue(updAttrValue.value);
  }

  const keys = Object.keys(props);
  if (keys.length === 0) {
    capture("qe_person_update_submit_empty");
    return;
  }

  // Cách 1 (đơn giản nhất): gọi identify với same distinct_id để update person props
  const did = posthog.get_distinct_id?.() || "qe_user_vue_001";
  posthog.identify(did, props);

  // log lại 1 event để bạn dễ trace trên Events tab
  capture("qe_person_update_submit", { updated_keys: keys });

  // optional: clear inputs sau khi submit
  // personEmail.value = ""; personPhone.value = ""; personName.value = "";
  // newAttrKey.value = ""; newAttrValue.value = "";
  // updAttrKey.value = ""; updAttrValue.value = "";
}
</script>
