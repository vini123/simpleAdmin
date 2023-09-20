<template>
  <div class="nav-bar">
    <div class="flex ml-3 font-light hamburger">
        <el-icon :class="{'is-active': !app.sidebarCollapse}" size="20" @click="doClick">
            <SvgIcon :icon="'hamburger'" />
        </el-icon>
    </div>

    <Breadcrumb />

    <div class="ml-auto mr-4" style="width:108px;">
        <el-select v-model="user.curRole" size="small" placeholder="请选择角色" @change="roleChange">
            <el-option v-for="(item, index) in user.roles" :key="index" :label="item.title" :value="item.name" />
        </el-select>
    </div>

    <div class="flex cursor-pointer mr-4">
        <el-icon v-if="isDark" size="20" @click="toggleDark()">
            <SvgIcon icon="sun" />
        </el-icon>
        <el-icon v-else size="20" @click="toggleDark()">
            <SvgIcon icon="moon" />
        </el-icon>
    </div>

    <Fullscreen class="flex cursor-pointer mr-4" />

    <div class="mr-3">
        <el-dropdown class="avatar-container" trigger="click">
            <img :src="user.avatar" class="user-avatar">
            <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                    <router-link to="/personal/profile">
                        <el-dropdown-item>个人资料</el-dropdown-item>
                    </router-link>
                    
                    <router-link to="/personal/password">
                        <el-dropdown-item>修改密码</el-dropdown-item>
                    </router-link>

                    <el-dropdown-item @click="lockScreen.visible=true">锁定屏幕</el-dropdown-item>

                    <el-dropdown-item divided @click="logout">
                        <span style="display:block;">退 出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
  </div>

  <el-dialog v-model="lockScreen.visible" :title="'锁定屏幕'" class="max-w-[520px] px-2">
    <div class="flex flex-col items-center justify-center">
        <img id="img" :src="user.avatar" class="w-[80px] h-[80px] rounded-full mt-2 shadow-md" />

        <span class="mt-2">{{ user.nickname }}</span>

        <el-form-item label="密码" class="w-full mt-10">
            <el-input type="password" v-model="lockScreen.password" placeholder="请输入锁屏密码" show-password />
        </el-form-item>

        <el-button class="w-full mb-2" type="primary" @click="doLockScreen">锁定</el-button>
    </div>
  </el-dialog> 
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'
import { setUserRole, setUserLock } from '@/api/personal'
import { useDark, useToggle } from '@vueuse/core'
import Breadcrumb from './Breadcrumb.vue'
import Fullscreen from './Fullscreen.vue'

const router = useRouter()
const isDark = useDark({disableTransition: false})
const toggleDark = useToggle(isDark)
const app = useApp()
const user = useUser()

const lockScreen = reactive({
    visible: false,
    password: ''
})

function doClick() {
    if (app.sidebarCollapse) {
        app.setData({collapse: false})
    } else {
        app.setData({collapse: true})
    }
}

function logout() {
    user.logout()
    location.reload()
}

function roleChange(value:string) {
    setUserRole({ role: value }).then(() => {
        router.go(0)
    })
}

function doLockScreen() {
    if (!lockScreen.password || lockScreen.password.length < 4 || lockScreen.password.length > 8) {
        ElNotification({
            type: 'warn',
            title: '提示',
            message: '密码长度在 4 到 8 位之间',
            duration: 3000,
        })
        return
    }

    setUserLock({ password: lockScreen.password }).then((res) => {
        if (res) {
            user.setUserInfo({'adminLock': true})
        } else {
            ElNotification({
                type: 'error',
                title: '提示',
                message: '设置失败，请联系管理员',
                duration: 3000,
            })
        }
    })
}
</script>

<style lang="scss">

.hamburger {
    .is-active {
        transform: rotate(180deg);
    }
}

.user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
}
</style>