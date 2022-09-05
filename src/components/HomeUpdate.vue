<script setup lang="ts">
defineProps<{
  versions: { [key: string]: { [key: string]: string } };
}>();
</script>

<template>
  <div class="container py-5 border-top border-2 text-center" id="update">
    <p class="display-5 fw-bold my-5">历史更新</p>
    <div class="accordion-card my-5 mx-2 p-3 p-lg-5 bg-body shadow">
      <div class="accordion accordion-flush">
        <h3 class="pb-4 fw-bold accordion-header">版本更新</h3>
        <div
          class="accordion-item"
          v-for="(version, index) in versions"
          :key="index"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              :class="index === 0 ? '' : 'collapsed'"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#collapse' + String(index)"
              :aria-controls="String(index)"
            >
              <p class="my-auto">
                {{ version.version_name }}
                <span class="badge small bg-primary align-top">
                  {{ version.version }}
                </span>
                <span
                  class="badge small bg-success align-top"
                  v-show="index === 0"
                >
                  new
                </span>
              </p>
            </button>
          </h2>
          <div
            :id="'collapse' + String(index)"
            :class="index === 0 ? 'show' : ''"
            class="accordion-collapse collapse"
          >
            <div
              class="accordion-body row d-grid gap-3 gap-lg-0 d-md-flex mx-auto p-2 p-lg-5 px-lg-2"
            >
              <div class="col-lg-3 text-start">
                <span><i class="bi bi-clock mx-1"></i>发布日期</span>
                <span class="badge bg-secondary mx-1">
                  {{ version.update_time }}
                </span>
              </div>
              <div class="col-lg-3 text-start">
                <a :href="version.update_info">
                  <i class="bi bi-info-circle mx-1"></i>更新内容
                </a>
              </div>
              <div class="col-lg-3 text-start">
                <a :href="version.download_url">
                  <i class="bi bi-file-zip-fill mx-1"></i>游戏下载
                </a>
              </div>
              <div class="col-lg-3 text-start">
                <a :href="version.notice_url">
                  <i class="bi bi-card-text mx-1"></i>官方公告
                </a>
                <span class="badge bg-secondary mx-1">Bilibili</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="accordion-card my-5 mx-2 p-3 p-lg-5 bg-body shadow">
      <div class="accordion accordion-flush">
        <h3 class="pb-4 fw-bold accordion-header">玩法更新</h3>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#play_collapse1"
              aria-controls="play_collapse1"
            >
              <p class="my-auto">
                CP协战
                <span class="badge small bg-primary align-top">特殊模式</span>
                <span class="badge small bg-success align-top">new</span>
              </p>
            </button>
          </h2>
          <div id="play_collapse1" class="accordion-collapse collapse">
            <div
              class="accordion-body row d-grid gap-3 gap-lg-0 d-md-flex mx-auto p-2 p-lg-5 px-lg-2"
            >
              <div class="col-lg-4 offset-lg-3 text-start">
                <span><i class="bi bi-clock mx-1"></i>最后更新日期</span>
                <span class="badge bg-secondary mx-1">2022-5-6</span>
              </div>
              <div class="col-lg-4 text-start">
                <a href="scenarios/couple.html">
                  <i class="bi bi-info-circle mx-1"></i>详细内容
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#play_collapse0"
              aria-controls="play_collapse0"
            >
              <p class="my-auto">
                贴贴大作战
                <span class="badge small bg-primary align-top">特殊模式</span>
                <span class="badge small bg-warning align-top">核心玩法</span>
              </p>
            </button>
          </h2>
          <div id="play_collapse0" class="accordion-collapse collapse">
            <div
              class="accordion-body row d-grid gap-3 gap-lg-0 d-md-flex mx-auto p-2 p-lg-5"
            >
              <div class="col-lg-4 offset-lg-3 text-start">
                <span><i class="bi bi-clock mx-1"></i>最后更新日期</span>
                <span class="badge bg-secondary mx-1">2021-7-27</span>
              </div>
              <div class="col-lg-4 text-start">
                <a href="scenarios/tietiebattle.html">
                  <i class="bi bi-info-circle mx-1"></i>详细内容
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion-card {
  border-radius: 2em;
}
</style>
