<template lang="pug">
Layer(:layers="cps")
  .overflow-hidden.w-full.h-actual-screen.text-4xl.relative
    .absolute(class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2") Loading...
</template>
<script setup lang="ts">
const h = ref(window.innerHeight);
const hpx = computed(() => h.value + "px");
const onResize = () => {
  h.value = window.innerHeight;
};
window.addEventListener("resize", onResize);
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const cps = {
  index: async () => (await import("~/components/page/Index.vue")).default,
};
</script>
<style lang="scss">
.h-actual-screen {
  height: v-bind(hpx);
}
</style>
