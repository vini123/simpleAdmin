<template>
    <div class="relative">
        <el-tooltip content="列设置" placement="top">
            <div>
                <el-popover placement="bottom-start" width="300" trigger="click" @show="showHandler">
                    <template #reference>
                        <el-icon size="20">
                            <SvgIcon :icon="'setting'" />
                        </el-icon>
                    </template>

                    <div>
                        <div class="flex items-center">
                            <el-checkbox v-model="allSelected" :indeterminate="isIndeterminate" @change="allChange">列展示</el-checkbox>

                            <el-button class="ml-auto" size="small" type="primary" text @click="reset()">复位</el-button>
                        </div>

                        <div class="columns-list">
                            <div v-for="(item) in columns" :key="item.value" class="flex items-center drag-btn">
                                <div class="flex items-center cursor-grab w-6">
                                    <el-icon><SvgIcon :icon="'drag'" /></el-icon>
                                </div>
                                <el-checkbox v-model="item.show" :disabled="item.readonly"  @change="itemChange">{{ item.label }}</el-checkbox>
                            </div>
                        </div>
                    </div>
                </el-popover>
            </div>
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">

import { ref, nextTick } from 'vue'

import type { CheckboxValueType } from 'element-plus';

import Sortable from 'sortablejs'

interface Props {
    columns: Array<TableColumnsControllerItem>
    cacheKey ?: string
}

const emits = defineEmits(['update:columns', 'reset'])

const props = withDefaults(defineProps<Props>(), {
    columns: () => []
})

const isIndeterminate = ref(false)

const allSelected = ref(false)

function showHandler() {
    freshCheckBoxState()

    nextTick(initDropable)
}

const allChange = (value:CheckboxValueType) => {
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

let initializedDropable = false;
const initDropable = () => {
    if (initializedDropable) {
        return
    }

    const el: HTMLElement | null = document.querySelector(".columns-list");
    if (el) {
        Sortable.create(el, {
        handle: '.drag-btn',
        animation: 300,
        onEnd: ({ newIndex, oldIndex }) => {
                if (typeof newIndex === 'number' && typeof oldIndex === 'number') {
                    const data:Array<TableColumnsControllerItem> = props.columns.concat()

                    const currRow = data.splice(oldIndex, 1)[0];

                    data.splice(newIndex, 0, currRow);

                    emits('update:columns', data)
                }
            }
        })
        initializedDropable = true
    }
}

function reset() {
    if (props.cacheKey) {
        localStorage.removeItem(props.cacheKey)
    }
    emits('reset')
}
</script>