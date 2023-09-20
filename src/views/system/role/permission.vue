<template>
  <div>
    <el-card v-loading="loading" shadow="never" class="border-none mb-[72px]">
      <div class="text-base mb-4">
        <span>给</span>
        <span class="font-medium">{{ role }}</span>
        <span>分配权限</span>
      </div>

      <el-tree
        ref="tree"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :data="permissions"
        :expand-on-click-node="false"
        :check-strictly="true"
        :check-on-click-node="true"
        :default-checked-keys="checkedIds"
        :props="defaultProps"
        @node-expand="nodeExpand"
      >
        <template #default="{ node, data }">
          <div :class="{ 'node-no-children': data.childs.length === 0 }">
            <span>{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
    </el-card>

    <div class="flex items-center justify-end w-full h-[72px] fixed right-0 bottom-0 z-10 pr-[36px] shadow el-bg-color">
      <el-button type="primary" @click="submitPermission">提交</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { ElTree } from 'element-plus'
import { getRolePermissions, setRolePermissions } from "@/api/system/role";

const loading = ref<boolean>(false);

const defaultProps = {
  children: "childs",
  label: "title",
};

// const tree = ref<InstanceType<typeof ElTree>>()
const tree = ref();

const role = ref<string>("");

const permissions = ref([]);

const checkedIds = ref<Array<number>>([]);

const route = useRoute();

const router = useRouter();

const roleId = ref<number>(0);

onMounted(function () {
  if (route && route.query && route.query.id) {
    if (typeof route.query.id === "string") {
      roleId.value = parseInt(route.query.id);

      initializeData();
    }
  }
});

function initializeData() {
  loading.value = true;

  getRolePermissions({ id: roleId.value })
    .then((res: Record<string, any>) => {
      permissions.value = res.permissions;

      role.value = res.role;

      checkedIds.value = res.checkedIds;

      loading.value = false;

      nodeExpand();
    })
    .catch(() => {});
}

function submitPermission() {
  if (tree.value && typeof tree.value.getCheckedKeys === "function") {
    if (loading.value) {
      return;
    }

    loading.value = true;

    const ids = tree.value.getCheckedKeys();

    setRolePermissions({ ids: ids, role_id: roleId.value })
      .then(() => {
        loading.value = false;

        ElNotification({
          type: "success",
          title: "",
          message: "权限已设置",
          duration: 3000,
        });
      })
      .catch(() => {
        loading.value = false;
      });
  }
}

function goBack() {
  router.back();
}

function nodeExpand() {
  nextTick(() => {
    adjustNodes();
  });
}

function adjustNodes() {
  var treeItems: HTMLCollectionOf<Element> = document.getElementsByClassName("node-no-children");
  for (var i = 0; i < treeItems.length; i++) {
    const item: HTMLElement = treeItems[i].parentNode as HTMLElement;
    if (item) {
      item.style.cssFloat = "left";
    }
  }
}
</script>
