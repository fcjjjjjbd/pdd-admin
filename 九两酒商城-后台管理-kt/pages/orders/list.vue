<script setup>
import { ref, unref } from 'vue';
import { routerTo, showLoading, showModal, showToast } from '@/utils/common.js';
import { getSmallImg } from '@/utils/tools.js';
import { payMethod, formatPrice, formatStatus } from '@/utils/format';
import dayjs from 'dayjs';
import { Timer, Place, Van, Promotion, Bicycle } from '@element-plus/icons-vue';
const loading = ref(false);
const orderCloudObj = uniCloud.importObject('admin-orders', { customUI: true });
const tableData = ref([]);
const query = ref({
	pageSize: 30,
	pageCurrent: 1,
	total: 0,
	keyword: ''
});

const search = () => {
	query.value.pageCurrent = 1;
	tableData.value = [];
	getData();
};

const getData = async () => {
	try {
		loading.value = true;
		let { errCode, data, total } = await orderCloudObj.list(query.value);
		console.log(data);
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

const handleChange = (e) => {
	query.value.pageCurrent = e;
	getData();
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
			<el-table v-loading="loading" :data="tableData" style="width: 100%" border stripe>
				<el-table-column label="订单号" width="250" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.out_trade_no || scope.row.order_no }}
					</template>
				</el-table-column>

				<el-table-column label="下单人" show-overflow-tooltip width="160">
					<template #default="scope">
						<view class="orderUser">
							<image :src="getSmallImg(scope.row.avatar)" mode="aspectFill"></image>
							<text>{{ scope.row.nickname }}</text>
						</view>
					</template>
				</el-table-column>

				<el-table-column label="付款方式">
					<template #default="scope">
						<view class="payment_method">
							<el-tag :type="{ 0: 'primary', 1: 'success' }[scope.row.payment_method] || 'info'" round effect="plain">
								{{ payMethod(scope.row.payment_method) }}
							</el-tag>
						</view>
					</template>
				</el-table-column>

				<el-table-column label="订单总额">
					<template #default="scope">
						<view class="total_fee">
							￥
							<text>{{ formatPrice(scope.row.total_fee ?? 0) }}</text>
						</view>
					</template>
				</el-table-column>

				<el-table-column label="下单时间" width="160">
					<template #default="scope">
						<view class="create_date">
							<el-icon><timer /></el-icon>
							{{ dayjs(scope.row.create_date).format('YYYY-MM-DD HH:mm:ss') }}
						</view>
					</template>
				</el-table-column>

				<el-table-column label="订单状态">
					<template #default="scope">
						<view class="payment_method">
							<el-tag :style="{ opacity: scope.row.order_status == -1 ? '0.4' : 1 }" size="small" effect="dark" :type="formatStatus(scope.row.order_status).type">
								{{ formatStatus(scope.row.order_status).text }}
							</el-tag>
						</view>
					</template>
				</el-table-column>

				<el-table-column prop="delivery_type" label="配送方式">
					<template #default="scope">
						<view class="delivery_type a" v-if="scope.row.delivery_type == 0">
							<el-icon size="16" :color="`#67C23A`"><Place /></el-icon>
							<text>自提</text>
						</view>
						<view class="delivery_type b" v-if="scope.row.delivery_type == 1">
							<template v-if="scope.row.transport_type == 0">
								<el-icon size="16" :color="`#409EFF`"><Bicycle /></el-icon>
								<text>同城</text>
							</template>
							<template v-else-if="scope.row.transport_type == 1">
								<el-icon size="16" :color="`#409EFF`"><Van /></el-icon>
								<text>快递</text>
							</template>
							<template v-else>-</template>
						</view>
					</template>
				</el-table-column>

				<el-table-column label="操作">
					<template #default="scope">
						<view>
							<el-button :icon="Promotion" type="success" size="small" @click="routerTo('./detail?id=' + scope.row._id)">详情</el-button>
						</view>
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
.orderUser {
	display: flex;
	align-items: center;
	image {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	text {
		margin-left: 10px;
		color: #888;
		flex-shrink: 0;
	}
}
.total_fee {
	color: $uni-color-error;
	text {
		font-weight: bold;
	}
}
.create_date {
	color: #888;
	font-size: 12px;
	text-wrap: nowrap;
	display: flex;
	align-items: center;
	gap: 2px;
}
.delivery_type {
	display: flex;
	align-items: center;
	text {
		font-size: 14px;
		padding-left: 4px;
	}
}
.delivery_type.a {
	text {
		color: #67c23a;
	}
}
.delivery_type.b {
	text {
		color: #409eff;
	}
}
</style>
