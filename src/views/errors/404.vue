<template>
  <div class="error-container">
     <div class="bg-404"></div>
     <div class="text-404">404</div>
     <div class="text-desc">路已尽，踏遍万水千山，不如归去。</div>
     <div class="text-back" @click="home">返回首页</div>
  </div>
</template>

<script setup lang="ts">
function home() {
  window.location.href = '/'
}
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.bg-404 {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -10;
      zoom: 1;
      background-color: #fff;
      background-image: url("../../assets/image/bg-404.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center 0;
}

.bg-404:after {
  position: absolute;
  left: 0;
  top: 0;
  content: '';
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
}

.text-404 {
  font-size: 200px;
  color: #fff;
  font-weight: 300;
}

.text-desc {
  font-size: 36px;
  font-weight: 300;
  color: #fff;
}

.text-back {
  font-size: 22px;
  box-sizing: border-box;
  padding: 10px 38px;
  font-weight: 300;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 8px;
  margin-top: 36px;
  cursor: pointer;
  transition: all 0.3s;
}

.text-back:hover {
  background-color: rgba(255,255,255,0.3);
}
</style>