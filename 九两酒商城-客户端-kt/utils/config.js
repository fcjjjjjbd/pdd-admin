//系统信息
export const SYSTEM_WINDOW_INFO = uni.getWindowInfo();

//胶囊按钮
export const MENU_BUTTON_RECT_INFO = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : {};

//主色调
export const COLOR_THEME_PRIMARY = '#bdaf8d';

//订单状态
export const ORDER_STATUS_ENUMS = () => [
	{
		text: '全部',
		value: null
	},
	{
		text: '待付款',
		value: 0,
		icon: 'icon-wallet',
		myOrder: true
	},
	{
		text: '待发货',
		value: 1,
		icon: 'icon-product',
		myOrder: true
	},
	{
		text: '待取货',
		value: 2,
		icon: 'icon-Newuserzone',
		myOrder: true
	},
	{
		text: '待收货',
		value: 3,
		icon: 'icon-landtransportation',
		myOrder: true
	},
	{
		text: '退款',
		value: 4,
		icon: 'icon-tuishuirongzi',
		myOrder: true
	},
	{
		text: '完成',
		value: 5
	}
];

export const MERCHANT_STATE = {
	0: '审核中',
	1: '审核通过',
	2: '停运'
};
