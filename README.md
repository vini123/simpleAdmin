# simpleAdmin

该后台使用 vite + ts + pnpm + vue3 + element-plus + tailwindcss 等技术栈构成。没有添加任意可视化图标等插件。以最小功能，最基础功能展现。用户可以额外添加可使用的插件逻辑。

该后台后端使用 php8.2 + laravel 10 + mysql。

在线体验： [https://www.zeipan.com/admin](https://www.zeipan.com/admin)

权限以及密码一键复位: [https://v3test.yuepaibao.com/admin/api/reset](https://v3test.yuepaibao.com/admin/api/reset)

测试账号以及密码： `zhoulin@xiangrong.pro`、   `111111` （如果发现登录不了，请复位谢谢）

图片预览：[https://github.com/vini123/simpleAdmin/blob/main/action.gif](https://github.com/vini123/simpleAdmin/blob/main/action.gif)

![image](action.gif)

# 前端技术栈选择说明

- 选择 vue3。是因为我只会 vue3 技术栈。
- 选择 element-plus。是因为我觉得 element-plus 是众多 ui 框架中，算是最好看的，功能也几乎是都有。对于做后台来说是很不错。
- 选择 tailwindcss。是不想在 template、script。之外再写 css。不想将 css 写在 style 下。当然有的时候为了追求极致好看，有些页面还是会写的（tailwindcss）不太熟。
- 选择 ts。是因为到了不得不写 ts 的时候了。在写这个之前，是从来没用 ts 写过项目。从面向对象过来的，知道强类型的舒服处。还有觉得，不要畏惧，写着写着，就会会了。
- 选择 nprogress。是因为情怀。这个用了很多很多年。也的确好用。
- 所有选择，什么新，什么好用就用什么。
# 后端技术栈选择说明

- 选择 php。是当前后端就 php 最熟练。后边会使用 go 语言。
- 选择 laravel 10 框架。laravel 10 是当前 laravel 的最新版本。laravel 还是最优雅，最舒服的全栈框架。吐槽性能啥的可以不用，也可以研究研究 `octane`。
- 所有选择，什么新，什么好用就用什么。

# 安装使用

```
# 先下载
git clone xxxx

# 再安装
cd xxx
pnpm install

# 运行就可以
pnpm dev
```

当前，我后端接口提供跨请求，也是可以测试使用的。

# 后台说明

### 视觉模块组成说明

遵从传统的后台模式。后台分左侧菜单栏，顶部状态栏，右侧内容栏。该后台仅有该布局方式。当然像登录、404 页面是全屏都占的哈。

### 菜单路由说明

- 菜单数据除了登录和 404页面。其他的全来自后端，也就是后端给什么数据左侧菜单栏就展示什么数据。权限控制也完全在后台，可以精确到按钮。这样前端爽，后端也爽。

（后端权限怎么控制呢。后端是以角色的形式来控制用户的权限，不单独给用户设置权限（当然是可以给用户设置，我后端就是倔强，就不，就只给角色设置权限）。给角色设置了很多权限。给用户设置了一个或多个角色。这样用户也就拥有了很多权限。后台用户、角色、权限这块的增删修改等等已完善。）

- 菜单的排序也是由后端提供，前端提供修改。排序只对当前层级排序。也就是顶级菜单对顶级菜单排序。当前二级菜单对当前二级菜单排序。依次类推。有排序，只是为了以防万一要换个菜单位置呢。

- 菜单按理说是支持无限嵌套。后端、前端都会对菜单数据进行递归处理。

- 菜单 icon。建议只给顶级菜单配置 icon（仅仅是为了好看）。 icon 使用的 iconify。需要自己去找 svg，然后在 assets 中进行配置上。有一个比较好的站点，可以去下 svg [https://www.flaticon.com/](https://www.flaticon.com/)
