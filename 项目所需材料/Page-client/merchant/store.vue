<script setup>
import { ref, unref } from 'vue';
import { routerTo } from '@/utils/common';
const searchVal = ref('');
const dataList = ref([]);
const paging = ref(null);
const merchantCloudObj = uniCloud.importObject('client-merchant', { customUI: true });
const handleSearch = () => {
	console.log(unref(searchVal));
};

const queryList = async (pageCurrent, pageSize) => {
	try {
		// let { errCode, data } = await merchantCloudObj.list({ pageCurrent, pageSize });
		// if (errCode !== 0) return paging.value.complete(false);
		// paging.value.complete(data);
	} catch (err) {
		paging.value.complete(false);
	}
};
</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<view class="filter-bar">
					<view class="city-box" @click.stop="routerTo('')">
						<view class="city">附近</view>
						<uni-icons type="down" size="30rpx"></uni-icons>
					</view>
					<view class="search-box">
						<uni-easyinput
							class="input"
							suffixIcon="search"
							v-model="searchVal"
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
				<view class="item-wrap" v-for="item in 3" :key="item" @click="routerTo('')">
					<view class="left-wrap">
						<view class="pic">
							<image class="img" src="/static/images/tmp_goods.jpg" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="store">华美餐厅</view>
							<view class="address">上海市黄浦区南京东路123号B座305</view>
						</view>
					</view>
					<view class="right-wrap">
						<view class="distance">1.9km</view>
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
