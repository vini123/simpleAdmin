<template>
  <div class="px-4 py-4">
    <el-card v-loading="loading" shadow="never"  class="border-none">
      <div class="action-container">
        <el-button class="ml-[10px]" type="primary" size="small"> 添加</el-button>
        <el-button style="margin-left: 10px;" type="primary" size="small">返回上一级</el-button>
      </div>

      <el-table :data="tableData" class="w-full mt-5">
        <el-table-column width="90" label="icon" prop="icon" />

        <el-table-column label="显示名称" prop="title" />

        <el-table-column label="路由名称" prop="name" />

        <el-table-column label="路由" prop="path" />

        <el-table-column label="组件" prop="component">
          <template #default="scope">
            <span v-if="scope.row.component">{{ scope.row.component }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="链接" prop="link">
          <template #default="scope">
            <span v-if="scope.row.link">{{ scope.row.link }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="iframe" prop="iframe">
          <template #default="scope">
            <span v-if="scope.row.iframe">{{ scope.row.iframe }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="重定向" prop="redirect">
          <template #default="scope">
            <span v-if="scope.row.redirect">{{ scope.row.redirect }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column width="60" label="hidden" prop="hidden" />

        <el-table-column width="60" label="keep alive" prop="keep_alive" />
        
        <el-table-column width="60" label="always show" prop="always_show" />

        <el-table-column width="60" label="排序" prop="order" />

        <el-table-column width="60" label="父 id" prop="parent_id" />

        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template #default>
            <el-button size="small" type="text">子权限</el-button>
            <el-button size="small" type="text">编辑</el-button>
            <el-button size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="mt-5" background hide-on-single-page layout="prev, pager, next" :total="total" :page-size="req.limit" v-model:current-page="req.page" @current-change="fetchData" />
    </el-card>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { getPermissions } from '@/api/system/permission'

const loading = ref<boolean>(false)
  
const total = ref<number>(0)

const req = reactive<ParentPaginateReq>({
  page: 1,
  limit: 30,
  parent_id: undefined
})

const tableData = ref<Array<any>>([])

onBeforeMount(function() {
    fetchData()
})

function fetchData() {
    if (loading.value) {
        return
    }
    
    loading.value = true

    const data = { ... req }
    getPermissions(data).then((res:Record<string, any>) => {
      loading.value = false

      if (res && res.data) {
        tableData.value = res.data
      }

      total.value = res.total
    }).catch(() => {
      loading.value = false
    })
}
</script>