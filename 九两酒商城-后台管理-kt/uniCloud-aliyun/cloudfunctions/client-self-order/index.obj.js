let dbJQL = uniCloud.databaseForJQL();
let dbCmd = dbJQL.command;
let { result } = require('utils');
module.exports = {
	_before: function () {
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({ clientInfo });
	},
	async list({ pageSize = 10, pageCurrent = 1, status } = {}) {
		try {
			pageSize = Math.min(20, pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;
			let wre = `user_id == $cloudEnv_uid && order_status != -1`;
			if (status || status == 0) wre += `&& order_status == ${status}`;
			let { data: orderData = [] } = await dbJQL.collection('JLJ-pay-order').where(wre).field(`_id,order_no,out_trade_no,total_fee,order_status,goods_price,goods_list,delivery_type,payment_method`).orderBy('create_date desc').orderBy('pay_date desc').skip(pageCurrent).limit(pageSize).get();
			return result({ errCode: 0, errMsg: 'success', data: orderData });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async cancel({ _id } = {}) {
		try {
			let { errCode, errMsg } = await dbJQL.collection('JLJ-pay-order').doc(_id).update({
				order_status: -1
			});
			return result({ errCode: 0, errMsg: 'success' });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async refund({ _id, value } = {}) {
		try {
			let { errCode, errMsg } = await dbJQL.collection('JLJ-pay-order').doc(_id).update({
				order_status: 4,
				refund_desc: value
			});
			return result({ errCode: 0, errMsg: 'success', custom: errMsg });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async confirm({ _id } = {}) {
		try {
			if (!_id) return result({ errCode: 400, errMsg: 'error', custom: '_id不能为空' });
			let { errCode, errMsg } = await dbJQL.collection('JLJ-pay-order').doc(_id).update({
				order_status: 5
			});
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error' });
			return result({ errCode: 0, errMsg: 'success' });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async detail({ out_trade_no, id } = {}) {
		try {
			let wre = out_trade_no != 'undefined' ? `out_trade_no == "${out_trade_no}"` : `_id == "${id}"`;
			let { errCode, errMsg, data } = await dbJQL.collection('JLJ-pay-order').where(wre).get({
				getOne: true
			});
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error' });
			return result({ errCode: 0, errMsg: 'success', data });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	}
};
