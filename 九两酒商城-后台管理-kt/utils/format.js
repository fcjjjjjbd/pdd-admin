import { commafy } from 'xe-utils';
import { ORDER_STATUS_ENUMS } from '@/utils/config.js';
const orderMenus = ORDER_STATUS_ENUMS();
export const formatPrice = (price = 0, opts = {}) => {
	const { digits = 2 } = opts;
	return commafy(Number(price) / 100, { digits });
};

export const payMethod = (value) => {
	switch (value) {
		case 0:
			return '真实支付';
		case 1:
			return '积分支付';
		default:
			return '-';
	}
};

export const formatStatus = (status) => {
	return orderMenus.find((val) => val.value == Number(status));
};
