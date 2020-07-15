<template>
  <div class="login">
    <!-- card 组件 -->
    <el-card class="card">
      <!-- 图片 -->
      <div class="avatar">
        <img src="../assets/image/Nishop.png" />
      </div>
      <!-- 表单 -->
      <!-- :rules 表单校验规则对象 -->
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 账号/用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="loginForm.password">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <div class="clearfix">
          <el-button type="warning" class="button-login" @click="handleLogin"
            >登录</el-button
          >
          <el-button type="info" class="button-reset" @click="handleReset"
            >重置</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      // 校验规则对象
      loginFormRules: {
        username: [
          // required 是否必须
          // message 如果没有填写 会在输入框下面出现这句话
          // trigger: 怎样的条件下触发  blur失去焦点的时候
          { required: true, message: "请输入您的用户名", trigger: "blur" },
          {
            min: 3,
            max: 18,
            message: "用户名长度在 3 到 18个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          // required 是否必须
          // message 如果没有填写 会在输入框下面出现这句话
          // trigger: 怎样的条件下触发  blur失去焦点的时候
          { required: true, message: "请输入您的密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度在 6 到 18个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 重置表单数据
    handleReset() {
      this.$refs.loginFormRef.resetFields();
    },
    handleLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid); // true false
        //如果校验没有通过 那么直接return
        if (!valid) return false;
        // 如果校验通过了(有两种情况: 通过了不存在用户 通过了也有用户)
        let { data: res } = await this.$http.post("login", this.loginForm);

        // console.log(res);
        //判断 如果状态码是400 意味着用户不存在 那么告诉用户 用户不存在 停止程序
        if (res.meta.status == 400) {
          // 当登录失败 要清空token

          window.sessionStorage.removeItem("token");
          // 提示
          return this.$message.error(res.meta.msg);
        }

        // 判断 如果状态码是200 意味着登录成功 要跳转
        if (res.meta.status == 200) {
          // 存令牌
          window.sessionStorage.setItem("token", res.data.token);
          // 页面跳转
          this.$router.push("/home");
          //提示
          return this.$message.success(res.meta.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("../assets/image/bgimg.jpg");
  background-size: 100% 100%;

  .card {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // 这句话就是为了干掉 overflow:hidden 就和没写一样效果
    overflow: initial;
  }

  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    background-color: #fff;
    left: 50%;
    transform: translate(-50%, -60%);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login-form {
    margin-top: 100px;
  }

  .button-reset {
    float: right;
  }
}
</style>
