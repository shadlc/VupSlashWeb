<script setup lang="ts">
import WebFooter from "./components/WebFooter.vue";
import axios from "axios";
import { onBeforeMount, ref } from "vue";

let thanks = ref();
onBeforeMount(() => {
  axios.get("https://api.vupslash.icu/json/thanks_list.php").then((respond) => {
    thanks.value = respond.data;
  });
});

// 隐藏顶部导航栏
function hideFloatNav() {
  let btn = document.querySelector(".navbar-toggler") as HTMLElement;
  if (getComputedStyle(btn, null).display != "none") btn.click();
}

// 动态背景
setTimeout(() => {
  let deg = 320;
  let header = document.querySelector("body") as HTMLElement;
  let dynamic = setInterval(() => {
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
              >主页</router-link
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://shimo.im/docs/R13j8bJ2DVUJjZk5/read"
              @click="hideFloatNav"
            >
              入门
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
            <a class="nav-link" href="/wiki" @click="hideFloatNav">百科</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cards" @click="hideFloatNav"
              >卡查</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/maker" @click="hideFloatNav"
              >制卡</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/faq" @click="hideFloatNav"
              >FAQ</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view />
  <WebFooter v-if="thanks" :thanks="thanks" />
</template>

<style>
@font-face {
  font-family: "vup_font";
  src: url("/public/fonts/vup.ttf");
}
@font-face {
  font-family: "sha_font";
  src: url("/public/fonts/sha.ttf");
}
@font-face {
  font-family: "zhengkuchaojihei";
  src: url("/public/fonts/zhengkuchaojihei.ttf");
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
html,
body {
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

nav a {
  font-weight: bold;
  color: #75828f;
  text-decoration: none;
  padding: 0.5em;
}

nav a.router-link-exact-active {
  color: #3d6cb4;
}

.badge {
  margin-right: 0.3em;
}

.btn {
  background: #212529;
  color: #f8f9fa;
  margin: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 3px 2px #f8f9fadd;
  transition: all 0.15s ease-in-out;
}
.btn:hover {
  color: #f8f9fa;
  box-shadow: 0 0 5px 4px #f8f9fadd;
}
.btn:active {
  transform: scale(0.9, 0.9) !important;
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