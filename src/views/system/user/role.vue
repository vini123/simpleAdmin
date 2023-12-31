<template>
  <div>
    <el-card v-loading="loading" shadow="never" class="border-none">
      <div class="text-base mb-4">
        <span>给</span>
        <span class="font-medium">{{ nickname }}</span>
        <span>分配角色</span>
      </div>

      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="allChangeHandler">全选</el-checkbox>

      <el-checkbox-group v-model="checkedIds" @change="checkChangeHandler">
        <el-checkbox v-for="role in roles" :key="role['id']" :label="role['id']">{{ role["title"] }}</el-checkbox>
      </el-checkbox-group>

      <el-form-item class="mt-6">
        <el-button type="primary" @click="submitRole">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { getUserRoles, setUserRoles } from "@/api/system/user";
import type { CheckboxValueType } from "element-plus";
import { useUser } from "@/stores/user";

const loading = ref<boolean>(false);

const nickname = ref<string>("");

const checkAll = ref(false);

const isIndeterminate = ref<boolean>(true);

const checkedIds = ref<Array<number>>([]);

const roles = ref<Array<Record<string, any>>>([]);

const route: RouteLocationNormalizedLoaded = useRoute();

const router = useRouter();

const user = useUser();

let user_id: number;

onMounted(function () {
  if (route && route.query && route.query.user_id) {
    if (typeof route.query.user_id === "string") {
      user_id = parseInt(route.query.user_id);

      initializeData();
    }
  }
});

function checkChangeHandler(value: Array<CheckboxValueType>): void {
  checkedIds.value = value as Array<number>;

  calcIndeterminate();
}

function calcIndeterminate() {
  if (checkedIds.value.length > 0 && checkedIds.value.length < roles.value.length) {
    isIndeterminate.value = true;
  } else {
    isIndeterminate.value = false;
  }

  checkAll.value = checkedIds.value.length === roles.value.length;
}

function allChangeHandler(value: CheckboxValueType) {
  if (value) {
    roles.value.forEach((element: Record<string, any>) => {
      if (!checkedIds.value.includes(element["id"])) {
        checkedIds.value.push(element["id"]);
      }
    });
  } else {
    checkedIds.value = [];
  }

  isIndeterminate.value = false;
}

function initializeData() {
  loading.value = true;

  getUserRoles({ user_id })
    .then((res: Record<string, any>) => {
      nickname.value = res.nickname;

      checkedIds.value = res.ids;

      roles.value = res.roles;

      calcIndeterminate();

      loading.value = false;
    })
    .catch(() => {});
}

function submitRole() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  const data = { user_id, ids: checkedIds.value };

  setUserRoles(data)
    .then(() => {
      loading.value = false;

      // 当前用户才需要这样
      if (user_id === user.id) {
        const curRoles: Array<UserRole> = [];
        let changeCurRole = false;
        roles.value.forEach((item) => {
          if (checkedIds.value.indexOf(item.id) >= 0) {
            curRoles.push({
              name: item.name,
              title: item.title,
            });
          } else {
            if (user.curRole === item.name) {
              changeCurRole = true;
            }
          }
        });

        if (changeCurRole) {
          if (curRoles.length > 0) {
            user.setUserInfo({ curRole: curRoles[0]["name"] });
          } else {
            user.setUserInfo({ curRole: "" });
          }
        }
        user.setUserInfo({ roles: curRoles });
      }

      ElNotification({
        type: "success",
        title: "",
        message: "用户角色已设置",
        duration: 3000,
      });
    })
    .catch(() => {
      loading.value = false;
    });
}

function goBack() {
  router.back();
}
</script>
