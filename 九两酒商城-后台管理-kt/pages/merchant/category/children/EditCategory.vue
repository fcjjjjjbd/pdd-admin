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
const categoryList
 = ref([]);

const formData = ref({
  name: "",
  sort: props.sort + 1,
  ...props.item,
  category_id:""
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
      ? await categoryCloudObj.update(unref(formData))
      : await categoryCloudObj.add(unref(formData));
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

</script>

<template>
  <view class="layout">
    <el-form ref="formRef" label-width="100px" :model="formData" :rules="rules">
      <el-form-item label="分类名称" prop="name">
        <el-input 
          v-model="formData.name" 
          placeholder="请输入分类名称"
          maxlength="5"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="排序" prop="sort">
        <el-input-number 
          v-model="formData.sort" 
          :min="1" 
          :max="999"
          placeholder="请输入排序值"
        />
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
