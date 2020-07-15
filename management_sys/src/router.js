import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/home",
          redirect: "/users"
        },
        {
          path: "/welcome",
          // 懒加载 组件 好处是 用的时候才去引入组件
          component: () => import("@/components/welcome.vue")
        },
        //  用户列表
        {
          path: "/users",
          //组件的名称 应该使用大驼峰  每个单词的首字母要大写
          // @ 代表的是 './src' 路由的别名
          component: () => import("@/components/UserList.vue")
        },
        //  权限列表
        {
          path: "/rights",
          //组件的名称 应该使用大驼峰  每个单词的首字母要大写
          // @ 代表的是 './src' 路由的别名
          component: () => import("@/components/RightsList.vue")
        },
        // 角色列表
        {
          path: "/roles",
          component: () => import("@/components/RolesList.vue")
        },
        // 商品分类列表
        {
          path: "/categories",
          component: () => import("@/components/categoryList.vue")
        },
        // 参数列表
        {
          path: "/params",
          component: () => import("@/components/ParamsList.vue")
        },
        // 订单列表
        {
          path: "/orders",
          component: () => import("@/components/OrdersList.vue")
        },
        // 商品列表
        {
          path: "/goods",
          component: () => import("@/components/GoodsList.vue")
        },
        // 商品添加
        {
          path: "/goods/add",
          component: () => import("@/components/GoodsAdd.vue")
        },
        // 数据统计
        {
          path: "/reports",
          component: () => import("@/components/DataReports.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "about",
      // 当访问 /login的时候 采取引入Login组件
      component: () => import("./views/Login.vue")
    }
  ]
});

路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果是登录 直接放行
  if (to.path == "/login") return next();
  // 如果是别的页面 先要看看是否登录
  const token = sessionStorage.getItem("token");
  // 如果没有登录 去登录
  if (!token) return next("/login");
  // 否则放行
  next();
});

export default router;
