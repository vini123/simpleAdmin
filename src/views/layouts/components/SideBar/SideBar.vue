<template>
  <div class="side-bar flex flex-col">
    <div class="w-10 h-[60px]">
      
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        router
        unique-opened
        mode="vertical"
        :collapse="isCollapse"
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

const isCollapse = computed(() => {
  return app.collapse === 'true'
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