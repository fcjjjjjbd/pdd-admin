<script setup>
import { computed, unref } from 'vue';
import { formatPrice } from '@/utils/format.js';
import { routerTo } from '@/utils/common.js';
import { getSmallImg } from '@/utils/tools.js';
import { useCartStore } from '@/stores/cart.js';
const cartStore = useCartStore();
const props = defineProps({
	info: {
		type: Object,
		default: () => ({})
	},
	type: {
		type: Number,
		default: 0 // 0 订单列表处， 1 商城分类列表处， 2 商品购物车处， 3 规格选择处, 4 创建订单处， 5 订单历史详情
	},
	sku: {
		type: Object,
		default: () => ({})
	}
});

const emits = defineEmits(['selectBuy']);

const cardData = computed(() => {
	const _bannerImg = props.info?.goods_banner_img || props.info?.goods_banner_imgs?.[0] || null;
	const _skuInfo = props.sku._id ? { ...props.sku } : { ...props.info.sku?.[0] };
	return {
		_bannerImg,
		_skuInfo,
		...props.info
	};
});

const numberChange = (e) => {
	console.log(e);
	cartStore.updateGoods({ ...unref(cardData), _countNum: e.value });
};

const selectBuy = () => {
	emits('selectBuy', { ...props.info });
};

const toDetail = () => {
	if ([1, 2, 5].includes(props.type)) {
		routerTo(`/pages/shop/goods?id=${unref(cardData)._id}`);
	}
};
</script>

<template>
	<view class="card-goods-item" @click.stop="toDetail">
		<view class="card-left">
			<image class="img" :src="getSmallImg(cardData._bannerImg, 180)" mode="aspectFill"></image>
		</view>
		<view class="card-right">
			<view class="top-box">
				<view class="title">{{ info.name }}</view>
				<view class="sku" v-if="[2, 4, 5].includes(type)">
					<view class="tag">
						{{ cardData._skuInfo.name }}
					</view>
				</view>
			</view>

			<view class="bottom-box">
				<view class="left">
					<view class="price-wrap">
						<view class="new">
							<text>￥</text>
							<text class="big">
								{{ formatPrice(info.price || cardData._skuInfo.price) }}
							</text>
						</view>
						<view class="old" v-if="info.market_price || cardData._skuInfo.market_price">￥{{ formatPrice(info.market_price || cardData._skuInfo.market_price) }}</view>
					</view>
				</view>
				<view class="right">
					<view class="buy" @click.stop="selectBuy" v-if="[1].includes(type)">选购</view>
					<uv-number-box v-if="[2].includes(type)" :value="cardData._countNum" @change="numberChange" :min="0"></uv-number-box>
					<view v-if="[4].includes(type)" class="select-number">×{{ cardData._countNum }}</view>
					<view v-if="[5].includes(type)" class="select-number">×{{ cardData.number }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.card-goods-item {
	width: 100%;
	height: 180rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 14rpx;
	.card-left {
		flex-shrink: 0;
		height: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 6rpx;
		overflow: hidden;
		.img {
			width: 100%;
			height: 100%;
		}
	}
	.card-right {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.top-box {
			.title {
				font-size: 28rpx;
				color: #000;
				@include text-ellipsis(2);
			}
			.sku {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 10rpx;
				.tag {
					padding: 6rpx 10rpx;
					font-size: 20rpx;
					color: #333;
					background-color: #f0f0f0;
					border-radius: 4rpx;
				}
			}
		}
		.bottom-box {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			.left {
				.price-wrap {
					font-size: 22rpx;
					.new {
						font-weight: bolder;
						color: $uni-color-error;
						.big {
							font-size: 28rpx;
						}
					}
					.old {
						font-size: 22rpx;
						color: #999;
						text-decoration: line-through;
					}
				}
			}
			.right {
				.buy {
					font-size: 24rpx;
					background: $uni-color-primary;
					border-radius: 40rpx;
					padding: 12rpx 24rpx;
					color: #fff;
				}
				.select-number {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}
}
</style>
