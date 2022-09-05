import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import lazyPlugin from "vue3-lazy";

createApp(App)
  .use(lazyPlugin, {
    error: require("/public/img/error.png"),
  })
  .use(router)
  .mount("#app");
