<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="5">
          <el-button type="primary" @click="addRolesDialog = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scoped">
            <el-row
              v-for="(item, index) in scoped.row.children"
              :key="item.id"
              :style="{
                'border-bottom': '1px solid #eee',
                'border-top': index === 0 ? '1px solid #eee' : ''
              }"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRights(scoped.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                  :style="{
                    'border-top': index2 === 0 ? '' : '1px solid #eee'
                  }"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRights(scoped.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      :cc3="index3"
                      type="warning"
                      closable
                      @close="removeRights(scoped.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getRolesListById(scoped.row.roleId)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoles(scoped.row.roleId)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRights(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="addRolesDialog" width="50%">
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="更新角色信息" :visible.sync="editRolesDialog" width="50%">
      <el-form
        :model="editRolesForm"
        :rules="editRolesFormRules"
        ref="editRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRoles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="setRightsDialog" width="50%">
      <el-tree
        ref="tree"
        :data="rightsList"
        :props="rightsProps"
        :show-checkbox="true"
        :default-expand-all="true"
        :default-checked-keys="rightsCheckedKeys"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRolesDialog: false,
      addRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "角色名称长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "角色描述长度在 3 到 50 个字符",
            trigger: "blur"
          }
        ]
      },
      editRolesDialog: false,
      editRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      editRolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "角色名称长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "角色描述长度在 3 到 50 个字符",
            trigger: "blur"
          }
        ]
      },
      setRightsDialog: false,
      rightsList: [],
      rightsProps: {
        label: "authName",
        children: "children"
      },
      rightsCheckedKeys: [],
      roleId: ""
    };
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },
    // 添加角色
    addRoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败");
        }

        this.addRolesDialog = false;
        this.$message.success("添加角色成功");
        this.getRolesList();
      });
    },
    // 修改角色
    async getRolesListById(id) {
      this.editRolesDialog = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }

      this.editRolesForm = res.data;
    },
    // 更新角色信息
    updateRoles() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRolesForm.roleId}`,
          this.editRolesForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("角色信息修改失败");
        }

        this.editRolesDialog = false;
        this.$message.success("角色信息修改成功");
        this.getRolesList();
      });
    },
    // 删除角色
    async removeRoles(id) {
      const chooseResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (chooseResult === "cancel") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("该用户删除失败");
      }

      this.getRolesList();
    },
    // 删除权限
    async removeRights(role, rightId) {
      let chooseResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (chooseResult === "cancel") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      if (chooseResult === "confirm") {
        const { data: res } = await this.$http.delete(
          `roles/${role.roleId}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("取消权限失败");
        }

        this.$message.success("取消权限成功");
        role.children = res.data;
      }
    },
    // 分配权限
    async setRights(role) {
      this.roleId = role.roleId;
      this.setRightsDialog = true;
      const { data: res } = await this.$http.get("rights/tree");
      this.rightsList = res.data;

      let keys = [];
      this.getLeafId(role, keys);
      this.rightsCheckedKeys = keys;
    },
    getLeafId(role, keyArr) {
      if (!role.children) {
        return keyArr.push(role.roleId);
      }
      role.children.forEach(item => this.getLeafId(item, keyArr));
    },
    async updateRights() {
      let fullCheckedArr = this.$refs.tree.getCheckedKeys();
      let halfCheckedArr = this.$refs.tree.getHalfCheckedKeys();
      let newArr = fullCheckedArr.concat(halfCheckedArr);

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: newArr
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("更新角色权限失败");
      }

      this.$message.success("更新角色权限成功");
      this.setRightsDialog = false;
      this.getRolesList();
    }
  },
  created: function() {
    this.getRolesList();
  }
};
</script>

<style lang="less" scoped>
.el-table,
.el-card {
  margin-top: 15px;
}

.el-tag {
  margin: 10px 5px;
}
</style>
