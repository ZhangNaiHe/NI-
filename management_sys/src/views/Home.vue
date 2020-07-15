<template>
  <!-- contrainer 布局容器组件 -->
  <el-container class="home">
    <el-header class="header">
      <img src="../assets/image/Nishop.png" alt />
      <h3>NI商城后台管理系统</h3>
      <el-button type="info" @click="handleLogOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '64px' : '200px'" class="aside">
        <div class="toggle-aside" @click="collapse = !collapse">|||</div>
        <!-- NavMenu 导航菜单-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#fff"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="item.path"
            v-for="(item, index) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="subItem.path"
              v-for="(subItem, subIndex) in item.children"
              :key="subItem.id"
              :cc="subIndex"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //菜单数据
      menuList: [],
      //一级菜单图片数据
      iconList: [
        "el-icon-user-solid",
        "el-icon-s-tools",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-marketing"
      ],
      // 控制左侧菜单折叠
      collapse: false
    };
  },
  methods: {
    //退出方法
    handleLogOut: function() {
      //清除浏览器中的令牌相当于 进了故宫把门票撕了
      window.sessionStorage.removeItem("token");
      //跳转
      this.$router.push("/login");
    },
    // 渲染左侧菜单方法
    handleLeftMenu: async function() {
      // 发起ajax请求
      const { data: res } = await this.$http.get("menus");
      // console.log(data);

      if (res.meta.status !== 200) {
        return this.$message.error("获取菜单数据失败");
      }

      this.menuList = res.data;
      // console.log(this.menuList);
    }
  },
  created: function() {
    this.handleLeftMenu();
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}
.header {
  background-color: #ffffff;
  user-select: none;

  img {
    float: left;
    margin-top: 2px;
    margin-right: 10px;
    width: 60px;
    height: 60px;
  }

  h3 {
    margin: 0px;
    float: left;
    color: #616063;
    font-weight: normal;
    font-size: 22px;
    line-height: 60px;
  }

  .el-button {
    float: right;
    margin-top: 10px;
  }
}

.aside {
  background-color: #313541;

  .toggle-aside {
    background-color: #313541;
    text-align: center;
    height: 22px;
    font-size: 12px;
    color: #fff;
    line-height: 20px;
    letter-spacing: 1px;
    user-select: none;
  }

  .el-menu {
    border-right: none;
  }
}

.main {
  background-color: #eaedf1;
}
</style>
