<script setup>
import {formatPrice} from "@/utils/format.js"
import {routerTo} from "@/utils/common.js"
import {getSmallImg} from "@/utils/tools.js"
const props = defineProps({
	info:{
		type:Object,
		default:()=>({})
	}
})
</script>

<template>
	<view class="card-goods-item" @click="routerTo('/pages/shop/goods?id='+info._id)">
		<view class="pic">
			<image class="img" :src="getSmallImg(info.goods_banner_img,200)" mode="aspectFill"></image>
		</view>
		<view class="info">
			<view class="title">{{info.name}}</view>
			<view class="price">
				<view class="new">
					<view class="small">￥</view>
					<view class="text">{{formatPrice(info.price)}}</view>
				</view>
				<view class="old" v-if="info.market_price">￥{{formatPrice(info.market_price)}}</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.card-goods-item{
		.pic{
			width: 100%;
			aspect-ratio: 1 / 1;
			.img{
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
		.info{
			padding:16rpx 0;
			.title{
				font-size: 30rpx;
				color:#333;
				font-weight: bold;
				@include text-ellipsis(1);
			}
			.price{
				display: flex;
				gap:16rpx;
				align-items: flex-end;
				padding-top:10rpx;
				.new{
					display: flex;
					align-items: flex-end;
					font-size: 32rpx;
					font-weight: bolder;
					color:$uni-color-error;
					.small{
						font-size: 24rpx;
					}
				}
				.old{
					font-size: 20rpx;
					color:#bbb;
					text-decoration: line-through;
				}
			}
		}
		
	}
</style>