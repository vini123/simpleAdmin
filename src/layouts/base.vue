<template>
  <div v-if="!user.adminLock" class="layout-container" :class="{'sidebar-collapse': app.sidebarCollapse, 'is-phone': app.isPhone}">
    <div v-if="app.isPhone && !app.sidebarCollapse" class="fixed w-full h-full bg-black/[.5] left-0 top-0 z-[95]" @click="doCollapse"></div>

    <SideBar />

    <div class="main-container">
      <NavBar />
  
      <AppMain />
    </div>
  </div>

  <Lock v-else />
</template>

<script setup lang="ts">
import SideBar from './components/SideBar/SideBar.vue'
import NavBar from './components/NavBar/NavBar.vue'
import Lock from './components/NavBar/Lock.vue'
import AppMain from './components/AppMain/AppMain.vue'
import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'

const app = useApp()
const user = useUser()

function doCollapse() {
  app.setData({collapse: true})
}
</script>