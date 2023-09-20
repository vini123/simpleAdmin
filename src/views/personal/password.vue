<template>
  <div>
    <el-card v-loading="loading" shadow="never" class="border-none">
      <div class="text-base mb-4">
        <span class="font-medium">更新个人密码</span>
      </div>

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-position="'left'" label-width="72px">
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="验证码" prop="captcha_code">
          <el-input v-model="ruleForm.captcha_code" maxlength="4" placeholder="请输入验证码" clearable class="w-[120px]" />

          <el-image class="w-[98px] h-[38px] ml-2 curson-poinster" v-if="captcha" :src="captcha" @click="refreshCaptcha" />
        </el-form-item>

        <el-form-item class="mt-6">
          <el-button v-loading="loading" type="primary" @click="submitPassword(ruleFormRef)">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { Router } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { getCaptcha, setUserPassword } from "@/api/personal";
import { useUser } from "@/stores/user";

interface FormData {
  password: string;
  captcha_key: string;
  captcha_code: string;
}

interface RuleForm {
  password: string;
  captcha_key: string;
  captcha_code: string;
}

const loading = ref<boolean>(false);
const router: Router = useRouter();
const user = useUser();
const captcha = ref<string>("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  password: "",
  captcha_key: "",
  captcha_code: "",
});

const rules = reactive<FormRules<RuleForm>>({
  password: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          return callback(new Error("请输入密码"));
        }

        if (value.length < 6 || value.length > 12) {
          return callback(new Error("请输入 6-12 位密码"));
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  captcha_code: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          return callback(new Error("请输入验证码"));
        }

        if (value.length !== 4) {
          return callback(new Error("请输入四位的验证码"));
        }
        callback();
      },
      trigger: "blur",
    },
  ],
});

onMounted(() => {
  refreshCaptcha();
});

function refreshCaptcha() {
  getCaptcha().then((res: Record<string, any>) => {
    ruleForm.captcha_key = res.captcha_key ?? "";
    captcha.value = res.captcha ?? "";
  });
}

function submitPassword(formEl: FormInstance | undefined) {
  if (!formEl) return;

  if (loading.value) {
    return;
  }

  loading.value = true;

  const data: FormData = {
    password: ruleForm.password,
    captcha_key: ruleForm.captcha_key,
    captcha_code: ruleForm.captcha_code,
  };

  setUserPassword(data)
    .then(() => {
      loading.value = false;

      ElNotification({
        type: "success",
        title: "",
        message: "密码已修改,请重新登录",
        duration: 3000,
      });

      user.logout();

      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1200);
    })
    .catch(() => {
      loading.value = false;
    });
}

function goBack() {
  router.back();
}
</script>
