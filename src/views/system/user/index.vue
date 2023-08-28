<template>
    <div class="px-4 py-4">
      <el-card v-if="initialized" v-loading="loading" shadow="never" class="border-none">
      <div class="flex items-center">
        <TableColumnsController v-model:columns="tableColumns" :cacheKey="columnsCache"/>

        <el-select v-model="req.role_id" placeholder="请选择角色" class="ml-auto mr-2 w-[150px]">
            <el-option v-for="(item, index) in roles" :key="index" :label="item.title" :value="item.id"></el-option>
        </el-select>

        <el-input v-model="req.phone" class="mr-2 w-[150px]" placeholder="请输入手机号码" />
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </div>
  
      <el-table :data="tableData" class="w-full mt-5">
        <template v-for="item in tableColumns" :key="item.value" >
          <el-table-column v-if="item.show && item.value !== 'setting'" :label="item.label" prop="item.value" :width="item.width ?? undefined">
            <template #default="scope">
              <el-avatar v-if="item.value === 'avatar'" :size="50" :src="scope.row.avatar" />

              <div v-else-if="item.value === 'role'">
                <el-tag v-for="(item, index) in scope.row.roles" :key="index" class="mr-1">{{ item.title }}</el-tag>
              </div>

              <div v-else-if="item.value === 'signature'">
                <span v-if="!scope.row.signature">-</span>
                <span v-else-if="scope.row.signature.length < 20">{{ scope.row.signature }}</span>
                <el-tooltip v-else :content="scope.row.signature" placement="top-end">
                  <span>{{ scope.row.signature.substr(0, 20) + '…' }}</span>
                </el-tooltip>
              </div>

              <span v-else>
                {{ scope.row[item.value] }}
              </span>
            </template>
          </el-table-column>

          <el-table-column v-else-if="item.show && item.value === 'setting' && includes(app.routeNames, ['user.role'])" :label="item.label" prop="item.value" :width="item.width ?? undefined" align="center" fixed="right">
            <template #default="scope">
              <el-button v-if="includes(app.routeNames, ['user.role'])" size="small" type="primary" text @click="goSetRole(scope.row)">设置角色</el-button>
              <el-button v-if="includes(app.routeNames, ['user.edit'])" size="small" type="primary" text @click="goSetPassword(scope.row)">设置密码</el-button>
            </template>
          </el-table-column>
        </template>
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

  const tableColumns = ref<Array<TableColumnsControllerItem>>([
    { label: '头像', value: 'avatar', width: 80, readonly: true, show: true, order: 0 },
    { label: 'ID', value: 'viewid', width: 120, readonly: true, show: true, order: 0 },
    { label: '昵称', value: 'nickname', readonly: true, show: true, order: 0 },
    { label: '注册来源', value: 'referer_str', width: 120, readonly: false, show: true, order: 0 },
    { label: '性别', value: 'gender_str', width: 80, readonly: false, show: true, order: 0 },
    { label: '手机号码', value: 'phone', width: 150, readonly: false,show: true, order: 0 },
    { label: '微信', value: 'wechat', width: 150, readonly: false,show: true, order: 0 },
    { label: '邮箱', value: 'email', readonly: false,show: true, order: 0 },
    { label: '后台角色', value: 'role', readonly: false,show: true, order: 0 },
    { label: '注册 ip', value: 'register_ip', width: 150, readonly: false,show: true, order: 0 },
    { label: '签名', value: 'signature', readonly: false,show: true, order: 0 },
    { label: '创建时间', value: 'created_at', readonly: false,show: true, order: 0 },
    { label: '操作', value: 'setting', width: 200, readonly: false,show: true, order: 0 },
  ])

  const columnsCache = ref<string>('system_user_index')

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

    if (columnsCache.value) {
      const value = localStorage.getItem(columnsCache.value)
      if (value) {
        tableColumns.value = JSON.parse(value) as Array<TableColumnsControllerItem>
      }
    }
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