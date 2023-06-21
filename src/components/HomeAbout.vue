<script setup lang="ts"></script>

<template>
  <div
    class="container p-4 text-center bg-dark text-white shadow fadeIn"
    id="about"
  >
    <div class="row m-3 mx-lg-6">
      <div class="col-lg-6 my-auto">
        <p class="display-5 fw-bold">小伙伴们和最新资讯</p>
        <p class="lead p-lg-4">
          尽管你可以下载游戏后独自玩，但是我们依旧非常推荐你关注我们的哔哩哔哩官方账号并加入我们的游戏交流群
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center my-2">
          <a
            class="btn rounded-pill btn-lg m-1 px-4 fw-bold"
            href="https://space.bilibili.com/699889791"
          >
            哔哩哔哩
          </a>
          <a
            class="btn rounded-pill btn-lg m-1 px-4 fw-bold"
            href="https://jq.qq.com/?_wv=1027&k=ILkjLild"
          >
            加入QQ群
          </a>
        </div>
      </div>
      <div class="col-lg-6 my-auto">
        <img class="m-2" lazy-src="assets/img/bilibili.png" height="180" />
        <img class="m-2" lazy-src="assets/img/qq.png" height="180" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#about {
  border-radius: 2em 2em 0 0;
}
</style>
