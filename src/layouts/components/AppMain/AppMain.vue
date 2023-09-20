<template>
  <!-- px-4 py-4 全局处理。如果不想要，可以干掉 -->
  <div class="app-main">
    <div class="px-0 py-0">
      <router-view v-slot="{ Component, route }">
        <transition name="slide-fade" mode="out-in">
          <keep-alive :include="cacheRoutes">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
const cacheRoutes: Array<string> = [];
</script>
