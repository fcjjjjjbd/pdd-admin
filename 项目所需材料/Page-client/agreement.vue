<template>
	<view class="detail">
		<text>
			{{detail}}
		</text>

	</view>
</template>

<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	
	const detail = ref("")
	let type;
	onLoad((e) => {
		type = e.type
		uni.setNavigationBarTitle({
			title: e.title
		})
		getData();
	})

	const getData = async () => {
		
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding: 30rpx;
		line-height: 1.7em;
		text-indent: 2em;
	}
</style>