import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import NProgress from '@/utils/progress'
import { getToken, removeToken } from '@/utils/auth'
import { useUser } from '@/stores/user'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/personal/login.vue'),
    hidden: true,
    meta: {
      title: '登录注册'
    }
  }
]

const { PROD, BASE_URL } = import.meta.env

const router = createRouter({
  history: PROD === true ? createWebHistory(BASE_URL) : createWebHashHistory(BASE_URL),
  routes: routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  }
})

const whiteList = ['/login']

router.beforeEach(async (to: AppRoute.ToRoute, _from, next) => {
  NProgress.start()

  if (to.meta.title && !to.meta.link) {
    document.title = to.meta.title
  }

  function toRedirect() {
    removeToken()
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }

  const token = getToken()
  if (token) {
    if (to.path === '/login') {
      if (to.query?.must) {
        next()
      } else {
        next({ path: '/' })
        NProgress.done()
      }
    } else {
      const user = useUser()
      if (user.accessAbility) {
        // 如果是链接，直接打开链接，其他就 next
        if (to.meta.link) {
          window.open(to.meta.link, '_blank')
          NProgress.done()
          next(false)
        } else {
          next()
        }
      } else {
        try {
          const menus: Array<Record<string, any>> = await user.getUserInfo()
          const accessAbility = user.setRoutes(router, menus)
          if (accessAbility) {
            next({ ...to, replace: true })
          } else {
            toRedirect()
          }
        } catch (error) {
          toRedirect()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      toRedirect()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
