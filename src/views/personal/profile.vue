<template>
    <div class="px-4 py-4">
        <el-card  v-loading="loading" shadow="never" class="border-none">
            <div class="text-base mb-4">
                <span class="font-medium">编辑个人资料</span>
            </div>

            <el-form :label-position="'left'" label-width="80px">
                <el-form-item label="头像">
                    <div class="relative cursor-pointer w-[100px] h-[100px]" @click="editAvatar">
                        <el-avatar :src="form.avatar" :size="100" class="border-white border-2 border-solid" />

                        <div class="flex items-center justify-center w-[100px] h-[100px] pt-8 text-white bg-black/40 rounded-full absolute left-0 top-0">
                            <el-icon><icon-edit /></el-icon>
                            <span class="text-sm ml-1">编辑</span>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="显示ID">
                    <el-input v-model="form.viewid" disabled />
                </el-form-item>

                <el-form-item label="手机号码">
                    <el-input v-model="form.phone" disabled />
                </el-form-item>

                <el-form-item label="昵称">
                    <el-input v-model="form.nickname" placeholder="请输入昵称" clearable />
                </el-form-item>

                <el-form-item label="性别">
                    <el-select v-model="form.gender" placeholder="请选择性别">
                        <el-option label="男" :value="1" />
                        <el-option label="女" :value="2" />
                    </el-select>
                </el-form-item>

                <el-form-item label="微信">
                    <el-input v-model="form.wechat" placeholder="请输入微信" clearable />
                </el-form-item>

                <el-form-item label="邮箱">
                    <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
                </el-form-item>

                <el-form-item label="签名">
                    <el-input v-model="form.signature" type="textarea" placeholder="请输入签名" />
                </el-form-item>

                <el-form-item class="mt-6">
                    <el-button type="primary" @click="submitProfile">提交</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <ImageCropper ref="cropper" :title="'修改用户头像'" :path="form.avatar" :outWidth="200" @on-cropper-complete="onCropperComplete" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserProfile, setUserProfile } from '@/api/personal'
import { useUser } from '@/stores/user'
import { uploadImage } from '@/api/utils'

interface RuleForm {
    avatar: string
    viewid: string
    nickname: string
    gender: Gender
    phone: string
    wechat: string
    email: string
    signature: string
}

const loading = ref<boolean>(false)

const initialForm = ():RuleForm => ({
    avatar: '',
    viewid: '',
    nickname: '',
    gender: 0,
    phone: '',
    wechat: '',
    email: '',
    signature: '',
})

const router = useRouter()

const form = reactive<RuleForm>(initialForm())

const user = useUser()

const cropper = ref(null as any)

onMounted(function() {
    initializeData()
})

function initializeData() {
    loading.value = true

    getUserProfile().then((res:Record<string, any>) => {
        Object.assign(form, res)

        loading.value = false
    }).catch(() => {

    })
}

function submitProfile() {
    if (loading.value) {
        return
    }

    loading.value = true

    const data = { ... form }

    setUserProfile(data).then(() => {
        loading.value = false

        user.refreshUserInfo()

        ElNotification({
            type: 'success',
            title: '',
            message: '更新个人信息完成',
            duration: 3000,
        })
    }).catch(() => {
        loading.value = false
    })
}

function onCropperComplete(value:string) {
    if (loading.value) {
        return 
    }
    loading.value = true

    uploadImage({file: value, info: {referer:'avatar'}}).then((value:any) => {

        loading.value = false
        
        form.avatar = value
        
        user.setUserInfo({avatar: value})

        ElNotification({
            type: 'success',
            title: '',
            message: '图像已上传',
            duration: 3000,
        })
    }).catch(() => {
        loading.value = false
    })
}

function editAvatar() {
    cropper.value?.open()
}

function goBack() {
    router.back()
}
</script>