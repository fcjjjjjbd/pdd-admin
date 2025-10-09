<script setup>
import { ref, unref } from 'vue';
import { routerTo, showLoading, showModal, showToast } from '@/utils/common.js';
import { getSmallImg } from '@/utils/tools.js';
import dayjs from 'dayjs';
const loading = ref(false);
const merchantCloudObj = uniCloud.importObject('admin-merchant-store', { customUI: true });
const tableData = ref([]);
const query = ref({
	pageSize: 10,
	pageCurrent: 1,
	total: 0,
	keyword: ''
});
const search = () => {
	query.value.pageCurrent = 1;
	getData();
};

const previewImg = (index) => {
	if (!unref(tableData)[index].goods_banner_img) return;
	uni.previewImage({
		urls: [unref(tableData)[index].goods_banner_img]
	});
};

const handleChange = (e) => {
	query.value.pageCurrent = e;
	getData();
};

const delTable = async (id) => {
	try {
	} catch (err) {
		console.log(err);
		showToast(err.errMsg);
	}
};

const getData = async () => {
	try {
		loading.value = true;
		let { errCode, data, total } = await merchantCloudObj.list(query.value);
		if (errCode !== 0) return showToast('数据查询有误');
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
				<input class="uni-search" type="text" v-model="query.keyword" @confirm="search" :placeholder="$t('common.placeholder.query')" />
				<button class="uni-button hide-on-phone" type="default" size="mini" @click="search">{{ $t('common.button.search') }}</button>
			</view>
		</view>

		<view class="uni-container">
			<el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
				<el-table-column prop="store" show-overflow-tooltip label="商家名称" width="200" />
				<el-table-column prop="category_name" label="商家类型" />
				<el-table-column label="缩略图" width="130">
					<template #default="scope">
						<div class="avatar">
							<image @click="previewImg(scope.$index)" :src="getSmallImg(scope.row.pic, 100)" mode="aspectFill"></image>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="联系人" />
				<el-table-column prop="phone" label="联系电话" />
				<el-table-column prop="address" label="商家地址" show-overflow-tooltip width="200" />
				<el-table-column label="审核状态">
					<template #default="scope">
						<view>
							<el-tag size="small" type="info"></el-tag>
						</view>
					</template>
				</el-table-column>

				<el-table-column label="申请时间">
					<template #default="scope">
						<view class="time">
							{{ dayjs(scope.row.create_date).format('YYYY-MM-DD HH:mm') }}
						</view>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="180">
					<template #default="scope">
						<div>
							<el-button type="primary" @click="routerTo('./edit?id=' + scope.row._id)">{{ $t('common.button.edit') }}</el-button>
							<el-button type="danger" @click="delTable(scope.row._id)">{{ $t('common.button.delete') }}</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>

			<view class="pagination">
				<el-pagination hide-on-single-page background layout="prev, pager, next" :total="query.total" :default-page-size="query.pageSize" @current-change="handleChange" />
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
.time {
	font-size: 12px;
	color: #888;
}
</style>
