<script setup>
import { ref, unref } from "vue";
import { showToast } from "../../../../utils/common";
const categoryCloudObj = uniCloud.importObject("admin-index-category", {
  customUI: true,
});
const emits = defineEmits(["close", "success"]);
const props = defineProps(["sort", "typeName", "item"]);
const formRef = ref(null);
const loading = ref(false);
const categoryList = ref([]);

const formData = ref({
  name: "",
  sort: props.sort + 1,
  ...props.item,

});

const rules = ref({
  name: [
    { required: true, message: "分类名称必填", trigger: "blur" },
    { min: 2, max: 5, message: "名称在2~5位", trigger: "blur" },
  ],
});

const close = () => {
  emits("close");
};

const onSubmit = async () => {
  try {
    if (!(await formRef.value.validate(() => {})))
      return showToast("存在校验不通过的字段");
    loading.value = true;
    let { errCode, data, errMsg } = unref(formData)._id
      ? await categoryCloudObj.twoupdate(unref(formData))
      : await categoryCloudObj.twoadd(unref(formData));
    if (errCode !== 0) return showToast(`${props.typeName}失败`);
    showToast(`${props.typeName}成功`);
    close();
    emits("success");
  } catch (err) {
    showToast(err);
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getCategory = async () => {
  try {
    uni.showLoading({ mask: true });
    let { errCode, data, errMsg } = await categoryCloudObj.list();
    console.log({ errCode, data, errMsg });
    if (errCode !== 0) return showToast("获取分类失败");
    categoryList.value = data;
  } catch (err) {
    console.log(err);
    showToast("获取分类失败");
  } finally {
    uni.hideLoading();
  }
};
getCategory()
</script>

<template>
  <view class="layout">
    <el-form ref="formRef" label-width="100px" :model="formData" :rules="rules">
    <el-form-item label="所属分类" prop="category_id">
							  <el-select v-model="formData.category_id" placeholder="请选择商品分类">
								  <el-option :label="item.name" :value="item._id" v-for="item in categoryList" :key="item._id"></el-option>
							  </el-select>
						</el-form-item>
					
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入分类名称"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number v-model="formData.sort" :min="0" :max="100" />
      </el-form-item>
    </el-form>
    
    <view class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading"
        >确认{{ typeName }}</el-button
      >
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
