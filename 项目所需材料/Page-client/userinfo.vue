<!-- 用户资料页 -->
<template>
	<view class="avatar">
		<view class="box">
			<view class="inner">
				<image v-if="avatar" :src="avatar" mode="aspectFill"></image>
				<image v-else src="@/static/images/defAvatar.png" mode="aspectFill"></image>
			
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="btn">按钮</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<button @click="onChooseAvatar" class="btn">按钮</button>
				<!-- #endif -->
				<view class="mask" v-if="uploadState">
					上传中
				</view>
			</view>
			<view class="icon">
				<uni-icons type="camera" color="#fff" size="16"></uni-icons>
			</view>
			<view class="text">点击更换头像</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>	
	.avatar {
		padding: 100rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;		
		.box{
			height: 160rpx;
			width: 160rpx;
			position: relative;			
			.inner {
				width: 100%;
				height: 100%;
				position: absolute;
				top:0;
				left:0;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;					
				}
			
				.btn {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					opacity: 0;
					margin:0;
				}
			
				.mask {
					position: absolute;
					background: rgba(0, 0, 0, 0.6);
					border-radius: 50%;
					color: #fff;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;					
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 22rpx;
				}
			}
			.icon{
				width: 50rpx;
				height: 50rpx;
				background: #FE9468;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				border:2px solid #fff;
				position: absolute;
				right:0;
				bottom:0;
				pointer-events: none;
			}
			.text{
				font-size: 25rpx;
				color:#999;
				white-space: nowrap;				
				text-align: center;				
				position: absolute;
				bottom:-40rpx;
				left:0;
			}
		}		
	}
</style>