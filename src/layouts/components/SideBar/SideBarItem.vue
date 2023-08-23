<template>
  <div v-if="!item?.meta.hidden">
    <el-menu-item v-if="onlyOneChild(item?.children)" :index="item?.path" :class="{'only-grade': onlyGrade(item?.path, item?.children)}">
      <el-icon v-if="item?.meta.icon" class="flex front-icon"><SvgIcon :icon="`${item.meta.icon}`" /></el-icon>

      <template #title>
        <span>{{ item?.meta.title }}</span>
      </template>
    </el-menu-item>

    <el-sub-menu v-else :index="item?.path || ''">
      <template #title>
          <el-icon v-if="item?.meta.icon" class="flex front-icon"><SvgIcon :icon="`${item.meta.icon}`" /></el-icon>

          <span>{{ item?.meta.title }}</span>
      </template>

      <side-bar-item
        v-for="child in item?.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  item: {
    type: Object as PropType<AppRoute.Route>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

function onlyOneChild(children: AppRoute.Route[] = []) {
  if (children.length === 1) {
    if (children[0].meta.alwaysShow) {
      return false
    }
    return true
  }

  if (children.length === 0) {
    return true
  }

  // 只有有一个不是隐藏的，就得渲染父级(因为把隐藏的路由信息都加入侧边栏，才这样做的，要不直接返回 false 就可以了)
  return children.some((item) => {
    return item.meta.hidden === true
  })
}

function onlyGrade(path:string | undefined, children: AppRoute.Route[] = []):boolean {
  if (!path) {
    return false
  }

  if (path.split('/').length > 2) {
    return false;
  }

  if (children.length === 1) {
    if (!children[0].meta.alwaysShow) {
      return true
    }
    return false
  }
  return false
}
</script>