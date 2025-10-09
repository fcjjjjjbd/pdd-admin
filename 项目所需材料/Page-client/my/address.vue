<script setup>
import { ref } from 'vue';
import { routerTo } from '../../utils/common';
const dataList = ref([]);
const paging = ref(null);
const queryList = async (pageCurrent, pageSize) => {
	console.log(pageCurrent, pageSize);
};
</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<view class="list-wrap">
				<view class="item-wrap" v-for="(item, index) in 5" :key="index">
					<view class="head">
						<view class="left">
							<view class="name">张三</view>
							<view class="phone">13022223333</view>
						</view>
						<view class="right">
							<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
						</view>
					</view>
					<view class="address">详细的收货地址</view>
					<view class="info">
						<view class="default">
							<switch checked color="#BDAF8D" style="transform: scale(0.6); transform-origin: left center" />
							<text class="txt">{{ true ? '默认地址' : '设为默认' }}</text>
						</view>
						<view class="edit" @click="routerTo(`/pages/my/addressItem?id=`)">
							<text class="iconfont icon-editor"></text>
							<text class="txt">编辑</text>
						</view>
					</view>
				</view>
			</view>
			<template #bottom>
				<view class="addBtn">
					<button type="primary" @click="routerTo('/pages/my/addressItem')">+ 新增收货地址</button>
					<view class="safe-area-box"></view>
				</view>
			</template>
		</z-paging>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	min-height: 100vh;
	background: #f8f8f8;
	.list-wrap {
		.item-wrap {
			background: #fff;
			margin: 20rpx 0;
			padding: 30rpx;
			.head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					display: flex;
					gap: 30rpx;
					font-size: 36rpx;
					.name {
						font-weight: bold;
					}
				}
				.right {
					width: 52rpx;
					aspect-ratio: 1/1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.address {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6em;
				padding: 30rpx 0;
			}
			.info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-top: 1rpx solid #eee;
				padding-top: 30rpx;
				.txt {
					font-size: 28rpx;
					color: #999;
				}
				.default {
					display: flex;
					align-items: center;
					.txt {
						display: inline-block;
						transform: translateX(-26rpx);
					}
				}
				.edit {
					display: flex;
					align-items: center;
					gap: 10rpx;
					.iconfont {
						font-size: 40rpx;
						color: #999;
					}
				}
			}
		}
	}

	.addBtn {
		background: #fff;
		padding: 30rpx;
		button {
			border-radius: 100rpx;
			color: #fff;
			background-color: $uni-color-primary;
		}
	}
}
</style>
