<template>
    <div class="relative">
        <el-popover placement="bottom-start" :width="400" trigger="click" @show="showHandler">
            <template #reference>
                <el-icon size="18">
                    <SvgIcon :icon="'setting'" />
                </el-icon>
            </template>

            <div>
                <div>
                    <el-checkbox v-model="allSelected" :indeterminate="isIndeterminate" @change="allChange">列展示</el-checkbox>
                </div>

                <div v-for="(item) in columns" :key="item.value" class="flex items-center columns-list">
                    <div class="flex items-center cursor-grab drag-btn w-6">
                        <el-icon><SvgIcon :icon="'drag'" /></el-icon>
                    </div>
                    <el-checkbox v-model="item.show" :disabled="item.readonly"  @change="itemChange">{{ item.label }}</el-checkbox>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

interface Props {
    columns: Array<TableColumnsControllerItem>
    cacheKey ?: string
}

const props = withDefaults(defineProps<Props>(), {
    columns: () => []
})

function showHandler() {
    freshCheckBoxState()
}

const isIndeterminate = ref(false)

const allSelected = ref(false)

const allChange = (value: boolean) => {
    props.columns.forEach((item:TableColumnsControllerItem) => {
        if (!item.readonly) {
            item.show = value ? true : false
        }
    })
    isIndeterminate.value = false
}

const itemChange = () => {
    freshCheckBoxState()
}

function freshCheckBoxState() {
    const selects = props.columns.filter((item) => item.show)
    if (selects.length > 0  && selects.length < props.columns.length) {
        isIndeterminate.value = true
    } else {
        isIndeterminate.value = false
    }

    if (selects.length === props.columns.length) {
        allSelected.value = true
    } else {
        allSelected.value = false
    }

    // 如果配置了 cacheKey, 可以对数据进行缓存
    if (props.cacheKey) {
        localStorage.setItem(props.cacheKey, JSON.stringify(props.columns))
    }
}
</script>