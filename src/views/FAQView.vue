<script setup lang="ts">
import axios from "axios";
import { onMounted, onBeforeMount, ref } from "vue";

const faqs = ref();
onBeforeMount(async () => {
  await axios.get("https://api.vupslash.icu/json/faq_list/").then((respond) => {
    faqs.value = respond.data;
  });

  // 自动滚动到锚点位置
  const anchor = decodeURIComponent(window.location.hash);
  if (anchor) {
    window.location.href = anchor;
  }

  // 导航栏滚动监听
  const links = document.querySelectorAll(".faq-navbar a");
  window.addEventListener("scroll", () => {
    const scrolls = window.scrollY;
    let had = false;
    for (let i = links.length - 1; i >= 0; i--) {
      const item = document.querySelector(
        "h3" + links[i].getAttribute("href")
      ) as HTMLElement;
      if (!had && item && scrolls >= item.offsetTop + 260) {
        links[i].classList.add("active");
        had = true;
      } else {
        links[i].classList.remove("active");
      }
    }
  });
});

onMounted(() => {
  // 搜索
  const searchBox = document.querySelector("#search_box") as HTMLElement;
  searchBox.onkeyup = () => {
    document.querySelectorAll("mark").forEach((each) => {
      const text = each.textContent as string;
      each.replaceWith(text);
    });
    const value = (searchBox as HTMLInputElement).value;
    document.querySelectorAll(".faq-subtype").forEach((each) => {
      if (
        (each.textContent as string).toLowerCase().includes(value.toLowerCase())
      ) {
        if (value !== "") highLight(each as HTMLElement, value);
        each.classList.remove("hide");
      } else {
        each.classList.add("hide");
      }
    });
    const showCardNum = document.querySelectorAll(
      ".faq-subtype:not(.hide)"
    ).length;
    const searchResult = document.querySelector(
      ".search-result"
    ) as HTMLElement;
    if (showCardNum && document.querySelectorAll(".faq-subtype.hide").length) {
      searchResult.innerHTML =
        "寻找到" + showCardNum + "条关于“" + value + "”的记录";
    } else if (showCardNum) {
      searchResult.innerHTML = "";
    } else {
      searchResult.innerHTML = "未找到有关“" + value + "”的内容";
    }
  };
});

// 高亮
function highLight(ele: HTMLElement, keys: string) {
  const reg = new RegExp("(" + keys.replace(/,/, "|") + ")", "g");
  ele.innerHTML = ele.innerHTML.replace(/>([^<>]*)</g, function ($1) {
    $1 = $1.replace(reg, "<mark>$&</mark>");
    return $1;
  });
}

window.addEventListener("scroll", doScroll, true);
function doScroll() {
  const btnToTop = document.querySelector("#btn_to_top") as HTMLElement;
  const navbarLeft = document.querySelector(".navbar-left") as HTMLElement;
  if (navbarLeft) {
    const scrolls = window.scrollY;
    // 显示回到顶部按钮
    if (btnToTop) {
      if (window.scrollY <= 100) {
        btnToTop.style.bottom = "-100px";
      } else {
        btnToTop.style.bottom = "16px";
      }
    }
    // 固定左侧导航栏
    const navbarContainer = document.querySelector(
      ".navbar-container"
    ) as HTMLElement;
    const navbarToTop: number = navbarContainer.offsetTop - scrolls;
    const navbarToBottom: number = -(
      navbarToTop +
      navbarContainer.clientHeight -
      document.body.clientHeight
    );
    if (navbarToTop >= 0) {
      navbarLeft.style.position = "absolute";
      navbarLeft.style.top = "0px";
      navbarLeft.style.bottom = "";
    } else if (navbarToBottom >= 0) {
      navbarLeft.style.position = "absolute";
      navbarLeft.style.bottom = "0px";
      navbarLeft.style.top = "";
    } else {
      navbarLeft.style.position = "fixed";
      navbarLeft.style.top = "0px";
    }
  }
}
// 滚动到顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div id="faq_div">
    <div class="p-5 text-center" id="title">
      <h1>
        <a class="link-light text-decoration-none fw-bold display-5" href="">
          常见问题 | FAQ
        </a>
      </h1>
    </div>
    <a class="p-0 center" id="btn_to_top" @click="scrollToTop" title="回到顶部">
      <i class="bi bi-caret-up-fill"></i>
    </a>
    <a
      class="p-0 center"
      id="btn_navbar"
      href="#offcanvas_navbar"
      data-bs-toggle="offcanvas"
      role="button"
      aria-controls="offcanvas_navbar"
      title="导航栏"
    >
      <i class="bi bi-list"></i>
    </a>
    <div
      class="offcanvas offcanvas-start text-light fs-3"
      data-bs-scroll="true"
      tabindex="-1"
      id="offcanvas_navbar"
      aria-labelledby="offcanvas_navbarLabel"
    >
      <div class="offcanvas-body bg-dark scroll-hide">
        <nav>
          <ul class="navbar-nav" v-if="faqs">
            <div v-for="(subtypes, type, index) in faqs.types" :key="index">
              <h3 class="pt-3 type">
                <a
                  :href="'#nav-' + type"
                  data-bs-toggle="collapse"
                  class=""
                  aria-expanded="true"
                  >{{ type }}</a
                >
              </h3>
              <div :id="'nav-' + type" class="collapse">
                <li
                  class="nav-item"
                  v-for="(data, subtype, index) in subtypes.subtypes"
                  :key="index"
                >
                  <a class="nav-link ps-3 fs-5" :href="'#' + subtype">{{
                    subtype
                  }}</a>
                </li>
              </div>
            </div>
          </ul>
        </nav>
      </div>
    </div>

    <div class="container-fluid">
      <div
        class="container bg-dark p-0 py-3 rounded-top-1rem border-bottom border-secondary fw-bold text-white text-center"
      >
        <i class="bi bi-search me-2 input-search"></i>
        <input
          type="text"
          id="search_box"
          class="p-3 ps-5 bg-dark text-white border border-2 rounded-1rem"
          title="检索常见问题"
        />
      </div>
      <div
        class="container bg-dark p-0 fs-5 text-light position-relative navbar-container overflow-hidden"
      >
        <div class="navbar-left border-end border-secondary scroll">
          <nav class="faq-navbar">
            <ul class="navbar-nav" v-if="faqs">
              <div v-for="(subtypes, type, index) in faqs.types" :key="index">
                <h3 class="type">
                  <a
                    :href="'#nav-' + type"
                    data-bs-toggle="collapse"
                    class=""
                    aria-expanded="true"
                    >{{ type }}</a
                  >
                </h3>
                <div :id="'nav-' + type" class="collapse">
                  <li
                    class="nav-item"
                    v-for="(data, subtype, index) in subtypes.subtypes"
                    :key="index"
                  >
                    <a class="nav-link ps-3 fs-5" :href="'#' + subtype">
                      {{ subtype }}
                    </a>
                  </li>
                </div>
              </div>
            </ul>
          </nav>
        </div>
        <div class="p-4 bg-dark faq" v-if="faqs">
          <p class="search-result text-wrap text-secondary"></p>
          <div
            class="mb-5"
            v-for="(subtypes, type, index) in faqs.types"
            :key="index"
          >
            <div
              class="faq-subtype mb-5"
              v-for="(quests, subtype, index) in subtypes.subtypes"
              :key="index"
            >
              <h3 class="type" :id="String(subtype)">
                <a class="anchor-subtype" :href="'#' + String(subtype)">#</a>
                {{ subtype }}
              </h3>
              <blockquote
                class="faq-card blockquote"
                v-for="(answers, quest, index) in quests.quests"
                :key="index"
              >
                <p>Q: {{ quest }}</p>
                <div v-for="(answer, index) in answers.answers" :key="index">
                  <pre>A: {{ answer.answer }}</pre>
                  <footer class="blockquote-footer">
                    回答自 <b>{{ answer.author }}</b>
                  </footer>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 991px) {
  .rounded-1rem {
    border-radius: 0.55rem;
  }
  .navbar-left {
    width: 0 !important;
    border: 0 !important;
    padding: 2rem 0rem !important;
  }
}
@media only screen and (min-width: 992px) {
  .faq {
    margin-left: 15rem !important;
    width: calc(100% - 15rem) !important;
  }
  #btn_navbar {
    display: none;
  }
  .offcanvas {
    visibility: visible !important;
  }
}
#btn_navbar {
  position: fixed;
  text-align: center;
  z-index: 10;
  bottom: 16px;
  left: 30px;
  height: 1.6em;
  width: 1.6em;
  border-radius: 100%;
  border: 3px solid #fafafa;
  font-size: 1.6em;
  color: #fafafa;
}
#btn_to_top {
  position: fixed;
  text-align: center;
  z-index: 10;
  bottom: -100px;
  right: 30px;
  height: 1.6em;
  width: 1.6em;
  border-radius: 100%;
  border: 3px solid #fafafa;
  font-size: 1.5em;
  color: #fafafa;
  cursor: pointer;
  transition: all 0.5s ease;
}
@-webkit-keyframes Up {
  50% {
    transform: translateY(-16px);
  }
}
@keyframes Up {
  50% {
    transform: translateY(-16px);
  }
}
.navbar-container {
  min-height: 54vh;
}
#btn_to_top:hover {
  animation: Up 0.75s ease;
}
#btn_to_top i {
  margin-bottom: 3px;
  border-radius: 100%;
}
.input-search {
  position: absolute;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}
.offcanvas {
  width: 12rem;
  z-index: 1051;
}
.navbar-left {
  position: absolute;
  white-space: nowrap;
  width: 12em;
  height: calc(100vh);
  overflow-x: hidden;
  padding: 2rem 1rem;
  transition: all 0.6s ease-in-out;
}
.navbar-left a,
.offcanvas-body a {
  display: block;
  text-decoration: none;
  color: #f8f9fa;
}
.navbar-left a:hover,
.offcanvas-body a:hover {
  color: grey;
}
.navbar-left .active {
  font-weight: bolder !important;
  border-left: 0.2em solid #f8f9fa !important;
}
.nav-link {
  border-left: none;
  padding: 0.2rem 1rem !important;
}
nav a {
  font-weight: unset !important;
}

.scroll-hide::-webkit-scrollbar {
  visibility: hidden;
}
.scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  color: #6c757d;
}
.scroll::-webkit-scrollbar-track {
  background-color: #6c757d;
}
.scroll::-webkit-scrollbar-thumb {
  background-color: #fafafa;
}

.faq {
  min-height: calc(50vh);
  width: calc(100%);
  margin-left: 0;
  transition: margin-left 0.6s ease-in-out;
}
blockquote {
  font-weight: 400;
  border-left: 0.2em solid #f8f9fa !important;
  margin: 2rem;
  padding-left: 1rem;
}
.text-wrap {
  word-wrap: anywhere;
}
.hide {
  display: none !important;
}
.type {
  font-weight: bold;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid grey;
}
.anchor-subtype {
  opacity: 0;
  color: #f8f9fa;
  font-size: 1.4rem;
}
.type:hover > .anchor-subtype {
  opacity: 1;
}
</style>
