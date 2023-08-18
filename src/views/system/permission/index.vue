<template>
  <div class="px-4 py-4">
    <el-card shadow="never" class="border-none">
    <div class="flex items-center">
      <el-button v-if="includes(app.routeNames, ['permission.create'])" type="primary" size="small"> 添加</el-button>
      <el-button v-if="req.parent_id" class="ml-3"  type="primary" size="small" @click="goBack">返回上一级</el-button>

      <span class="ml-auto"></span>

      <el-button v-if="includes(app.routeNames, ['permission.create', 'permission.edit']) && sorted" v-loading="loading" type="primary" @click="updatePermissionsOrders">保存排序</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData"  ref="dragTable" class="w-full mt-5">

      <el-table-column v-if="includes(app.routeNames, ['permission.create'])" width="60" label="排序">
        <template #default="scope">
          <div class="w-full h-full flex items-center cursor-grab drag-btn">
            <el-icon><SvgIcon :icon="'drag'" /></el-icon>

            <span class="ml-2">{{ scope.row.order }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="108" label="icon" prop="icon">
        <template #default="scope">
          <div class="w-full h-full">
            <span v-if="scope.row.icon">{{ scope.row.icon }}</span>
            <span v-else>{{ scope.row.icon }}</span>
          </div>
        </template>
      </el-table-column>

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

      <el-table-column width="120" label="hidden" prop="hidden" />

      <el-table-column width="120" label="keep alive" prop="keep_alive" />
      
      <el-table-column width="120" label="always show" prop="always_show" />

      <el-table-column width="60" label="父 id" prop="parent_id" />

      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" text @click="goSon(scope.row)">子权限</el-button>
          <el-button v-if="app.routeNames.includes('permission.edit')" size="small" type="primary" text>编辑</el-button>
          <el-button v-if="app.routeNames.includes('permission.delete')" size="small" type="primary" text>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="mt-5" background hide-on-single-page layout="prev, pager, next" :total="total" :page-size="req.limit" v-model:current-page="req.page" @current-change="fetchData" />
  </el-card>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useApp } from '@/stores/app'
import { getPermissions, updatePermissionsOrders as updateOrders } from '@/api/system/permission'
import { includes } from '@/utils/utils'
import Sortable from 'sortablejs'

const route = useRoute()

const router = useRouter()

const app = useApp()

const dragTable = ref(null)

const loading = ref<boolean>(false)
  
const total = ref<number>(0)

const req = reactive<ParentPaginateReq>({
  page: 1,
  limit: 30,
  parent_id: undefined
})

const tableData = ref<Array<any>>([])

const initDataIds:Array<number> =[]

const sorted = ref<boolean>(false)

watch(tableData, () => {
  const judgeSort = function():boolean {
    if (initDataIds.length === 0 || initDataIds.length !== tableData.value.length) {
      return false
    }
    return tableData.value.some((item:any, index:number) => {
      return initDataIds[index] !== item.id
    })
  }
  sorted.value = judgeSort()
})

onBeforeRouteUpdate((value) => {
  req.page = 1
  req.parent_id = undefined
  if (value && value.query && value.query.parent_id) {
    if (typeof value.query.parent_id === 'string') {
      req.parent_id = parseInt(value.query.parent_id)
    }
  }

  fetchData()
})

onBeforeMount(function() {
  req.page = 1
  req.parent_id = undefined
  if (route && route.query && route.query.parent_id) {
    if (typeof route.query.parent_id === 'string') {
      req.parent_id = parseInt(route.query.parent_id)
    }
  }

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

      // 记录初始化的 id
      initDataIds.splice(0, initDataIds.length)
      tableData.value.forEach((item:any) => {
          if (item.id) {
            initDataIds.push(item.id)
          }
      })
    }

    total.value = res.total
  }).catch(() => {
    loading.value = false
  })
}

function updatePermissionsOrders() {
  if (loading.value) {
      return
  }
  
  loading.value = true

  const data:number[] = []
  tableData.value.forEach((item:any) => {
      if (item.id) {
        data.push(item.id)
      }
  })

  updateOrders({ ids: data}).then(() => {
    loading.value = false

    ElNotification({
        type: 'success',
        title: '',
        message: '排序已完成',
        duration: 3000,
    })

    window.location.reload()
  }).catch(() => {
    loading.value = false
  })
}

onMounted(function() {
  nextTick(initDropTable)
})

const initDropTable = () => {
  if (!includes(app.routeNames, ['permission.create', 'permission.edit'])) {
    return
  }

  if(dragTable.value){
    const el = dragTable.value.$el.querySelector('.el-table__body tbody')
    Sortable.create(el, {
      handle: '.drag-btn',
      animation: 300,
      onEnd: ({ newIndex, oldIndex }) => {
        const data:Array<any> = tableData.value.concat()
        const currRow = data.splice(oldIndex, 1)[0];
        data.splice(newIndex, 0, currRow);

        tableData.value = []
        nextTick(() => {
          tableData.value = data
        })
      }
    })
  }
}

function goBack():void {
  router.back()
}

function goSon(value:any):void {
  if (value && value.id) {
    router.push({name: 'permission.index', query: { parent_id: value.id}})
  }
}
</script>