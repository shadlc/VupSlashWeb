<script setup lang="ts">
// 图片差视
window.addEventListener("scroll", avatarFloating, true);
function avatarFloating() {
  if (document.querySelector("#c1") as HTMLElement) {
    var c1 = document.querySelector("#c1") as HTMLElement;
    var c2 = document.querySelector("#c2") as HTMLElement;
    var c3 = document.querySelector("#c3") as HTMLElement;
    var c4 = document.querySelector("#c4") as HTMLElement;
    var floating_up = 400;
    var scrolls =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    floating_up = c1.offsetTop - scrolls - 200;
    if (floating_up >= 0 && floating_up <= 600) {
      c1.style.transform = "translateY(" + floating_up * 0.1 + "px)";
      c2.style.transform = "translateY(" + floating_up * 0.3 + "px)";
      c3.style.transform = "translateY(" + floating_up * 0.2 + "px)";
      c4.style.transform = "translateY(" + floating_up * 0.4 + "px)";
      c1.style.opacity = "1";
      c2.style.opacity = "1";
      c3.style.opacity = "1";
      c4.style.opacity = "1";
    }
  }
}
</script>

<template>
  <div class="container py-5" id="introduce">
    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fadeIn">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">
        「VUP杀」以三国杀为基础的卡牌游戏
      </h2>
      <blockquote class="lead fs-5 px-5">
        <p class="mb-0">本游戏是一款基于《三国杀》创作的桌游</p>
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
    <div class="my-5 text-center fadeIn">
      <img
        class="img-fluid col-lg-8 shadow"
        v-lazy="require('@/img/battle.jpg')"
      />
    </div>

    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fadeIn">
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
        class="img-fluid col-5 col-lg-2 mx-2 shadow fadeIn"
        v-lazy="require('@/img/c1.jpg')"
      />
      <img
        id="c2"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fadeIn"
        v-lazy="require('@/img/c2.jpg')"
      />
      <img
        id="c3"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fadeIn"
        v-lazy="require('@/img/c3.jpg')"
      />
      <img
        id="c4"
        class="img-fluid col-5 col-lg-2 mx-2 shadow fadeIn"
        v-lazy="require('@/img/c4.jpg')"
      />
    </div>
    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fadeIn">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">
        更多特殊卡牌
      </h2>
      <blockquote class="fs-5 px-5">
        <p class="lead">
          为了给各位旅人们带来全新体验和更多的参与感，特制诸多功能卡片
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
    <div class="text-center my-5 fadeIn">
      <img
        class="img-fluid col-12 col-lg-6"
        v-lazy="require('@/img/cards.png')"
      />
    </div>

    <div class="row mt-5 pt-5 col-lg-8 offset-lg-2 fadeIn">
      <h2 class="pb-3 display-5 fw-bold border-bottom text-center">游戏指南</h2>
      <blockquote class="fs-5 px-5">
        <p class="lead">
          在本界面，可以查看游玩帮助以及进入卡片查询页面，如有更多疑问，欢迎入群讨论！
        </p>
      </blockquote>
    </div>
    <div class="row m-md-5 px-md-5 fw-bold fadeIn">
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
              href="wiki"
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
</style>
