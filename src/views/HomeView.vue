<script setup lang="ts">
import HomeCover from "@/components/HomeCover.vue";
import HomeIntroduce from "@/components/HomeIntroduce.vue";
import HomeDownload from "@/components/HomeDownload.vue";
import HomeUpdate from "@/components/HomeUpdate.vue";
import HomeAbout from "@/components/HomeAbout.vue";
import axios from "axios";
import { onBeforeMount, ref } from "vue";

let versions = ref();
onBeforeMount(() => {
  axios.get("https://api.vupslash.icu/json/version_list/").then((respond) => {
    versions.value = respond.data;
  });
});

// 划出扉页之后自动显示导航栏
window.addEventListener("scroll", showFloatNav, true);
function showFloatNav() {
  if (document.querySelector(".cover") as HTMLElement) {
    let scrolls = window.scrollY;
    let cover = document.querySelector(".cover") as HTMLElement;
    let nav = document.querySelector("#float_nav") as HTMLElement;
    if (scrolls >= cover.clientHeight) {
      nav.classList.remove("hide-nav");
    } else {
      nav.classList.add("hide-nav");
    }
  }
}

// 点击导航栏进行定位后隐藏导航栏
let link = document.querySelector(".navbar-nav a") as HTMLElement;
link.addEventListener("click", hideFloatNav);

function hideFloatNav() {
  let navbar = document.querySelector("#float_navBar") as HTMLElement;
  let toggler = document.querySelector(".navbar-toggler") as HTMLElement;
  if (navbar.classList.contains("show")) {
    toggler.dispatchEvent(new Event("click"));
  }
}
</script>

<template>
  <div class="hide-nav" id="float_nav" style="z-index: 10">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand fs-1" href="" style="line-height: 0">
          <span class="vup">VUP</span><span class="sha">杀</span>
        </a>
        <button
          class="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#float_navBar"
          aria-expanded="false"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          id="float_navBar"
          class="collapse navbar-collapse justify-content-end"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#introduce">介绍</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#download">下载</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#update">更新</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#about">关于</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <HomeCover v-if="versions" :versions="versions" />
  <div class="home-page">
    <HomeIntroduce />
    <HomeDownload />
    <HomeUpdate v-if="versions" :versions="versions" />
    <HomeAbout />
  </div>
</template>

<style scoped>
#float_nav {
  color: #fafafa;
  position: fixed;
  width: 100%;
  top: 0;
  transition: all 0.2s;
  background: #211f2f;
  background: #211f2fcc;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}
.hide-nav {
  transition: all 0.2s;
  transform: translate3d(0, -100%, 0);
}
.home-page {
  background-color: #fafafa;
}
</style>
