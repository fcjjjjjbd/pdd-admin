<script setup>
import { computed, nextTick, ref, shallowRef, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import { hideLoading, routerTo, showLoading, showModal, showToast, isEmpty } from '../../utils/common';
import { formatPrice, formatStatus } from '../../utils/format';
import { useOrder } from './hooks.js';
const currStatus = ref(0);
const paging = ref(null);
const { handlePay, paySuccess, payRef, cancelPay, handleRefund, inputDialog, inputClose, inputValue, dialogInputConfirm, handleConfirm } = useOrder({ currStatus, paging, getDetail });
let out_trade_no, id;
const detail = ref({});
const detailItem = computed(() => {
	let item = unref(detail);
	let info = item.delivery_type == 0 ? item.self_take_info : item.transport_info;
	let { merchant_address, merchant_id, merchant_store = '-' } = info;
	return {
		...item,
		merchant_address,
		merchant_id,
		merchant_store,
		goods_list:
			item?.goods_list?.map((goods) => ({
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
			})) || []
	};
});
const orderCloudObj = uniCloud.importObject('client-self-order', { customUI: true });
onLoad((e) => {
	out_trade_no = e.out_trade_no;
	id = e.id;
	getDetail();
});

async function getDetail() {
	try {
		let { data, errCode } = await orderCloudObj.detail({ out_trade_no, id });
		detail.value = data;
		console.log(detail.value);
	} catch (err) {
		console.log(err);
	}
}
</script>

<template>
	<view class="page-wrap" v-if="!isEmpty(detail)">
		<view class="status-wrap">
			<text class="status">
				{{ formatStatus(detailItem.order_status)?.text || '已关闭' }}
			</text>
		</view>

		<view class="content-wrap">
			<view class="store-wrap">
				<view class="top-wrap" @click="routerTo('/pages/merchant/storeDetail?id=' + detailItem.merchant_id)">
					<view class="left-wrap">
						<view class="label">供货商家：</view>
						<view class="name">{{ detailItem.merchant_store }}</view>
						<view class="address">{{ detailItem.merchant_address }}</view>
					</view>
					<view class="right-wrap">
						<uni-icons class="arrow" type="right" size="30rpx" color="#aaa" />
					</view>
				</view>
			</view>

			<!-- 自提信息 -->
			<view class="self-pick-box" v-if="detailItem.delivery_type == 0">
				<view class="row-wrap pick-user-wrap">
					<view class="label">预留电话：</view>
					<view class="value-wrap">
						<view class="text-wrap">{{ detailItem.self_take_info.user_phone }}</view>
					</view>
				</view>

				<view class="row-wrap pick-time-wrap">
					<view class="label">自提时间：</view>
					<view class="value-wrap">
						<view class="text-wrap">{{ detailItem.self_take_info.user_time }}</view>
					</view>
				</view>
			</view>

			<!-- 收货信息 -->
			<view class="delivery-box" v-if="detailItem.delivery_type == 1">
				<view class="row-wrap address-wrap" @click="routerTo('/pages/my/address')">
					<view class="left-wrap">
						<view class="label">收货信息：</view>
						<view class="name">{{ detailItem.transport_info.user_name }},{{ detailItem.transport_info.user_phone }}</view>
						<view class="address">{{ detailItem.transport_info.user_address }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="goods-wrap">
			<view class="goods-list">
				<view class="goods-item" v-for="item in detailItem.goods_list" :key="item._id">
					<card-goods-info :info="item" :type="5" />
				</view>
			</view>

			<view class="info-list">
				<view class="item">
					<view class="left">商品总价</view>
					<view class="right">￥{{ formatPrice(detailItem.goods_price) }}</view>
				</view>
				<view class="item" v-if="detailItem.transport_fee">
					<view class="left">配送运费</view>
					<view class="right">￥{{ formatPrice(detailItem.transport_fee) }}</view>
				</view>
				<view class="item">
					<view class="left">优惠金额</view>
					<view class="right">减￥2.35</view>
				</view>
				<view class="item">
					<view class="left">积分消耗</view>
					<view class="right">2555分</view>
				</view>
				<view class="item total">
					<view class="left">价格明细</view>
					<view class="right">
						<text>实付款</text>
						￥{{ formatPrice(detailItem.total_fee) }}
					</view>
				</view>
			</view>
		</view>

		<view class="order-wrap">
			<view class="info-list">
				<view class="item">
					<view class="left">订单号</view>
					<view class="right">{{ detailItem.order_no }}</view>
				</view>
				<view class="item" v-if="detailItem.out_trade_no">
					<view class="left">交易号</view>
					<view class="right">{{ detailItem.out_trade_no }}</view>
				</view>
				<view class="item">
					<view class="left">创建时间</view>
					<view class="right">{{ dayjs(detailItem.create_date).format('YYYY-MM-DD HH:mm:ss') }}</view>
				</view>
				<view class="item" v-if="detailItem.pay_date">
					<view class="left">付款时间</view>
					<view class="right">{{ dayjs(detailItem.pay_date).format('YYYY-MM-DD HH:mm:ss') }}</view>
				</view>
				<view class="item" v-if="detailItem.refund_date">
					<view class="left">退款时间</view>
					<view class="right">{{ dayjs(detailItem.refund_date).format('YYYY-MM-DD HH:mm:ss') }}</view>
				</view>
			</view>
		</view>

		<view class="confirm-bar">
			<view class="flex-box">
				<view class="left-wrap">
					<button class="btn wechat" open-type="contact">联系商家</button>
				</view>
				<view class="right-wrap">
					<template v-if="[0].includes(detailItem.order_status)">
						<button class="btn" @click="cancelPay(detailItem._id)">取消</button>
						<button class="btn red" @click="handlePay(detailItem)">付款</button>
					</template>
					<template v-if="[1].includes(detailItem.order_status)">
						<button class="btn red" @click="handleRefund(detailItem)">申请退款</button>
					</template>
					<template v-if="[2].includes(detailItem.order_status)">
						<button class="btn" @click="handleConfirm(detailItem)">确认取货</button>
						<button class="btn red" @click="handleRefund(detailItem)">申请退款</button>
					</template>
					<template v-if="[3].includes(detailItem.order_status)">
						<button class="btn" @click="handleConfirm(detailItem)">确认收货</button>
					</template>
					<template v-if="[4].includes(detailItem.order_status)">
						<view class="text" v-if="detailItem?.refund_fee">已退款 ￥{{ formatPrice(detailItem.refund_fee) }}</view>
						<template v-else>
							<button class="btn red">审核中</button>
						</template>
					</template>
				</view>
			</view>
			<view class="safe-area-box"></view>
		</view>

		<view class="safe-area-box"></view>
		<uni-pay :toSuccessPage="false" ref="payRef" @success="paySuccess"></uni-pay>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="退款理由" v-model="inputValue" placeholder="请输入退款理由" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>

	<uni-load-more status="loading" v-else></uni-load-more>
</template>

<style lang="scss" scoped>
.page-wrap {
	min-height: 100vh;
	background: #f8f8f8;
	padding-bottom: 100rpx;
	padding: 32rpx;
	padding-bottom: 100rpx;
	.status-wrap {
		width: 100%;
		padding: 32rpx;
		border-radius: 10rpx;
		background-color: #fff;
		.status {
			font-size: 38rpx;
			color: $uni-color-primary;
			font-weight: bold;
		}
	}
	.content-wrap {
		min-height: 100rpx;
		background: #fff;
		padding: 32rpx 0;
		margin: 32rpx auto;
		.store-wrap {
			padding: 0 32rpx;
			.top-wrap {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #eee;
				padding-bottom: 20rpx;
				.left-wrap {
					padding-right: 20rpx;
					.label {
						font-size: 28rpx;
						color: #999;
					}
					.name {
						font-size: 34rpx;
						font-weight: 600;
						padding: 10rpx 0;
					}
					.address {
						font-size: 28rpx;
						color: #666;
					}
				}
			}
		}
		.row-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 32rpx;
			.label {
				flex-shrink: 0;
				font-size: 28rpx;
				color: #999;
			}
			.value-wrap {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.text-wrap {
					padding-right: 20rpx;
				}
			}
		}
		.pick-user-wrap {
			.ipt {
				text-align: right;
				font-size: 28rpx;
			}
		}
		.address-wrap {
			.left-wrap {
				padding-right: 20rpx;
				.label {
					font-size: 28rpx;
					color: #999;
				}
				.name {
					font-size: 32rpx;
					padding: 10rpx 0;
				}
				.address {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}

	.info-list {
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80rpx;
			font-size: 28rpx;
			.left {
				color: #999;
			}
			.right {
				color: #000;
			}
		}
		.item.total {
			border-top: 1px solid #eee;
			height: 100rpx;
			font-size: 34rpx;
			.left {
				color: #000;
			}
			.right {
				font-weight: bold;
				text {
					font-size: 28rpx;
				}
			}
		}
	}

	.goods-wrap {
		width: 100%;
		padding: 32rpx;
		padding-bottom: 0;
		margin: 0 auto 32rpx;
		background-color: #fff;
		border-radius: 10rpx;
		.goods-list {
			.goods-item {
				margin-bottom: 32rpx;
			}
		}
	}

	.order-wrap {
		width: 100%;
		padding: 32rpx;
		padding-bottom: 0;
		margin: 0 auto 32rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.confirm-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		padding: 0 32rpx;
		background-color: #fff;
		box-shadow: 0 -8rpx 8rpx 1px #efefef;
		box-sizing: border-box;
		.flex-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
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
			.left-wrap {
				display: flex;
				align-items: center;
				height: 100%;
			}
			.right-wrap {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 100%;
				gap: 10rpx;
			}
		}
	}
}
</style>
