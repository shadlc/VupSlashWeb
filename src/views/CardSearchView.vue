<script setup lang="ts">
import axios from "axios";
import { onMounted, onBeforeMount, ref } from "vue";
import CardShare from "@/components/CardShare.vue";

const website = window.location.origin;
const characters = ref();
const characterInfo = ref();
characterInfo.value = {"code":""};
onBeforeMount(async () => {
  await axios
    .get("https://api.vupslash.icu/json/character_list/")
    .then((respond) => {
      characters.value = convertUrl(respond.data);
      characterInfo.value = characters.value[0];
    });
  // 角色数量统计
  (document.querySelector("#character_btn") as HTMLElement).innerHTML =
    "角色(" + document.querySelectorAll(".vup-card").length + ")";
  // 图片懒加载
  document.querySelectorAll("img[lazy-src]").forEach(function (item) {
    const lazyImg = item;
    const img = new Image();
    img.setAttribute("src", String(lazyImg.getAttribute("lazy-src")));
    img.onload = () => {
      lazyImg.setAttribute("src", img.src);
      lazyImg.removeAttribute("lazy-src");
    };
  });

  // 自动打开卡片
  const anchor = decodeURIComponent(window.location.hash);
  if (anchor) {
    scrollTo(anchor);
    click(anchor + ">.card>img");
  }
});

onMounted(() => {
  // 搜索
  const searchBox = document.querySelector("#search_box") as HTMLElement;
  searchBox.onkeyup = function () {
    const text = (searchBox as HTMLInputElement).value as string;
    document.querySelectorAll(".vup-card").forEach(function (item) {
      if (item.innerHTML.toLowerCase().includes(text.toLowerCase())) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
    const cardCount = document.querySelectorAll(".vup-card:not(.hide)")
      .length as number;
    if (cardCount === 0) {
      (document.querySelector(".no-card") as HTMLInputElement).classList.remove(
        "hide"
      );
    } else {
      (document.querySelector(".no-card") as HTMLInputElement).classList.add(
        "hide"
      );
    }
    const cBtn = document.querySelector("#character_btn") as HTMLElement;
    cBtn.innerHTML = "角色(" + cardCount + ")";
  };
  // 显示回到顶部按钮
  window.addEventListener("scroll", showBtn, true);
  const btnToTop = document.querySelector("#btn_to_top") as HTMLElement;
  function showBtn() {
    if (btnToTop) {
      if (window.scrollY <= 100) {
        btnToTop.style.bottom = "-100px";
      } else {
        btnToTop.style.bottom = "16px";
      }
    }
  }
});

let timeout: number;
window.onhashchange = () => {
  show();
  hideModal();
};
document.addEventListener("click", () => {
  show();
});

// 处理MarkDown链接
function convertUrl(data: unknown): unknown {
  let text = JSON.stringify(data);
  text = text.replace(
    /\[([^[\]()]*)\]\(([^[\]()]*)\)/g,
    "<a class='hyperlink' href='$2' target='_blank'>$1</a>"
  );
  text = text.replace(
    /(锁定技|限定技|觉醒技|主公技|转换技|征询技|衍生技|登场技|变身技)(?=，)/g,
    "<b>$1</b>"
  );
  return JSON.parse(text);
}

// 关闭模态框
function hideModal() {
  const modal = document.querySelector(".modal.show");
  const anchor = decodeURIComponent(window.location.hash);
  if (!anchor && modal) {
    (document.querySelector("#default_modal") as HTMLElement).click();
  }
}

// 显示卡片
function show() {
  const modal = document.querySelector(".modal.show");
  const anchor = decodeURIComponent(window.location.hash);
  if (anchor && !modal) {
    const aLink = document.getElementById(
      anchor.replace("#", "a_")
    ) as HTMLImageElement;
    aLink.click();

    const img = document.querySelector(
      aLink.getAttribute("data-bs-target") + " img[inner-src]"
    ) as HTMLElement;
    if (img) {
      img.setAttribute("src", String(img.getAttribute("inner-src")));
      img.removeAttribute("inner-src");
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const modal = document.querySelector(".modal.show");
      if (!modal) {
        history.pushState({ cards: "#" }, "", "#");
      }
    }, 200);
  }
}

// 卡片分享
function showCardShare(info: { (key: string): string }) {
  characterInfo.value = info;
}

// 记录锚点
function cardAnchor(event: MouseEvent, id: string) {
  const card = event.target as HTMLImageElement;
  card.setAttribute("src", card.src);

  if (window.location.hash !== "#" + id)
    history.pushState({ cards: "#" }, "", "#" + id);
}

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 滚动到元素
function scrollTo(id: string) {
  setTimeout(() => {
    window.location.href = id;
  }, 200);
}

// 点击元素
function click(id: string) {
  const element = document.querySelector(id) as HTMLElement;
  if (element) {
    element.click();
  }
}
</script>

<template>
  <div>
    <a id="default_modal" data-bs-toggle="modal"></a>
    <div class="p-5 center" id="title">
      <h1>
        <a class="link-light text-decoration-none fw-bold display-5" href="">
          卡牌查看器
        </a>
      </h1>
    </div>
    <a class="p-0 center" id="btn_to_top" @click="scrollToTop" title="回到顶部">
      <i class="bi bi-caret-up-fill"></i>
    </a>
    <div class="container">
      <ul class="list-group list-group-horizontal mx-4 mx-lg-5">
        <li class="list-group-item list-group-selected">
          <a class="fs-5 fw-bold" id="character_btn" title="角色"
            >角色(Loading...)</a
          >
        </li>
        <!-- <li class="list-group-item">
        <a class="fs-5 fw-bold disabled" title="此分区未开启">卡牌</a>
        </li>
        <li class="list-group-item">
          <a class="fs-5 fw-bold disabled" title="此分区未开启">模式</a>
        </li> -->
      </ul>
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
          title="检索全部角色信息"
        />
      </div>
      <div class="container bg-dark px-3 py-3 overflow-hidden">
        <div id="card_list" class="row row-cols-12 px-lg-5">
          <div class="no-card text-center hide">
            <p class="text-secondary center fs-5 fw-bold">
              哎呀，要观测的角色失踪了...
            </p>
          </div>
          <div
            class="vup-card col-md-2 col-4 p-2"
            v-for="(each, index) in characters"
            :key="index"
            :id="each.code"
          >
            <div class="card center">
              <img
                class="img-fluid"
                :lazy-src="
                  'https://gitee.com/vupslash/img/raw/master/cards/' + each.code + '.png'
                "
                src="https://gitee.com/vupslash/img/raw/master/cards/_unknown.png"
                :id="each.code"
                :alt="each.label + '&nbsp;' + each.name"
                :title="each.label + '&nbsp;' + each.name"
                @click="cardAnchor($event, each.code)"
              />
              <a
                :id="'a_' + each.code"
                data-bs-toggle="modal"
                :data-bs-target="'#modal' + index"
              ></a>
            </div>
            <div class="modal fade" :id="'modal' + index">
              <div class="modal-dialog modal-lg modal-dialog-centered">
                <div
                  class="modal-content bg-dark text-white shadow-lg rounded-1rem"
                >
                  <div class="modal-header border-3 py-1">
                    <div class="modal-title mx-auto">
                      <img
                        class="px-2 d-none d-sm-inline"
                        src="/assets/img/vup_title_border.svg"
                      />
                      <p class="m-0 p-0 fs-4 fw-bold center">角色介绍</p>
                      <img
                        class="px-2 d-none d-sm-inline"
                        src="/assets/img/vup_title_border.svg"
                      />
                    </div>
                  </div>
                  <div class="modal-body">
                    <div class="row m-sm-3">
                      <div class="col-4 p-1 p-lg-3 pb-4 mx-auto center">
                        <img
                          class="img-fluid border border-2 rounded-1rem w-100"
                          :inner-src="
                            'https://gitee.com/vupslash/img/raw/master/avatars/' +
                            each.code +
                            '.png'
                          "
                        />
                      </div>
                      <div class="px-2 col-12 col-lg-8 center">
                        <div class="px-2 fw-bold w-100">
                          <table class="table table-dark table-hover m-0">
                            <tbody>
                              <tr>
                                <td>角色</td>
                                <td>
                                  <span class="vup-label">
                                    {{ each.label }}
                                  </span>
                                  <span class="vup-name">
                                    {{ each.name }}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>性别</td>
                                <td>
                                  {{ each.sex }}
                                </td>
                              </tr>
                              <tr>
                                <td>种族</td>
                                <td>
                                  {{ each.race }}
                                </td>
                              </tr>
                              <tr>
                                <td>势力</td>
                                <td>
                                  {{ each.party }}
                                </td>
                              </tr>
                              <tr>
                                <td>最大体力</td>
                                <td :title="each.maxPower">
                                  <span v-if="each.maxPower <= 10">
                                    <span
                                      class="power"
                                      v-for="index in each.maxPower"
                                      :key="index"
                                    ></span>
                                  </span>
                                  <span v-if="each.maxPower > 10">
                                    <span class="power"></span>
                                    {{ " × " + each.maxPower }}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>体力</td>
                                <td :title="each.power">
                                  <span v-if="each.power <= 10">
                                    <span
                                      class="power"
                                      v-for="index in each.power"
                                      :key="index"
                                    ></span>
                                  </span>
                                  <span v-if="each.power > 10">
                                    <span class="power"></span>
                                    {{ " × " + each.power }}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>设计师</td>
                                <td>
                                  {{ each.designer }}
                                </td>
                              </tr>
                              <tr>
                                <td>观测日期</td>
                                <td>
                                  {{ each.birthDate }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 rounded-1rem"
                      title="技能一"
                      v-if="each.skill1"
                    >
                      <div class="col fs-5 center">
                        {{ each.skillName1 }}
                      </div>
                      <div
                        class="text col-12 col-sm-10"
                        v-html="each.skill1"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 rounded-1rem"
                      title="技能二"
                      v-if="each.skill2"
                    >
                      <div class="col fs-5 center">
                        {{ each.skillName2 }}
                      </div>
                      <div
                        class="text col-12 col-sm-10"
                        v-html="each.skill2"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 rounded-1rem"
                      title="技能三"
                      v-if="each.skill3"
                    >
                      <div class="col fs-5 center">
                        {{ each.skillName3 }}
                      </div>
                      <div
                        class="text col-12 col-sm-10"
                        v-html="each.skill3"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 rounded-1rem derived-skill"
                      title="衍生技一"
                      v-if="each.derivedSkill1"
                    >
                      <div class="col fs-5 center">
                        {{ each.derivedSkillName1 }}
                      </div>
                      <div
                        class="text col-12 col-sm-10"
                        v-html="each.derivedSkill1"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 rounded-1rem derived-skill"
                      title="衍生技二"
                      v-if="each.derivedSkill2"
                    >
                      <div class="col fs-5 center">
                        {{ each.derivedSkillName2 }}
                      </div>
                      <div
                        class="text col-12 col-sm-10"
                        v-html="each.derivedSkill2"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 rounded-1rem"
                      title="概念介绍"
                      v-if="each.notion"
                    >
                      <div class="col-12 fs-5 center">概念介绍</div>
                      <div
                        class="text col-12 fit-content"
                        v-html="each.notion"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 border-warning text-warning rounded-1rem"
                      title="角色特性"
                      v-if="each.feature1"
                    >
                      <div class="col-12 fs-5 center">
                        {{ each.featureName1 }}
                      </div>
                      <div
                        class="text col-12 fit-content"
                        v-html="each.feature1"
                      ></div>
                    </div>
                    <div
                      class="row m-2 p-2 p-lg-3 border border-2 border-warning text-warning rounded-1rem"
                      title="角色特性"
                      v-if="each.feature2"
                    >
                      <div class="col-12 fs-5 center">
                        {{ each.featureName2 }}
                      </div>
                      <div
                        class="text col-12 fit-content"
                        v-html="each.feature2"
                      ></div>
                    </div>
                  </div>
                  <div class="modal-footer border-0">
                    <div class="mx-auto">
                      <a
                        class="fw-bold mx-4 btn border-2 rounded-1rem"
                        :href="'https://wiki.vupslash.icu/' + each.name"
                        >详情</a
                      >
                      <button
                        type="button"
                        class="fw-bold mx-4 btn border-2 rounded-1rem"
                        data-bs-dismiss="modal"
                      >
                        关闭
                      </button>
                      <a
                        class="fw-bold mx-4 btn border-2 rounded-1rem"
                        data-bs-toggle="modal"
                        data-bs-target="#card_share_modal"
                        @click="showCardShare(each)"
                      >
                        分享
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="card_share_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white rounded-1rem">
          <div class="modal-header border-0">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <CardShare :card_info="characterInfo" />
          </div>
          <div class="modal-footer border-0">
            <div class="mx-auto">
               <!-- <a>{{ website + "/cards#" + characterInfo.code }}</a> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.vup-label {
  font-weight: bold;
  color: #fafafa;
  text-shadow: grey 2px 0 3px, grey 0 2px 3px, grey -2px 0 3px, grey 0 -2px 3px;
}
.vup-name {
  margin: auto 0.2em;
  font-weight: bold;
  color: #fcf271;
  text-shadow: #f69920 2px 0 3px, #f69920 0 2px 3px, #f69920 -2px 0 3px,
    #f69920 0 -2px 3px;
}
.power {
  margin: 0 0.1em;
  padding-right: 1em;
  background: url("../../public/assets/img/power.svg") no-repeat;
}
.text {
  display: block;
  height: fit-content;
  margin: auto;
}
.fit-content {
  width: fit-content;
  margin: 0 auto;
}
.talk {
  cursor: pointer;
}
</style>
<style scoped>
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
#btn_to_top:hover {
  animation: Up 0.75s ease;
}
#btn_to_top i {
  margin-bottom: 3px;
  border-radius: 100%;
  cursor: pointer;
}
#card_list {
  min-height: 54vh;
}
.no-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.input-search {
  position: absolute;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}
.list-group-item {
  border-radius: 1rem 1rem 0 0 !important;
  padding: 0.5rem 1.5rem;
  border-width: 2px;
  background: #212529;
}
.list-group-item > a {
  color: #fafafa;
  text-decoration: none;
  cursor: pointer;
}
.list-group-item > a:hover {
  color: #dddddd;
}
.list-group-selected {
  border-color: transparent;
  box-shadow: 0 -3px 3px 1px #333;
  background: #212529;
  z-index: 2;
}

.card {
  background: #fafafa;
  border: 3px solid #fafafa;
  border-radius: 10%/6%;
  overflow: hidden;
  transition: transform 0.25s ease;
}
.card:hover {
  z-index: 10;
  transform: scale(1.1, 1.1);
  box-shadow: 0 0 16px #fafafa !important;
  cursor: pointer;
}

.modal-header {
  border-image: linear-gradient(to right, #212529 10%, #fafafa, #212529 90%) 20
    20 !important;
  border-image: -webkit-linear-gradient(
      to right,
      #212529 10%,
      #fafafa,
      #212529 90%
    )
    20 20 !important;
}
.modal-title {
  display: flex;
  justify-content: center;
}
.modal-title > p {
  white-space: nowrap;
}
.modal-title > img {
  align-self: center;
  height: 1.5rem;
}
.modal-title > img:last-child {
  transform: scaleX(-1);
}
.btn-close {
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
}
.btn-close:focus {
    outline: none;
    box-shadow: none;
}

.derived-skill {
  opacity: 0.5;
  transition: all 0.5s ease-out;
}
.derived-skill:hover {
  opacity: 1;
  transition: all 0.5s ease-out;
}
.table {
  font-size: 0.8rem;
}
.table > :not(caption) > * > *:nth-child(1),
.table > :not(caption) > * > *:nth-child(2) {
  border-top-width: 1px;
}
</style>
