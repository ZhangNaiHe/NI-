<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row>
        <el-col :span="24">
          <span>选择商品分类：</span>
          <el-cascader
            v-model="categorySelected"
            :options="categoryList"
            :props="categoryProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addParams"
          >添加参数</el-button>
          <el-table
            :data="manyList"
            style="width: 100%"
            border
          >
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in scoped.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scoped.row, index)"
                >{{ tag }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParams(scoped.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addParams"
          >添加属性</el-button>
          <el-table
            :data="onlyList"
            style="width: 100%"
            border
          >
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  :cc="scoped"
                  @click="editParams(scoped.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="this.activeName == 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addParamsDialog"
      @close="resetParamsDialog"
      width="50%"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsRef"
        label-width="100px"
      >
        <el-form-item
          :label="this.activeName == 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addParamsDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveAddParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="this.activeName == 'many' ? '修改动态参数' : '修改静态属性'"
      :visible.sync="editParamsDialog"
      width="50%"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsRules"
        ref="editParamsRef"
        label-width="100px"
      >
        <el-form-item
          :label="this.activeName == 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editParamsDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveEditParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "many",
      categoryList: [],
      categorySelected: [],
      categoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      manyList: [],
      onlyList: [],
      addParamsDialog: false,
      addParamsForm: {
        attr_name: ""
      },
      addParamsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      editParamsDialog: false,
      editParamsForm: {
        attr_name: ""
      },
      editParamsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数",
            trigger: "blur"
          }
        ]
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    // 请求数据
    async getCategoryList() {
      const { data: res } = await this.$http.get("categories");
      this.categoryList = res.data.result;
    },
    // 监听handleChange方法  如果不是三个 让选中项数组置空 只有 选中的项的数组的个数是三个 才可以
    handleChange() {
      if (this.categorySelected.length !== 3) {
        this.categorySelected = [];
        this.manyList = [];
        this.onlyList = [];
      } else {
        this.getParamsList();
      }
    },
    // 获取参数列表
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach(item => {
        if (item.attr_vals) {
          let arr = item.attr_vals.split(" ");
          item.attr_vals = arr;
        } else {
          item.attr_vals = [];
        }
      });
      if (this.activeName == "many") {
        this.manyList = res.data;
      } else {
        this.onlyList = res.data;
      }
    },
    // 当tab栏进行切换的时候 重新查询数据并且渲染
    handleClick() {
      this.getParamsList();
    },
    // 添加属性
    addParams() {
      this.addParamsDialog = true;
    },
    // 重置 表单
    resetParamsDialog() {
      this.$refs.addParamsRef.resetFields();
    },
    // 保存添加属性
    saveAddParams() {
      this.$refs.addParamsRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.addParamsDialog = false;
        this.getParamsList();
        this.$message.success("添加数据成功");
      });
    },
    async deleteParams(id) {
      const chooseResut = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (chooseResut == "cancel") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.categoryId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.getParamsList();
      this.$message.success("删除成功");
    },
    // 编辑参数回显
    async editParams(row) {
      this.editParamsDialog = true;
      const { data: res } = await this.$http.get(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          params: {
            attr_sel: row.attr_sel
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.editParamsForm = res.data[0];
    },
    // 保存编辑参数的数据
    saveEditParams() {
      this.$refs.editParamsRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.editParamsForm.cat_id}/attributes/${this.editParamsForm.attr_id}`,
          this.editParamsForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("数据更新失败");
        }
        this.getParamsList();
        this.editParamsDialog = false;
        this.$message.success("数据更新成功");
      });
    },
    // 失去焦点 和按下回车的时候 让input隐藏
    handleInputConfirm(row) {
      if (this.inputValue.trim().length == 0) {
        this.inputVisible = false;
        this.inputValue = "";
        return false;
      }
      if (this.inputValue.trim().length > 0) {
        row.attr_vals.push(this.inputValue.trim());
      }
      this.inputValue = "";
      this.inputVisible = false;
      this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" ")
      });
    },
    // 点击按钮的时候 要让input显示
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        console.log(_);
      });
    },
    // 删除标签
    handleClose(row, index) {
      row.attr_vals.splice(index, 1);
      this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" ")
      });
    }
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    isDisabled: function() {
      if (this.categorySelected.length == 3) return false;
      return true;
    },
    categoryId: function() {
      if (this.categorySelected.length == 3) {
        return this.categorySelected[2];
      }

      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-alert,
.el-button {
  margin-bottom: 15px;
}

.el-tag {
  margin: 10px 5px;
}

.input-new-tag {
  width: 90px;
  margin: 10px 0;
}
</style>
