declare namespace AppRoute {
  interface ToRoute extends RouteLocationNormalized {
    meta: RouteMeta
    path: string
    query?: Record<string, any>
  }

  interface InitRoutesData {
    menus: Array<Route>
    routeNames: Array<string>
  }

  /** 单个路由的类型结构(动态路由模式：后端返回此类型结构的路由) */
  interface Route {
    /** 路由名称(路由唯一标识) */
    name: string
    /** 路由路径 */
    path: string
    /** 路由重定向 */
    redirect?: string
    /** 路由组件 布局组件（基础布局和空白布局[容器]）或某一个具体的组件*/
    component?: RawRouteComponent | null
    /** 子路由 */
    children?: Route[]
    /** 路由描述 */
    meta: RouteMeta
    /** 路由属性 */
    props?: boolean | Record<string, any> | ((to: any) => Record<string, any>)
  }

  /** 路由描述 */
  type RouteMeta = {
    /** 菜单和面包屑对应的图标 */
    icon?: string
    /** 路由标题(可用来作document.title或者菜单的名称) */
    title: string
    /** 侧边栏高亮(通常用作详情页高亮父级菜单)) */
    activePath?: string
    /** 是否显示父菜单（对子菜单只有一个的情况有效果） */
    alwaysShow?: boolean
    /** 外链链接（点击，跳转 _blank 方式打开页面） */
    link?: string
    /** iframe (单独一个 iframe 组件作为承接)*/
    iframe?: string
    /** 缓存页面 */
    keepAlive?: boolean
    /** 是否在菜单中隐藏 */
    hidden?: boolean
    /** 路由顺序，可用于菜单的排序 */
    order?: number
  }
}

declare interface LayoutConfig {
  collapse?: boolean
}

declare interface UserRole {
  name: string
  title: string
}

// 表格列控制
declare interface TableColumnsControllerItem {
  label: string
  value: string
  width?: number
  align?: string
  fixed?: string
  readonly: boolean
  show: boolean
}
