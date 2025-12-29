import "./style.css";
import { Leanbase } from '@leanbase.com/js'
// const leanbase = new Leanbase('lbc_xBFdY7G2xQDAYVv1h858CQUVJrxuEVTTMNhWbvYHsm1', {
//   host: 'https://ingest-compass-25.leanflag.net',  // Use 'host', not 'api_host'
//   person_profiles: 'identified_only'  // or 'always'
// });
import PostHog from 'posthog-js-lite'

const leanbase = new PostHog('lbc_xBFdY7G2xQDAYVv1h858CQUVJrxuEVTTMNhWbvYHsm1', {
  host: 'https://ingest-compass-25.leanflag.net',
  // person_profiles: 'identified_only'  // or 'always'
});

///////


globalThis.leanbase = leanbase;

console.log("init done");

function safe(fn) {
  try { fn?.(); } catch (e) { console.error(e); }
}

document.querySelector("#app").innerHTML = `
  <h1>Compass JS Playground</h1>

  <section>
    <h3>Autocapture targets</h3>
    <button id="btn-primary">Primary button</button>
    <a id="link-about" href="/about">Go /about (fake link)</a>

    <div style="margin-top:8px;">
      <label>Text: <input id="inp-text" placeholder="type here"/></label>
      <label>Password: <input id="inp-pass" type="password" placeholder="should not leak"/></label>
    </div>

    <div style="margin-top:8px;">
      <label><input type="checkbox" id="chk-1"/> Checkbox</label>
      <label><input type="radio" name="r" value="A"/> Radio A</label>
      <label><input type="radio" name="r" value="B"/> Radio B</label>
      <select id="sel-1">
        <option value="">Choose</option>
        <option value="x">X</option>
        <option value="y">Y</option>
      </select>
    </div>

    <form id="form-1" style="margin-top:8px;">
      <input name="email" placeholder="email (avoid sending raw in autocapture)" />
      <button type="submit">Submit form</button>
    </form>

    <div id="dead-click" role="button" tabindex="0"
         style="margin-top:10px;padding:10px;border:1px dashed #999;cursor:pointer;">
      Dead click target (looks clickable, does nothing)
    </div>
  </section>

  <section style="margin-top:16px;">
    <h3>Manual events</h3>
    <button id="m-page">qe_manual_page</button>
    <button id="m-search">qe_search</button>
    <button id="m-purchase">qe_purchase</button>
    <button id="m-error">qe_js_error</button>
    <button id="m-burst">qe_burst_50</button>
  </section>

  <section style="margin-top:16px;">
    <h3>Identity</h3>
    <button id="id-identify">identify</button>
    <button id="id-reset">reset (new anon)</button>
  </section>

  <section style="margin-top:16px;">
    <h3>Date & time probes</h3>
    <button id="t-now">qe_time_ping (now)</button>
    <button id="t-near-midnight">qe_time_boundary (try custom timestamp)</button>
  </section>
`;

document.getElementById("m-page").onclick = () =>
  leanbase.capture("qe_manual_page", { from: "js-web", path: location.pathname });

document.getElementById("m-search").onclick = () =>
  leanbase.capture("qe_search", { query: "manga", results: 42 });

document.getElementById("m-purchase").onclick = () =>
  leanbase.capture("qe_purchase", { currency: "VND", amount: 99000, sku: "sku_demo_01" });

document.getElementById("m-error").onclick = () => {
  leanbase.capture("qe_js_error", { where: "button" });
  // tạo lỗi thật để xem console + xem platform có capture error không
  throw new Error("QE intentional error");
};

document.getElementById("m-burst").onclick = () => {
  for (let i = 0; i < 10; i++) {
    leanbase.capture("qe_burst_event", { i });
  }
};

document.getElementById("id-identify").onclick = () =>
  safe(() => {
    if (leanbase.identify) {
      leanbase.identify("qe_user_js_001", { email: "qe+js@demo.local", name: "QE JS" });
    }
    leanbase.capture("qe_after_identify", { from: "js-web" });
  });

document.getElementById("id-reset").onclick = () =>
  safe(() => {
    if (leanbase.reset) leanbase.reset();
    leanbase.capture("qe_after_reset", { from: "js-web" });
  });

document.getElementById("t-now").onclick = () =>
  leanbase.capture("qe_time_ping", { local: new Date().toString() });

// timestamp boundary: chỉ hoạt động nếu SDK support timestamp option
document.getElementById("t-near-midnight").onclick = () =>
  safe(() => {
    const nearMidnightLocal = new Date();
    nearMidnightLocal.setHours(23, 59, 30, 0);

    // thử 2 kiểu phổ biến
    if (leanbase.capture.length >= 3) {
      leanbase.capture("qe_time_boundary", { note: "try options.timestamp" }, { timestamp: nearMidnightLocal });
    } else {
      leanbase.capture("qe_time_boundary", { note: "no timestamp option supported", ts: nearMidnightLocal.toISOString() });
    }
  });

// Fake navigation (SPA-ish): không reload để xem pageview autocapture có bắt không
document.getElementById("link-about").onclick = (e) => {
  e.preventDefault();
  history.pushState({}, "", "/about");
  leanbase.capture("qe_route_change", { to: "/about" });
};
window.onpopstate = () => leanbase.capture("qe_route_change", { to: location.pathname });

document.getElementById("form-1").addEventListener("submit", (e) => {
  e.preventDefault();
  leanbase.capture("qe_form_submit", { form: "form-1" });
});
