import { ref, computed, unref } from 'vue';
import dayjs from 'dayjs';
import { useOrderStore } from '@/stores/order.js';
import { useCartStore } from '@/stores/cart.js';
import { routerTo, showModal, showToast } from '../../utils/common';
const cartStore = useCartStore();
const orderCloudObj = uniCloud.importObject('client-create-order', { customUI: true });
const orderStore = useOrderStore();

export const useSelfTake = () => {
	const selfTakeInfo = ref({
		phone: uni.getStorageSync('selfTakePhone') || null,
		time: ''
	});

	const selfPickDateLimit = computed(() => {
		const today = dayjs();
		const endDay = today.clone().add(5, 'day');
		const formatTmpl = 'YYYY-MM-DD HH:mm';
		return [today.format(formatTmpl), endDay.format(formatTmpl)];
	});

	const handleTakePhone = () => {
		uni.setStorageSync('selfTakePhone', selfTakeInfo.value.phone);
	};

	return {
		selfTakeInfo,
		selfPickDateLimit,
		handleTakePhone
	};
};

export const useTransport = () => {
	const transportType = ref(-1);
	const transportRef = ref(null);
	const transportList = ref([]);

	const getTransportFee = async () => {
		transportType.value = -1;
		let { data, errCode } = await orderCloudObj.transportFee({
			merchantId: orderStore.merchantInfo._id,
			addressId: orderStore.addressInfo._id,
			goodsList: unref(orderStore.mapGoodsList)
		});
		transportType.value = data.find((f) => f.disabled == false).index;
		transportList.value = data;
	};
	const transportSelect = (e) => {
		console.log(e);
		transportType.value = e.index;
	};

	const handleTransport = () => {
		transportRef.value.open();
	};
	return {
		transportType,
		transportRef,
		transportList,
		transportSelect,
		handleTransport,
		getTransportFee
	};
};

export function usePay(deliveryType) {
	const payRef = ref(null);
	const paySuccess = (e) => {
		console.log('success', e);
		if (e.user_order_success) {
			showToast('支付成功');
			let status = unref(deliveryType) == 0 ? 2 : 1;
			routerTo('/pages/my/orderList?status=' + status, 'redirectTo');
		} else {
			showToast('支付异常，请联系管理员');
		}
	};
	const payCancel = async (e) => {
		console.log('cancel', e);
		if (await showModal({ title: '已取消支付', content: '跳转至我的订单可以继续完成支付', showCancel: false })) {
			routerTo('/pages/my/orderList?status=0', 'redirectTo');
		}
	};
	const payFail = (e) => {
		console.log('fail', e);
	};

	const payCreate = () => {
		cartStore.clearCart();
	};

	return {
		payRef,
		paySuccess,
		payCancel,
		payFail,
		payCreate
	};
}
