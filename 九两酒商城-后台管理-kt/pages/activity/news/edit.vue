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
let id = ref();
const newsCloudObj = uniCloud.importObject("admin-news", { customUI: true });
const formRef = ref(null);
const formData = ref({
  title: "",
  content: "",
  is_sticky: false,
  article_status: 1,
  avatar: "",
});
const rules = ref({
  title: [
    { required: true, message: "新闻标题必填", trigger: "blur" },
    { min: 5, max: 30, message: "字符在5-30间", trigger: "blur" },
  ],
  content: [{ required: true, message: "新闻内容必填", trigger: "blur" }],
});

const pageType = computed(() => (unref(id) ? "修改" : "新增"));

onLoad((e) => {
  id.value = e.id;
  if (id.value) getDetail();
  uni.setNavigationBarTitle({ title: unref(pageType) });
});

const onSubmit = async () => {
  try {
    showLoading({ title: "提交中...", mask: true });
    if (!(await formRef.value.validate(() => {})))
      return showToast("存在校验不通过的字段");

    if (formData.value.avatar && !formData.value.avatar.startsWith("http")) {
      let { fileID = "" } = await uploadFileItem(formData.value.avatar);
      formData.value.avatar = fileID;
    }

    let { errCode, errMsg } = unref(id)
      ? await newsCloudObj.update(formData.value)
      : await newsCloudObj.add(formData.value);
    if (errCode !== 0) return showToast(unref(pageType) + "失败");
    showToast(unref(pageType) + "成功");
    routerTo("./list");
  } catch (err) {
    showToast(err);
    console.log(err);
  }
};

const getDetail = async () => {
  let { errCode, data } = await newsCloudObj.detail(unref(id));
  formData.value = data;
  console.log(data);
};
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
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" />
          </el-form-item>

          <el-form-item label="缩略图" prop="avatar">
            <xxm-select-image
              :width="200"
              v-model:picurl="formData.avatar"
            ></xxm-select-image>
          </el-form-item>

          <el-form-item label="主体内容" prop="content">
            <xxm-wangeditor-next
              v-model:content="formData.content"
            ></xxm-wangeditor-next>
          </el-form-item>

          <el-form-item label="是否置顶">
            <el-switch v-model="formData.is_sticky" />
          </el-form-item>

          <el-form-item label="是否可见">
            <el-switch
              v-model="formData.article_status"
              :active-value="1"
              :inactive-value="0"
            />
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
