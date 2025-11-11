<script setup>
import { computed, ref, unref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import {
  goBack,
  routerTo,
  showLoading,
  showToast,
  uploadFileItem,
} from "@/utils/common.js";
import { uuid } from "@/utils/tools.js";
import { Delete, Plus } from "@element-plus/icons-vue";
let id;
const categoryCloudObj = uniCloud.importObject("admin-product-category", {
  customUI: true,
});
const goodsCloudObj = uniCloud.importObject("admin-product-goods", {
  customUI: true,
});

const formRef = ref(null);
const skuItem = () => ({
  _id: uuid(12),
  name: "",
  price: null,
  market_price: null,
  weight: 500,
  status: true,
});
const formData = ref({
  name: "",
  category_id: "",
  is_on_sale: true,
  is_hot: false,
  goods_desc: "",
  goods_banner_imgs: [],
  sku: [skuItem()],
});
const categoryList = ref([]);

const validateSku = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error("sku规格必填"));
  } else if (!value.every((item) => item.name && item.price && item._id)) {
    callback(new Error("sku规格内name、price、_id必填"));
  } else {
    callback();
  }
};

const rules = ref({
  name: [
    { required: true, message: "商品标题必填", trigger: "blur" },
    { min: 2, max: 30, message: "字符在2-30间", trigger: "blur" },
  ],
  category_id: [{ required: true, message: "商品分类必选", trigger: "change" }],
  sku: [{ required: true, validator: validateSku, trigger: "blur" }],
});

const pageType = computed(() => (unref(id) ? "修改" : "新增"));

const getCategory = async () => {
  try {
    showLoading({ mask: true });
    let { errCode, data } = await categoryCloudObj.list();
    if (errCode !== 0) return showToast("获取分类失败");
    categoryList.value = data;
  } catch (err) {
    console.log(err);
    showToast("获取分类失败");
  } finally {
    uni.hideLoading();
  }
};

const addSku = () => {
  formData.value.sku.push(skuItem());
};

const delSku = (index) => {
  formData.value.sku.splice(index, 1);
};

onLoad((e) => {
  id = e.id;
  if (id) getDetail();
  uni.setNavigationBarTitle({
    title: pageType.value,
  });
});

const onSubmit = async () => {
  try {
    if (!(await formRef.value.validate(() => {})))
      return showToast("存在校验不通过的字段");
    showLoading({ mask: true });

    if (unref(formData).goods_banner_imgs.length) {
      let uploadPromises = unref(formData).goods_banner_imgs.map(
        (item, index) => {
          if (typeof item == "string" && item.startsWith("https")) {
            return Promise.resolve({ fileID: item });
          }
          return uploadFileItem(item);
        }
      );
      let uploadResult = await Promise.all(uploadPromises);
      uploadResult.forEach((item, index) => {
        formData.value.goods_banner_imgs[index] = item.fileID;
      });
    }

    let _formData = JSON.parse(JSON.stringify(formData.value));
    _formData.sku.forEach((item) => {
      if (item.price) item.price *= 100;
      if (item.market_price) item.market_price *= 100;
    });
    let { errCode } = unref(id)
      ? await goodsCloudObj.update({ _id: unref(id), ..._formData })
      : await goodsCloudObj.add(unref(_formData));
    if (errCode !== 0) return showToast(pageType.value + "失败");
    showToast(pageType.value + "成功");
    routerTo("./list");
  } catch (err) {
    console.log(err);
    showToast(err);
  } finally {
    uni.hideLoading();
  }
};

const getDetail = async () => {
  try {
    let { errCode, data } = await goodsCloudObj.detail({ _id: id });
    if (errCode != 0) return showToast("数据查询有误");

    if (!data.sku) {
      data.sku = [];
    }
    if (data.sku.length) {
      data.sku.forEach((item) => {
        if (item.price) item.price /= 100;
        if (item.market_price) item.market_price /= 100;
      });
    }
    formData.value = data;
    console.log(data);
  } catch (err) {
    console.log(err);
    showToast(err);
  }
};

getCategory();
</script>

<template>
  <link rel="stylesheet" href="static/css/editor-style.css" />
  <view class="uni-container">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="100"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商品名称" />
          </el-form-item>

          <el-form-item label="所属分类" prop="category_id">
            <el-select
              v-model="formData.category_id"
              placeholder="请选择商品分类"
            >
              <el-option
                :label="item.name"
                :value="item._id"
                v-for="item in categoryList"
                :key="item._id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="缩略图">
            <xxm-select-image
              :width="100"
              ratio="1/1"
              v-model:picurls="formData.goods_banner_imgs"
              :limit="6"
            ></xxm-select-image>
          </el-form-item>

          <el-form-item label="商品规格" prop="sku">
            <el-table :data="formData.sku" stripe border>
              <el-table-column label="上门服务类型" width="220">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.name"
                    placeholder="请输入规格名称"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="进价">
                <template #default="scope">
                  <el-input-number
                    :min="0.01"
                    v-model="scope.row.price"
                    placeholder="售价"
                    :precision="2"
                  >
                    <template #prefix>
                      <text>￥</text>
                    </template>
                  </el-input-number>
                </template>
              </el-table-column>

              <el-table-column label="原价">
                <template #default="scope">
                  <el-input-number
                    :min="0.01"
                    v-model="scope.row.market_price"
                    placeholder="原价"
                    :precision="2"
                  >
                    <template #prefix>
                      <text>￥</text>
                    </template>
                  </el-input-number>
                </template>
              </el-table-column>

              <el-table-column label="重量">
                <template #default="scope">
                  <el-input-number
                    :min="1"
                    v-model="scope.row.weight"
                    placeholder="原价"
                  >
                    <template #suffix>
                      <text>克</text>
                    </template>
                  </el-input-number>
                </template>
              </el-table-column>

              <el-table-column label="显示" width="80">
                <template #default="scope">
                  <el-switch v-model="scope.row.status"></el-switch>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <view class="skuBtn">
                    <el-button
                      v-if="formData.sku.length > 1"
                      @click="delSku(scope.$index)"
                      type="danger"
                      :icon="Delete"
                      circle
                    />
                    <el-button
                      v-if="
                        scope.$index == formData.sku.length - 1 &&
                        formData.sku.length < 9
                      "
                      @click="addSku"
                      type="success"
                      :icon="Plus"
                      circle
                    />
                  </view>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="是否上架">
            <el-switch v-model="formData.is_on_sale" />
          </el-form-item>

          <el-form-item label="热销推荐">
            <el-switch v-model="formData.is_hot" />
          </el-form-item>

          <el-form-item label="主体内容" prop="goods_desc">
            <xxm-wangeditor-next
              v-model:content="formData.goods_desc"
            ></xxm-wangeditor-next>
          </el-form-item>

          <el-form-item></el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" @click="onSubmit"
              >确认{{ pageType }}</el-button
            >
            <el-button size="large" @click="goBack">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </view>
</template>

<style lang="scss" scoped>
.skuBtn {
  display: flex;
}
</style>
