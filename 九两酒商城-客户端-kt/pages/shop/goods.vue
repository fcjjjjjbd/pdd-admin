<script setup>
import { computed, ref,unref } from 'vue';

import {onLoad} from "@dcloudio/uni-app"
import {useCartStore} from "@/stores/cart.js"
import { getSmallImg } from '../../utils/tools';
import { formatPrice } from '../../utils/format';
import {isEmpty} from "@/utils/common.js"
const cartStore = useCartStore();
const goodsCloudObj = uniCloud.importObject("client-product-goods",{customUI:true});
const goodsDatail = ref({})
const id=ref(null);


const skuPopRef = ref(null);
const currGoods = ref({})
const currSkuId = ref("");
const cartPopRef = ref(null);
const currSkuInfo = computed(()=>unref(goodsDatail)?.sku?.find(item=>item._id == unref(currSkuId)) || {})


onLoad((e)=>{
	id.value = e.id;
	if(unref(id)) getDetail()	
})


const showSkuPop = (e)=>{
	skuPopRef.value.open()
}

const closeSkuPop = ()=>{
	skuPopRef.value.close()
}


const openCartPop = ()=>{
	cartPopRef.value.open();
}


const getDetail = async()=>{
	let {data,errCode} = await goodsCloudObj.detail({_id:unref(id)})
	goodsDatail.value = data;
	console.log(goodsDatail.value);
	currGoods.value = unref(goodsDatail) 
	currSkuId.value = unref(goodsDatail)?.sku?.[0]?._id || "";
}
</script>

<template>
	<uni-load-more status="loading" v-if="isEmpty(goodsDatail)"></uni-load-more>
	<view class="page-wrap" v-else>
		<view class="banner-wrap">		
			<image v-if="isEmpty(goodsDatail.goods_banner_imgs)" class="noPic" 
			:src="getSmallImg('',500)" mode="aspectFill" />
			
			<swiper v-else class="swiper" indicator-dots indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="rgba(255,255,255,1)">
				<swiper-item class="swiper-item" v-for="(item, index) in goodsDatail.goods_banner_imgs" :key="index">
					<image class="img" :src="getSmallImg(item,500)" mode="aspectFit" />
				</swiper-item>
			</swiper>
			
		</view>

		<view class="title-wrap">
			<view class="price-wrap">
				<view class="new">
					<text>￥</text>
					<text class="big">{{formatPrice(currSkuInfo.price)}}</text>
				</view>
				<view class="old">￥{{formatPrice(currSkuInfo.market_price)}}</view>
			</view>
			<view class="name">{{goodsDatail.name}}</view>
		</view>

		<view class="row-wrap service-wrap">
			<view class="label">服务</view>
			<view class="value-wrap">
				<view class="text">线下门店·快递发货·到店自提</view>
			</view>
		</view>

		<view class="row-wrap curr-sku-wrap">
			<view class="label">规格</view>
			<view class="value-wrap" @click="showSkuPop">
				<view class="text">
					{{currSkuInfo.name}}
				</view>
				<uni-icons type="right" size="36rpx" color="#aaaaaa" />
			</view>
		</view>
		
		
		<view class="content-wrap">
			<uni-load-more v-if="isEmpty(goodsDatail.goods_desc)" status="noMore" :content-text="{contentnomore:'暂无商品描述'}"></uni-load-more>
			<uv-parse v-else :content="goodsDatail.goods_desc"></uv-parse>			
		</view>
		
		<view class="shop-bar-wrap">
			<view class="flex-box">
				<view class="left-wrap">
					<view class="menu-item">
						<view class="icon-wrap">
							<uni-icons class="icon" type="chat" size="36rpx" color="#666"></uni-icons>
						</view>
						<view class="label">客服</view>
						<button class="btn" open-type="contact">123</button>
					</view>
					<view class="menu-item" @click="openCartPop">
						<view class="icon-wrap">
							<uni-icons class="icon" type="cart" size="36rpx" color="#666"></uni-icons>
							<view class="tag" v-if="cartStore.goodsTotal>0">{{cartStore.goodsTotal}}</view>
						</view>
						<view class="label">购物车</view>
					</view>
				</view>
				<view class="right-wrap">
					<view class="btn cart-btn" @click="showSkuPop">加入购物车</view>
					<view class="btn buy-btn" @click="showSkuPop">立即购买</view>
				</view>
			</view>
			<view class="safe-area-box"></view>
		</view>
		
		
		<uni-popup ref="skuPopRef" type="bottom" :safe-area="false">
			<view class="sku-pop-wrap">
				<shop-sku :info="currGoods" v-model:sku-id="currSkuId" @close="closeSkuPop"></shop-sku>
			</view>
		</uni-popup>
		
		<uni-popup ref="cartPopRef" type="bottom"  :safe-area="false">
			<view class="cart-pop-wrap">
				<shop-cart />
			</view>
		</uni-popup>
		
		

		<view class="safe-area-box"></view>
	</view>
</template>

<style lang="scss" scoped>
	.page-wrap {
		padding-bottom: 100rpx;
		.banner-wrap {
			width: 750rpx;
			aspect-ratio: 1 / 1;

			.swiper {
				width: 100%;
				height: 100%;

				.img {
					width: 100%;
					height: 100%;
				}

			}
			.noPic{
				width: 100%;
				height: 100%;
			}
		}

		.title-wrap {
			padding: 26rpx 32rpx;
			border-bottom: 22rpx solid #efefef;

			.price-wrap {
				display: flex;
				gap: 20rpx;
				align-items: flex-end;

				.new {
					font-weight: bolder;
					font-size: 32rpx;
					color: $uni-color-error;

					.big {
						font-size: 40rpx;
					}
				}

				.old {
					font-size: 26rpx;
					color: #888;
					text-decoration: line-through;
				}
			}

			.name {
				font-size: 38rpx;
				line-height: 1.6em;
				margin-top: 10rpx;
			}
		}


		.row-wrap {
			display: flex;
			align-items: center;
			padding: 32rpx;
			border-bottom: 22rpx solid #efefef;
			gap: 32rpx;

			.label {
				flex-shrink: 0;
				width: 75rpx;
				font-size: 28rpx;
				color: #999;
			}

			.value-wrap {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.text {
					width: 540rpx;
					font-size: 28rpx;
					color: #333;
					@include text-ellipsis();
				}

				.icon {
					flex-shrink: 0;
				}
			}
			
		}
		
		.curr-sku-wrap {
			.value-wrap {
				.text {
					color: #000;
					font-weight: bolder;
				}
			}
		}
		
		
		.content-wrap{
			padding:32rpx;
		}
		
		.shop-bar-wrap{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 750rpx;
			padding: 0 32rpx;
			background-color: #fff;
			box-shadow: 0 -8rpx 8rpx 0px #e3e3e3;
			.flex-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 100rpx;
				.left-wrap {
					display: flex;
					align-items: center;
					height: 100%;
					gap: 30rpx;
					.menu-item {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						width: 80rpx;
						height: 100%;
						position: relative;
						.icon-wrap{
							position: relative;
							.tag{
								position: absolute;
								right: -12rpx;
								top: -12rpx;
								min-width: 26rpx;
								height: 26rpx;
								padding: 6rpx;
								font-size: 18rpx;
								color: #fff;
								display: flex;
								align-items: center;
								justify-content: center;
								background-color: $uni-color-error;
								border-radius: 26rpx;
							}
						}
						.label {
						  font-size: 24rpx;
						  color: #666;						
						}
						.btn{
							position: absolute;
							top:0;
							left:0;
							width: 100%;
							height: 100%;
							opacity: 0;
						}
					}
				}
				
				.right-wrap{
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					.btn {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 220rpx;
						height: 64rpx;
						font-size: 28rpx;
						color: #fff;
					}
					.cart-btn {
						background-color: $uni-color-warning;
						border-radius: 64rpx 0 0 64rpx;
					}

					.buy-btn {
						background-color: $uni-color-error;
						border-radius: 0 64rpx 64rpx 0;
					}
				}
				
			}
		}
		
	}
	
	
	.sku-pop-wrap,.cart-pop-wrap{
		background: #fff;
		min-height: 300rpx;
		padding:32rpx;
		/* #ifdef H5 */
		padding:32rpx 32rpx 66px;
		/* #endif */			
		border-radius: 20rpx 20rpx 0 0;
	}
	
</style>