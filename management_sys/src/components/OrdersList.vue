<template>
  <div class="orders">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100"
        ></el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.pay_status == 0" type="warning">
              未付款
            </el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80"
        ></el-table-column>
        <el-table-column label="下单时间" width="200">
          <template slot-scope="scoped">{{
            scoped.row.add_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-s-promotion"
              :cc="scoped"
              size="mini"
              @click="send(scoped.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="getwlInfo"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      ></el-pagination>
    </el-card>

    <el-dialog title="物流信息" :visible.sync="wlDialog" width="50%">
      <el-steps direction="vertical" :active="0">
        <el-step
          v-for="(item, index) in wlinfoList"
          :key="index"
          :title="item.time"
          :description="item.context"
        ></el-step>
      </el-steps>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wlDialog = false">取 消</el-button>
        <el-button type="primary" @click="wlDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      orderList: [],
      pageTotal: 0,
      wlDialog: false,
      wlinfoList: []
    };
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      }

      this.orderList = res.data.goods;
      this.pageTotal = res.data.totalpage;
    },
    // 一页显示多少条数据发生变化之后触发
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getOrderList();
    },
    // 页码发生变化之后触发
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getOrderList();
    },
    // 获取物流信息
    async getwlInfo() {
      this.wlDialog = true;
      const { data: res } = await this.$http.get("/kuaidi/619915933338");
      this.wlinfoList = res.data;
    },
    // 发货
    async send(ord) {
      this.$http.put(`orders/${ord.order_id}`, {
        is_send: ord.is_send
      });
      this.getOrderList();
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style>
.el-card,
.el-table,
.el-pagination {
  margin-top: 15px;
}
</style>
