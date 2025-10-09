<script setup>
import { ref, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { routerTo, showLoading, showModal, showToast } from '@/utils/common.js';
import { getSmallImg } from '@/utils/tools.js';
import { payMethod, formatPrice, formatStatus } from '@/utils/format';
import { Place, Van, Promotion, Bicycle } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
const orderCloudObj = uniCloud.importObject('admin-orders', { customUI: true });

let id;
const detail = ref({});

onLoad((e) => {
	id = e.id;
	getDetail();
});

const getDetail = async () => {
	try {
		let { errCode, data } = await orderCloudObj.detail({ _id: id });
		if (errCode != 0) return showToast('数据查询有误');
		detail.value = data;
		console.log(data);
	} catch (err) {
		console.log(err);
		showToast(err);
	}
};
</script>

<template>
	<view class="uni-container">
		<view class="module">
			<el-divider content-position="left" border-style="dashed">基础信息</el-divider>
			<el-row>
				<el-col :xl="8" :md="8">
					<view class="row">
						<view class="label">下单人</view>
						<view class="content">
							<view class="orderUser">
								<image :src="getSmallImg(detail.avatar)" mode="aspectFill"></image>
								<text>{{ detail.nickname }}</text>
							</view>
						</view>
					</view>
				</el-col>
				<el-col :xl="8" :md="8">
					<view class="row">
						<view class="label">订单号</view>
						<view class="content">{{ detail.order_no }}</view>
					</view>
				</el-col>
				<el-col :xl="8" :md="8">
					<view class="row">
						<view class="label">付款方式</view>
						<view class="content">
							<view class="payment_method">
								<el-tag round effect="plain" :type="{ 0: 'primary', 1: 'success' }[detail.payment_method] || 'info'">
									{{ payMethod(detail.payment_method) }}
								</el-tag>
							</view>
						</view>
					</view>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="8">
					<view class="row">
						<view class="label">商品总额</view>
						<view class="content">
							<view class="original priceCol">
								￥
								<text>{{ formatPrice(detail.goods_price) }}</text>
							</view>
						</view>
					</view>
				</el-col>
				<el-col :span="8">
					<view class="row">
						<view class="label">应付总额</view>
						<view class="content">
							<view class="total_fee priceCol">
								<text>￥</text>
								<text>{{ formatPrice(detail.total_fee) }}</text>
							</view>
						</view>
					</view>
				</el-col>
				<el-col :span="8">
					<view class="row">
						<view class="label">消耗积分</view>
						<view class="content">{{ detail?.minus_score || '-' }}</view>
					</view>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="8">
					<view class="row">
						<view class="label">下单时间</view>
						<view class="content">
							<view class="create_date">
								{{ dayjs(detail.create_date).format('YYYY-MM-DD HH:mm:ss') }}
							</view>
						</view>
					</view>
				</el-col>
				<el-col :span="8">
					<view class="row">
						<view class="label">支付时间</view>
						<view class="content">
							<view class="create_date">
								{{ detail.pay_date ? dayjs(detail.pay_date).format('YYYY-MM-DD HH:mm:ss') : '-' }}
							</view>
						</view>
					</view>
				</el-col>
				<el-col :span="8">
					<view class="row">
						<view class="label">订单状态</view>
						<view class="content">
							<view class="payment_method">
								<el-tag size="large" :type="formatStatus(detail.order_status)?.type">
									{{ formatStatus(detail.order_status)?.text }}
								</el-tag>
							</view>
						</view>
					</view>
				</el-col>

				<el-col :span="8">
					<view class="row">
						<view class="label">有无退款</view>
						<view class="content">
							{{ detail?.refund_date ? '有' : '无' }}
						</view>
					</view>
				</el-col>

				<el-col :span="8">
					<view class="row">
						<view class="label">退款时间</view>
						<view class="content">
							<view class="create_date">
								{{ detail?.refund_date ? dayjs(detail.refund_date).format('YYYY-MM-DD HH:mm:ss') : '-' }}
							</view>
						</view>
					</view>
				</el-col>

				<el-col :span="8">
					<view class="row">
						<view class="label">退款金额</view>
						<view class="content">
							{{ detail.refund_fee ? '￥' + formatPrice(detail.refund_fee) : '-' }}
						</view>
					</view>
				</el-col>
			</el-row>
		</view>

		<!-- 商品信息 -->
		<view class="module">
			<el-divider content-position="left" border-style="dashed">商品信息</el-divider>
			<el-row>
				<el-col :xl="24" :md="24" v-for="(row, idx) in detail.goods_list" :key="idx">
					<view class="row">
						<view class="label">商品{{ idx + 1 }}</view>
						<view class="content">
							<view class="goods">
								<view class="pic">
									<image :src="getSmallImg(row.goods_banner_img)" mode="aspectFill"></image>
								</view>
								<view class="text">
									<view class="name">{{ row.goods_name }}</view>
									<view class="info">[ {{ row.sku_name }}，×{{ row.number }}， ￥{{ formatPrice(row.price) }}]</view>
								</view>
								<view class="rest">
									<view class="original priceCol">
										￥
										<text>{{ formatPrice(row.number * row.price) }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</el-col>

				<el-col :span="6">
					<view class="row">
						<view class="label">是否优惠</view>
						<view class="content">
							{{ XEUtils.isEmpty(detail.discount) ? '否' : '是' }}
						</view>
					</view>
				</el-col>

				<el-col :span="6">
					<view class="row">
						<view class="label">通用优惠额</view>
						<view class="content">-</view>
					</view>
				</el-col>

				<el-col :span="6">
					<view class="row">
						<view class="label">产品优惠额</view>
						<view class="content">-</view>
					</view>
				</el-col>

				<el-col :span="6">
					<view class="row">
						<view class="label">优惠总额</view>
						<view class="content" style="text-align: right">-</view>
					</view>
				</el-col>

				<el-col :xl="24" :md="24">
					<view class="row">
						<view class="label">总计：</view>
						<view class="content">
							<view class="goods">
								<view></view>
								<view class="text"></view>
								<view class="rest">
									<view class="total_fee priceCol">
										￥
										<text>{{ formatPrice(0) }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</el-col>
			</el-row>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.module {
	padding-bottom: 20px;
	:deep(.el-divider--horizontal) {
		border-color: #409eff;
	}
	:deep(.el-divider__text.is-left) {
		color: #409eff;
		font-weight: bold;
	}
	.el-row {
		border-right: 1px solid #eee;
		&:last-child {
			border-bottom: 1px solid #eee;
		}
	}
	.el-col {
		border-top: 1px solid #eee;
		border-left: 1px solid #eee;
		min-height: 50px;
		.row {
			display: flex;
			align-items: center;
			font-size: 14px;
			height: 100%;
			width: 100%;
			.label {
				display: flex;
				align-items: center;
				background: #f6f6f6;
				height: 100%;
				width: 120px;
				padding-left: 10px;
				font-weight: bold;
			}
			.content {
				padding: 0 10px;
				flex: 1;
			}
		}
	}
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
	.priceCol {
		color: #f56c6c;
		font-size: 12px;
		font-weight: bold;
		text {
			font-size: 16px;
		}
	}
	.original {
		color: #333;
	}
	.create_date {
		color: #888;
		font-size: 12px;
		text-wrap: nowrap;
		display: flex;
		align-items: center;
	}

	.goods {
		display: flex;
		flex: 1;
		height: 100%;
		padding: 10px 0;
		gap: 10px;
		.pic {
			width: 50px;
			height: 50px;
			border-radius: 5px;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.text {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;
			.name {
				font-size: 16px;
				font-weight: bold;
			}
			.info {
				font-style: 14px;
				color: #888;
			}
		}
		.rest {
			width: 200px;
			height: 100%;
			text-align: right;
		}
	}

	.delivery_way {
		display: flex;
		align-items: center;
		text {
			font-size: 14px;
			padding-left: 4px;
		}
	}
	.delivery_way.a {
		text {
			color: #67c23a;
		}
	}
	.delivery_way.b {
		text {
			color: #409eff;
		}
	}
}
</style>
