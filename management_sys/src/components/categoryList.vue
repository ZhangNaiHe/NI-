<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="5">
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <table-tree
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
      >
        <template slot="isOk" slot-scope="scoped">
          <i
            v-if="scoped.row.cat_deleted == 'false'"
            class="el-icon-success"
            style="color:green"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="scoped">
          <el-tag v-if="scoped.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-if="scoped.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" v-if="scoped.row.cat_level == 2">三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scoped">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCategory(scoped.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCategory(scoped.row.cat_id)"
            >删除</el-button
          >
        </template>
      </table-tree>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="categoryTotal"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addCategoryDialog" width="50%">
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryRules"
        ref="addCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类" label-width="100px">
          <el-cascader
            v-model="addCategorySelected"
            :options="addCategoryList"
            :props="addCategoryProps"
            @change="handleChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="editCategoryDialog" width="50%">
      <el-form
        :model="editCategoryForm"
        :rules="editCategoryRules"
        ref="editCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "sort"
        },
        {
          label: "操作",
          type: "template",
          template: "operate"
        }
      ],
      categoryTotal: 0,
      addCategoryDialog: false,
      addCategoryForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCategoryRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      addCategoryList: [],
      addCategorySelected: [],
      addCategoryProps: {
        label: "cat_name",
        checkStrictly: true,
        value: "cat_id",
        children: "children"
      },
      editCategoryDialog: false,
      editCategoryForm: {
        cat_name: ""
      },
      editCategoryRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表数据失败");
      }

      this.categoryList = res.data.result;
      this.categoryTotal = res.data.total;
    },
    // 监听页面发生变化
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getCategoryList();
    },
    // 添加分类方法
    async addCategory() {
      this.addCategoryDialog = true;
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.addCategoryList = res.data.result;
    },
    // 监听级联列表中值的变化
    handleChange() {
      if (this.addCategorySelected.length == 0) {
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      } else {
        this.addCategoryForm.cat_pid = this.addCategorySelected[
          this.addCategorySelected.length - 1
        ];
        this.addCategoryForm.cat_level = this.addCategorySelected.length;
      }
    },
    // 提交添加分类
    saveCategory() {
      this.$refs.addCategoryRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCategoryForm
        );
        this.$refs.addCategoryRef.resetFields();
        this.addCategorySelected = [];
        this.addCategoryDialog = false;
        this.getCategoryList();
        this.$message.success(res.meta.msg);
      });
    },
    // 编辑分类
    async editCategory(id) {
      this.editCategoryDialog = true;
      const { data: res } = await this.$http.get(`categories/${id}`);
      this.editCategoryForm = res.data[0];
    },
    // 保存编辑分类名称
    saveEditCategory() {
      this.$refs.editCategoryRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCategoryForm.cat_id,
          this.editCategoryForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新数据失败");
        }
        this.editCategoryDialog = false;
        this.editCategoryForm = [];
        this.getCategoryList();
        this.$message.success("更新数据成功");
      });
    },
    // 删除分类
    async deleteCategory(id) {
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
      const { data: res } = await this.$http.delete(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除数据失败");
      }

      this.getCategoryList();
    }
  },
  created() {
    this.getCategoryList();
  }
};
</script>

<style lang="less" scoped>
.el-card,
.el-pagination {
  margin-top: 15px;
}

.el-row {
  margin-bottom: 15px;
}
</style>
