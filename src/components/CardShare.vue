<script setup lang="ts">
import { onMounted } from "vue";
import html2canvas from "html2canvas";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

defineProps<{
  card_info: { url: string; id: string };
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
  <div class="center">
    <vue-qr
      class="qrcode"
      :text="$props.card_info.url + '/cards#' + $props.card_info.id"
      :correctLevel="3"
      :margin="30"
      :size="1000"
      colorDark="#131e2f"
      colorLight="#f8f8f8"
      logoSrc="/assets/img/vupslash.png"
      :logoScale="0.6"
      logoBackgroundColor="#00000000"
    />
  </div>
</template>

<style scoped>
.qrcode {
  height: 200px;
  width: 200px;
}
</style>
