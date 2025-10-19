<script setup>
import { ref, unref } from "vue";
import { showToast } from "../../../../utils/common";
const categoryCloudObj = uniCloud.importObject("admin-open-fenlei", {
  customUI: true,
});
const emits = defineEmits(["close", "success"]);
const props = defineProps(["sort", "typeName", "item"]);
const formRef = ref(null);
const loading = ref(false);
const formData = ref({
  name: "",
  sort: props.sort + 1,
  is_on_sale: true,
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
const saleChange = async (e, index) => {
  try {
    loading.value = true;
    let { errCode } = await goodsCloudObj.update({
      _id: unref(tableData)[index]._id,
      is_on_sale: e,
    });
    if (errCode !== 0) return showToast("更新失败");
    tableData.value[index].is_on_sale = e;
    showToast("修改成功");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
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
          clearable
        ></el-input>
      </el-form-item>

      <el-table-column label="是否上架">
        <template #default="scope">
          <div>
            <el-switch
              :model-value="scope.row.is_on_sale"
              @change="saleChange($event, scope.$index)"
            />
          </div>
        </template>
      </el-table-column>

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
