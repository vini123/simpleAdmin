<template>
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
        <transition name="slide-fade" mode="out-in">
            <keep-alive :include="cacheRoutes">
              <component :is="Component" :key="route.path" />
            </keep-alive>
        </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
const cacheRoutes:Array<string> = []
</script>