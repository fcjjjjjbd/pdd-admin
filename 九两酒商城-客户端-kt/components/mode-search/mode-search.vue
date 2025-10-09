<script setup>
import { ref } from 'vue';
const searchVal = ref("");
const emits = defineEmits(["onConfirm","update:keyword"])

const props = defineProps({
	keyword:{
		type:String,
		default:""
	}
})

defineOptions({
  options: {
    styleIsolation: 'shared'
  }
})

const handleSearch = ()=>{
	emits("onConfirm")
}

const handleInput = (e)=>{
	emits("update:keyword",e)
}
</script>

<template>
	<view class="search-wrap">
		<view class="fixed">
			<uni-easyinput class="input" suffixIcon="search"
			:value="keyword" 
			@input="handleInput"
			placeholder="请输入要搜索的产品..." 
			@iconClick="handleSearch" 
			@confirm="handleSearch"></uni-easyinput>
		</view>
		<view class="block"></view>			
	</view>
</template>

<style lang="scss" scoped>
.search-wrap{	
	.fixed{
		background: $uni-color-primary;
		padding:10rpx 32rpx;
		position: fixed;
		width: 100%;
		height: 45px;
		top:v-bind(headHeight);
		left:0;
		z-index: 8000;
		:deep(.is-input-border){
			border-radius: 50px;
			border-color:$uni-color-primary !important;
		}
	}
	.block{
		height: 45px;
	}
	
}	
</style>