<template>
  <div class="side-bar flex flex-col">
    <div class="w-full logo">
      <router-link class="flex items-center w-full" :class="{'justify-center': app.sidebarCollapse, 'px-3': !app.sidebarCollapse }" :title="appTitle" :to="'/'">
        <img v-if="app.logo" :src="app.logo" :alt="appTitle" />
        <img v-else :src="logo" :alt="appTitle" />
        <span v-if="!app.sidebarCollapse" class="title">{{ appTitle }}</span>
      </router-link>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        router
        unique-opened
        mode="vertical"
        :collapse="app.sidebarCollapse"
        :default-active="defaultActive"
        :collapse-transition="false"
      >
        <side-bar-item
            v-for="sidebar in app.menus"
            :key="sidebar.path"
            :item="sidebar"
            :base-path="sidebar.path"
            class="outer-most select-none"
        />
      </el-menu> 
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';
import { useApp } from '@/stores/app'
import SideBarItem from './SideBarItem.vue'
import logo from '@/assets/image/logo.png'

const app = useApp()
const route = useRoute()
const defaultActive = computed(() => {
    if (route.meta.hidden) {
      let index = route.path.lastIndexOf('/')
      return route.path.substring(0, index)
    }
    return (route.meta?.activePath) ? route.meta.activePath.toString(): route.path
  }
);

const appTitle = computed(():string => {
  if (app.title) {
    return app.title
  }
  return import.meta.env.VITE_APP_TITLE
})

onMounted(() => {
  window.addEventListener('resize', resizeHandler)

  resizeHandler()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})

function resizeHandler() {
  if (!document.hidden) {
    const isPhone:boolean = document.body.getBoundingClientRect().width < 992
    if (isPhone) {
      app.setData({collapse: true, isPhone})
    } else {
      app.setData({collapse: false, isPhone})
    }
  }
}
</script>