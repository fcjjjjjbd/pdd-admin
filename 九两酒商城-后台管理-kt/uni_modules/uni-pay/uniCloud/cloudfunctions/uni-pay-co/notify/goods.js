const db = uniCloud.database();

module.exports = async (obj) => {
	let user_order_success = true;
	let { data = {} } = obj;
	let { order_no, out_trade_no, total_fee, openid } = data;

	let {
		data: [payOrder],
		errCode
	} = await db.collection('JLJ-pay-order').where({ order_no }).field({ delivery_type: true, total_fee: true, order_status: true, goods_list: true }).get();
	let statusValue = payOrder.delivery_type == 0 ? 2 : 1;
	db.collection('JLJ-pay-order').where({ order_no }).update({
		order_status: statusValue,
		openid,
		out_trade_no,
		pay_date: Date.now()
	});
	return user_order_success;
};
