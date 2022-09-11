<script setup lang="ts">
defineProps<{
  versions: { [key: string]: string }[];
}>();
</script>

<template>
  <div style="height: 100vh">
    <div class="cover cover-container text-center h-100 overflow-hidden">
      <div class="title">
        <h1>
          <a class="text-decoration-none" href="">
            <span class="vup">VUP</span><span class="sha">杀</span>
          </a>
          <a
            v-if="versions[0].version != ''"
            :href="versions[0].notice_url"
            class="badge title-badge bg-white text-dark align-top fs-6 text-decoration-none d-none d-sm-inline"
            title="点击查看最新版本资讯"
          >
            {{ versions[0].version }}
          </a>
        </h1>
      </div>
      <p class="fs-3 p-2">虚拟主播与三国杀的奇妙相遇</p>
    </div>
    <div id="down_arrow">
      <a href="#introduce">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
  </div>
</template>

<style scoped>
a,
a:visited,
a:hover {
  color: #fbfbfd;
}

.cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fbfbfd;
  background: transparent;
}

@keyframes TitleMove {
  from {
    height: 100%;
  }
  to {
    height: 50%;
  }
}
.title {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: TitleMove 1.5s cubic-bezier(0.5, 0, 0.5, 1.2) 1s;
  animation-fill-mode: forwards;
}
.title > h1 {
  font-size: calc(2rem + 6vw);
  white-space: nowrap;
  padding: 50% 0;
}

.title-badge {
  position: absolute;
  margin-left: 1rem;
  padding: 0.3em;
}

@keyframes Down {
  50% {
    top: 0%;
  }
}

@keyframes Show {
  from {
    opacity: 0;
  }
  to {
    opacity: 100;
  }
}

#down_arrow {
  position: relative;
  width: 36px;
  top: -14em;
  opacity: 0;
  margin: 0 auto;
  animation: Show 1s ease 2.5s 1;
  animation-fill-mode: forwards;
}
#down_arrow span {
  background: #ddd;
}
#down_arrow span:nth-child(1) {
  position: absolute;
  width: 8px;
  height: 24px;
  left: 8px;
  top: 0;
  transform: rotate(-45deg);
  animation: Down 2s ease infinite;
}
#down_arrow span:nth-child(2) {
  position: absolute;
  width: 8px;
  height: 24px;
  left: 20px;
  top: 0;
  transform: rotate(45deg);
  animation: Down 2s ease infinite;
}
#down_arrow span:nth-child(3) {
  position: absolute;
  width: 8px;
  height: 24px;
  left: 8px;
  top: 16px;
  transform: rotate(-45deg);
  animation: Down 2s ease infinite;
}
#down_arrow span:nth-child(4) {
  position: absolute;
  width: 8px;
  height: 24px;
  left: 20px;
  top: 16px;
  transform: rotate(45deg);
  animation: Down 2s ease infinite;
}
#down_arrow span:nth-child(5) {
  position: absolute;
  width: 8px;
  height: 24px;
  left: 8px;
  top: 32px;
  transform: rotate(-45deg);
  animation: Down 2s ease infinite;
}
#down_arrow span:nth-child(6) {
  position: absolute;
  width: 8px;
  height: 24px;
  left: 20px;
  top: 32px;
  transform: rotate(45deg);
  animation: Down 2s ease infinite;
}
</style>
