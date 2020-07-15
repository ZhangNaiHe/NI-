<template>
  <div class="goods-add">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <el-steps
        :active="activeName - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="goodsAddForm"
        :rules="goodsAddRules"
        ref="goodsAddRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          tab-position="left"
          :before-leave="handleBeforeLeave"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="goodsAddForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input v-model="goodsAddForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input v-model="goodsAddForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input v-model="goodsAddForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                v-model="goodsAddForm.goods_cat"
                :options="categoryList"
                :props="categoryProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              v-for="item in manyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(subitem, subindex) in item.attr_vals"
                  :key="subindex"
                  :label="subitem"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              v-for="item in onlyData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              action="http://127.0.0.1:7979/api/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="uploadToken"
              multiple
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <quill-editor
              v-model="goodsAddForm.goods_introduce"
              ref="myQuillEditor"
            ></quill-editor>

            <el-button
              type="primary"
              style="margin-top: 15px;"
              @click="handleGoodsAdd"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="imagePreviewDialog"
      width="30%"
    >
      <img
        width="100%"
        :src="imagePreviewPath"
        alt
      />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeName: "0",
      goodsAddForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      goodsAddRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称!",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品名称!",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品名称!",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品名称!",
            trigger: "blur"
          }
        ],
        goods_cat: [
          {
            required: true,
            message: "请输入商品名称!",
            trigger: "blur"
          }
        ]
      },
      categoryList: [],
      categoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      manyData: [],
      onlyData: [],
      uploadToken: {
        Authorization: window.sessionStorage.getItem("token")
      },
      imagePreviewDialog: false,
      imagePreviewPath: ""
    };
  },
  methods: {
    // tab切换的时候触发
    async handleClick() {
      if (this.activeName == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数数据失败");
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.trim().split(" ");
        });
        this.manyData = res.data;
      } else if (this.activeName == 2) {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数数据失败");
        }

        this.onlyData = res.data;
      }
    },
    // 当级联列表中的值发生变化的时候触发
    handleChange() {
      if (this.goodsAddForm.goods_cat.length !== 3) {
        this.goodsAddForm.goods_cat = [];
      }
    },
    // 图片预览
    handlePreview(file) {
      this.imagePreviewPath = file.response.data.url;
      this.imagePreviewDialog = true;
    },
    // 图片删除
    handleRemove(file) {
      let path = file.response.data.tmp_path;
      let i = this.goodsAddForm.pics.findIndex(item => item.pic == path);
      this.goodsAddForm.pics.splice(i, 1);
    },
    // 图片上传成功时的回调
    handleSuccess(response) {
      this.goodsAddForm.pics.push({
        pic: response.data.tmp_path
      });
    },
    handleBeforeLeave(next, prev) {
      if (prev == 0 && this.categoryId == null) {
        this.$message.error("请选中三级分类");
        return false;
      }
    },
    handleGoodsAdd() {
      this.$refs.goodsAddRef.validate(async valid => {
        if (!valid) return this.$message.error("请把数据填写完整");
        const form = _.cloneDeep(this.goodsAddForm);
        form.goods_cat = form.goods_cat.join(",");
        this.manyData.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          });
        });
        this.onlyData.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          });
        });
        const { data: res } = await this.$http
          .post("goods", form)
          .catch(error => error);
        if (res.meta.status == 400) {
          return this.$message.error(res.meta.msg);
        }

        this.$message.success("商品创建成功");
        this.$router.push("/goods");
      });
    },

    async getCategoryList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.categoryList = res.data.result;
    }
  },
  created: function() {
    this.getCategoryList();
  },
  computed: {
    categoryId: function() {
      if (this.goodsAddForm.goods_cat.length === 3) {
        return this.goodsAddForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style>
.el-steps,
.el-tabs,
.el-card {
  margin-top: 25px;
}

.ql-editor {
  min-height: 400px;
}
</style>
