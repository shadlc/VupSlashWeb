<script setup lang="ts">
import { onMounted } from "vue";
import html2canvas from "html2canvas";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

const website = window.location.origin;
defineProps<{
  card_info: {
    code: string;
    name: string;
    label: string;
    sex: string;
    race: string;
    party: string;
    power: string;
    maxPower: string;
    birthDate: string;
    designer: string;
    skillName1: string;
    skill1: string;
    skillName2: string;
    skill2: string;
    skillName3: string;
    skill3: string;
    derivedSkillName1: string;
    derivedSkill1: string;
    derivedSkillName2: string;
    derivedSkill2: string;
    notion: string;
    featureName1: string;
    feature1: string;
    featureName2: string;
    feature2: string;
  };
}>();

onMounted(() => {
  console.log(html2canvas.length);
});
</script>

<template>
  <div class="center">
    <vue-qr
      class="qrcode"
      :text="website + '/cards#' + $props.card_info.code"
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
