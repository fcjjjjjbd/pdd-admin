import { ref, computed, unref } from 'vue';
import dayjs from 'dayjs';
import { showModal, showToast } from '@/utils/common.js';
const orderCloudObj = uniCloud.importObject('client-self-order', { customUI: true });

//我的订单模块
export function useOrder({ currStatus, paging, getDetail } = {}) {
	const payRef = ref(null);
	const orderData = ref(null);
	const inputDialog = ref(null);
	const inputClose = ref(null);
	const inputValue = ref('');

	const handlePay = (item) => {
		console.log(item);
		orderData.value = item;
		payRef.value.createOrder({
			provider: 'wxpay',
			total_fee: item.total_fee,
			type: 'goods',
			order_no: item.order_no,
			description: item.description
		});
	};
	const cancelPay = async (id) => {
		if (await showModal({ content: '是否确认取消订单？' })) {
			let { errCode, errMsg } = await orderCloudObj.cancel({ _id: id });
			if (errCode !== 0) return showToast('取消失败');
			getDetail ? getDetail() : paging.value?.reload();
		}
	};

	const paySuccess = (e) => {
		const deliveryType = unref(orderData)?.delivery_type;
		if (deliveryType !== undefined && deliveryType !== null) {
			currStatus.value = unref(deliveryType) === 0 ? 2 : 1;
		}
		getDetail ? getDetail() : paging.value?.reload();
	};

	const handleRefund = async (item) => {
		orderData.value = item;
		inputValue.value = '';
		inputDialog.value.open();
	};

	const dialogInputConfirm = async () => {
		let { errCode, errMsg } = await orderCloudObj.refund({ _id: unref(orderData)._id, value: unref(inputValue) });
		if (errCode !== 0) return showToast('申请失败');
		showToast('已提交申请，等待审核');
		currStatus.value = 4;
		getDetail ? getDetail() : paging.value?.reload();
	};

	const handleConfirm = async (item) => {
		if (await showModal({ content: '是否确认完成订单' })) {
			let { errCode, errMsg } = await orderCloudObj.confirm({ _id: item._id });
			if (errCode !== 0) return showToast('取消失败');
			getDetail ? getDetail() : paging.value?.reload();
		}
	};

	return {
		payRef,
		handlePay,
		paySuccess,
		cancelPay,
		handleRefund,
		inputDialog,
		inputClose,
		inputValue,
		dialogInputConfirm,
		handleConfirm
	};
}
