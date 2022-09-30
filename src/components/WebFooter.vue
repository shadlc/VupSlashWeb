<script setup lang="ts">
import { onMounted } from "vue";

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thanks: Array<any>;
}>();

onMounted(() => {
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
</script>

<template>
  <footer class="container-fluid bg-dark p-4 pb-0 shadow">
    <div class="row align-items-center justify-content-center">
      <div class="col-lg-6 offset-lg-1">
        <h2 class="fw-bold">关于我们</h2>
        <p class="fs-5 mx-4">
          正如你看到的这样，我们为我们所热爱的事物创作不一样的玩法，如果你也有能力、有意愿，欢迎加入我们一起观测，一起创作！
        </p>
        <h5 class="fw-bold" title="ヾ(≧▽≦*)o感谢一路上有你">鸣谢</h5>
        <p class="mx-4" v-if="thanks">
          <span
            v-for="(thank, index) in thanks"
            :key="index"
            :title="thank.about + ' ' + thank.reason"
          >
            {{ thank.name }} |
          </span>
        </p>
      </div>
      <div
        class="row col-lg-3 offset-lg-2 text-lg-start justify-content-center"
      >
        <div class="col-12">
          <a class="fs-4" href="https://space.bilibili.com/699889791">
            <img class="me-2" lazy-src="assets/img/bilibili.svg" />哔哩哔哩
          </a>
        </div>
        <div class="col-12">
          <a
            class="fs-4"
            href="https://github.com/meng-long-shao-zhu/VupSlash_V0"
          >
            <img class="me-2" lazy-src="assets/img/github.svg" />游戏主体
          </a>
        </div>
        <div class="col-12">
          <a class="fs-4" href="https://github.com/shadlc/VupSlashWeb">
            <img class="me-2" lazy-src="assets/img/github.svg" />网页项目
          </a>
        </div>
      </div>
    </div>
    <div class="w-100 row border-top p-2 mx-auto justify-content-center">
      <span class="col-lg-4">Vup杀制作组 © 2022</span>
      <a class="col-lg-4" href="https://beian.miit.gov.cn/">
        沪ICP备2021016716号
      </a>
    </div>
  </footer>
</template>

<style scoped>
a,
a:visited,
a:hover {
  color: #fbfbfd;
}

footer {
  text-align: center;
  color: #fbfbfd;
}
</style>
