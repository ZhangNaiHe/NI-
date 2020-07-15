module.exports = {
  // 控制webpack-dev-server的配置
  devServer: {
    // 自动打开浏览器
    open: true,
    // 热更新
    hot: true
  },
  // 配置webpack
  configureWebpack: {
    // 
    externals: {
      // 格式: 包名: 构造函数的名字
      "vue": "Vue",
      "vue-router": "VueRouter",
      "lodash": "_",
      "axios": "axios",
      "echarts": "echarts"
    }
  }
};
