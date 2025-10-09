<script setup>
import { computed, ref, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

let id;
onLoad((e) => {
	id = e.id;
	getDetail();
});

const detail = ref();

const getDetail = async () => {
	try {
	} catch (err) {
		console.log(err);
		showToast(err);
	}
};
</script>

<template>
	<view class="page-wrap">
		<view class="store-title">华美餐厅</view>
		<view class="row-item">
			<view class="label">商家类型：</view>
			<view class="value">餐饮</view>
		</view>
		<view class="row-item">
			<view class="label">详细地址：</view>
			<view class="value">
				<text>上海市黄浦区南京东路123号B座305</text>
			</view>
		</view>
		<view class="row-item">
			<view class="label">商家电话：</view>
			<view class="value">18866669999</view>
		</view>
		<view class="row-item">
			<view class="label">商家环境：</view>
			<view class="images-wrap">
				<video class="video" src=""></video>
				<image class="image" src="/static/images/tmp_goods.jpg" mode="widthFix" />
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
