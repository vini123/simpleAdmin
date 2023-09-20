<template>
  <div class="frame" v-loading="loading">
    <iframe :src="iframe" class="frame-iframe" ref="frameRef" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, unref, onMounted, nextTick } from "vue";

defineOptions({
  name: "FrameView",
});

const loading = ref(true);
const currentRoute = useRoute();
const iframe = ref<string>("");
const frameRef = ref<HTMLElement | null>(null);

if (unref(currentRoute.meta)?.iframe) {
  iframe.value = unref(currentRoute.meta)?.iframe as string;
}
unref(currentRoute.meta)?.frameLoading === false && hideLoading();

function hideLoading() {
  loading.value = false;
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    const _frame = iframe as any;
    if (_frame.attachEvent) {
      _frame.attachEvent("onload", () => {
        hideLoading();
      });
    } else {
      iframe.onload = () => {
        hideLoading();
      };
    }
  });
}

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.frame {
  z-index: 998;
  width: 100%;
  height: calc(100vh - var(--nav-bar-height));

  .frame-iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}

.main-content {
  margin: 2px 0 0 !important;
}
</style>
