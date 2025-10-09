let dbJQL = uniCloud.databaseForJQL();
let { result } = require('utils');
const { encryption } = require('xxm-wx-crypto');
module.exports = {
	_before: function () {
		// 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({ clientInfo });
	},

	async list({ pageSize = 10, pageCurrent = 1, keyword = '' } = {}) {
		try {
			pageSize = Math.min(100, pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;
			let wre = keyword ? `${new RegExp(keyword, 'i')}.test(name) || ${new RegExp(keyword, 'i')}.test(store)` : {};

			let listTemp = dbJQL.collection('JLJ-merchant-list').orderBy('create_date desc').skip(pageCurrent).limit(pageSize).getTemp();
			let cateTemp = dbJQL.collection('JLJ-merchant-category').field(`_id,name`).getTemp();

			let { errCode, data, count } = await dbJQL
				.collection(listTemp, cateTemp)
				.where(wre)
				.field(`_id,name,phone,store,concat(address,house) as address,state,create_date,arrayElemAt(category_id.name, 0) as category_name,arrayElemAt(pics,0) as pic`)
				.get({ getCount: true });

			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error', custom: '查询失败' });
			return result({ errCode: 0, errMsg: 'success', data, total: count });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},

	async update({ _id, area, address, house, phone, ...rest } = {}) {
		try {
			if (!_id) return result({ errCode: 400, errMsg: 'error', custom: '_id不能为空' });
			if (!Object.keys(rest).length) return result({ errCode: 400, errMsg: 'error', custom: '更新的内容不能为空' });

			let { errCode, errMsg, updated } = await dbJQL
				.collection('JLJ-merchant-list')
				.doc(_id)
				.update({ ...rest, last_modify_date: Date.now() });
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error', custom: errMsg });

			let { data: merchant } = await dbJQL.collection('JLJ-merchant-list').doc(_id).get({ getOne: true });

			if (merchant.state === 1) {
				let apiPath = merchant.wx_store_id
					? 'https://api.weixin.qq.com/cgi-bin/express/intracity/updatestore'
					: 'https://api.weixin.qq.com/cgi-bin/express/intracity/createstore';
				let payload = {
					url_path: apiPath,
					out_store_id: merchant._id,
					store_name: merchant.store,
					address_info: {
						province: merchant.area[0].text,
						city: merchant.area[1].text,
						area: merchant.area[2].text,
						house: merchant.address + merchant.house,
						lng: merchant.location.coordinates[0],
						lat: merchant.location.coordinates[1],
						phone: merchant.phone
					}
				};
				if (merchant.wx_store_id) {
					let _payload = {};
					_payload.url_path = payload.url_path;
					_payload.keys = { wx_store_id: merchant.wx_store_id };
					_payload.content = { store_name: payload.store_name, address_info: payload.address_info };
					payload = _payload;
				}

				let { errcode, errmsg, wx_store_id } = await encryption(payload);
				if (errcode !== 0) {
					let action = merchant.wx_store_id ? '修改' : '创建';
					return result({ errCode: 400, errMsg: 'error', custom: `${action}微信同城配送商户失败，${errmsg}` });
				}
				if (wx_store_id) {
					await dbJQL.collection('JLJ-merchant-list').doc(_id).update({ wx_store_id });
				}
			}

			return result({ errCode: 0, errMsg: 'success', data: { updated } });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},

	async remove({ _id } = {}) {
		try {
			if (!_id) return result({ errCode: 400, errMsg: 'error', custom: '_id不能为空' });
			let { errCode, errMsg, deleted } = await dbJQL.collection('JLJ-merchant-list').doc(_id).remove();
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error', custom: errMsg });
			return result({ errCode: 0, errMsg: 'success', data: { deleted } });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},

	async detail({ _id } = {}) {
		try {
			if (!_id) return result({ errCode: 400, errMsg: 'error', custom: '_id不能为空' });
			let { errCode, data } = await dbJQL
				.collection('JLJ-merchant-list')
				.doc(_id)
				.field(`_id,name, phone, store, category_id, area, address, house, location, state, pics, video, wx_store_id`)
				.get({ getOne: true });
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error' });
			return result({ errCode: 0, errMsg: 'success', data });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	}
};
