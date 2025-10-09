import {commafy} from 'xe-utils'
import { ORDER_STATUS_ENUMS } from '@/utils/config.js';
const orderMenus = ORDER_STATUS_ENUMS();
export const formatPrice = (price=0,opts={})=>{
	const {digits = 2} = opts
	return commafy(Number(price) / 100,{digits});
}

export const formatStatus = (status) => {
	return orderMenus.find((val) => val.value == Number(status));
};