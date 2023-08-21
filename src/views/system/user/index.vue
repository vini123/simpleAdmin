<template>
    <div class="px-4 py-4">
      <el-card v-if="initialized" v-loading="loading" shadow="never" class="border-none">
      <div class="flex items-center">
        <el-input v-model="req.phone" class="ml-auto mr-2 w-[150px]" placeholder="请输入手机号码" />
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </div>
  
      <el-table :data="tableData" class="w-full mt-5">
        <el-table-column label="头像" prop="avatar" width="80">
          <template #default="scope">
            <el-avatar :size="50" :src="scope.row.avatar" />
          </template>
        </el-table-column>

        <el-table-column label="Id" prop="viewid" width="120" />

        <el-table-column label="昵称" prop="nickname" />

        <el-table-column label="注册来源" prop="referer_str" width="120" />

        <el-table-column label="性别" prop="gender_str" width="80" />

        <el-table-column label="手机号码" prop="phone" width="150" />

        <el-table-column label="微信" prop="wechat" width="150" />

        <el-table-column label="邮箱" prop="email" />

        <el-table-column label="cid" prop="cid" />

        <el-table-column label="注册 ip" prop="register_ip" width="150" />

        <el-table-column label="签名" prop="signature">
          <template #default="scope">
            <span v-if="!scope.row.signature">-</span>
            <span v-else-if="scope.row.signature.length < 20">{{ scope.row.signature }}</span>
            <el-tooltip v-else :content="scope.row.signature" placement="top-end">
              <span>{{ scope.row.signature.substr(0, 20) + '…' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="created_at" />

        <el-table-column v-if="includes(app.routeNames, ['user.role'])" label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button v-if="includes(app.routeNames, ['user.role'])" size="small" type="primary" text @click="goSet(scope.row)">设置角色</el-button>
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
  import { getUsers } from '@/api/system/user'
  import { includes } from '@/utils/utils'

  interface UserReq extends PaginateReq {
    phone?: number
  }

  const initialized = ref<boolean>(false)
  
  const loading = ref<boolean>(false)

  const router = useRouter()

  const app = useApp()
  
  const total = ref<number>(0)
  
  const req = reactive<UserReq>({
    page: 1,
    limit: 30,
    phone: undefined
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
    if (!data.phone) {
      delete data.phone
    }

    getUsers(data).then((res:Record<string, any>) => {
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

function goSet(value:any):void {
  if (value && value.id) {
    router.push({name: 'user.role', query: { user_id: value.id}})
  }
}
</script>