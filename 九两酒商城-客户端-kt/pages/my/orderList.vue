<script setup>
import { computed, ref, unref } from 'vue';
import { ORDER_STATUS_ENUMS } from '@/utils/config.js';
import { onLoad } from '@dcloudio/uni-app';
import { formatPrice, formatStatus } from '../../utils/format';
import { useOrder } from './hooks.js';
import { routerTo } from '../../utils/common';
const currStatus = ref(null);
const paging = ref(null);
const { handlePay, paySuccess, payRef, cancelPay, handleRefund, inputDialog, inputClose, inputValue, dialogInputConfirm, handleConfirm } = useOrder({ currStatus, paging });
const orderCloudObj = uniCloud.importObject('client-self-order', { customUI: true });
const dataList = ref([]);

const orderMenus = ORDER_STATUS_ENUMS();

const dataListShow = computed(() => {
	return unref(dataList).map((item) => {
		return {
			...item,
			goods_list: item.goods_list.map((goods) => ({
				_id: goods.goods_id,
				name: goods.goods_name,
				price: goods.price,
				number: goods.number,
				goods_banner_img: goods.goods_banner_img,
				sku: [
					{
						_id: goods.sku_id,
						name: goods.sku_name
					}
				]
			}))
		};
	});
});

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
				<view class="item-wrap" v-for="(item, index) in dataListShow" :key="item._id">
					<view class="card-header">
						<view class="left">
							订单编号:
							<text user-select>{{ item.order_no }}</text>
						</view>
						<view class="right">{{ formatStatus(item.order_status).text }}</view>
					</view>
					<view class="card-body" @click="routerTo(`/pages/my/orderDetail?out_trade_no=${item.out_trade_no}&id=${item._id}`)">
						<view class="item" style="pointer-events: none" v-for="goods in item.goods_list" :key="goods._id">
							<card-goods-info :info="goods" :type="5"></card-goods-info>
						</view>
					</view>
					<view class="card-footer">
						<view class="left">
							{{ item.order_status === 0 ? '需付款:' : '总计:' }}
							<text>￥{{ formatPrice(item.total_fee) }}</text>
						</view>
						<view class="right">
							<template v-if="[0].includes(item.order_status)">
								<button class="btn" @click="cancelPay(item._id)">取消</button>
								<button class="btn red" @click="handlePay(item)">付款</button>
							</template>
							<template v-if="[1].includes(item.order_status)">
								<button class="btn wechat" open-type="contact">催发货</button>
								<button class="btn red" @click="handleRefund(item)">申请退款</button>
							</template>
							<template v-if="[2].includes(item.order_status)">
								<button class="btn" @click="handleConfirm(item)">确认取货</button>
								<button class="btn red" @click="handleRefund(item)">申请退款</button>
							</template>
							<template v-if="[3].includes(item.order_status)">
								<button class="btn" @click="handleConfirm(item)">确认收货</button>
							</template>
							<template v-if="[4].includes(item.order_status)">
								<view class="text" v-if="item?.refund_fee">已退款 ￥{{ formatPrice(item.refund_fee) }}</view>
								<template v-else>
									<button class="btn red">审核中</button>
									<button class="btn wechat" open-type="contact">联系商家</button>
								</template>
							</template>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		<uni-pay :toSuccessPage="false" ref="payRef" @success="paySuccess"></uni-pay>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="退款理由" v-model="inputValue" placeholder="请输入退款理由" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
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
