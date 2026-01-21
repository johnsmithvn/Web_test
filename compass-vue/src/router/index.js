import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import PlaygroundView from "../views/PlaygroundView.vue";
import PaymentView from "../views/PaymentView.vue";
import BillingView from "../views/BillingView.vue";
import { usePosthog } from "../composables/useLeanbaseCompass";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/playground", name: "playground", component: PlaygroundView },
  { path: "/about", name: "about", component: AboutView },
  { path: "/payment", name: "payment", component: PaymentView },
  { path: "/billing", name: "billing", component: BillingView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { posthog } = usePosthog();

// SPA pageview tracking
router.afterEach((to) => {
  posthog.capture("$pageview", { 
    path: to.fullPath,
    route_name: to.name,
    timestamp: new Date().toISOString()
  });
});

export default router;
