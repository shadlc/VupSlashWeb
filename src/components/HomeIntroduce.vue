<script setup lang="ts">
const cardList = randomSort([
  "xingyenaixu",
  "ssfusang",
  "xueniangaogun",
  "lianglunche",
  "fire_attack",
  "befriend_attacking",
  "duel",
  "amazing_grace",
  "ex_nihilo",
  "savage_assault",
  "supply_shortage",
  "nullification",
  "peach",
  "ice_slash",
]);
function randomSort(arr: string[]) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = arr[randomIndex];
    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }
  return arr;
}

function displayCard(element: EventTarget | null) {
  let isDisplay = true;
  if (element) {
    isDisplay = (element as HTMLElement).classList.contains("display");
  }
  document.querySelectorAll("img.display").forEach((element) => {
    element.classList.remove("display");
    element.classList.add("display-back");
  });
  if (!isDisplay) {
    (element as HTMLElement).classList.remove("display-back");
    (element as HTMLElement).classList.add("display");
  }
}

// 图片差视
window.addEventListener("scroll", avatarFloating, true);
function avatarFloating() {
  if (document.querySelector("#c1") as HTMLElement) {
    const c1 = document.querySelector("#c1") as HTMLElement;
    const c2 = document.querySelector("#c2") as HTMLElement;
    const c3 = document.querySelector("#c3") as HTMLElement;
    const c4 = document.querySelector("#c4") as HTMLElement;
    let floatingUp = 400;
    const scrolls =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    floatingUp = c1.offsetTop - scrolls - 200;
    if (floatingUp >= 0 && floatingUp <= 600) {
      c1.style.transform = "translateY(" + floatingUp * 0.1 + "px)";
      c2.style.transform = "translateY(" + floatingUp * 0.3 + "px)";
      c3.style.transform = "translateY(" + floatingUp * 0.2 + "px)";
      c4.style.transform = "translateY(" + floatingUp * 0.4 + "px)";
      c1.style.opacity = "1";
      c2.style.opacity = "1";
      c3.style.opacity = "1";
      c4.style.opacity = "1";
    }
  }
}

const detectCardDiv = setInterval(() => {
  if (document.querySelector(".example-card-div.expanded")) {
    cardPolling();
    clearInterval(detectCardDiv);
  }
}, 1000);
function cardPolling() {
  setInterval(() => {
    const cardDiv = document.querySelector(
      ".example-card-div:not(:hover)"
    ) as HTMLElement;
    if (
      cardDiv &&
      cardDiv.lastChild &&
      !document.querySelector(".example-card-div img.display")
    ) {
      cardDiv.prepend(cardDiv.lastChild);
    }
  }, 2000);
}
</script>

<template>
  <div class="container py-5" id="introduce">
    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fade-in">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">
        「VUP杀」基于三国杀创作的衍生作品
      </h2>
      <blockquote class="lead fs-5 px-5">
        <p class="mb-0">
          本作是一款以《三国杀》为基础创作的多人回合制战略卡牌游戏
        </p>
        <p class="mt-0">
          卡牌皆由目前盛行的Vup作为人物角色组成，作为其“存在记录”，也便于各位DD们记住这段美好时光，并进行对外宣传
        </p>
        <a
          type="button"
          class="btn btn-dark rounded-pill btn-lg col-sm-6 col-lg-3"
          href="scenarios/newgamerules.html"
        >
          特有机制
        </a>
      </blockquote>
    </div>
    <div class="my-5 text-center fade-in">
      <img
        class="img-fluid col-lg-8 shadow"
        lazy-src="assets/img/battle.jpg"
      />
    </div>

    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fade-in">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">
        同台竞技的各位可爱VUP
      </h2>
      <blockquote class="fs-5 px-5">
        <p class="mb-0">你可曾这样想过:</p>
        <p class="lead mt-0">
          能够让喜爱的Vup在卡牌游戏里展现实力,与其他的Vup们进行混战，抑或是参加创作，为你梦想中的TA打造不一样的玩法
        </p>
        <a
          type="button"
          class="btn btn-dark rounded-pill btn-lg col-sm-6 col-lg-3"
          href="cards/"
        >
          查看详细
        </a>
      </blockquote>
    </div>
    <div class="text-center my-5 pb-5">
      <img
        id="c1"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fade-in"
        lazy-src="assets/img/c1.jpg"
      />
      <img
        id="c2"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fade-in"
        lazy-src="assets/img/c2.jpg"
      />
      <img
        id="c3"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fade-in"
        lazy-src="assets/img/c3.jpg"
      />
      <img
        id="c4"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fade-in"
        lazy-src="assets/img/c4.jpg"
      />
    </div>
    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fade-in">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">
        风格卡牌与特殊卡牌
      </h2>
      <blockquote class="fs-5 px-5">
        <p class="lead">
          为了给各位旅人们带来更强的沉浸游玩体验与更多玩法，特制诸多风格化卡片和功能卡片
        </p>
        <p>有更多想法？欢迎加入我们共同创作！</p>
        <a
          type="button"
          class="btn btn-dark rounded-pill btn-lg col-sm-6 col-lg-3"
          href="#about"
        >
          加入群聊
        </a>
      </blockquote>
    </div>
    <div class="text-center my-5 fade-in">
      <div
        class="example-card-div col-12 col-lg-6 mx-auto expand"
        @mouseleave="displayCard(null)"
      >
        <img
          v-for="(card, index) in cardList"
          :key="index"
          :lazy-src="'assets/img/example_card/' + card + '.webp'"
          @click="displayCard($event.target)"
        />
      </div>
    </div>

    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fade-in">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">游戏指南</h2>
      <blockquote class="fs-5 px-5">
        <p class="lead">
          在本界面，可以查看游玩帮助以及进入卡片查询页面，如有更多疑问，欢迎入群讨论！
        </p>
      </blockquote>
    </div>
    <div class="row m-md-5 px-md-5 fw-bold fade-in">
      <div class="col-10 offset-1 col-lg-4 offset-lg-0">
        <div class="link-card overflow-hidden text-center shadow m-2">
          <p class="p-4 my-2 fs-5">旅者们，究竟如何扬帆起航</p>
          <div class="border-top border-2">
            <a
              class="btn btn-outline-secondary m-3 fs-5 fw-bold px-3"
              href="https://shimo.im/docs/R13j8bJ2DVUJjZk5/read"
            >
              <i class="bi bi-book me-2"></i>入门教程
            </a>
          </div>
        </div>
      </div>
      <div class="col-10 offset-1 col-lg-4 offset-lg-0">
        <div class="link-card overflow-hidden text-center shadow m-2">
          <p class="p-4 my-2 fs-5">异乡神秘旅人，于港湾共聚</p>
          <div class="border-top border-2">
            <a
              class="btn btn-outline-secondary m-3 fs-5 fw-bold px-3"
              href="cards/"
            >
              <i class="bi bi-search me-2"></i>卡片查寻
            </a>
          </div>
        </div>
      </div>
      <div class="col-10 offset-1 col-lg-4 offset-lg-0">
        <div class="link-card overflow-hidden text-center shadow m-2">
          <p class="p-4 my-2 fs-5">探究港湾内无数法则的目录</p>
          <div class="border-top border-2">
            <a
              class="btn btn-outline-secondary m-3 fs-5 fw-bold px-3"
              href="https://wiki.vupslash.icu"
            >
              <i class="bi bi-archive me-2"></i>官方百科
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-card {
  border-radius: 1rem;
}
#c1,
#c2,
#c3,
#c4 {
  transition: all 0.2s;
  opacity: 0;
}
.example-card-div {
  position: relative;
  height: 50vw;
  width: 50vw;
  max-width: 500px;
  max-height: 500px;
}
@keyframes CardRotate {
  0% {
    left: 25%;
    transform: rotate(0deg);
  }
}
@keyframes CardShuffle {
  0% {
    left: 25%;
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes CardDisplay {
  100% {
    left: 25%;
    top: 0%;
    transform: rotate(0deg);
    z-index: 2;
  }
}
@keyframes CardDisplayBack {
  0% {
    left: 25%;
    top: 0%;
    transform: rotate(0deg);
    z-index: 2;
  }
  50% {
    left: 25%;
    top: -70%;
    transform: rotate(0deg);
    z-index: 2;
  }
  51% {
    left: 25%;
    top: -70%;
    transform: rotate(0deg);
    z-index: unset;
  }
}
.example-card-div img {
  position: absolute;
  height: auto;
  width: 50%;
  top: 25%;
  transform: translateX(200px);
  cursor: pointer;
  transition: 1s all ease-in-out;
  animation: CardShuffle 0.3s ease-in-out 0s 2 alternate,
    CardShuffle 0.3s ease-in-out 0.6s 2 alternate,
    CardRotate 0.5s cubic-bezier(0.5, 1.2, 0.8, 1.1) 1.2s;
  animation-play-state: paused;
}
.example-card-div.expanded img {
  animation-play-state: running;
}
.example-card-div.expanded img.display {
  animation: CardDisplay 0.5s ease-in-out !important;
  animation-fill-mode: forwards !important;
}
.example-card-div.expanded img.display-back {
  animation: CardDisplayBack 1s ease-in-out !important;
}
.example-card-div img:nth-child(1) {
  left: -5%;
  transform: rotate(-52deg);
  opacity: 0;
  pointer-events: none;
}
.example-card-div img:nth-child(2) {
  left: 0%;
  transform: rotate(-44deg);
}
.example-card-div img:nth-child(3) {
  left: 5%;
  transform: rotate(-36deg);
}
.example-card-div img:nth-child(4) {
  left: 10%;
  transform: rotate(-28deg);
}
.example-card-div img:nth-child(5) {
  left: 15%;
  transform: rotate(-20deg);
}
.example-card-div img:nth-child(6) {
  left: 20%;
  transform: rotate(-12deg);
}
.example-card-div img:nth-child(7) {
  left: 25%;
  transform: rotate(-4deg);
}
.example-card-div img:nth-child(8) {
  left: 30%;
  transform: rotate(4deg);
}
.example-card-div img:nth-child(9) {
  left: 35%;
  transform: rotate(12deg);
}
.example-card-div img:nth-child(10) {
  left: 40%;
  transform: rotate(20deg);
}
.example-card-div img:nth-child(11) {
  left: 45%;
  transform: rotate(28deg);
}
.example-card-div img:nth-child(12) {
  left: 50%;
  transform: rotate(36deg);
}
.example-card-div img:nth-child(13) {
  left: 55%;
  transform: rotate(44deg);
}
.example-card-div img:nth-child(14) {
  left: 60%;
  transform: rotate(52deg);
  opacity: 0;
  pointer-events: none;
}
</style>
