<template>
  <div class="user-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialog = !addDialog"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.type"
              active-color="#13ce66"
              inactive-color="#C0CCDA"
              @change="changeState(scoped.row.id, scoped.row.type, scoped.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getUserById(scoped.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scoped.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="assignRoles(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      width="50%"
      @close="resetAddForm"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="editDialog" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserById">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="assignRolesDialog" width="50%">
      <p>当前的用户：{{ assignRolesInfo.username }}</p>
      <p>当前的角色：{{ assignRolesInfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRoles" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSignRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkEmail = (rule, value, callback) => {
      if (!value) return callback(new Error("请输入您的邮箱"));
      /* eslint-disable */

      if (
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
          value
        )
      ) {
        //
        callback();
      } else {
        callback(new Error("您的邮箱格式不正确"));
      }
    };

    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      userList: [],
      addDialog: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入您的用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入您的密码", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入您的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入您的手机号", trigger: "blur" }
        ]
      },

      editDialog: false,
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入您的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入您的手机号", trigger: "blur" }
        ]
      },
      assignRolesDialog: false,
      assignRolesInfo: {
        username: "",
        rolename:""
      },
      rolesList: [],
      selectedRoles: ""
    };
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败!");

      this.userList = res.data.users;
      this.total = res.data.totalpage;
    },
    // 处理 每页显示多少条数据
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getUserList();
    },
    // 跳转到第几页 要把页码要传出来
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getUserList();
    },
    //改变用户状态
    async changeState(id, type, user) {
      const { data: res } = await this.$http.put(`users/${id}/state/${type}`);
      if (res.meta.status !== 200) {
        user.type = !user.type;

        return this.$message.error("用户状态设置失败");
      }

      this.$message.success("用户状态修改成功");
    },
    // 重置表单
    resetAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("用户添加失败");
        this.addDialog = false;
        this.getUserList();
      });
    },
    // 删除用户
    async removeUser(id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        return "cancel";
      });

      if (result === "cancel") {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      } else if (result === "confirm") {
        let { data: res } = await this.$http.delete(`users/${id}`);
        if (res.meta.status !== 200) return this.$message.error("删除失败");
        this.$message.success("删除用户成功");
        this.getUserList();
      }
    },
    // 通过用户Id查找用户信息
    async getUserById(id) {
      this.editDialog = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败");
      }
      this.editForm = res.data;
    },
    // 修改信息
    editUserById() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        );
        if (res.meta.status !== 200) {
          this.editDialog = false;
          return this.$message.error("用户数据更新失败");
        }

        this.$message.success("用户数据更新成功");
        this.editDialog = false;
        this.getUserList();
      });
    },
    // 分配角色
   async  assignRoles(users) {
      this.assignRolesDialog = true;
      this.assignRolesInfo = users;
      const {data: res} = await this.$http.get("roles");
      this.rolesList  = res.data;
    },
    async saveSignRoles() {
      if(!this.selectedRoles) return this.$message.error("请选中一个角色");
      const {data: res} = await this.$http.put(`users/${this.assignRolesInfo.id}/role`,{
        rid: this.selectedRoles
      });

      if(res.meta.status !== 200) {
        return this.$message.error("角色分配失败");
      }

      this.getUserList();
      this.$message.success("角色分配成功");
      this.assignRolesDialog = false;
    }
  },
  created: function() {
    this.getUserList();
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
