<template>
    <div class="px-4 py-4">
      <el-card v-if="initialized" shadow="never" class="border-none">
      <div v-if="includes(app.routeNames, ['role.create'])" class="flex items-center mb-5">
        <el-button type="primary" size="small" @click="goCreate">添加</el-button>
      </div>
  
      <el-table v-loading="loading" :data="tableData" class="w-full">
        
        <el-table-column label="名称" prop="name" />

        <el-table-column label="显示名称" prop="title" />

        <el-table-column label="创建时间" prop="created_at" />

        <el-table-column label="更新时间" prop="updated_at" />
  
  
        <el-table-column v-if="includes(app.routeNames, ['role.permission', 'role.edit', 'role.delete'])" label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button v-if="includes(app.routeNames, ['role.permission'])" size="small" type="primary" text @click="goSet(scope.row)">设置权限</el-button>
            <el-button v-if="includes(app.routeNames, ['role.edit'])" link size="small" type="primary" text @click="goEdit(scope.row)">编辑</el-button>
            <el-button v-if="includes(app.routeNames, ['role.delete'])" link size="small" type="primary" text @click="goDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination class="mt-5" background hide-on-single-page layout="prev, pager, next" :total="total" :page-size="req.limit" v-model:current-page="req.page" @current-change="fetchData" />
    </el-card>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, reactive, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useApp } from '@/stores/app'
  import { getRoles, deleteRoles } from '@/api/system/role'
  import { includes } from '@/utils/utils'

  const initialized = ref<boolean>(false)

  const loading = ref<boolean>(false)

  const router = useRouter()
  
  const app = useApp()
  
  const total = ref<number>(0)
  
  const req = reactive<PaginateReq>({
    page: 1,
    limit: 30,
  })
  
  const tableData = ref<Array<any>>([])
  
  onBeforeMount(function() {
    req.page = 1
  
    fetchData()
  })
  
  function fetchData() {
    if (loading.value) {
        return
    }
    
    loading.value = true
  
    const data = { ... req }
    getRoles(data).then((res:Record<string, any>) => {
      if (res && res.data) {
        tableData.value = res.data
      }
  
      total.value = res.total

      loading.value = false

      initialized.value = true
    }).catch(() => {
      loading.value = false
    })
  }
  
  function goCreate() {
    router.push({name: 'role.create'})
  }

  function goSet(value:any):void {
    if (value && value.id) {
      router.push({name: 'role.permission', query: { id: value.id}})
    }
  }

  function goEdit(value:any):void {
    if (value && value.id) {
      router.push({name: 'role.edit', query: { id: value.id}})
    }
  }
  
  function goDelete(value:any):void {
    if (value && value.id) {
      ElMessageBox.confirm(
        '确认删该除角色吗？',
        '',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        if (loading.value) {
          return
        }
  
        loading.value = true
  
        deleteRoles({id: value.id}).then(() => {
          loading.value = false

          fetchData()
  
          ElNotification({
              type: 'success',
              title: '',
              message: '角色已删除',
              duration: 3000,
          })
        })
      }).catch(() => {
        
      })
    }
  }
  </script>