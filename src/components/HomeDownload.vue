<script setup lang="ts"></script>

<template>
  <div class="container p-5 border-top border-2 text-center" id="download">
    <div class="row my-5 fadeIn">
      <p class="display-5 fw-bold">游戏下载</p>
    </div>
    <div class="row my-5">
      <div class="fadeIn my-5">
        <p class="fs-2 fw-bold">
          <i class="bi bi-windows"></i>
          Windows平台 Vup杀启动器
        </p>
        <p class="lead fw-bold">无需繁琐的安装步骤</p>
        <p class="lead fw-bold">下载后即可自动安装</p>
      </div>
      <div id="carousel-launcher" class="col-12 col-lg-6 fadeIn">
        <div
          id="Carousel"
          class="carousel carousel-dark carousel-fade slide pointer-event"
          data-bs-ride="carousel"
        >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#Carousel"
              data-bs-slide-to="0"
              aria-label="Slide 1"
              class="active"
              aria-current="true"
            />
            <button
              type="button"
              data-bs-target="#Carousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#Carousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            />
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                class="img-fluid mb-5"
                lazy-src="/assets/img/launcher_main.png"
              />
            </div>
            <div class="carousel-item">
              <img
                class="img-fluid mb-5"
                lazy-src="/assets/img/launcher_theme.png"
              />
            </div>
            <div class="carousel-item">
              <img
                class="img-fluid mb-5"
                lazy-src="/assets/img/launcher_install.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 offset-lg-2">
        <div class="m-3 d-md-flex justify-content-md-center fadeIn">
          <a
            class="btn px-3 rounded-pill btn-lg"
            href="https://gitee.com/shadlc/vup-slash-launcher/attach_files/986121/download/VSL_v1.2.2.exe"
          >
            下载最新版(444KB)
          </a>
        </div>
        <div class="row fadeIn">
          <div>下载启动器后请按照提示安装游戏</div>
          <div>请为游戏预留约500MB的磁盘空间</div>
        </div>
        <ul class="p-lg-4 list-group list-group-flush">
          <li class="list-group-item fadeIn">流畅丝滑的过渡动画</li>
          <li class="list-group-item fadeIn">迅速稳定的更新下载</li>
          <li class="list-group-item fadeIn">多线程任务处理程序</li>
          <li class="list-group-item fadeIn">合理优化的语言提示</li>
          <li class="list-group-item fadeIn">
            源代码
            <a
              class="mt-2 mb-5 text-body"
              href="https://gitee.com/shadlc/vup-slash-launcher"
            >
              <img class="me-1" lazy-src="/assets/img/gitee.svg" />更新日志
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="row my-5 fadeIn">
      <p class="my-5 fs-2 fw-bold">其他平台游玩</p>
      <p class="lead my-5 fw-bold">o((&#62;ω&#60; ))o 敬请期待啦...</p>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  background-color: #fafafa;
}
#carousel-launcher {
  display: flex;
  align-items: center;
}
</style>
