<script setup>
import { computed, ref, unref } from "vue";
import dayjs from "dayjs";
import { showToast, showModal } from "../../../utils/common";
import EditCategory from "./children/EditCategory.vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
const categoryCloudObj = uniCloud.importObject("admin-index-category", {
  customUI: true,
});
const editDialog = ref(false);
const editType = ref("add");
const typeName = computed(() => (unref(editType) === "add" ? "新增" : "修改"));
const tableData = ref([]);
const currentItem = ref(null);
const loading = ref(false);
const handleAdd = () => {
  editType.value = "add";
  editDialog.value = true;
  currentItem.value = null;
};

const onUpdate = (index) => {
  editType.value = "update";
  editDialog.value = true;
  currentItem.value = unref(tableData)[index];
};

const sortChange = async (e, index) => {
  try {
    let _id = unref(tableData)[index]._id;
    loading.value = true;
    let { errCode, data } = await categoryCloudObj.update({ _id, sort: e });
    if (errCode !== 0) return showToast("更新失败");
    getData();
  } catch (err) {
    loading.value = false;
    console.log(err);
    showToast(err);
  }
};

const onRemove = async (index) => {
  try {
    if (!(await showModal({ content: "是否确认删除?" }))) return;
    let _id = unref(tableData)[index]._id;
    loading.value = true;
    let { errCode, data } = await categoryCloudObj.remove({ _id });
    if (errCode !== 0) return showToast("删除失败");
    showToast("删除成功");
    getData();
  } catch (err) {
    loading.value = false;
    console.log(err);
    showToast(err.errMsg);
  }
};

const getData = async () => {
  try {
    loading.value = true;
    let { errCode, data } = await categoryCloudObj.list();
    if (errCode !== 0) return showToast("查询失败");
    tableData.value = data;
    console.log(tableData.value);
  } catch (err) {
    console.log(err);
    showToast(err);
  } finally {
    loading.value = false;
  }
};

getData();
</script>

<template>
  <view class="fix-top-window">
    <view class="uni-header">
      <uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
      <view class="uni-group">
        <button
          class="uni-button"
          type="primary"
          size="mini"
          @click="handleAdd"
        >
          {{ $t("common.button.add") }}
        </button>
      </view>
    </view>

    <view class="uni-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="分类名称"
          width="200"
        />
        <el-table-column label="排序">
          <template #default="scope">
            <el-input-number
              :model-value="scope.row.sort"
              @change="sortChange($event, scope.$index)"
            >
              <template #decrease-icon>
                <el-icon>
                  <ArrowUp />
                </el-icon>
              </template>
              <template #increase-icon>
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </template>
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <div>
              <el-button type="primary" @click="onUpdate(scope.$index)">{{
                $t("common.button.edit")
              }}</el-button>
              <el-button type="danger" @click="onRemove(scope.$index)">{{
                $t("common.button.delete")
              }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </view>

    <el-dialog
      :title="`${typeName}分类`"
      width="800"
      v-model="editDialog"
      destroy-on-close
      :close-on-click-modal="false"
      :z-index="999"
    >
      <EditCategory
        @close="editDialog = false"
        @success="() => getData()"
        :sort="tableData[tableData.length - 1]?.sort || 0"
        :typeName="typeName"
        :item="currentItem"
      ></EditCategory>
    </el-dialog>
  </view>
</template>

<style lang="scss" scoped></style>
