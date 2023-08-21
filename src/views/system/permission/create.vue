<template>
    <div class="px-4 py-4">
        <el-card v-if="initialized" v-loading="loading" shadow="never" class="border-none">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-position="'right'" label-width="120px">
                <el-form-item label="父节点" prop="parent_id">
                    <el-select v-model="ruleForm.parent_id" placeholder="请选择父节点" @change="parentIdChange">
                        <el-option v-for="(item, index) in permissionList" :key="index" :label="item.value" :value="item.id">
                            <template #default>
                                <div v-html="item.label"></div>
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="菜单名称" prop="title">
                    <el-input v-model="ruleForm.title" placeholder="请输入菜单名称，如优惠券" clearable />
                </el-form-item>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入名称，如 user.edit" clearable />
                </el-form-item>

                <el-form-item label="路由" prop="path">
                    <el-input v-model="ruleForm.path" placeholder="请输入路由，如 edit" clearable />
                </el-form-item>

                <el-form-item label="icon" prop="icon">
                    <el-input v-model="ruleForm.icon" placeholder="请输入路由 icon" clearable />
                </el-form-item>

                <el-form-item label="隐藏" prop="hidden">
                    <el-switch v-model="ruleForm.hidden" :active-value="1" :inactive-value="0"/>
                </el-form-item>

                <el-form-item label="路由缓存" prop="keep_alive">
                    <el-switch v-model="ruleForm.keep_alive" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="显示父级" prop="always_show">
                    <el-switch v-model="ruleForm.always_show" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="组件" prop="component">
                    <el-input v-model="ruleForm.component" placeholder="请输入组件名称（几乎不需要填，默认为路由名）" clearable />
                </el-form-item>

                <el-form-item label="链接" prop="link">
                    <el-input v-model="ruleForm.link" placeholder="请输入外部链接地址" clearable />
                </el-form-item>

                <el-form-item label="Iframe" prop="iframe">
                    <el-input v-model="ruleForm.iframe" placeholder="请输入 Iframe 地址" clearable />
                </el-form-item>

                <el-form-item label="重定向" prop="redirect">
                    <el-input v-model="ruleForm.redirect" placeholder="请输入重定向（几乎不需要填）" clearable />
                </el-form-item>

                <el-form-item class="mt-6">
                    <el-button v-loading="loading" type="primary" @click="submitPermission">提交</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { getPermissions, createOrUpdatePermissions } from '@/api/system/permission'

interface PermissionItem {
    id: number
    label: string
    value: string
}

interface RuleForm {
    title: string
    name: string
    path: string
    icon?: string
    hidden: NumberBoolean
    keep_alive: NumberBoolean
    always_show: NumberBoolean
    component?: string
    link?: string
    iframe?: string
    redirect?: string
    parent_id: number
}

const initialized = ref<boolean>(false)

const loading = ref<boolean>(false)

const initialForm = ():RuleForm => ({
    title: '',
    name: '',
    path: '',
    icon: '',
    hidden: 0,
    keep_alive: 0,
    always_show: 0,
    component: '',
    link: '',
    iframe: '',
    redirect: '',
    parent_id: 0
})

const ruleForm = reactive<RuleForm>(initialForm())

const permissionList = ref<Array<PermissionItem>>([])
  
const ruleFormRef = ref<FormInstance>()

const route:RouteLocationNormalizedLoaded = useRoute()

const router = useRouter()

onMounted(function() {
    if (route && route.query && route.query.parent_id) {
        if (typeof route.query.parent_id === 'string') {
            ruleForm.parent_id =  parseInt(route.query.parent_id)
        }
    }

    runderPermissions()
})

const rules = reactive<FormRules<RuleForm>>({
    parent_id: [
        { required: true, validator: (rule: any, value: any, callback: any) => {
            callback()
        }, trigger: 'blur'},
    ],
    title: [
        { required: true, validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                return callback(new Error('请输入菜单名称'))
            }

            callback()
        }, trigger: 'blur'},
    ],
    name: [
        { required: true, validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                return callback(new Error('请输入名称'))
            }

            if (!/^([a-z][a-z0-9]*[.]*[a-z][a-z0-9]*)|([a-z][a-z0-9]*)$/.test(value)) {
                return callback(new Error('名称必须由小写字母数字点字母数字组成,且以小写字母开头'))
            }
            callback()
        }, trigger: 'blur'},
    ],
    path: [
        { required: true, validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                return callback(new Error('请输入路由'))
            }

            if (ruleForm.parent_id === 0 && !/^(\/[a-z])[a-z0-9]*$/.test(value)) {
                return callback(new Error('根路由必须由斜杠和小写字母开头'))
            }

            if (ruleForm.parent_id !== 0 && !/^[a-z][a-z0-9]*$/.test(value)) {
                return callback(new Error('非根路由必须小写字母开头,且只能小写字母或数字组合'))
            }
            callback()
        }, trigger: 'blur'},
    ],
    link: [
        { required: false, validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                return callback()
            }

            if (!/^(http|https):\/\/[\w]+\.[\w]+/.test(value)) {
                return callback(new Error('链接请用 http 或 https 开头'))
            }
            callback()
        }, trigger: 'blur'},
    ],
    iframe: [
        { required: false, validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                return callback()
            }

            if (!/^(http|https):\/\/[\w]+\.[\w]+/.test(value)) {
                return callback(new Error('iframe 请用 http 或 https 开头'))
            }
            callback()
        }, trigger: 'blur'},
    ]
})

function submitPermission() {
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            if (ruleForm.link && ruleForm.iframe) {
                ElNotification({
                    type: 'error',
                    title: '',
                    message: '外链和 iframe 最多只选一个',
                    duration: 3000,
                })
                return
            }

            if (ruleForm.parent_id === 0 && !ruleForm.icon) {
                ElNotification({
                    type: 'error',
                    title: '',
                    message: '根权限，必须要有 icon',
                    duration: 3000,
                })
                return
            }

            if (ruleForm.parent_id === 0 && ruleForm.path.indexOf('/') === -1) {
                ElNotification({
                    type: 'error',
                    title: '',
                    message: '根权限，路由必须是 / 开头',
                    duration: 3000,
                })
                return
            }

            fetch()
        }   
    })

    function fetch() {
        if (loading.value) {
            return
        }

        loading.value = true

        const data = { ... ruleForm }
        for(const key in data) {
            if (isValidKey(key, data)) {
                if (data[key] === '') {
                    delete data[key]
                }

                if (key === 'parent_id' && data[key] === 0) {
                    delete data[key]
                }
            }
        }

        createOrUpdatePermissions(data).then(() => {
            loading.value = false

            // Object.assign(ruleForm, initialForm())
            // runderPermissions()
            
            ElNotification({
                type: 'success',
                title: '',
                message: '权限已创建,将刷新浏览器',
                duration: 3000,
            })


            setTimeout(() => {
                window.location.reload()
            }, 1200)
        }).catch(() => {
            loading.value = false

            ElNotification({
                type: 'error',
                title: '',
                message: '创建权限失败',
                duration: 3000,
            })
        })
    }
}

function goBack() {
    router.back()
}

function isValidKey(key: string | number | symbol,object: object): key is keyof typeof object {
    return key in object;
}

function parentIdChange(value:number) {
    ruleForm.parent_id = value
}

function runderPermissions() {
    loading.value = true

    const menus: Array<PermissionItem> = []
    let level = 0
    let parentId = -1

    getPermissions(null).then((res:Record<string, any>) => {
        if (res && res.data) {
            assemblyPermissions(menus, res.data)
        }

        menus.unshift({
            id: 0,
            label: '根权限',
            value: '根权限'
        })

        permissionList.value = menus
         
        nextTick(() => {
            initialized.value = true
            loading.value = false
        })
    })

    function assemblyPermissions(accept:Array<PermissionItem>, source: Array<Record<string, any>>, prefix:string = '') {
        source.forEach( value => {
            const item: PermissionItem = {
                id: value.id,
                label: prefix + value.title,
                value: value.title
            }
            accept.push(item)

            if (value.parent_id === 0) {
                level = 0
            }

            if (value.childs && value.childs.length > 0) {
                level ++
                const prefixs:string[] = ['┗━']
                for(let i = 0; i < level; i++) {
                    prefixs.unshift('&nbsp;&nbsp;&nbsp;&nbsp;')
                }

                assemblyPermissions(accept, value.childs, prefixs.join(''))
            } else {
                if (parentId !== value.parent_id) {
                    parentId = value.parent_id
                    level --
                }
            }
        })
    }
}
</script>