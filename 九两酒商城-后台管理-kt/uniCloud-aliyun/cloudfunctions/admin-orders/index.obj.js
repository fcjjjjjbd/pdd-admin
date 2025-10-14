let dbJQL = uniCloud.databaseForJQL();
let { result } = require('utils');
module.exports = {
	_before: function () {
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({ clientInfo });
	},
	async list({ pageSize = 10, pageCurrent = 1, keyword = '', status } = {}) {
		try {
			pageSize = Math.min(100, pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;
			let wre = `_id != null`;
			if (status || status == 0) wre += `&& order_status == ${status}`;
			if (keyword) wre += `&& order_no == "${keyword}"`;

			let orderTemp = dbJQL.collection('JLJ-pay-order').where(wre).orderBy('create_date desc').skip(pageCurrent).limit(pageSize).getTemp();
			let userTemp = dbJQL.collection('uni-id-users').field(`_id,nickname,avatar`).getTemp();
			let {
				errCode,
				data: orderData = [],
				count
			} = await dbJQL.collection(orderTemp, userTemp).field(`order_no,total_fee,create_date,delivery_type,transport_info.type as transport_type,order_status,payment_method,arrayElemAt(user_id.nickname,0) as nickname,arrayElemAt(user_id.avatar,0) as avatar`).get({ getCount: true });

			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error', custom: '查询失败' });
			return result({ errCode: 0, errMsg: 'success', data: orderData, total: count });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},

	async detail({ _id } = {}) {
		try {
			if (!_id) return result({ errCode: 400, errMsg: 'error', custom: '_id不能为空' });
			let orderTemp = dbJQL.collection('JLJ-pay-order').where({ _id }).getTemp();
			let userTemp = dbJQL.collection('uni-id-users').field(`_id,nickname,avatar`).getTemp();
			let { errCode, data } = await dbJQL
				.collection(orderTemp, userTemp)
				.field(
					`order_no,total_fee,create_date,delivery_type,transport_info,self_take_info,order_status,payment_method,arrayElemAt(user_id.nickname,0) as nickname,arrayElemAt(user_id.avatar,0) as avatar,goods_price,goods_list,out_trade_no,pay_date,refund_fee,refund_desc,refund_date,description`
				)
				.get({ getOne: true });
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error' });
			return result({ errCode: 0, errMsg: 'success', data });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	}
};
