<script setup>
  import {
    ref,
    unref
  } from "vue";
  import {
    routerTo,
    showLoading,
    showModal,
    showToast
  } from "@/utils/common.js";
  import {
    getSmallImg
  } from "@/utils/tools.js";
  const loading = ref(false);
  const goodsCloudObj = uniCloud.importObject("admin-amax", {
    customUI: true,
  });
  const tableData = ref([]);
  const query = ref({
    pageSize: 10,
    pageCurrent: 1,
    total: 0,
    keyword: "",
  });

  const search = () => {
    query.value.pageCurrent = 1;
    getData();
  };

  const handleChange = (e) => {
    query.value.pageCurrent = e;
    getData();
  };

  const delTable = async (id) => {
    try {
      //  if (!(await showModal({ content: "是否确认删除?" }))) return;
      let {
        errCode
      } = await goodsCloudObj.removeopen({
        _id: id
      });
      if (errCode !== 0) return showToast("删除失败");
      showToast("删除成功");
      getData();
    } catch (err) {
      console.log(err);
      showToast(err.errMsg);
    }
  };

  const getData = async () => {
    try {
      loading.value = true;
      let {
        errCode,
        data,
        total
      } = await goodsCloudObj.openlist(query.value);
      if (errCode !== 0) return showToast("数据查询有误");
      tableData.value = data;
      query.value.total = total;
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
        <input class="uni-search" type="text" v-model="query.keyword" @confirm="search"
          :placeholder="$t('common.placeholder.query')" />
        <button class="uni-button hide-on-phone" type="default" size="mini" @click="search">
          {{ $t("common.button.search") }}
        </button>
        <button class="uni-button" type="primary" size="mini" @click="routerTo('./edit')">
          {{ $t("common.button.add") }}
        </button>
      </view>
    </view>

    <view class="uni-container">
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column label="缩略图" width="130">
          <template #default="scope">
            <div class="avatar">
              <image @click="previewImg(scope.$index)" :src="getSmallImg(scope.row.goods_banner_img, 100)"
                mode="aspectFill"></image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="内容" width="400" />
         <el-table-column prop="name" show-overflow-tooltip label="阅读量"  />
        <el-table-column prop="category_name" show-overflow-tooltip label="所属分类" />
        <el-table-column prop="publish_date" show-overflow-tooltip label="时间" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <div>
              <el-button type="primary"
                @click="routerTo('./edit?id=' + scope.row._id)">{{ $t("common.button.edit") }}</el-button>
              <el-button type="danger" @click="delTable(scope.row._id)">{{
                $t("common.button.delete")
              }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <view class="pagination">
        <el-pagination hide-on-single-page background layout="prev, pager, next" :total="query.total"
          :default-page-size="query.pageSize" @current-change="handleChange" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .avatar {
    width: 100px;
    height: 100px;

    image {
      width: 100%;
      height: 100%;
    }
  }
</style>