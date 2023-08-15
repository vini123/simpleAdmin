<template>
  <div class="layout-container" :class="{'sidebar-collapse': app.collapse === 'true'}">
    <SideBar />
    
    <div class="main-container">
      <NavBar />
  
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './components/SideBar/SideBar.vue'
import NavBar from './components/NavBar/NavBar.vue'
import AppMain from './components/AppMain/AppMain.vue'
import { useApp } from '@/stores/app'
const app = useApp()
</script>