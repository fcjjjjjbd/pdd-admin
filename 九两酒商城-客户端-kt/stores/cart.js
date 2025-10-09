import { computed, ref, unref } from 'vue';
import { defineStore } from 'pinia';
import { formatPrice } from '@/utils/format.js';
import { add as xe_add, multiply as xe_multiply } from 'xe-utils';
import { useOrderStore } from './order.js';
import { routerTo } from '../utils/common.js';
const orderStore = useOrderStore();
const cartList = ref([]);
export const useCartStore = defineStore(
	'cart',
	() => {
		const goodsTotal = computed(() => {
			return unref(cartList).reduce((prev, current) => {
				return xe_add(prev, Number(current._countNum));
			}, 0);
		});

		const clearCart = () => {
			cartList.value = [];
		};

		const priceTotal = computed(() => {
			let amount = unref(cartList).reduce((prev, current) => {
				const result = xe_multiply(Number(current._countNum), Number(current._skuInfo.price));
				return xe_add(prev, result);
			}, 0);
			return formatPrice(amount);
		});

		const pushGoods = (data) => {
			let {
				_id,
				_skuInfo: { _id: skuId },
				_countNum
			} = data;

			const index = unref(cartList).findIndex((item) => _id && skuId && item._id == _id && item._skuInfo._id == skuId);
			if (index > -1) {
				cartList.value[index]._countNum = Number(_countNum) + Number(cartList.value[index]._countNum);
				return;
			}
			cartList.value.unshift(data);
		};

		const updateGoods = (data) => {
			let {
				_id,
				_skuInfo: { _id: skuId },
				_countNum
			} = data;
			const index = unref(cartList).findIndex((item) => _id && skuId && item._id == _id && item._skuInfo._id == skuId);
			if (index > -1) {
				if (_countNum > 0) cartList.value[index] = { ...data };
				else cartList.value.splice(index, 1);
			}
		};

		const createOrder = () => {
			orderStore.setGoodsList([...unref(cartList)]);
			routerTo('/pages/shop/order');
		};

		return {
			cartList,
			pushGoods,
			goodsTotal,
			priceTotal,
			updateGoods,
			createOrder,
			clearCart
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
