<template>
  <div class="flex justify-center items-center" @click="home">
     not found , 点击回首页
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function home() {
  router.push({path: '/'})
}
</script>