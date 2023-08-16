<template>
    <el-breadcrumb class="mx-5 text-sm" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                <router-link v-if="item.path !== route.path" :to="{ path: item.path }">
                    {{ item.meta.title }}
                </router-link>

                <span v-else>
                    {{ item.meta.title }}
                </span>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

let menus:Array<AppRoute.Route>
let breadcrumbs = ref<Array<AppRoute.Route>>([])

const route = useRoute()
watch(route, () => {
    getBreadcrumb()
}, { immediate: true })

onMounted(() => {
    getBreadcrumb()
})

function getBreadcrumb() {
    if (!route || !route.path) {
        return
    }

    if (!menus) {
        const routes:string | null = sessionStorage.getItem('admin-routes')
        if (routes) {
            menus =  JSON.parse(routes) as Array<AppRoute.Route>
        }
    }

    // 搞了五层，按场景一般不会超过 3 层，循环 5 存已足够了的。
    for(let i = 0; i < menus.length; i++) {
        const menui:AppRoute.Route = menus[i]
        if (menui.path === route.path) {
            breadcrumbs.value = [menui]
            break;
        }

        if (menui.children) {   
            for(let j = 0; j < menui.children.length; j++) {
                const menuj:AppRoute.Route = menui.children[j]
                if (menuj.path === route.path) {
                    breadcrumbs.value = [menui, menuj]
                    break;
                }

                if (menuj.children) {
                    for(let k = 0; k < menuj.children.length; k++) {
                        const menuk:AppRoute.Route = menuj.children[k]
                        if (menuk.path === route.path) {
                            breadcrumbs.value = [menui, menuj, menuk]
                            break;
                        }

                        if (menuk.children) {
                            for(let l = 0; l < menuk.children.length; l++) {
                                const menul:AppRoute.Route = menuk.children[l]
                                if (menul.path === route.path) {
                                    breadcrumbs.value = [menui, menuj, menuk, menul]
                                    break;
                                }

                                if (menul.children) {
                                    for(let m = 0; m < menul.children.length; m++) {
                                        const menum:AppRoute.Route = menul.children[m]
                                        if (menum.path === route.path) {
                                            breadcrumbs.value = [menui, menuj, menuk, menul, menum]
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</script>