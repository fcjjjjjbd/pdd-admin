<script setup>

import { computed } from "vue";
import {COLOR_THEME_PRIMARY} from "@/utils/config.js"
import {useNavBarStyle} from "@/utils/system.js"
const {statusBarHeight,titleBarHeight,headHeight} = useNavBarStyle();

const props = defineProps({
	title:{
		type:String,
		default:""
	},
	titleColor:{
		type:String,
		default:'#000'
	}
})


const showBack = getCurrentPages().length > 1

const titleTextAlign = computed(()=>{
	if(!showBack) return 'left'
	return 'center'
})

const navBack = ()=>{
	uni.navigateBack({
		fail:()=>{
			uni.reLaunch({
				url:"/pages/index/index"
			})
		}
	})
}


</script>

<template>
	<view class="mod-nav-bar">
		<view class="fixed-wrap">
			<view class="status-bar"></view>
			<view class="title-bar">
				<view class="arrow-wrap" v-if="showBack" @click.stop="navBack">					
					<uni-icons class="icon" type="left" size="28" :color="titleColor"></uni-icons>
				</view>
				<view class="text-wrap">
					{{title}}
				</view>
				<view class="menu-wrap">
					
				</view>
			</view>
		</view>
		<view class="block-wrap"></view>
	</view>
</template>

<style lang="scss" scoped>
.mod-nav-bar{
	width: 750rpx;
	.fixed-wrap{
		position: fixed;
		left:0;
		top:0;
		width: 100%;
		background: v-bind(COLOR_THEME_PRIMARY);
		z-index:8000;
		.status-bar{
			width: 100%;
			height: v-bind(statusBarHeight);			
		}
		.title-bar{
			display: flex;
			width: 100%;
			text-align: center;
			justify-content: space-between;
			align-items: center;
			height: v-bind(titleBarHeight);				
			color:v-bind(titleColor);
			padding:0 32rpx;
			font-size: 32rpx;
			.arrow-wrap{
				height: 100%;
				width:80rpx;
				flex-shrink: 0;
				display: flex;
				align-items: center;
			}
			.text-wrap{
				flex:1;
				text-align: v-bind(titleTextAlign);
				font-weight: bolder;
			}
			.menu-wrap{
				height:100%;
				width: 80rpx;
				flex-shrink: 0;
			}
		}
	}
	.block-wrap{
		width: 100%;
		height: v-bind(headHeight);
	}
}
</style>