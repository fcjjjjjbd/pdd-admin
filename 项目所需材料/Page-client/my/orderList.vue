<script setup>
import { ref, unref } from 'vue';
import { ORDER_STATUS_ENUMS } from '@/utils/config.js';
import { onLoad } from '@dcloudio/uni-app';
import { formatPrice } from '../../utils/format';
const orderCloudObj = uniCloud.importObject('client-self-order', { customUI: true });
const dataList = ref([]);
const paging = ref(null);
const currStatus = ref(null);
const orderMenus = ORDER_STATUS_ENUMS();
const queryList = async (pageCurrent, pageSize) => {
	try {
		let { errCode, data } = await orderCloudObj.list({ pageCurrent, pageSize, status: unref(currStatus) });
		console.log(data);
		if (errCode !== 0) return paging.value.complete(false);
		paging.value.complete(data);
	} catch (err) {
		paging.value.complete(false);
	}
};

const changeStatus = (item) => {
	console.log(item);
	currStatus.value = item.value;
	paging.value.reload();
};

onLoad((e) => {
	if (e.status) currStatus.value = Number(e.status);
});
</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<view class="navbar">
					<view :class="{ item: true, active: item.value === currStatus }" v-for="item in orderMenus" :key="item.value" @click.stop="changeStatus(item)">
						{{ item.text }}
					</view>
				</view>
			</template>
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<view class="list-wrap">
				<view class="item-wrap" v-for="(item, index) in 5" :key="index">
					<view class="card-header">
						<view class="left">
							订单编号:
							<text user-select>1233213123</text>
						</view>
						<view class="right">待付款</view>
					</view>
					<view class="card-body">
						<view class="item">
							<card-goods-info></card-goods-info>
						</view>
						<view class="item">
							<card-goods-info></card-goods-info>
						</view>
					</view>
					<view class="card-footer">
						<view class="left">
							需付款:
							<text>￥{{ formatPrice(5566) }}</text>
						</view>
						<view class="right">
							<template v-if="true">
								<button class="btn">取消</button>
								<button class="btn red">付款</button>
							</template>
							<template v-if="false">
								<button class="btn wechat" open-type="contact">催发货</button>
								<button class="btn red">退款</button>
							</template>
							<template v-if="false">
								<button class="btn">确认取货</button>
								<button class="btn red">退款</button>
							</template>
							<template v-if="false">
								<button class="btn">确认收货</button>
							</template>
							<template v-if="false">
								<view class="text">已退款 ￥{{ formatPrice(3322) }}</view>
								<button class="btn red">审核中</button>
								<button class="btn wechat" open-type="contact">联系商家</button>
							</template>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	min-height: 100vh;
	background: #f8f8f8;
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;
		background: #fff;
		.item {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 90rpx;
			font-size: 28rpx;
			color: #666666;
			&:after {
				content: '';
				position: absolute;
				left: 10%;
				bottom: 0;
				width: 80%;
				height: 2px;
				background-color: $uni-color-primary;
				opacity: 0;
				transition: opacity 0.1s linear;
			}
		}
		.active {
			color: #000;
			&:after {
				opacity: 1;
			}
		}
	}
	.list-wrap {
		padding: 32rpx;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		gap: 32rpx;
		.item-wrap {
			background-color: #fff;
			box-sizing: border-box;
			border-radius: 12rpx;
			padding: 32rpx;
			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 32rpx;
				.left {
					font-size: 26rpx;
					color: #999;
					text {
						color: #000;
					}
				}
				.right {
					margin-right: 8rpx;
					font-size: 26rpx;
					color: #000;
				}
			}
			.card-body {
				display: flex;
				flex-direction: column;
				gap: 10rpx;
			}
			.card-footer {
				padding-top: 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					font-size: 28rpx;
					color: #999;
					text {
						font-size: 32rpx;
						font-weight: bold;
						color: $uni-color-primary;
					}
				}
				.right {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					gap: 15rpx;
					.btn {
						height: 56rpx;
						font-size: 26rpx;
						line-height: 55rpx;
						color: #666;
						border-radius: 56rpx;
						border: 1px solid #ccc;
						background-color: #fff;
						padding: 0 18rpx;
						&:before {
							border: none;
						}
					}
					.red {
						color: #fff;
						border: 1px solid $uni-color-error;
						background-color: $uni-color-error;
					}
					.wechat {
						display: flex;
						justify-content: center;
						align-items: center;
						color: #fff;
						border: 1px solid $uni-color-success;
						background-color: $uni-color-success;
					}
					.text {
						color: #666;
						font-size: 30rpx;
					}
				}
			}
		}
	}
}
</style>
