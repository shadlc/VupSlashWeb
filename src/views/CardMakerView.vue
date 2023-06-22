<script setup lang="ts">
import { type Ref, ref, onMounted, onBeforeMount, watch } from "vue";
import axios from "axios";
import * as cd from "@/components/card";
import { Card } from "@/components/card";
import { Canvas } from "@/components/canvas";
import { Mouse } from "@/components/move";

// Canvas相关变量
const width = 600;
const height = 870;
let cardCvs: Ref<Canvas>;
const card = ref(new Card());
let isCardChanged = false;
let loopTimeout = false;

// 鼠标相关变量
const mouse: Ref<Mouse> = ref(new Mouse());
let oldPortraitX = 0;
let oldPortraitY = 0;
let oldPortraitW = 0;
let oldPortraitH = 0;

// 载入数据
const characters = ref();
const parties = ref();

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
  // 重置数据
  reset(card.value);
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
  () => {
    isCardChanged = true;
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
    if (e.touches.length === 0) {
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

  // 检测屏幕宽度缩小卡片大小
  if (window.screen.width <= 500) {
    mouse.value.screenRatio = 1 / 2;
  } else {
    mouse.value.screenRatio = 2 / 3;
  }
});

// 移动立绘
function movePortrait(card: Card, mouse: Mouse) {
  if (mouse.isMoveable) {
    card.portraitX =
      oldPortraitX +
      (mouse.x - mouse.startX + (mouse.x2 - mouse.startX2)) /
        mouse.screenRatio /
        2;
    card.portraitY =
      oldPortraitY +
      (mouse.y - mouse.startY + (mouse.y2 - mouse.startY2)) /
        mouse.screenRatio /
        2;
    const distance = Math.hypot(mouse.x - mouse.x2, mouse.y - mouse.y2);
    card.portraitW = oldPortraitW * (distance / mouse.distance);
    card.portraitH = oldPortraitH * (distance / mouse.distance);
    card.portraitX += (oldPortraitW - card.portraitW) / 2;
    card.portraitY += (oldPortraitH - card.portraitH) / 2;
  } else {
    card.portraitX =
      oldPortraitX + (mouse.x - mouse.startX) / mouse.screenRatio;
    card.portraitY =
      oldPortraitY + (mouse.y - mouse.startY) / mouse.screenRatio;
  }
}
// 缩放立绘
function zoomPortrait(card: Card, event: WheelEvent) {
  if (card.portrait.isLoad) {
    const direction: number = event.deltaY;
    const oldPortraitW = card.portraitW;
    const oldPortraitH = card.portraitH;
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
function reset(card: Card) {
  card.name = "七海幽娴";
  card.nameEng = "NORA SILENT";
  card.label = "幽海鸢行";
  card.party = cd.getPartyCode("鸽舍", parties.value);
  card.importPortrait("/assets/img/portrait/default.png");
  cd.setShadow(card);
  cd.setParty(card, parties.value);
  card.shadowDistance = 50;
  card.shadowType = "default";
  card.isOverflow = true;
  card.isShine = false;
  card.shineColor = "#ffffff";
  card.portraitX = -31;
  card.portraitY = 62;
  card.portraitW = 632;
  card.portraitH = 691;
  card.logoX = 30;
  card.logoY = 30;
}

// 上传配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function uploadConfig(c: Card, event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reader.onload = function (read: any) {
    event.target.value = "";
    const data = JSON.parse(read.target.result);
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
    c.importLogo("/assets/img/logo/" + c.party + ".png");
  };
}

// 下载配置
function downloadConfig(c: Card) {
  const data: { [key: string]: string | number | boolean } = {};
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

  const d = new Date();
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

// 点击HTML元素
function click(element: string) {
  const htmlElement = document.querySelector(element) as HTMLElement;
  htmlElement?.click();
}
</script>

<template>
  <div>
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

6. 特别感谢 ⌈七海幽娴⌋ 在早期为本项目提供的美术支持，因此设为模板。</pre
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
          v-if="characters && parties"
        >
          <div class="center">
            <div class="col-12 fw-bold my-2 center border-vup">
              <span>角色立绘</span>
            </div>
            <div class="col-12 fw-bold my-2 center">
              <a class="btn btn-portrait" @click="click('#import-portrait')">
                上传自定义立绘
              </a>
            </div>
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
              <input
                class="input-coord"
                type="number"
                v-model="card.portraitX"
              />
              <input
                class="input-coord"
                type="number"
                v-model="card.portraitY"
              />
            </div>
            <div class="input-group">
              <span class="input-group-text">立绘尺寸</span>
              <input
                class="input-size"
                type="number"
                v-model="card.portraitW"
              />
              <input
                class="input-size"
                type="number"
                v-model="card.portraitH"
              />
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
                  <input
                    class="input-coord"
                    type="number"
                    v-model="card.logoX"
                  />
                  <input
                    class="input-coord"
                    type="number"
                    v-model="card.logoY"
                  />
                </div>
                <div class="input-group">
                  <span class="input-group-text">尺寸</span>
                  <input
                    class="input-size"
                    type="number"
                    v-model="card.logoW"
                  />
                  <input
                    class="input-size"
                    type="number"
                    v-model="card.logoH"
                  />
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
            <a class="btn" @click="reset(card)">重置配置</a>
            <a class="btn btn-save" @click="downloadCard(card)">保存卡片</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#card_maker {
  justify-content: space-around;
}
#card_view {
  width: 420px;
  padding: 30px 10px;
}
@media only screen and (max-width: 500px) {
  #card_view {
    transform: scale(0.75, 0.75);
  }
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
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23f8f9fa%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e");
  color: #f8f9fa;
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
  border-image: -webkit-linear-gradient(
      to right,
      #212529 10%,
      #fafafa,
      #212529 90%
    )
    20 20;
  border-image: linear-gradient(to right, #212529 10%, #fafafa, #212529 90%) 20
    20;
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 600px;
    margin: 1.75rem auto;
  }
}
</style>
