<script setup lang="ts">
import BatchDownloader from "@/components/BatchDownloader.vue";
import { Ref, ref, onMounted, onBeforeMount, watch } from "vue";
import axios from "axios";
import * as cd from "../components/card";
import { Card } from "../components/card";
import { Canvas } from "../components/canvas";
import { Mouse } from "../components/move";

// Canvas相关变量
const width = 600;
const height = 870;
let cardCvs: Ref<Canvas>;
let card = ref(new Card());
let isCardChanged = false;
let loopTimeout = false;
let isBatch = false;

// 鼠标相关变量
const mouse: Ref<Mouse> = ref(new Mouse());
let oldPortraitX = 0;
let oldPortraitY = 0;
let oldPortraitW = 0;
let oldPortraitH = 0;

// 载入数据
let characters = ref();
let parties = ref();
let cardList = ref();
let cardListDefault = ref();

// 挂载前读取数据
onBeforeMount(async () => {
  await axios
    .get("https://api.vupslash.icu/json/character_list/")
    .then((respond) => {
      characters.value = respond.data;
    });
  await axios
    .get("https://api.vupslash.icu/json/party_list/")
    .then((respond) => {
      parties.value = respond.data;
    });
  await axios
    .get("https://api.vupslash.icu/json/card_list/")
    .then((respond) => {
      cardList.value = respond.data;
      cardListDefault.value = JSON.parse(JSON.stringify(cardList.value));
    });

  // 默认选择七海幽娴
  card.value.code = "qihaiyouxian_zhuangzhilingyun";
  cd.setCard(card.value, cardList.value, parties.value);
});

// 监听缩放
watch(
  () => [
    card.value.portraitW,
    card.value.portraitH,
    card.value.portraitX,
    card.value.portraitY,
  ],
  () => {
    card.value.portraitW = Math.round(Math.abs(card.value.portraitW)) ?? 0;
    card.value.portraitH = Math.round(Math.abs(card.value.portraitH)) ?? 0;
    card.value.portraitX = Math.round(card.value.portraitX) ?? 0;
    card.value.portraitY = Math.round(card.value.portraitY) ?? 0;
  }
);

// 监听卡牌参数改变
watch(
  () => JSON.parse(JSON.stringify(card.value)),
  (n, o) => {
    isCardChanged = true;
    if (n.code != o.code) {
      cd.setCard(card.value, cardList.value, parties.value);
    }
    if (isBatch && n.code == o.code) {
      syncConfigList(cardList, card.value);
    }
  },
  { deep: true }
);

// 监听立绘移动
function moveListen(cvs: HTMLCanvasElement, card: Card, mouse: Mouse) {
  const addEL = cvs.addEventListener;
  addEL("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  addEL("mousedown", (e) => {
    if (mouse.isDown) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      oldPortraitX = card.portraitX;
      oldPortraitY = card.portraitY;
    }
  });

  addEL("mouseup", () => {
    mouse.isDown = false;
  });

  addEL("touchmove", (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    if (e.touches.length >= 2) {
      mouse.x2 = e.touches[1].clientX;
      mouse.y2 = e.touches[1].clientY;
    }
  });

  addEL("touchstart", (e) => {
    if (mouse.isDown) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      oldPortraitX = card.portraitX;
      oldPortraitY = card.portraitY;
      if (e.touches.length >= 2) {
        mouse.isMoveable = true;
        mouse.x2 = e.touches[1].clientX;
        mouse.y2 = e.touches[1].clientY;
        mouse.startX2 = mouse.x2;
        mouse.startY2 = mouse.y2;
        mouse.distance = Math.hypot(
          mouse.startX - mouse.startX2,
          mouse.startY - mouse.startY2
        );
        oldPortraitW = card.portraitW;
        oldPortraitH = card.portraitH;
      }
    }
  });

  addEL("touchend", (e) => {
    if (e.touches.length == 0) {
      mouse.isDown = false;
    } else if (e.touches.length <= 1) {
      mouse.isMoveable = false;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      oldPortraitX = card.portraitX;
      oldPortraitY = card.portraitY;
    }
  });
}

// 动画循环
function loop() {
  if (isCardChanged || loopTimeout) {
    // 清空画布
    cardCvs.value.clear();

    // 绘制卡牌
    card.value.draw(cardCvs.value.cvs);

    // 重置变量
    isCardChanged = false;
    loopTimeout = false;
  }

  // 绘制移动
  if (card.value.portrait.isLoad && mouse.value.isDown) {
    movePortrait(card.value, mouse.value);
  }

  // 下一帧
  window.requestAnimationFrame(loop);
}

// 初始化Canvas
function initCanvas() {
  cardCvs = ref(
    new Canvas(
      document.getElementById("card_canvas") as HTMLCanvasElement,
      width,
      height
    )
  );
  moveListen(cardCvs.value.cvs, card.value, mouse.value);
}

// 挂载时初始化Canvas
onMounted(() => {
  initCanvas();
  setInterval(() => {
    loopTimeout = true;
  }, 1000);
  window.requestAnimationFrame(loop);
});

// 移动立绘
function movePortrait(card: Card, mouse: Mouse) {
  if (mouse.isMoveable) {
    card.portraitX =
      oldPortraitX +
      (((mouse.x - mouse.startX + (mouse.x2 - mouse.startX2)) / 2) * 3) / 2;
    card.portraitY =
      oldPortraitY +
      (((mouse.y - mouse.startY + (mouse.y2 - mouse.startY2)) / 2) * 3) / 2;
    let distance = Math.hypot(mouse.x - mouse.x2, mouse.y - mouse.y2);
    card.portraitW = oldPortraitW * (distance / mouse.distance);
    card.portraitH = oldPortraitH * (distance / mouse.distance);
    card.portraitX += (oldPortraitW - card.portraitW) / 2;
    card.portraitY += (oldPortraitH - card.portraitH) / 2;
  } else {
    card.portraitX = oldPortraitX + ((mouse.x - mouse.startX) * 3) / 2;
    card.portraitY = oldPortraitY + ((mouse.y - mouse.startY) * 3) / 2;
  }
}
// 缩放立绘
function zoomPortrait(card: Card, event: WheelEvent) {
  if (card.portrait.isLoad) {
    let direction: number = event.deltaY;
    let oldPortraitW = card.portraitW;
    let oldPortraitH = card.portraitH;
    if (direction < 0) {
      card.portraitW *= 1.020408;
      card.portraitH *= 1.020408;
    } else if (direction > 0) {
      card.portraitW *= 0.98;
      card.portraitH *= 0.98;
    }
    card.portraitX += (oldPortraitW - card.portraitW) / 2;
    card.portraitY += (oldPortraitH - card.portraitH) / 2;
  }
}

// 更改角色
function changeCharacter(card: Card) {
  cd.setCard(card, cardList.value, parties.value);
  cd.setShadow(card);
}

// 更改势力
function changeParty(card: Card, parties: [{ [key: string]: string }]) {
  cd.setParty(card, parties);
}
// 更改阴影
function changeShadow(card: Card) {
  cd.setShadow(card);
}

// 上传立绘
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function changePortrait(card: Card, event: any) {
  const url: string = URL.createObjectURL(event.target.files[0]);
  card.importPortrait(url, card);
  card.code = "custom";
  event.target.value = "";
}

// 上传势力图标
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function changeLogo(card: Card, event: any) {
  const url: string = URL.createObjectURL(event.target.files[0]);
  card.importLogo(url, card);
  card.party = "custom";
  event.target.value = "";
}

// 下载卡牌
function downloadCard(card: Card) {
  const link = document.createElement("a");
  const fileName = card.label + " " + card.name + ".png";
  link.setAttribute("download", fileName);
  cardCvs.value.cvs.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.click();
    }
  });
}

// 重置配置
function reset(card: Card, event: MouseEvent) {
  if (event.shiftKey) {
    cardList.value = JSON.parse(JSON.stringify(cardListDefault.value));
    cd.setCard(card, cardListDefault.value, parties.value);
  } else if (card.code != "custom" && card.code != "undefined") {
    let d = cardListDefault.value[card.code];
    cd.setCard(card, cardListDefault.value, parties.value);
    cd.setParty(card, parties.value);
    card.shadowType = d.shadowType;
    card.isOverflow = d.isOverflow;
    card.isShine = d.isShine;
    card.shineColor = d.shineColor;
    card.portraitX = d.portraitX;
    card.portraitY = d.portraitY;
    card.portraitW = d.portraitW;
    card.portraitH = d.portraitH;
    card.logoX = 30;
    card.logoY = 30;
  } else {
    card.code = "qihaiyouxian_zhuangzhilingyun";
    cd.setCard(card, cardList.value, parties.value);
  }
}

// 上传配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function uploadConfig(c: Card, event: any) {
  const file = event.target.files[0];
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reader.onload = function (read: any) {
    event.target.value = "";
    let data = JSON.parse(read.target.result);
    c.code = data.code ?? "undefined";
    c.name = data.name ?? "未知名称";
    c.nameEng = data.nameEng ?? "undefined";
    c.label = data.label ?? "未知称号";
    c.party = data.party ?? "undefined";
    c.shadowType = data.shadowType ?? "default";
    c.isShine = data.isShine ?? "false";
    c.isOverflow = data.isOverflow ?? "true";
    c.shadowDistance = data.shadowDistance ?? "50";
    c.portraitX = data.portraitX ?? "0";
    c.portraitY = data.portraitY ?? "0";
    c.portraitW = data.portraitW ?? "700";
    c.portraitH = data.portraitH ?? "700";
    c.logoX = data.logoX ?? "30";
    c.logoY = data.logoY ?? "30";
    c.logoW = data.logoW ?? "100";
    c.logoH = data.logoH ?? "100";
    c.themeColor = data.themeColor ?? "#999999";
    c.shineColor = data.shineColor ?? "#000000";
    c.nameColor = data.nameColor ?? "#000000";
    c.labelColor = data.labelColor ?? "#dddddd";
    c.borderColor = data.borderColor ?? "#333333";
    c.importPortrait(
      "http://static.vupslash.icu/img/portrait/" + c.code + ".png"
    );
    c.importLogo("http://static.vupslash.icu/img/logo/" + c.party + ".png");
  };
}

// 下载配置
function downloadConfig(c: Card) {
  let data: { [key: string]: string | number | boolean } = {};
  data.code = c.code;
  data.name = c.name;
  data.nameEng = c.nameEng;
  data.label = c.label;
  data.party = c.party;
  data.shadowType = c.shadowType;
  data.isShine = c.isShine;
  data.isOverflow = c.isOverflow;
  data.shadowDistance = c.shadowDistance;
  data.portraitX = c.portraitX;
  data.portraitY = c.portraitY;
  data.portraitW = c.portraitW;
  data.portraitH = c.portraitH;
  data.logoX = c.logoX;
  data.logoY = c.logoY;
  data.logoW = c.logoW;
  data.logoH = c.logoH;
  data.themeColor = c.themeColor;
  data.shineColor = c.shineColor;
  data.nameColor = c.nameColor;
  data.labelColor = c.labelColor;
  data.borderColor = c.borderColor;

  let d = new Date();
  const time = d.toLocaleDateString();
  const content =
    "data:text/Json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  const fileName = c.label + "_" + c.name + "_" + time + ".json";
  link.setAttribute("download", fileName);
  link.setAttribute("href", content);
  link.click();
}

// 批量制卡上传配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function uploadConfigBatch(card: Card, event: any) {
  const file = event.target.files[0];
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reader.onload = function (read: any) {
    event.target.value = "";
    let input = JSON.parse(read.target.result);
    if (input["qihaiyouxian_zhuangzhilingyun"]) {
      cardList.value = input;
      cd.setCard(card, cardList.value, parties.value);
    } else {
      alert("导入失败！请上传批量制卡配置文件");
    }
  };
}
// 批量制卡下载配置
function downloadConfigBatch() {
  let d = new Date();
  const time = d.toLocaleDateString();
  const content =
    "data:text/Json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(cardList.value, null, 2));
  const link = document.createElement("a");
  const fileName = "VupSlashCardList_" + time + ".json";
  link.setAttribute("download", fileName);
  link.setAttribute("href", content);
  link.click();
}
// 批量制卡同步到配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function syncConfigList(cardList: Ref<any>, card: Card) {
  if (cardList.value[card.code]) {
    let d = cardList.value[card.code];
    d.name = card.name;
    d.nameEng = card.nameEng;
    d.label = card.label;
    d.party = cd.getPartyName(card.party, parties.value);
    d.shadowType = card.shadowType;
    d.isShine = card.isShine;
    d.isOverflow = card.isOverflow;
    d.shadowDistance = card.shadowDistance;
    d.portraitX = card.portraitX;
    d.portraitY = card.portraitY;
    d.portraitW = card.portraitW;
    d.portraitH = card.portraitH;
    d.shineColor = card.shineColor;
  }
}

// 点击HTML元素
function click(element: string) {
  const htmlElement = document.querySelector(element) as HTMLElement;
  htmlElement?.click();
}

// 更改精修和批量
function toggleMaker(maker: string) {
  let single = document.querySelector("#single_editor") as HTMLElement;
  let batch = document.querySelector("#batch_editor") as HTMLElement;
  let singleBtn = document.querySelector(
    ".list-group li:nth-child(1)"
  ) as HTMLElement;
  let batchBtn = document.querySelector(
    ".list-group li:nth-child(2)"
  ) as HTMLElement;
  if (maker == "single") {
    isBatch = false;
    singleBtn.classList.add("active");
    batchBtn.classList.remove("active");
    single.classList.remove("hide");
    batch.classList.add("hide");
  } else if (maker == "batch") {
    isBatch = true;
    if (card.value.code == "custom") card.value.code = "undefined";
    if (card.value.party == "custom") card.value.party = "undefined";
    singleBtn.classList.remove("active");
    batchBtn.classList.add("active");
    single.classList.add("hide");
    batch.classList.remove("hide");
  }
}
</script>

<template>
  <div class="p-5 text-center" id="title">
    <h1>
      <a class="link-light text-decoration-none fw-bold display-5" href="">
        卡牌制作器
      </a>
      <span
        class="btn btn-primary btn-help"
        data-bs-toggle="modal"
        data-bs-target="#modal-help"
      >
        ?
      </span>
    </h1>
    <div class="modal fade" id="modal-help">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white shadow-lg rounded-1rem">
          <div class="modal-header border-vup p-2">
            <h4 class="modal-title mx-auto">注意事项</h4>
          </div>
          <pre class="modal-body text-start">
1. 自定义立绘建议使用700*700大小带的透明背景图片(.png)，自定义势力图标建议使用100*100大小。

2. 使用鼠标拖拽卡牌预览处移动立绘，滚轮缩放立绘；触屏设备单指移动立绘，双指缩放立绘。

3. 输入文字之前使用[^]符号生成大一号文字，使用[_]符号生成小一号文字(如"中^大_小"将生成中等字号的"中"，大字号的"大"，小字号的"小")。

4. 本工具为开源项目，此制作器内用户数据的上传与处理完全运行在本地，无服务器交互，请放心食用。

5. 此工具为VUP杀官方平台工具，除其自带数据外，对任何缘由在使用此工具时产生的对用户自己或别人造成的任何形式的损失和损害不担当责任。

6. 特别感谢 ⌈七海幽娴⌋ 在早期为本项目提供的美术支持，因此设为默认角色。</pre
          >
          <div class="modal-footer p-2 border-0 mx-auto">
            <button type="button" class="btn" data-bs-dismiss="modal">
              已阅
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <ul class="list-group list-group-horizontal mx-4 mx-lg-5">
      <li class="list-group-item active">
        <a class="fs-5 fw-bold" title="精修卡牌" @click="toggleMaker('single')">
          精修卡牌
        </a>
      </li>
      <li class="list-group-item">
        <a class="fs-5 fw-bold" title="批量制卡" @click="toggleMaker('batch')">
          批量制卡
        </a>
      </li>
    </ul>
  </div>
  <div class="container-fluid text-light">
    <div
      id="card_maker"
      class="container row bg-dark p-3 mx-auto rounded-top-1rem"
    >
      <div id="card_view" class="text-center center">
        <canvas
          id="card_canvas"
          @mousedown="mouse.isDown = true"
          @touchstart.passive="mouse.isDown = true"
          @touchmove.prevent
          @wheel.prevent="zoomPortrait(card, $event)"
        ></canvas>
      </div>
      <div
        id="single_editor"
        class="row center card-editor"
        v-if="characters && parties && cardList"
      >
        <div class="center">
          <div class="col-12 fw-bold my-2 center border-vup">
            <span>角色立绘</span>
          </div>
          <div class="input-group">
            <span class="input-group-text">角色</span>
            <select
              class="form-select select-character"
              data-live-search="true"
              v-model="card.code"
              @change="changeCharacter(card)"
            >
              <option value="undefined" disabled>未知称号 未知名称</option>
              <option value="custom" disabled>自定义</option>
              <option
                v-for="(c, index) in characters"
                :key="index"
                :value="c.code"
                :disabled="Boolean(!cardListDefault[c.code])"
              >
                {{ c.label }} {{ c.name }}
              </option>
            </select>
          </div>
          <button class="btn" @click="click('#import-portrait')">
            上传立绘
          </button>
          <input
            id="import-portrait"
            type="file"
            style="display: none"
            accept="image/jpeg, image/png, image/webp, image/jpg"
            @change="changePortrait(card, $event)"
          />
          <div class="input-group">
            <span class="input-group-text">立绘可溢出边缘</span>
            <div class="div-checkbox">
              <input
                id="is-overflow"
                type="checkbox"
                v-model="card.isOverflow"
              />
              <label for="is-overflow"></label>
            </div>
          </div>
          <div class="input-group">
            <span class="input-group-text">立绘发光</span>
            <div class="div-checkbox div-shine">
              <input id="is-shine" type="checkbox" v-model="card.isShine" />
              <label for="is-shine"></label>
            </div>
            <div class="center mx-2">
              <input
                id="shine-color"
                class="input-color"
                type="color"
                v-model="card.shineColor"
                :disabled="!card.isShine"
              />
              <input
                class="input-color-text"
                type="text"
                v-model="card.shineColor"
                readonly
                @click="click('#shine-color')"
              />
            </div>
          </div>
          <div class="input-group">
            <span class="input-group-text">立绘坐标</span>
            <input class="input-coord" type="number" v-model="card.portraitX" />
            <input class="input-coord" type="number" v-model="card.portraitY" />
          </div>
          <div class="input-group">
            <span class="input-group-text">立绘尺寸</span>
            <input class="input-size" type="number" v-model="card.portraitW" />
            <input class="input-size" type="number" v-model="card.portraitH" />
          </div>
          <div class="input-group">
            <span class="input-group-text">阴影图案</span>
            <select
              class="form-select select-shadow"
              data-live-search="true"
              v-model="card.shadowType"
              @change="changeShadow(card)"
            >
              <option value="default">默认</option>
              <option value="undefined" disabled>未知</option>
            </select>
          </div>
          <div class="input-group col-12 my-2 center">
            <span class="input-group-text">阴影距离</span>
            <input
              class="input-range"
              type="range"
              min="0"
              max="100"
              step="1"
              v-model="card.shadowDistance"
            />
          </div>
        </div>
        <div class="center">
          <div class="col-12 fw-bold my-2 center border-vup">
            <span>角色信息</span>
          </div>
          <div class="input-group">
            <span class="input-group-text">角色名称</span>
            <input type="text" v-model="card.name" />
          </div>
          <div class="input-group">
            <span class="input-group-text">英文名称</span>
            <input type="text" v-model="card.nameEng" />
          </div>
          <div class="input-group">
            <span class="input-group-text">角色称号</span>
            <input type="text" v-model="card.label" />
          </div>
          <div class="input-group">
            <span class="input-group-text">角色势力</span>
            <select
              class="form-select select-party"
              v-model="card.party"
              @change="changeParty(card, parties)"
            >
              <option value="undefined" disabled>未知势力</option>
              <option value="custom">自定义</option>
              <option
                v-for="(party, index) in parties"
                :key="index"
                :value="party.code"
              >
                {{ party.name }}
              </option>
            </select>
          </div>
          <div class="center" v-if="card.party == 'custom'">
            <div class="center">
              <div class="col-12 fw-bold my-2 center border-vup">
                <span>势力图标</span>
              </div>
              <div class="input-group">
                <span class="input-group-text">坐标</span>
                <input class="input-coord" type="number" v-model="card.logoX" />
                <input class="input-coord" type="number" v-model="card.logoY" />
              </div>
              <div class="input-group">
                <span class="input-group-text">尺寸</span>
                <input class="input-size" type="number" v-model="card.logoW" />
                <input class="input-size" type="number" v-model="card.logoH" />
              </div>
              <button class="btn" @click="click('#import-logo')">上传</button>
              <input
                id="import-logo"
                type="file"
                style="display: none"
                accept="image/jpeg, image/png, image/webp, image/jpg"
                @change="changeLogo(card, $event)"
              />
            </div>
            <div class="col-12 fw-bold my-2 center border-vup">
              <span>配色</span>
            </div>
            <div class="input-group">
              <span class="input-group-text">主题颜色</span>
              <div class="center mx-2">
                <input
                  id="theme-color"
                  class="input-color"
                  type="color"
                  v-model="card.themeColor"
                />
                <input
                  class="input-color-text"
                  type="text"
                  v-model="card.themeColor"
                  readonly
                  @click="click('#theme-color')"
                />
              </div>
            </div>
            <div class="input-group">
              <span class="input-group-text">名称颜色</span>
              <div class="center mx-2">
                <input
                  id="name-color"
                  class="input-color"
                  type="color"
                  v-model="card.nameColor"
                />
                <input
                  class="input-color-text"
                  type="text"
                  v-model="card.nameColor"
                  readonly
                  @click="click('#name-color')"
                />
              </div>
            </div>
            <div class="input-group">
              <span class="input-group-text">称号颜色</span>
              <div class="center mx-2">
                <input
                  id="label-color"
                  class="input-color"
                  type="color"
                  v-model="card.labelColor"
                />
                <input
                  class="input-color-text"
                  type="text"
                  v-model="card.labelColor"
                  readonly
                  @click="click('#label-color')"
                />
              </div>
            </div>
            <div class="input-group">
              <span class="input-group-text">轮廓颜色</span>
              <div class="center mx-2">
                <input
                  id="border-color"
                  class="input-color"
                  type="color"
                  v-model="card.borderColor"
                />
                <input
                  class="input-color-text"
                  type="text"
                  v-model="card.borderColor"
                  readonly
                  @click="click('#border-color')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          <a class="btn" @click="click('#import-config')">导入配置</a>
          <input
            id="import-config"
            type="file"
            style="display: none"
            accept="application/json"
            @change="uploadConfig(card, $event)"
          />
          <a class="btn" @click="downloadConfig(card)">导出配置</a>
          <a
            class="btn"
            @click="reset(card, $event)"
            title="如需重置全部卡牌请按住Shift再点击"
          >
            重置
          </a>
          <a class="btn btn-save" @click="downloadCard(card)">保存卡片</a>
        </div>
      </div>
      <div
        id="batch_editor"
        class="row center card-editor hide"
        v-if="characters && parties && cardList"
      >
        <div class="center">
          <div class="col-12 fw-bold my-2 center border-vup">
            <span>角色立绘</span>
          </div>
          <div class="input-group">
            <span class="input-group-text">角色</span>
            <select
              class="form-select select-character"
              data-live-search="true"
              v-model="card.code"
              @change="changeCharacter(card)"
            >
              <option value="undefined" disabled>未知称号 未知名称</option>
              <option
                v-for="(c, index) in characters"
                :key="index"
                :value="c.code"
                :disabled="Boolean(!cardListDefault[c.code])"
              >
                {{ c.label }} {{ c.name }}
              </option>
            </select>
          </div>
          <a
            class="btn"
            title="如需重置全部卡牌请按住Shift再点击"
            @click="reset(card, $event)"
            >重置本卡</a
          >
          <div class="input-group">
            <span class="input-group-text">立绘可溢出边缘</span>
            <div class="div-checkbox">
              <input
                id="is-overflow2"
                type="checkbox"
                v-model="card.isOverflow"
              />
              <label for="is-overflow2"></label>
            </div>
          </div>
          <div class="input-group">
            <span class="input-group-text">立绘发光</span>
            <div class="div-checkbox div-shine">
              <input id="is-shine2" type="checkbox" v-model="card.isShine" />
              <label for="is-shine2"></label>
            </div>
            <div class="center mx-2">
              <input
                id="shine-color"
                class="input-color"
                type="color"
                v-model="card.shineColor"
                :disabled="!card.isShine"
              />
              <input
                class="input-color-text"
                type="text"
                v-model="card.shineColor"
                readonly
                @click="click('#shine-color')"
              />
            </div>
          </div>
          <div class="input-group">
            <span class="input-group-text">立绘坐标</span>
            <input class="input-coord" type="number" v-model="card.portraitX" />
            <input class="input-coord" type="number" v-model="card.portraitY" />
          </div>
          <div class="input-group">
            <span class="input-group-text">立绘尺寸</span>
            <input class="input-size" type="number" v-model="card.portraitW" />
            <input class="input-size" type="number" v-model="card.portraitH" />
          </div>
          <div class="input-group">
            <span class="input-group-text">阴影图案</span>
            <select class="form-select select-shadow" data-live-search="true">
              <option value="default">默认</option>
              <option value="undefined" disabled>未知</option>
            </select>
          </div>
          <div class="input-group col-12 my-2 center">
            <span class="input-group-text">阴影距离</span>
            <input
              class="input-range"
              type="range"
              min="0"
              max="100"
              step="1"
              v-model="card.shadowDistance"
            />
          </div>
        </div>
        <div class="center">
          <div class="col-12 fw-bold my-2 center border-vup">
            <span>角色信息</span>
          </div>
          <div class="input-group">
            <span class="input-group-text">角色名称</span>
            <input type="text" v-model="card.name" />
          </div>
          <div class="input-group">
            <span class="input-group-text">英文名称</span>
            <input type="text" v-model="card.nameEng" />
          </div>
          <div class="input-group">
            <span class="input-group-text">角色称号</span>
            <input type="text" v-model="card.label" />
          </div>
          <div class="input-group">
            <span class="input-group-text">角色势力</span>
            <select
              class="form-select select-party"
              v-model="card.party"
              @change="changeParty(card, parties)"
            >
              <option value="undefined" disabled>未知势力</option>
              <option
                v-for="(party, index) in parties"
                :key="index"
                :value="party.code"
              >
                {{ party.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="center">
          <a class="btn" @click="click('#import-config-batch')">
            导入全部配置
          </a>
          <input
            id="import-config-batch"
            type="file"
            style="display: none"
            accept="application/json"
            @change="uploadConfigBatch(card, $event)"
          />
          <a class="btn" @click="downloadConfigBatch()"> 导出全部配置 </a>
          <a
            class="btn btn-save-batch"
            data-bs-toggle="modal"
            data-bs-target="#modal-download-cards"
          >
            批量保存卡片
          </a>
          <div class="modal fade" id="modal-download-cards">
            <div class="modal-dialog modal-dialog-centered modal-xl">
              <div
                class="modal-content bg-dark text-white shadow-lg rounded-1rem"
              >
                <div class="modal-header border-vup p-2">
                  <h4 class="modal-title mx-auto fw-bold">批量下载</h4>
                </div>
                <BatchDownloader
                  :cardList="cardList"
                  :parties="parties"
                  :character="card.code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  border-radius: 1rem 1rem 0 0 !important;
  padding: 0.5rem 1.5rem;
  border-width: 2px;
  background: #212529;
  transition: all ease-in-out 0.2s;
}
.list-group-item > a {
  color: #fafafa;
  text-decoration: none;
  cursor: pointer;
}
.list-group-item:not(.active) > a:hover {
  color: #dddddd;
}
.list-group-item.active {
  border-color: transparent;
  box-shadow: 0 -3px 3px 1px #333;
  background: #212529;
  z-index: 2;
}
#card_maker {
  justify-content: space-around;
}
#card_view {
  width: 420px;
  padding: 30px 10px;
}
#card_canvas {
  width: 400px;
  border-radius: 12%/8.2%;
  box-shadow: 0 0 2vh 1vh #999;
  cursor: grab;
}
#card_canvas:active {
  cursor: move;
}
.card-editor {
  width: 500px;
}
select {
  background-color: #393e44;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='%23fafafa' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/></svg>");
  color: #f8f9fa;
}

.select-character {
  width: 17.6rem !important;
}
.select-shadow {
  width: 5.2rem !important;
}
.input-group {
  width: fit-content;
  height: 2.4rem;
  margin: 0.5rem;
  overflow: hidden;
  border-radius: 0.4rem;
  border: #f8f9fa solid 1px;
}
.input-group-text {
  padding: 0.4rem;
  color: #f8f9fa;
  background: #212529;
  border: none;
  border-right: 1px solid #fafafa;
  z-index: 10;
}
.input-group input {
  width: 8rem;
  padding: 0 0.2rem;
  color: #f8f9fa;
  background: #393e44;
  text-align: center;
  border: none;
}
.input-group input:focus-visible {
  outline: none;
}
.input-group select {
  width: 8rem;
  padding: 0 1rem;
  border: none;
}
.input-group select:hover {
  border: none;
}

.text-input {
  background: #393e44;
  color: #f8f9fa;
  height: 1.6rem;
  width: 8rem;
  font-size: 10px;
  border-radius: 0.4rem;
  border: #f8f9fa solid 1px;
  padding: 0 0.5rem;
  margin: 0.5rem;
}
.input-coord,
.input-size {
  width: 4rem !important;
}
.input-color {
  height: 1.5rem !important;
  width: 1.5rem !important;
  padding: 0 !important;
  background: #393e44;
  border-radius: 1rem;
  cursor: pointer;
  margin: auto 0;
}
.input-color-text {
  width: 5rem !important;
  margin: auto 0 auto 0.4rem !important;
  border-radius: 0.5rem;
  cursor: pointer;
}
.input-range {
  width: 8.5rem !important;
  margin: 0 1rem !important;
}
@media only screen and (max-width: 575px) {
  .input-group input {
    width: 10rem;
  }
  .input-group select {
    width: 10rem;
  }
  .select-character {
    width: 12rem !important;
  }
  .select-shadow {
    width: 10rem !important;
  }
  .input-coord,
  .input-size {
    width: 5rem !important;
  }
  .input-range {
    width: 8rem !important;
  }
  .input-color-text {
    width: 7rem !important;
  }
  .btn-save {
    margin-left: 0.5rem !important;
  }
  .btn-save-batch {
    margin-left: 0.5rem !important;
  }
  #shine-color + input {
    display: none;
  }
}
.btn-help {
  position: absolute;
  font-size: 10px;
  height: 18px;
  width: 18px;
  margin: 0 0.5rem;
  padding: 0;
  border: 1px solid white;
  border-radius: 100%;
  vertical-align: text-top;
}
.btn-save {
  margin-left: 6rem;
}
.btn-save-batch {
  margin-left: 4rem;
}

.div-shine {
  border: none;
  border-right: 1px solid #fafafa;
}
.div-checkbox {
  width: 2.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.div-checkbox input {
  display: none;
}
.div-checkbox label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 100%;
  border: 2px solid #fafafa;
  cursor: pointer;
  background: transparent;
  transition: all cubic-bezier(0, 1, 0.5, 3) 0.3s;
}

.div-checkbox input:checked + label {
  width: 1.6rem;
  height: 1.6rem;
  top: 0.35rem;
  right: 0.35rem;
}
.div-checkbox label::after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-radius: 100%;
  background: #fafafa;
  transition: all cubic-bezier(0, 1, 0.5, 2) 0.3s;
}

.div-checkbox input:checked + label::after {
  width: 0.6rem;
  height: 0.6rem;
}

.border-vup {
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, #212529 10%, #fafafa, #212529 90%) 20
    20;
  border-image: -webkit-linear-gradient(
      to right,
      #212529 10%,
      #fafafa,
      #212529 90%
    )
    20 20;
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 600px;
    margin: 1.75rem auto;
  }
}
</style>
