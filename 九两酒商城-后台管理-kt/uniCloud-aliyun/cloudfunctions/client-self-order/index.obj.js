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
			let wre = `user_id == $cloudEnv_uid`;
			if (status || status == 0) wre += `&& order_status == ${status}`;
			let { data: orderData = [] } = await dbJQL.collection('JLJ-pay-order').where(wre).orderBy('create_date desc').orderBy('pay_date desc').skip(pageCurrent).limit(pageSize).get();
			return result({ errCode: 0, errMsg: 'success', data: orderData });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	}
};
