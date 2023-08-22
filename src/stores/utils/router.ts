import type { RouteRecordRaw, Router } from 'vue-router'
const modulesRoutes = import.meta.glob(["@/views/**/*.{vue,tsx}", "!@/views/layouts/**/*.{vue,tsx}"])
const BasicLayout = () => import('@/views/layouts/base.vue')
const IframeLayout = () => import('@/views/layouts/iframe.vue')

// 菜单的顺序，服务端已经先整理好了。当然 / 必须是第一个路由
export default function initRoutes(router:Router, menus:Array<any>):AppRoute.InitRoutesData {
    const tempRoutes: Array<AppRoute.Route> = []
    const tempNames: Array<string> = []
    const index = menus.findIndex((item) => item.path === '/')
    if (index == -1) {
      menus.unshift({
          path: '/',
          name: 'home',
          component: 'Layout',
          title: '首页'
      })
    } else {
      menus = menus.splice(index, 1).concat(menus)
    }
    const layoutName = menus[0]['name']
   
    function generateMenu(routes:Array<AppRoute.Route>, menus:Array<any>, prefix = '') {
      menus.forEach(item => {
        const path = prefix + item.path
        let redirect = item.redirect
        if (!item.redirect && item.children && item.children.length > 0) {
          if (path === '/') {
            redirect = path + item.children[0]['path']
          } else {
            redirect = path + '/' + item.children[0]['path']
          }
        }

        let component;
        if (!prefix && item.path === '/') {
          component = BasicLayout
        } else if (prefix && item.children && item.children.length > 0) {
          component = null
        } else {
          if (item.iframe) {
            component = IframeLayout
          } else if (!item.link) {
            // 只有最后一级，我才需要去渲染组件。如果是跟目录下组件，就包裹在 home 下边
            if (!item.component && (!item.children || item.children.length == 0)) {
              if (path.lastIndexOf('/') === 0) {
                item.component = 'home' + path
              } else {
                item.component = path.substring(1)
              }
            }

            if (item.component) {
              component = modulesRoutes[`/src/views/${item.component}.vue`]
            }
          }
        }

        let activePath;
        if (item.active_path) {
          activePath = item.active_path
        } else {
          activePath = (item.children && item.children.length > 0) && prefix ? prefix : undefined
        }
        const menu: AppRoute.Route = {
          path: path,
          name: item.name,
          redirect: redirect,
          component: component,
          meta: {
            title: item.title,
            icon: item.icon,
            alwaysShow: item.always_show ?? false,
            hidden: item.hidden ? true : false,
            keepAlive: item.keep_alive ? true : false,
            link: item.link ?? '',
            iframe: item.iframe ?? '',
            activePath: activePath
          },
          children: []
        }

        // 非一直显示
        if (item.children && item.children.length == 1 && !item.children[0]['always_show']) {
          item.children[0]['active_path'] = item.path
          menu.meta.title = item.children[0]['title']
          menu.meta.icon = item.children[0]['icon'] ?? item['icon']
        }
        
        if (item.children && item.children.length > 0 && menu.children) {
          const newPath = path === '/' ? path : path + '/'
          generateMenu(menu.children, item.children, newPath)
        } else {
          delete menu.children
        }

        routes.push(menu)
        tempNames.push(item.name)

        const history = router && router.options && router.options.routes && router.options.routes ? router.options.routes[0] : null
        if (history && history.children && history.children.findIndex(value => value.path === menu.path) !== -1) {
          history.children.push(menu as RouteRecordRaw)
        }

        if (item.path !== '/') {
          router.addRoute(layoutName, menu as RouteRecordRaw)
        } else {
          router.addRoute(menu as RouteRecordRaw)
        }
      })
    }

    generateMenu(tempRoutes, menus)

    const notFound:RouteRecordRaw = {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import("@/views/errors/404.vue"),
        meta: {
            title: '上错星球啦'
        }
    }
    router.addRoute(notFound)

    return { menus: tempRoutes, routeNames: tempNames }
}