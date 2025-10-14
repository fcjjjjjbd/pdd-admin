//订单状态
export const ORDER_STATUS_ENUMS = () => [
	{
		text: '已关闭',
		value: -1,
		type: 'info'
	},
	{
		text: '待付款',
		value: 0,
		icon: 'icon-wallet',
		myOrder: true,
		type: 'info'
	},
	{
		text: '待发货',
		value: 1,
		icon: 'icon-product',
		myOrder: true,
		type: 'warning'
	},
	{
		text: '待取货',
		value: 2,
		icon: 'icon-Newuserzone',
		myOrder: true,
		type: 'primary'
	},
	{
		text: '待收货',
		value: 3,
		icon: 'icon-landtransportation',
		myOrder: true,
		type: 'primary'
	},
	{
		text: '退款',
		value: 4,
		icon: 'icon-tuishuirongzi',
		myOrder: true,
		type: 'danger'
	},
	{
		text: '完成',
		value: 5,
		type: 'success'
	}
];
