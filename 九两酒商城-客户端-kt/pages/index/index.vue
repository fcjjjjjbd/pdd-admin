<script setup>
import { ref, unref } from 'vue';
import { useNavBarStyle } from '@/utils/system.js';
import { routerTo, isEmpty } from '@/utils/common.js';
const goodsCloudObj = uniCloud.importObject('client-product-goods', { customUI: true });
const { headHeight } = useNavBarStyle();

const searchVal = ref('');
const goodsList = ref([]);
const hotTotal = ref(null);
const menuList = ref([
	{
		label: '我的积分',
		icon: 'icon-jifen',
		color: '#6470E8',
		bg1: '#CBD6FC',
		bg2: '#EDEFFD'
	},
	{
		label: '购物商城',
		icon: 'icon-caigou',
		color: '#EF807A',
		bg1: '#FADAD2',
		bg2: '#FFF6F5'
	},
	{
		label: '商家地图',
		icon: 'icon-dianpu1',
		color: '#79AA9C',
		bg1: '#D3F2EE',
		bg2: '#EDF7F7',
		url: '/pages/merchant/store'
	},
	{
		label: '我要合作',
		icon: 'icon-hezuoguanxi',
		color: '#45C2D3',
		bg1: '#A4F2FD',
		bg2: '#ECFBFD',
		url: '/pages/merchant/join'
	}
]);

const getHotGoods = async () => {
	let { data, errCode, total } = await goodsCloudObj.goodsList({ isHot: true });
	goodsList.value = data;
	hotTotal.value = total;
};

const onSearch = () => {
	routerTo('/pages/shop/search?keyword=' + unref(searchVal));
};

getHotGoods();
</script>

<template>
	<view class="page-wrap">
		<mod-nav-bar title="首页" title-color="#fff"></mod-nav-bar>
		<mode-search @on-confirm="onSearch" v-model:keyword="searchVal"></mode-search>

		<view class="page-content">
			<view class="banner">
				<swiper class="swiper" circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="rgba(255,255,255,1)" autoplay interval="3500">
					<swiper-item class="swiper-item">
						<image class="image" src="/static/images/tmp_banner1.png" mode=""></image>
					</swiper-item>

					<swiper-item class="swiper-item">
						<image class="image" src="/static/images/tmp_banner2.jpg" mode=""></image>
					</swiper-item>
				</swiper>
			</view>

			<view class="notice">
				<scroll-notice></scroll-notice>
			</view>

			<view class="home-menu">
				<view class="item" :style="{ color: item.color }" v-for="item in menuList" :key="item.label" @click="routerTo(item.url)">
					<view class="icon" :style="{ background: `linear-gradient(to bottom,${item.bg1},${item.bg2})` }">
						<text class="iconfont" :class="item.icon"></text>
					</view>
					<view class="label">{{ item.label }}</view>
				</view>
			</view>

			<view class="prize">
				<image class="image" src="/static/images/home_xydcj.png" />
			</view>

			<view class="hot">
				<view class="page-title">
					<view class="left">
						<view class="line"></view>
						<view class="name">热销产品</view>
					</view>
					<view class="right">
						<view class="more">查看更多</view>
						<view class="icon">
							<uni-icons type="right" size="28rpx" color="#A6A6A6"></uni-icons>
						</view>
					</view>
				</view>

				<view class="hot-content">
					<view v-if="isEmpty(goodsList)">
						<uni-load-more :status="hotTotal === 0 ? 'noMore' : 'loading'"></uni-load-more>
					</view>
					<view class="list" v-else>
						<view class="item" v-for="(item, index) in goodsList" :key="item._id">
							<card-goods :info="item"></card-goods>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	.page-content {
		padding: 20rpx 32rpx;
		width: 100%;
		position: relative;
		overflow: hidden;
		&::before {
			content: '';
			display: block;
			width: 984rpx;
			height: 522rpx;
			border-radius: 50%;
			background: $uni-color-primary;
			position: absolute;
			left: calc(50% - 492rpx);
			top: -320rpx;
		}

		.banner {
			width: 100%;
			.swiper {
				width: 100%;
				height: 352rpx;
				&-item {
					width: 100%;
					height: 100%;
					border-radius: 30rpx;
					overflow: hidden;
					.image {
						height: 100%;
						width: 100%;
					}
				}
			}
		}
		.notice {
			padding: 40rpx 0;
		}
		.home-menu {
			padding: 20rpx 0;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				.icon {
					width: 140rpx;
					height: 140rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					.iconfont {
						font-size: 60rpx;
					}
				}
				.label {
					font-size: 32rpx;
					text-align: center;
					padding-top: 15rpx;
				}
			}
		}

		.prize {
			width: 100%;
			margin: 20rpx 0;
			.image {
				width: 686rpx;
				height: 185rpx;
				display: block;
			}
		}
	}

	.page-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			gap: 10rpx;
			.line {
				width: 8rpx;
				height: 32rpx;
				background: $uni-color-primary;
				border-radius: 6rpx;
			}
			.name {
				font-size: 36rpx;
				font-weight: bolder;
				color: $uni-color-primary;
			}
		}
		.right {
			display: flex;
			align-items: center;
			gap: 5rpx;
			.more {
				font-size: 24rpx;
				color: #a6a6a6;
			}
		}
	}

	.hot {
		padding: 30rpx 0;
		&-content {
			margin-top: 30rpx;
			.list {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 30rpx;
				.item {
				}
			}
		}
	}
}
</style>
