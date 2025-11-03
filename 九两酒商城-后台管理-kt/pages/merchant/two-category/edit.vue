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
let id;
const goodsCloudObj = uniCloud.importObject("admin-category", {
  customUI: true,
});
const categoryCloudObj = uniCloud.importObject("admin-index-category", {
  customUI: true,
});

const formRef = ref(null);
const formData = ref({
  name: "",
  category_id: "",
  is_on_sale: true,
 });
const categoryList = ref([]);

const rules = ref({
  name: [
    { required: true, message: "商品标题必填", trigger: "blur" },
    { min: 2, max: 30, message: "字符在2-30间", trigger: "blur" },
  ],
  category_id: [{ required: true, message: "商品分类必选", trigger: "change" }],
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
/*
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
*/
    let _formData = JSON.parse(JSON.stringify(formData.value));
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

          <!-- <el-form-item label="缩略图">
            <xxm-select-image
              :width="100"
              ratio="1/1"
              v-model:picurls="formData.goods_banner_imgs"
              :limit="6"
            ></xxm-select-image>
          </el-form-item> -->

          <el-form-item label="是否上架">
            <el-switch v-model="formData.is_on_sale" />
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

<style lang="scss" scoped></style>
