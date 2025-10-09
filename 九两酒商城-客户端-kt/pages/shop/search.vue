<script setup>
import { ref, unref } from 'vue';
import {onLoad} from "@dcloudio/uni-app"
const goodsCloudObj = uniCloud.importObject("client-product-goods",{customUI:true})
const searchVal = ref("")
const dataList  = ref([])
const paging = ref(null);

const queryList = async(pageCurrent, pageSize)=>{
	try{
		let {errCode,data} = await goodsCloudObj.goodsList({pageCurrent,pageSize,keyword:unref(searchVal)})
		if(errCode!==0) return paging.value.complete(false);
		paging.value.complete(data);
	}catch(err){
		paging.value.complete(false);
		console.log(err);
	}	
}

onLoad((e)=>{
	if(e.keyword) searchVal.value = e.keyword;	
})


</script>

<template>
	<view class="page-wrap">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<template #top>
				<mod-nav-bar title="搜索" title-color="#fff"></mod-nav-bar>
				<mode-search @on-confirm="queryList" v-model:keyword="searchVal"></mode-search>
			</template>
			
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			
			<view class="list-wrap">
				<view class="item-wrap" v-for="item in dataList" :key="item._id">
					<card-goods :info="item"></card-goods>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<style lang="scss" scoped>
	.list-wrap{
		padding:32rpx;
		display: grid;
		grid-template-columns: repeat(2 , minmax(0,1fr));
		gap:30rpx;
	}
</style>
