import { ref, computed, unref } from 'vue';
import { defineStore } from 'pinia';
import { add as xe_add, multiply as xe_multiply } from 'xe-utils';
import { formatPrice } from '@/utils/format.js';
const orderGoodsList = ref([]);
export const useOrderStore = defineStore(
	'order',
	() => {
		const setGoodsList = (list = []) => {
			orderGoodsList.value = list;
		};
		const merchantInfo = ref({});
		const addressInfo = ref({});

		const orderGoodsTotal = computed(() => {
			return unref(orderGoodsList).reduce((prev, current) => {
				return xe_add(prev, Number(current._countNum));
			}, 0);
		});

		const orderPriceTotal = computed(() => {
			let amount = unref(orderGoodsList).reduce((prev, current) => {
				const result = xe_multiply(Number(current._countNum), Number(current._skuInfo.price));
				return xe_add(prev, result);
			}, 0);
			return amount;
		});

		const mapGoodsList = computed(() => {
			return unref(orderGoodsList).map(({ _id, _skuInfo, _countNum }) => ({ goods_id: _id, sku_id: _skuInfo._id, number: _countNum }));
		});

		return {
			merchantInfo,
			addressInfo,
			orderGoodsList,
			setGoodsList,
			orderGoodsTotal,
			orderPriceTotal,
			mapGoodsList
		};
	},
	{
		persist: {
			storage: {
				getItem: uni.getStorageSync,
				setItem: uni.setStorageSync
			}
		}
	}
);
