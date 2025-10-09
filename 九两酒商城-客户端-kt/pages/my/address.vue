<script setup>
import { ref, unref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { hideLoading, routerTo, showLoading, showModal, showToast } from '../../utils/common';
import { useOrderStore } from '@/stores/order.js';
const orderStore = useOrderStore();
const addressCloudObj = uniCloud.importObject('client-user-address', { customUI: true });
const dataList = ref([]);
const isSelect = ref(false);
const paging = ref(null);
const queryList = async (pageCurrent, pageSize) => {
	try {
		let { data, errCode } = await addressCloudObj.list({ pageCurrent, pageSize });
		if (errCode !== 0) return paging.value.complete(false);
		paging.value.complete(data);
	} catch (err) {
		paging.value.complete(false);
	}
};

const defaultChange = async (e, item) => {
	try {
		showLoading({ mask: true });
		let { errCode, data } = await addressCloudObj.update({ _id: item._id, is_default: e.detail.value });
		if (errCode !== 0) return showToast('设置失败');
		showToast('设置成功');
		paging.value.reload();
	} catch (err) {
		console.log(err);
		showToast(err);
	} finally {
		hideLoading();
	}
};

const handleRemove = async (item) => {
	try {
		if (!(await showModal({ content: '是否确认删除该收货地址？' }))) return;
		showLoading({ mask: true });
		let { errCode, data } = await addressCloudObj.remove({ _id: item._id });
		if (errCode !== 0) return showToast('删除失败');
		showToast('删除成功');
		paging.value.reload();
	} catch (err) {
		showToast(err);
	}
};

const handleAddressItem = (item) => {
	if (unref(isSelect)) {
		orderStore.addressInfo = item;
		uni.navigateBack();
		return;
	}
};

onLoad((e) => {
	if (e.type == 'select') isSelect.value = true;
	uni.$on('addressSuccess', () => {
		paging.value.reload();
	});
});

onUnload(() => {
	uni.$off('addressSuccess');
});
</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<view class="list-wrap">
				<view class="item-wrap" @click="handleAddressItem(item)" v-for="(item, index) in dataList" :key="item._id">
					<view class="head">
						<view class="left">
							<view class="name">{{ item.name }}</view>
							<view class="phone">{{ item.phone }}</view>
						</view>
						<view class="right" @click.stop="handleRemove(item)">
							<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
						</view>
					</view>
					<view class="address">{{ item.address + item.house }}</view>
					<view class="info">
						<view class="default" @click.stop="">
							<switch :checked="item.is_default" color="#BDAF8D" style="transform: scale(0.6); transform-origin: left center" @change="defaultChange($event, item)" />
							<text class="txt">{{ item.is_default ? '默认地址' : '设为默认' }}</text>
						</view>
						<view class="edit" @click.stop="routerTo(`/pages/my/addressItem?id=${item._id}`)">
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
