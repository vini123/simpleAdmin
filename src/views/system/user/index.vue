<template>
    <div class="px-4 py-4">
      <el-card v-if="initialized" v-loading="loading" shadow="never" class="border-none">
      <div class="flex items-center">
        <el-select v-model="req.role_id" placeholder="请选择角色" class="ml-auto mr-2 w-[150px]">
            <el-option v-for="(item, index) in roles" :key="index" :label="item.title" :value="item.id"></el-option>
        </el-select>

        <el-input v-model="req.phone" class="mr-2 w-[150px]" placeholder="请输入手机号码" />
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

        <el-table-column label="后台角色">
          <template #default="scope">
            <el-tag v-for="(item, index) in scope.row.roles" :key="index" class="mr-1">{{ item.title }}</el-tag>
          </template>
        </el-table-column>

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
            <el-button v-if="includes(app.routeNames, ['user.role'])" size="small" type="primary" text @click="goSetRole(scope.row)">设置角色</el-button>
            <el-button v-if="includes(app.routeNames, ['user.edit'])" size="small" type="primary" text @click="goSetPassword(scope.row)">设置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination class="mt-5" background hide-on-single-page layout="prev, pager, next" :total="total" :page-size="req.limit" v-model:current-page="req.page" @current-change="fetchData" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" :show-close="false" :destroy-on-close="true" class="max-w-[720px] min-w-[520px] rounded-xl" center>
      <div class="image-wrap">
        <el-form label-width="80px">
          <el-form-item label="昵称">
            <el-input v-model="dialog.nickname" :readonly="true" />
          </el-form-item>

          <el-form-item label="手机号码">
            <el-input v-model="dialog.phone" :readonly="true" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="dialog.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>

          <el-form-item>
            <el-button v-loading="loading" type="primary" @click="submitPassword">确定</el-button>
            <el-button @click="dialog.visible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useApp } from '@/stores/app'
  import { getUsers, setUserInfo } from '@/api/system/user'
  import { includes } from '@/utils/utils'

  interface UserReq extends PaginateReq {
    phone?: number
    role_id?: number
  }

  const initialized = ref<boolean>(false)
  
  const loading = ref<boolean>(false)

  const router = useRouter()

  const app = useApp()
  
  const total = ref<number>(0)

  const roles = ref<Array<Record<string, any>>>()
  
  const req = reactive<UserReq>({
    page: 1,
    limit: 30,
    phone: undefined,
    role_id: 0,
  })
  
  const tableData = ref<Array<any>>([])

  const dialog = reactive({
    visible: false,
    title: '设置用户密码',
    user_id: '',
    nickname: '',
    phone: '',
    password: '',
  })
  
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

      roles.value = [{id: 0, title: '所有角色'}].concat(res.roles)
      
      loading.value = false

      initialized.value = true
    }).catch(() => {
      loading.value = false
    })
  }

  function submitPassword() {
    const data = { user_id: dialog.user_id, password: dialog.password }

    if (!data['user_id'] || !data['password']) {
        ElNotification({
          type: 'error',
          title: '',
          message: '请设置密码',
          duration: 3000,
        })
        return
    }

    const passwordLength = data['password'].length
    if (passwordLength < 6 || passwordLength > 12) {
      ElNotification({
        type: 'error',
        title: '',
        message: '密码长度是 6 -12 位',
        duration: 3000,
      })
      return
    }

    if (loading.value) {
      return
    }
    loading.value = true

    setUserInfo(data).then(() => {
      loading.value = false

      dialog.visible = false

      ElNotification({
        type: 'success',
        title: '',
        message: '密码已设置',
        duration: 3000,
      })
    }).catch(() => {
      loading.value = false
    })
  }

  function goSetRole(value:any):void {
    if (value && value.id) {
      router.push({name: 'user.role', query: { user_id: value.id}})
    }
  }

  function goSetPassword(value:any):void {
    if (value && value.id) {
      dialog.nickname = value.nickname
      dialog.phone = value.phone
      dialog.user_id = value.id
      dialog.password = ''
      dialog.visible = true
    }
  }
</script>