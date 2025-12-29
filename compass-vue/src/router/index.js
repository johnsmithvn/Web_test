import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import { usePosthog } from "../composables/useLeanbaseCompass";
import PlaygroundView from "../views/PlaygroundView.vue";

const routes = [
  { path: "/", name: "playground", component: PlaygroundView },
  // { path: "/", name: "home", component: HomeView },
  { path: "/about", name: "about", component: AboutView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { posthog } = usePosthog();

// // SPA pageview: để chắc ăn, hook router
// router.afterEach((to) => {
//   posthog.capture("$pageview", { path: to.fullPath });
// });

export default router;
