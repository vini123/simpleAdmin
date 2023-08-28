<template>
    <div class="px-4 py-4">
        <el-card v-loading="loading" shadow="never" class="border-none">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-position="'right'" label-width="120px">
                <el-form-item label="显示名称" prop="title">
                    <el-input v-model="ruleForm.title" placeholder="请输入显示名称，如超级管理员" clearable />
                </el-form-item>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入名称，如 manager" clearable />
                </el-form-item>

                <el-form-item class="mt-6">
                    <el-button type="primary" @click="submitRole">提交</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { getRole, createOrUpdateRoles } from '@/api/system/role'

interface RuleForm {
    title: string
    name: string
    id: number
}

const loading = ref<boolean>(false)

const initialForm = ():RuleForm => ({
    title: '',
    name: '',
    id: 0
})

const route:RouteLocationNormalizedLoaded = useRoute()

const router = useRouter()

const ruleForm = reactive<RuleForm>(initialForm())

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<RuleForm>>({
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
    ]
})

onMounted(function() {
    if (route && route.query && route.query.id) {
        if (typeof route.query.id === 'string') {
            ruleForm.id =  parseInt(route.query.id)

            initializeData()
        }
    }
})

function initializeData() {
    loading.value = true

    getRole(ruleForm.id).then((res:Record<string, any>) => {
        const whiteList:string[] = ['title', 'name']
        for(const key in res) {
            if (!whiteList.includes(key)) {
                delete res[key]
            }
        }
        Object.assign(ruleForm, res)

        loading.value = false
    }).catch(() => {

    })
}

function submitRole() {
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            fetch()
        }   
    })

    function fetch() {
        if (loading.value) {
            return
        }

        loading.value = true

        const data = { ... ruleForm }

        createOrUpdateRoles(data).then(() => {
            loading.value = false

            ElNotification({
                type: 'success',
                title: '',
                message: '角色已更新,将返回',
                duration: 3000,
            })

            setTimeout(() => {
                goBack()
            }, 1200)
        }).catch(() => {
            loading.value = false
        })
    }
}

function goBack() {
    router.back()
}
</script>