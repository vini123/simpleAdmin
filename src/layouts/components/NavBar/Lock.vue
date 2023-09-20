<template>
  <div class="w-full h-full">
    <div class="w-full h-full flex justify-center backdrop-blur">
      <div class="flex flex-col items-center mt-[120px] animate-piece-in">
        <img id="img" :src="user.avatar" class="w-[80px] h-[80px] rounded-full mt-2 shadow-md" />

        <span class="mt-2">{{ user.nickname }}</span>

        <el-form class="w-[520px] mt-10" v-on:submit.prevent>
          <el-form-item label="密码" class="w-full">
            <el-input type="password" v-model="password" placeholder="请输入解锁密码" show-password />
          </el-form-item>

          <el-button class="w-full" type="primary" @click="doUnLock">解锁</el-button>

          <el-link class="ml-2" @click="doLogin">登录</el-link>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "@/stores/user";
import { useRouter } from "vue-router";
import { checkUserLock } from "@/api/personal";

const password = ref("");

const user = useUser();

const router = useRouter();

const doLogin = function () {
  router.push({ name: "login", query: { must: "true" } });
};

const doUnLock = function () {
  if (!password.value) {
    return;
  }

  checkUserLock({ password: password.value }).then(() => {
    user.setUserInfo({ adminLock: false });
  });
};
</script>

<style>
.el-dialog {
  border-radius: 10px;
}
</style>
