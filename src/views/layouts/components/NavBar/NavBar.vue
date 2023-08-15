<template>
  <div class="nav-bar">
 
    <div class="flex ml-3">
        <el-icon v-if="app.collapse === 'true'" size="20" @click="doClick">
            <icon-expand />
        </el-icon>

        <el-icon v-else size="20" @click="doClick">
            <icon-fold />
        </el-icon>
    </div>

    <div class="flex ml-auto mr-3">
        <el-icon v-if="isDark" size="22" @click="doClick"> <IconSunny /></el-icon>
        <el-icon v-else size="22" @click="doClick"> <IconMoon /></el-icon>
    </div>

    <div class="mr-3">
        <el-dropdown class="avatar-container" trigger="click">
            <img :src="user.avatar" class="user-avatar">
            <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                    <el-dropdown-item>个人资料</el-dropdown-item>
                
                    <el-dropdown-item>修改密码</el-dropdown-item>

                    <el-dropdown-item divided @click="logout">
                        <span style="display:block;">退 出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'
import { useDark } from '@vueuse/core'

const isDark = useDark()
const app = useApp()
const user = useUser()

function doClick() {
    if (app.collapse === 'true') {
        app.setData({collapse: false})
    } else {
        app.setData({collapse: true})
    }
}

function logout() {
    user.logout()
    location.reload()
}
</script>

<style lang="scss">
.user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
}
</style>