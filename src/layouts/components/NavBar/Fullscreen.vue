<template>
  <div @click="toggle">
    <el-icon v-if="isFullscreen" size="20">
      <SvgIcon :icon="'exit-fullscreen'" />
    </el-icon>
    <el-icon v-else size="20">
      <SvgIcon :icon="'fullscreen'" />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
</script>
<style scoped></style>
