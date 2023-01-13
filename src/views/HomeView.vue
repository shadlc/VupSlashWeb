<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import axios from "axios";
import HomeCover from "@/components/HomeCover.vue";
import HomeIntroduce from "@/components/HomeIntroduce.vue";
import HomeDownload from "@/components/HomeDownload.vue";
import HomeUpdate from "@/components/HomeUpdate.vue";
import HomeAbout from "@/components/HomeAbout.vue";
import ScrollMagic from "scrollmagic";

const versions = ref([{ version: "" }]);
onBeforeMount(() => {
  axios.get("https://api.vupslash.icu/json/version_list/").then((respond) => {
    versions.value = respond.data;
  });
});

onMounted(() => {
  doScrollMagic();
  // 图片懒加载
  document.querySelectorAll("img[lazy-src]").forEach(function (item) {
    const lazyImg = item;
    const img = new Image();
    img.addEventListener("load", loadHandler);
    img.setAttribute("src", item.getAttribute("lazy-src") as string);
    function loadHandler() {
      lazyImg.setAttribute("src", img.src);
      lazyImg.removeAttribute("lazy-src");
    }
  });
});

// 划出扉页之后自动显示导航栏
window.addEventListener("scroll", showFloatNav, true);
function showFloatNav() {
  if (document.querySelector(".cover") as HTMLElement) {
    const scrolls = window.scrollY;
    const cover = document.querySelector(".cover") as HTMLElement;
    const nav = document.querySelector("#float_nav") as HTMLElement;
    if (scrolls >= cover.clientHeight) {
      nav.classList.remove("hide-nav");
    } else {
      nav.classList.add("hide-nav");
    }
  }
}

// 点击导航栏进行定位后隐藏导航栏
const link = document.querySelector(".navbar-nav a") as HTMLElement;
link.addEventListener("click", hideFloatNav);

function hideFloatNav() {
  const navbar = document.querySelector("#float_navBar") as HTMLElement;
  const toggler = document.querySelector(".navbar-toggler") as HTMLElement;
  if (navbar && navbar.classList.contains("show")) {
    toggler.dispatchEvent(new Event("click"));
  }
}

// 页面动画
function doScrollMagic() {
  const controller = new ScrollMagic.Controller();
  const fadeInElements = document.querySelectorAll(".fade-in");
  fadeInElements.forEach((each) => {
    new ScrollMagic.Scene({
      triggerElement: each,
      triggerHook: 0.8,
      reverse: false,
    })
      .setClassToggle(each, "faded-in")
      .addTo(controller);
  });
  const expandElements = document.querySelectorAll(".expand");
  expandElements.forEach((each) => {
    new ScrollMagic.Scene({
      triggerElement: each,
      triggerHook: 0.8,
      reverse: false,
      offset: 250,
    })
      .setClassToggle(each, "expanded")
      .addTo(controller);
  });
}
</script>

<template>
  <div>
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
    <HomeCover :versions="versions" />
    <div class="home-page">
      <HomeIntroduce />
      <HomeDownload />
      <HomeUpdate :versions="versions" />
      <HomeAbout />
    </div>
  </div>
</template>

<style scoped>
#float_nav {
  color: #fafafa;
  position: fixed;
  width: 100%;
  top: 0;
  opacity: 1;
  background: #211f2f;
  background: rgba(33, 31, 47, 0.8);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transition: all 0.2s;
}
.hide-nav {
  opacity: 0 !important;
  transform: translate3d(0, -100%, 0);
  transition: all 0.2s;
}
.home-page {
  background-color: #fafafa;
}
</style>
