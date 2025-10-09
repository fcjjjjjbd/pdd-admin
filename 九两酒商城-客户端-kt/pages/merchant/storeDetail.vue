<script setup>
import { computed, ref, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
const merchantCloudObj = uniCloud.importObject('client-merchant', { customUI: true });
let id;
onLoad((e) => {
	id = e.id;
	getDetail();
});

const detail = ref();

const getDetail = async () => {
	try {
		let { errCode, data } = await merchantCloudObj.item({ _id: id });
		if (errCode !== 0) return showToast('获取失败');
		detail.value = data;
		uni.setNavigationBarTitle({
			title: detail.value.store
		});
	} catch (err) {
		console.log(err);
		showToast(err);
	}
};
</script>

<template>
	<uni-load-more status="loading" v-if="!detail"></uni-load-more>
	<view class="page-wrap" v-else>
		<view class="store-title">{{ detail.store }}</view>
		<view class="row-item">
			<view class="label">商家类型：</view>
			<view class="value">{{ detail.category_name }}</view>
		</view>
		<view class="row-item">
			<view class="label">详细地址：</view>
			<view class="value">
				<text>{{ detail.address + detail.house }}</text>
			</view>
		</view>
		<view class="row-item">
			<view class="label">商家电话：</view>
			<view class="value">{{ detail.phone }}</view>
		</view>
		<view class="row-item">
			<view class="label">商家环境：</view>
			<view class="images-wrap">
				<video class="video" :src="detail.video" v-if="detail.video"></video>
				<image class="image" v-for="(pic, index) in detail.pics" :key="index" :src="pic" mode="widthFix" />
			</view>
		</view>
		<view class="safe-area-box"></view>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	padding: 32rpx;

	.store-title {
		margin-bottom: 32rpx;
		font-size: 44rpx;
		font-weight: 500;
	}

	.row-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 26rpx;
		.label {
			flex-shrink: 0;
			margin-right: 8rpx;
			font-size: 28rpx;
			color: #999;
		}

		.value {
			flex: 1;
			font-size: 28rpx;
			color: #666;
		}

		.images-wrap {
			overflow: hidden;

			.video {
				width: 538rpx;
				height: 338rpx;
				margin-bottom: 32rpx;
			}

			.image {
				width: 538rpx;
				margin-bottom: 32rpx;
				background-color: #efefef;
			}
		}
	}
}
</style>
