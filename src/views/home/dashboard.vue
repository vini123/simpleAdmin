<template>
    <div class="container p-4 mx-auto">
      <h1 class="mt-4">Custom theme example (on demand)</h1>
  
      <div style="font-size: 20px">
        <el-icon> <IconEdit /></el-icon>
        <el-icon><icon-delete /> </el-icon>
        <el-icon><SvgIcon :icon="'home'" /></el-icon>
      </div>
  
      <el-row>
        <el-button @click="onClick">Default</el-button>
        <el-button type="primary" @click="onClick">Primary</el-button>
        <el-button type="success" @click="onClick">Success</el-button>
        <el-button type="info" @click="onClick">Info</el-button>
        <el-button type="warning" @click="onClick">Warning</el-button>
        <el-button type="danger" @click="onClick">Danger</el-button>
      </el-row>
  
      <el-radio-group v-model="radioVal">
        <el-radio-button label="New York" />
        <el-radio-button label="Washington" />
        <el-radio-button label="Los Angeles" />
        <el-radio-button label="Chicago" />
      </el-radio-group>
  
      <div>
        <el-switch v-model="switchVal" />&nbsp;
        <el-switch
          v-model="switchVal"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </div>
  
      <div>
        <span @click.stop="toggleDark()">暗黑模式</span>
        <el-switch size="small" v-model="isDark" />
      </div>
  
      <div>
        <el-select>
          <el-option value="test">test</el-option>
        </el-select>
        &nbsp;
        <el-date-picker />
      </div>
  
      <el-slider v-model="sliderVal" />
  
      <p>
        It is a example built by vite.&nbsp; More info see
        <a
          href="https://github.com/element-plus/unplugin-element-plus"
          target="_blank"
          >unplugin-element-plus</a
        >.
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  import { useDark, useToggle } from '@vueuse/core'
   
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  
  const radioVal = ref('New York')
  const switchVal = ref(true)
  const sliderVal = ref(50)
  
  function onClick() {
    ElNotification({
      type: 'success',
      title: '已成功发送邮件',
      message: '验证码区分大小写，有效期5分钟',
      duration: 3000,
    })
  }
  </script>
  
  <style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items:center;
    min-height: calc(100vh - var(--nav-bar-height) - 100px);
  }
  
  a {
    color: var(--el-color-primary);
    text-decoration: none;
  }
  </style>
  