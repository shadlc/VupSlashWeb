import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/web/",
      name: "home",
      meta: { title: "VUP杀——旅人的港湾" },
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/web/cards",
      name: "cards",
      meta: { title: "卡牌查看器——VUP杀" },
      component: () => import("@/views/CardSearchView.vue"),
    },
    {
      path: "/web/maker",
      name: "maker",
      meta: { title: "卡牌制作器——VUP杀" },
      component: () => import("@/views/CardMakerView.vue"),
    },
    {
      path: "/web/faq",
      name: "faq",
      meta: { title: "常见问题——VUP杀" },
      component: () => import("@/views/FAQView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "notFound",
      meta: { title: "404 Not Found——VUP杀" },
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
