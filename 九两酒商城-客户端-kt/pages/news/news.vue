<script setup>
import {ref} from "vue";
import dayjs from "dayjs";
import {routerTo} from "@/utils/common.js"
const newsCloudObj = uniCloud.importObject("client-news",{customUI:true});
const dataList = ref([]);
const paging = ref(null);
const queryList = async(pageCurrent, pageSize)=>{
	try{
		let {errCode,data} = await newsCloudObj.list({pageCurrent,pageSize})
		if(errCode!==0) return paging.value.complete(false);
		paging.value.complete(data);
	}catch(err){
		paging.value.complete(false);
	}	
}


</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<mod-nav-bar title="资讯" title-color="#fff"></mod-nav-bar>
			</template>
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<view class="list-wrap">
				<view class="item-wrap" v-for="item in dataList" :key="item._id" 
				@click="routerTo('/pages/news/newsDetail?id='+item._id)">
					<view class="left-wrap">
						<view class="title">
							{{item.title}}
						</view>
						<view class="info">
							<view class="author">{{item.nickname}}</view>
							<view class="time">{{dayjs(item.publish_date).format("YYYY-MM-DD HH:mm")}}</view>
						</view>
					</view>
					<view class="right-wrap" v-if="item.avatar">
						<image class="img" :src="item.avatar" mode="aspectFill"></image>
					</view>
				</view>			
			</view>
		</z-paging>
		
	</view>
</template>

<style lang="scss" scoped>
	.page-wrap{
		.list-wrap{
			padding:12rpx 0;
			.item-wrap{
				border-bottom: 1px solid #f0f0f0;
				display: flex;
				align-items: stretch;
				justify-content: space-between;
				padding:24rpx 32rpx;
				gap:24rpx;
				height: 200rpx;
				.left-wrap{
					flex:1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;					
					.title{
						font-size: 30rpx;
						color:#333;
						@include text-ellipsis(2);
					}
					.info{
						display: flex;
						font-size: 26rpx;
						color:#aaa;
						gap:12rpx;
					}
				}
				.right-wrap{
					flex-shrink: 0;
					height: 100%;
					aspect-ratio: 16 / 10;
					border-radius: 8rpx;
					overflow: hidden;
					.img{
						width: 100%;
						height: 100%;
					}
				}
			}
			.item-wrap:last-child{
				border-bottom: none;
			}
		}
	}
</style>
