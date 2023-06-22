<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import WebFooter from "./components/WebFooter.vue";
import axios from "axios";
import { onBeforeMount, ref } from "vue";

const thanks = ref();
onBeforeMount(() => {
  axios.get("https://api.vupslash.icu/json/thanks_list/").then((respond) => {
    thanks.value = respond.data;
  });
});

// 隐藏顶部导航栏
function hideFloatNav() {
  const btn = document.querySelector(".navbar-toggler") as HTMLElement;
  if (getComputedStyle(btn, null).display !== "none") btn.click();
}

// 动态背景
setTimeout(() => {
  let deg = 320;
  const header = document.querySelector("body") as HTMLElement;
  const dynamic = setInterval(() => {
    if (deg <= 680) {
      header.style.background =
        "linear-gradient(" + deg + "deg, #211f2f, #001010) no-repeat fixed";
    } else clearInterval(dynamic);
    deg++;
  }, 5);
  deg = 320;
}, 2000);
</script>

<template>
  <nav class="fix-nav navbar navbar-expand-lg navbar-dark text-center">
    <div class="container-fluid">
      <button
        type="button"
        class="navbar-toggler collapsed"
        data-bs-toggle="collapse"
        data-bs-target="#navbar"
        aria-expanded="false"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="navbar-collapse justify-content-md-center collapse"
        id="navbar"
      >
        <ul class="navbar-nav fs-5">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="hideFloatNav"
              >主页
            </router-link>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://shimo.im/docs/R13j8bJ2DVUJjZk5/read"
              @click="hideFloatNav"
              >入门
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="/scenarios/newgamerules.html"
              @click="hideFloatNav"
              >规则</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://wiki.vupslash.icu" @click="hideFloatNav">百科</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cards" @click="hideFloatNav"
              >卡查
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/maker" @click="hideFloatNav"
              >制卡
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/faq" @click="hideFloatNav"
              >FAQ
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view v-slot="{ Component }">
    <transition name="zoom-fade" mode="out-in" appear>
      <keep-alive exclude="HomeView">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <WebFooter v-if="thanks" :thanks="thanks" />
</template>

<style>
@font-face {
  font-family: "vup_font";
  src: url("fonts/vup.ttf");
}
@font-face {
  font-family: "sha_font";
  src: url("fonts/sha.ttf");
}
@font-face {
  font-family: "zhengkuchaojihei";
  src: url("fonts/zhengkuchaojihei.ttf");
}
.vup {
  font-family: vup_font;
}
.sha {
  font-family: sha_font;
}
.hide {
  display: none !important;
}
.fade-in {
  opacity: 0;
  transform: translateY(20%);
  transition: all 0.5s ease-in-out;
}
.faded-in {
  opacity: 1;
  transform: translateY(0);
}
.center {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
}
pre {
  font-family: unset;
  font-size: 1em;
  white-space: pre-wrap;
  word-wrap: break-word;
}
mark {
  border-radius: 0.5em;
  padding: 0.1em;
  margin: 0 0.2em;
}
.hyperlink {
  display: inline;
  color: inherit;
  text-decoration: underline dashed;
}
.hyperlink:hover {
  color: inherit;
}
#text {
  display: inline;
}
html,
body {
  position: relative;
  margin: 0;
  height: 100%;
  width: 100%;
}
body {
  background: #211f2f;
  background: -webkit-linear-gradient(320deg, #211f2f, #001010) fixed;
  background: linear-gradient(320deg, #211f2f, #001010) fixed;
}
#app {
  height: 100%;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.zoom-fade-leave-active {
  transition: all 0.3s ease-out;
}
.zoom-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.5, 0, 0.5, 1.5);
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.zoom-fade-enter-to {
  opacity: 1;
}
.zoom-fade-leave {
  opacity: 1;
}
.zoom-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

nav a {
  font-weight: bold !important;
  color: #75828f;
  text-decoration: none;
  padding: 0.5em;
}

.badge {
  margin-right: 0.3em;
}

.btn {
  background: #212529;
  color: #f8f9fa;
  margin: 0.5rem;
  padding: 0.4rem 0.5rem;
  border: 1px solid #f8f9fa;
  border-radius: 1rem;
  box-shadow: 0 0 3px 2px #f8f9fadd;
  transition: all 0.15s ease-in-out;
}
.btn:hover {
  box-shadow: 0 0 5px 4px #f8f9fadd;
  border-color: #f8f9fadd !important;
  background-color: #212529 !important;
}
.btn:active {
  transform: scale(0.9, 0.9) !important;
  background-color: #212529 !important;
  border-color: #f8f9fadd !important;
}
.btn-check:focus + .btn,
.btn:focus,
button:focus:not(:focus-visible),
.accordion-button:focus {
  outline: none;
  box-shadow: 0 0 5px 4px #f8f9fadd;
}
.btn-outline-secondary {
  background: transparent;
  color: #6c757d;
  border-color: #6c757d;
}
.btn-danger {
  color: #f3717e !important;
  box-shadow: 0 0 3px 2px #f3717e;
}
.btn-danger:focus,
.btn-danger:hover {
  background: #212529;
  box-shadow: 0 0 5px 4px #f3717e !important;
}
.btn-success {
  color: #8ef682 !important;
  box-shadow: 0 0 3px 2px #8ef682;
}
.btn-success:focus,
.btn-success:hover {
  background: #212529;
  box-shadow: 0 0 5px 4px #8ef682 !important;
}

@media only screen and (max-width: 991px) {
  .rounded-1rem {
    border-radius: 0.55rem !important;
  }
}
.rounded-1rem {
  border-radius: 1rem;
}
.rounded-top-1rem {
  border-radius: 1rem 1rem 0 0;
}
.rounded-bottom-1rem {
  border-radius: 0 0 1rem 1rem;
}
</style>
