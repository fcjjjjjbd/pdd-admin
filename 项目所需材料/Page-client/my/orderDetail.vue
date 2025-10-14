<script setup>
import { computed, nextTick, ref, shallowRef, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { hideLoading, routerTo, showLoading, showModal, showToast } from '../../utils/common';
import { formatPrice, formatStatus } from '../../utils/format';
import { useOrder } from './hooks.js';
const currStatus = ref(0);
const paging = ref(null);
const { handlePay, paySuccess, payRef, cancelPay, handleRefund, inputDialog, inputClose, inputValue, dialogInputConfirm, handleConfirm } = useOrder({ currStatus, paging });
let out_trade_no;
const detail = ref({});
const orderCloudObj = uniCloud.importObject('client-self-order', { customUI: true });
onLoad((e) => {
	out_trade_no = e.out_trade_no;
	getDetail();
});

const getDetail = async () => {
	try {
		let { data, errCode } = await orderCloudObj.detail({ out_trade_no });
		detail.value = data;
		console.log(detail.value);
	} catch (err) {
		console.log(err);
	}
};
</script>

<template>
	<view class="page-wrap">
		<view class="status-wrap">
			<text class="status">待收货</text>
		</view>

		<view class="content-wrap">
			<view class="store-wrap">
				<view class="top-wrap" @click="routerTo('/pages/merchant/store')">
					<view class="left-wrap">
						<view class="label">供货商家：</view>
						<view class="name">商家名称</view>
						<view class="address">详细的商家地址</view>
					</view>
					<view class="right-wrap">
						<uni-icons class="arrow" type="right" size="30rpx" color="#aaa" />
					</view>
				</view>
			</view>

			<!-- 自提信息 -->
			<view class="self-pick-box" v-if="false">
				<view class="row-wrap pick-user-wrap">
					<view class="label">预留电话：</view>
					<view class="value-wrap">
						<view class="text-wrap">13022223333</view>
					</view>
				</view>

				<view class="row-wrap pick-time-wrap">
					<view class="label">自提时间：</view>
					<view class="value-wrap">
						<view class="text-wrap">2025-10-20 15:30:20</view>
					</view>
				</view>
			</view>

			<!-- 收货信息 -->
			<view class="delivery-box" v-if="true">
				<view class="row-wrap address-wrap" @click="routerTo('/pages/my/address')">
					<view class="left-wrap">
						<view class="label">收货信息：</view>
						<view class="name">用户姓名，用户电话</view>
						<view class="address">用户详细地址信息</view>
					</view>
				</view>
			</view>
		</view>

		<view class="goods-wrap">
			<view class="goods-list">
				<view class="goods-item">
					<card-goods-info :info="item" :type="5" />
				</view>
			</view>

			<view class="info-list">
				<view class="item">
					<view class="left">商品总价</view>
					<view class="right">￥32.88</view>
				</view>
				<view class="item">
					<view class="left">配送运费</view>
					<view class="right">￥9.99</view>
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
						￥2.35
					</view>
				</view>
			</view>
		</view>

		<view class="order-wrap">
			<view class="info-list">
				<view class="item">
					<view class="left">订单号</view>
					<view class="right">20251023231545845</view>
				</view>
				<view class="item">
					<view class="left">交易号</view>
					<view class="right">25102323154584588</view>
				</view>
				<view class="item">
					<view class="left">创建时间</view>
					<view class="right">2025-10-23 15:20:32</view>
				</view>
				<view class="item">
					<view class="left">付款时间</view>
					<view class="right">2025-10-23 15:20:32</view>
				</view>
			</view>
		</view>

		<view class="confirm-bar">
			<view class="flex-box">
				<view class="left-wrap">
					<button class="btn wechat" open-type="contact">联系商家</button>
				</view>
				<view class="right-wrap">
					<template v-if="true">
						<button class="btn" @click="cancelPay(detail._id)">取消</button>
						<button class="btn red" @click="handlePay(detail)">付款</button>
					</template>
					<template v-if="false">
						<button class="btn red" @click="handleRefund(detail)">申请退款</button>
					</template>
					<template v-if="false">
						<button class="btn" @click="handleConfirm(detail)">确认取货</button>
						<button class="btn red" @click="handleRefund(detail)">申请退款</button>
					</template>
					<template v-if="false">
						<button class="btn" @click="handleConfirm(detail)">确认收货</button>
					</template>
					<template v-if="false">
						<view class="text" v-if="detail?.refund_fee">已退款 ￥{{ formatPrice(detail.refund_fee) }}</view>
						<template v-else>
							<button class="btn red">审核中</button>
							<button class="btn wechat" open-type="contact">联系商家</button>
						</template>
					</template>
				</view>
			</view>
			<view class="safe-area-box"></view>
		</view>

		<view class="safe-area-box"></view>
	</view>
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