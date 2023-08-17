<template>
  <div class="px-4 py-4">
    <el-card shadow="never">
      <div class="action-container">
        <el-button class="ml-[10px]" size="small" type="primary"> 添加</el-button>
        <el-button style="margin-left: 10px;" size="small" type="primary">返回上一级</el-button>
      </div>

      <el-table v-loading="loading" :data="list" class="w-full mt-5">
        <el-table-column align="left" label="权限名称" prop="name" />

        <el-table-column align="left" label="显示名称" prop="title" />

        <el-table-column width="90" align="left" label="icon" prop="icon" />

        <el-table-column align="left" label="路由" prop="path" />
      </el-table>
    </el-card>
    <router-view />
  </div>
</template>


<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { getPermissions } from '@/api/system/permission'

const loading = ref<boolean>(false)

const list = ref<Array<any>>([])

const form = {
    page: 1,
    limit: 30
}

onBeforeMount(function() {
    fetchData()
})

function fetchData() {
    if (loading.value) {
        return
    }

    const data = { ... form }
    getPermissions(data).then(res => {
        if (res && res.data) {
            list.value = res.data
        }
    })
}
</script>