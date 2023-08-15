<template>
<div>
  <el-transfer v-if="num%3 == 0" v-model="value" :data="data" class="mb-4" />

  <div v-if="num%2 == 0" class="px-4 py-4">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="150" />
      <el-table-column label="Delivery Info">
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column label="Address Info">
          <el-table-column prop="state" label="State" width="120" />
          <el-table-column prop="city" label="City" width="120" />
          <el-table-column prop="address" label="Address" />
          <el-table-column prop="zip" label="Zip" width="120" />
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-space direction="vertical" alignment="flex-start" class="mt-4">
      <el-button @click="setLoading">Click me to reload</el-button>
      <el-skeleton style="width: 240px" :loading="loading" animated :count="3">
        <template #template>
          <el-skeleton-item variant="image" style="width: 400px; height: 267px" />
          <div style="padding: 14px">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
                margin-top: 16px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </div>
        </template>
        <template #default>
          <el-card
            v-for="item in lists"
            :key="item.name"
            :body-style="{ padding: '0px', marginBottom: '1px' }"
          >
            <img :src="item.imgUrl" class="image multi-content" />
            <div style="padding: 14px">
              <span>{{ item.name }}</span>
              <div class="bottom card-header">
                <div class="time">{{ currentDate }}</div>
                <el-button text class="button">Operation button</el-button>
              </div>
            </div>
          </el-card>
        </template>
      </el-skeleton>
    </el-space>
  </div>

  <div v-else class="px-4 py-4">
    <el-space direction="vertical" alignment="flex-start">
      <el-button @click="setLoading">Click me to reload</el-button>
      <el-skeleton style="width: 240px" :loading="loading" animated :count="3">
        <template #template>
          <el-skeleton-item variant="image" style="width: 400px; height: 267px" />
          <div style="padding: 14px">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <div
              style="
                display: flex;
                align-items: center;
                justify-items: space-between;
                margin-top: 16px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
          </div>
        </template>
        <template #default>
          <el-card
            v-for="item in lists"
            :key="item.name"
            :body-style="{ padding: '0px', marginBottom: '1px' }"
          >
            <img :src="item.imgUrl" class="image multi-content" />
            <div style="padding: 14px">
              <span>{{ item.name }}</span>
              <div class="bottom card-header">
                <div class="time">{{ currentDate }}</div>
                <el-button text class="button">Operation button</el-button>
              </div>
            </div>
          </el-card>
        </template>
      </el-skeleton>
    </el-space>

    <el-table :data="tableData" style="width: 100%" class="mt-4">
      <el-table-column prop="date" label="Date" width="150" />
      <el-table-column label="Delivery Info">
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column label="Address Info">
          <el-table-column prop="state" label="State" width="120" />
          <el-table-column prop="city" label="City" width="120" />
          <el-table-column prop="address" label="Address" />
          <el-table-column prop="zip" label="Zip" width="120" />
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Option {
  key: number
  label: string
  disabled: boolean
}

interface ListItem {
  imgUrl: string
  name: string
}

const generateData = () => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0,
    })
  }
  return data
}

const data = ref<Option[]>(generateData())
const value = ref([])
const loading = ref<boolean>(true)
const lists = ref<ListItem[]>([])
const currentDate = new Date().toDateString()

const setLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

const num:number =  Math.floor(Math.random() * 100)

onMounted(() => {
  loading.value = false
  lists.value = [
    {
      imgUrl:
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
      name: 'Deer',
    },
    {
      imgUrl:
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      name: 'Horse',
    },
    {
      imgUrl:
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
      name: 'Mountain Lion',
    },
  ]
})

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
]
</script>  