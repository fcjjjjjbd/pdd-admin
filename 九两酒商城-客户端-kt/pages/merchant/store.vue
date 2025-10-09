<script setup>
import { computed, ref, unref, watch } from 'vue';
import { onUnload, onLoad } from '@dcloudio/uni-app';
import { routerTo, isEmpty } from '@/utils/common';
import { getSmallImg, calculateDistance } from '@/utils/tools.js';
import { useLocationStore } from '@/stores/location.js';
import { useOrderStore } from '@/stores/order.js';
const orderStore = useOrderStore();
const isSelect = ref(false);
const locationStore = useLocationStore();
const locating = ref(true);
const query = ref({
	pageSize: 10,
	pageCurrent: 1,
	total: 0,
	keyword: '',
	code: ''
});

const dataList = ref([]);
const paging = ref(null);
const merchantCloudObj = uniCloud.importObject('client-merchant', { customUI: true });

const selectLabel = computed(() => {
	if (locationStore.city.name) return locationStore.city.name;
	if (unref(query).keyword) return '全部';
	if (locationStore.location.length === 2) return '附近';
	return unref(locating) ? '定位中' : '请选择城市';
});

const handleSearch = () => {
	console.log(unref(query).keyword);
	paging.value.reload();
};

locationStore.doLocation().finally(() => {
	query.value.location = locationStore.location;
	locating.value = false;
	paging.value.reload();
});

const queryList = async (pageCurrent, pageSize) => {
	try {
		query.value = { ...query.value, pageCurrent, pageSize };
		let { errCode, data } = await merchantCloudObj.list(unref(query));
		if (errCode !== 0) return paging.value.complete(false);
		paging.value.complete(data);
	} catch (err) {
		paging.value.complete(false);
	}
};

const handleStoreItem = (item) => {
	if (unref(isSelect)) {
		orderStore.merchantInfo = item;
		uni.navigateBack();
		return;
	}
	routerTo('/pages/merchant/storeDetail?id=' + item._id);
};

watch(
	() => locationStore.city.code,
	(nv, ov) => {
		if (nv) {
			if (nv != ov) {
				query.value.code = locationStore.city.code;
				paging.value.reload();
			}
		}
	}
);

onUnload(() => {
	locationStore.city = { name: '', code: '' };
});

onLoad((e) => {
	if (e.type == 'select') isSelect.value = true;
});
</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList" :auto="false">
			<template #top>
				<view class="filter-bar">
					<view class="city-box" @click.stop="routerTo('/pages/merchant/city')">
						<view class="city">{{ selectLabel }}</view>
						<uni-icons type="down" size="30rpx"></uni-icons>
					</view>
					<view class="search-box">
						<uni-easyinput
							class="input"
							suffixIcon="search"
							v-model="query.keyword"
							placeholder="请输入要搜索的产品..."
							@iconClick="handleSearch"
							@confirm="handleSearch"></uni-easyinput>
					</view>
				</view>
			</template>
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>

			<view class="list-wrap">
				<view class="item-wrap" v-for="item in dataList" :key="item._id" @click="handleStoreItem(item)">
					<view class="left-wrap">
						<view class="pic">
							<image class="img" :src="getSmallImg(item.pic)" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="store">{{ item.store }}</view>
							<view class="address">{{ item.address + item.house }}</view>
						</view>
					</view>
					<view class="right-wrap" @click.stop="routerTo('/pages/merchant/storeDetail?id=' + item._id)">
						<view class="distance" v-if="!isEmpty(locationStore.location)">
							{{ calculateDistance(locationStore.location, item.location.coordinates) }}
						</view>
						<view class="more">详情</view>
					</view>
				</view>
			</view>
		</z-paging>
		<view class="safe-area-box"></view>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	.filter-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		gap: 20rpx;
		.city-box {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			height: 60rpx;
			gap: 10rpx;
			padding-right: 20rpx;
			.city {
				font-size: 30rpx;
				color: #666;
				max-width: 260rpx;
				@include text-ellipsis(1);
			}
		}
		.search-box {
			max-width: 350rpx;
			flex-shrink: 0;
			:deep(.is-input-border) {
				border-radius: 50px;
				width: 100% !important;
			}
			:deep(.is-focused) {
				border-color: #e5e5e5 !important;
			}
		}
	}
	.list-wrap {
		padding: 32rpx;
		display: flex;
		flex-direction: column;
		gap: 28rpx;
		.item-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 40rpx;
			.left-wrap {
				display: flex;
				align-items: center;
				gap: 20rpx;
				flex: 1;
				.pic {
					flex-shrink: 0;
					width: 120rpx;
					height: 120rpx;
					background-color: #efefef;
					.img {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.info {
					flex: 1;
					display: flex;
					flex-direction: column;
					height: 120rpx;
					.store {
						display: flex;
						align-items: center;
						margin-bottom: 12rpx;
						font-size: 34rpx;
					}
					.address {
						font-size: 26rpx;
						color: #666;
						@include text-ellipsis(2);
					}
				}
			}
			.right-wrap {
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 120rpx;
				font-size: 26rpx;
				color: #666;
				gap: 5rpx;
				.more {
					color: #000;
				}
			}
		}
	}
}
</style>
