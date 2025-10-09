<script setup>
import { getPageAndParams, routerTo, showModal, truncateString } from '../../utils/common';
import { ORDER_STATUS_ENUMS } from '@/utils/config.js';
import { mutations, store } from '@/uni_modules/uni-id-pages/common/store.js';
import { computed, unref } from 'vue';
import pagesJson from '@/pages.json';
const orderMenus = ORDER_STATUS_ENUMS().filter((item) => item.myOrder === true);
const userInfo = computed(() => store.userInfo);
const hasLogin = computed(() => store.hasLogin);

const handleLogout = async () => {
	if (await showModal({ content: '是否确认退出？' })) {
		mutations.logout();
	}
};

const handleLogin = () => {
	if (unref(hasLogin)) {
		routerTo('/uni_modules/uni-id-pages/pages/userinfo/userinfo');
	} else {
		routerTo('/' + pagesJson.uniIdRouter.loginPage + '?uniIdRedirectUrl=' + getPageAndParams());
	}
};
</script>

<template>
	<view class="page-wrap">
		<mod-nav-bar title="我的" title-color="#fff"></mod-nav-bar>
		<view class="page-content">
			<view class="user-wrap">
				<view class="userinfo">
					<view class="left" @click="handleLogin">
						<image class="img" :src="userInfo.avatar || '/static/images/defAvatar.png'" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="head" @click="handleLogin">
							<view class="nickname" v-if="!hasLogin">游客，请登录</view>
							<view class="nickname" v-else>
								{{ truncateString(userInfo.nickname, 8) }}
							</view>
							<view class="tag">正式会员</view>
						</view>
						<view class="id" v-if="hasLogin">
							ID：
							<text selectable>{{ userInfo._id }}</text>
						</view>
					</view>
				</view>
				<view class="list">
					<view class="item">
						<view class="icon">
							<text class="iconfont icon-calendar"></text>
						</view>
						<view class="title">每日签到</view>
						<view class="desc">积分+1</view>
					</view>

					<view class="item">
						<view class="icon"><text class="iconfont icon-zijin"></text></view>
						<view class="title">我的积分</view>
						<view class="desc">当前53分</view>
					</view>
					<view class="item">
						<view class="icon"><text class="iconfont icon-assessed-badge"></text></view>
						<view class="title">会员认证</view>
						<view class="desc">已完成认证</view>
					</view>
				</view>
				<view class="vip" :class="{ isVip: false }">
					<image class="img" src="/static/images/vip_icon.png" mode="aspectFill"></image>
				</view>
			</view>

			<view class="order-wrap">
				<view class="head">
					<view class="label">我的订单</view>
					<view class="value" @click="routerTo('/pages/my/orderList')">
						查看全部
						<uni-icons type="right" color="#999"></uni-icons>
					</view>
				</view>
				<view class="list">
					<view class="item" v-for="item in orderMenus" :key="item.value">
						<view class="icon-wrap">
							<text class="iconfont" :class="item.icon"></text>
							<view class="tag">3</view>
						</view>
						<view class="label">{{ item.text }}</view>
					</view>
				</view>
			</view>

			<view class="menu-wrap">
				<view class="list">
					<view class="item">
						<view class="left">
							<text class="iconfont icon-dianpu1"></text>
							<view class="name">商家订单</view>
						</view>
						<view class="right">
							<view class="text">管理商家订单</view>
							<uni-icons type="right" color="#999" size="26rpx"></uni-icons>
						</view>
					</view>

					<view class="item">
						<view class="left">
							<text class="iconfont icon-calculator-fill"></text>
							<view class="name">签到记录</view>
						</view>
						<view class="right">
							<view class="text">已签到6天</view>
							<uni-icons type="right" color="#999" size="26rpx"></uni-icons>
						</view>
					</view>

					<view class="item">
						<view class="left">
							<text class="iconfont icon-Newuserzone-fill"></text>
							<view class="name">抽奖记录</view>
						</view>
						<view class="right">
							<view class="text">已参与6次</view>
							<uni-icons type="right" color="#999" size="26rpx"></uni-icons>
						</view>
					</view>

					<view class="item" @click="routerTo('/pages/my/address')">
						<view class="left">
							<text class="iconfont icon-location-fill"></text>
							<view class="name">收货地址</view>
						</view>
						<view class="right">
							<view class="text">管理收货地址</view>
							<uni-icons type="right" color="#999" size="26rpx"></uni-icons>
						</view>
					</view>

					<view class="item" @click="handleLogout">
						<view class="left">
							<text class="iconfont icon-reduce-fill"></text>
							<view class="name">退出登录</view>
						</view>
						<view class="right">
							<view class="text">退出当前账号</view>
							<uni-icons type="right" color="#999" size="26rpx"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	background: #f9f9f9;
	min-height: 100vh;
	/* #ifdef H5 */
	min-height: calc(100vh - 50px);

	/* #endif */
	.page-content {
		padding: 20rpx 32rpx;
		width: 100%;
		overflow: hidden;
		position: relative;

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

		.user-wrap {
			width: 100%;
			padding: 32rpx;
			border-radius: 12rpx;
			background-color: #fff;
			margin-bottom: 32rpx;
			position: relative;

			.userinfo {
				display: flex;
				gap: 20rpx;
				position: relative;

				.left {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					overflow: hidden;
					flex-shrink: 0;

					.img {
						width: 100%;
						height: 100%;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					gap: 10rpx;

					.head {
						display: flex;
						gap: 20rpx;

						.nickname {
							font-size: 32rpx;
							font-weight: bolder;
							color: #000;
						}

						.tag {
							background: #eccc7d;
							color: #ae6337;
							font-size: 22rpx;
							padding: 2rpx 16rpx;
							display: flex;
							align-items: center;
							border-radius: 20rpx;
						}
					}

					.id {
						font-size: 22rpx;
						color: #999;
					}
				}
			}

			.list {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				padding-top: 50rpx;
				padding-bottom: 20rpx;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 5rpx;
					padding: 0 10rpx;

					.icon {
						.iconfont {
							font-size: 70rpx;
							color: $uni-color-primary;
						}
					}

					.title {
						font-size: 30rpx;
						padding-top: 10rpx;
					}

					.desc {
						font-size: 26rpx;
						color: #999;
					}
				}
			}

			.vip {
				position: absolute;
				right: -20rpx;
				top: -20rpx;
				filter: grayscale(100%);

				.img {
					width: 140rpx;
					height: 110rpx;
				}
			}

			.isVip {
				filter: grayscale(0%);
			}
		}

		.order-wrap {
			position: relative;
			width: 100%;
			border-radius: 12rpx;
			background-color: #fff;
			margin-bottom: 32rpx;

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 80rpx;
				padding: 0 32rpx;
				border-bottom: 1px solid #f4f4f4;

				.label {
					font-size: 28rpx;
					color: #333;
				}

				.value {
					font-size: 26rpx;
					color: #999;
					display: flex;
					align-items: center;
				}
			}

			.list {
				min-height: 100rpx;
				display: flex;
				align-items: flex-end;
				justify-content: space-around;
				padding: 32rpx 0;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					text-align: center;
					gap: 10rpx;

					.icon-wrap {
						position: relative;

						.iconfont {
							font-size: 52rpx;
						}

						.tag {
							position: absolute;
							right: -6rpx;
							top: -6rpx;
							min-width: 26rpx;
							height: 26rpx;
							padding: 6rpx;
							font-size: 18rpx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: $uni-color-primary;
							border-radius: 26rpx;
						}
					}

					.label {
						font-size: 28rpx;
						color: #333;
					}
				}
			}
		}

		.menu-wrap {
			position: relative;
			background: #fff;
			border-radius: 12rpx;

			.list {
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 90rpx;
					padding: 0 32rpx;
					border-bottom: 1rpx solid #f4f4f4;

					.left {
						display: flex;
						align-items: center;
						color: #333;
						gap: 5rpx;
						line-height: 1em;

						.iconfont {
							font-size: 34rpx;
							color: $uni-color-primary;
						}

						.name {
							font-size: 30rpx;
						}
					}

					.right {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #999;
						gap: 5rpx;
					}
				}

				.item:last-child {
					border-bottom: none;
				}
			}
		}
	}
}
</style>
