<script setup>
import { ref } from 'vue';
import { showToast, routerTo } from '../../utils/common';
const newsCloudObj = uniCloud.importObject('client-news', { customUI: true });
const dataList = ref([]);

const getData = async () => {
	try {
		let { errCode, data } = await newsCloudObj.sticky();
		if (errCode !== 0) return showToast('获取失败');
		dataList.value = data;
	} catch (err) {
		console.log(err);
		showToast(err);
	}
};

getData();
</script>

<template>
	<view class="scroll-notice">
		<view class="left-wrap">
			<image class="icon" src="/static/images/notic_prefix.png" mode="aspectFill"></image>
		</view>
		<view class="notice-wrap">
			<swiper class="swiper" vertical autoplay interval="3000" circular>
				<swiper-item @click="routerTo('/pages/news/newsDetail?id=' + item._id)" class="swiper-item" v-for="item in dataList" :key="item._id">
					<view class="title">{{ item.title }}</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="right-wrap">
			<uni-icons type="right" color="#888" size="36rpx"></uni-icons>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.scroll-notice {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	.left-wrap {
		flex-shrink: 0;
		.icon {
			width: 88rpx;
			height: 40rpx;
			display: block;
		}
	}
	.notice-wrap {
		flex: 1;
		.swiper {
			width: 100%;
			height: 50rpx;
			&-item {
				width: 100%;
				font-size: 32rpx;
				color: #333;
				display: flex;
				align-items: center;
				.title {
					text-decoration: underline;
					@include text-ellipsis(1);
				}
			}
		}
	}
	.right-wrap {
		flex-shrink: 0;
		width: 80rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
}
</style>
