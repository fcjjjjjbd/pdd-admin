<script setup>
import { computed, ref, unref } from 'vue';
import { useLocationStore } from '@/stores/location.js';
const locationStore = useLocationStore();
const merchantCloudObj = uniCloud.importObject('client-merchant', {
	customUI: true
});
const dataList = ref([
	{
		letter: 'A',
		data: ['阿克苏机场', '阿拉山口机场', '阿勒泰机场', '阿里昆莎机场', '安庆天柱山机场', '澳门国际机场']
	},
	{
		letter: 'B',
		data: ['保山机场', '包头机场', '北海福成机场', '北京南苑机场', '北京首都国际机场']
	}
]);

const cityList = computed(() => {
	if (!Array.isArray(unref(dataList)) || unref(dataList).length === 0) {
		return [];
	}
	// 按首字母分组
	const grouped = unref(dataList).reduce((acc, city) => {
		// 确保城市对象和first_letter属性存在
		if (city && city.first_letter && city.name) {
			const letter = city.first_letter;
			if (!acc[letter]) {
				acc[letter] = [];
			}
			acc[letter].push(city.name);
		}
		return acc;
	}, {});

	// 转换为数组并按字母顺序排序
	return Object.keys(grouped)
		.sort()
		.map((letter) => ({
			letter: letter,
			data: grouped[letter]
		}));
});

const bindClick = (e) => {
	let { key = '', name = '' } = e?.item || {};
	let code = getCityCode(unref(dataList), key, name);
	if (code) {
		locationStore.city = { code, name };
		uni.navigateBack();
	}
};

function getCityCode(arr, key, name) {
	// 将key转换为大写，确保匹配的是first_letter的大写形式
	const upperKey = key.toUpperCase();

	// 遍历数组查找匹配项
	for (const item of arr) {
		// 同时匹配首字母和名称
		if (item.first_letter === upperKey && item.name === name) {
			return item.code;
		}
	}

	// 如果没有找到匹配项，返回null或其他表示未找到的值
	return null;
}

const getCitys = async () => {
	let { data, errCode } = await merchantCloudObj.citys();
	dataList.value = data;
};

getCitys();
</script>

<template>
	<view class="page-wrap">
		<uni-indexed-list :options="cityList" :showSelect="false" @click="bindClick"></uni-indexed-list>
	</view>
</template>

<style lang="scss" scoped></style>
