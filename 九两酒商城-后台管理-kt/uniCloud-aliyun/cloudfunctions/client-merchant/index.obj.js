let dbJQL = uniCloud.databaseForJQL();
let dbCmd = dbJQL.command;
let { result } = require('utils');
module.exports = {
	_before: function () {
		// 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({
			clientInfo
		});
	},
	async add(params = {}) {
		try {
			if (!(Array.isArray(params.location) && params.location.length === 2)) return result({ errCode: 400, errMsg: 'required', custom: '没有传递商户经纬度location' });
			//地理位置转换
			let location = {
				type: 'Point',
				coordinates: params.location
			};

			let { errCode, errMsg, id } = await dbJQL.collection('JLJ-merchant-list').add({
				...params,
				location
			});
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error', custom: errMsg });
			return result({ errCode: 0, errMsg: 'success', data: { id } });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async detail() {
		try {
			let { errCode, data } = await dbJQL
				.collection('JLJ-merchant-list')
				.where(`user_id == $cloudEnv_uid`)
				.field(`_id,name, phone, store, category_id, area, address, location.coordinates as coordinates,house,state`)
				.get({ getOne: true });
			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error' });
			if (!data) return result({ errCode: 0, errMsg: 'success', data: null });
			let { coordinates, ...rest } = data;
			return result({
				errCode: 0,
				errMsg: 'success',
				data: { ...rest, location: coordinates }
			});
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async list({ pageSize = 10, pageCurrent = 1, location = [], keyword = '', code = '' } = {}) {
		try {
			pageSize = Math.min(30, pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;
			if (location.length === 2 && !keyword && !code) {
				let [longitude, latitude] = location;
				var { data, errCode, count } = await dbJQL
					.collection('JLJ-merchant-list')
					.where({
						state: 1,
						location: dbCmd.geoNear({
							geometry: new dbJQL.Geo.Point(longitude, latitude),
							maxDistance: 200000
						})
					})
					.field(`_id,store,address,house,location,pics,wx_store_id`)
					.skip(pageCurrent)
					.limit(pageSize)
					.get({ getCount: true });
				data = data.map(({ pics, ...item }) => ({ ...item, pic: pics?.[0] || '' }));
			} else {
				/*  
				let wre = `state == 1`;
				if (keyword) wre += ` && ${new RegExp(keyword, 'i')}.test(store) `;
				if (code) wre += ` && arrayElemAt(area.value,1) == "${code}"`;
				*/
				let wre = { state: 1 };
				if (keyword) wre.store = { $regex: keyword, $options: 'i' };
				if (code) wre.area = dbCmd.elemMatch({ value: code });
				var { data, errCode, count } = await dbJQL
					.collection('JLJ-merchant-list')
					.where(wre)
					.field(`_id,store,address,house,location,arrayElemAt(pics,0) as pic,wx_store_id`)
					.orderBy('last_modify_date desc')
					.skip(pageCurrent)
					.limit(pageSize)
					.get({ getCount: true });
			}

			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error', custom: errMsg });
			return result({ errCode: 0, errMsg: 'success', data, total: count });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async item({ _id } = {}) {
		try {
			if (!_id) return result({ errCode: 400, errMsg: 'error', custom: '_id不能为空' });
			let listTemp = dbJQL.collection('JLJ-merchant-list').where(`_id == "${_id}" && state == 1`).field(`_id, phone, store, category_id, address,house,video,pics`).getTemp();

			let categoryTemp = dbJQL.collection('JLJ-merchant-category').field(`_id,name`).getTemp();

			let { errCode, data } = await dbJQL.collection(listTemp, categoryTemp).field(`_id, phone, store, arrayElemAt(category_id.name,0) as category_name, address,house,video,pics`).get({ getOne: true });

			if (errCode !== 0) return result({ errCode: 400, errMsg: 'error' });
			if (!data) return result({ errCode: 0, errMsg: 'success', data: null });
			let { coordinates, ...rest } = data;
			return result({
				errCode: 0,
				errMsg: 'success',
				data: { ...rest, location: coordinates }
			});
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	},
	async citys() {
		try {
			let { data } = await dbJQL.collection('JLJ-merchant-list').groupBy('arrayElemAt(area.value,1) as code').groupField('count(*) as totalCode').get();
			let codes = [...new Set(data.map((item) => item.code))];

			let {
				data: cityData,
				errCode,
				errMsg,
				count
			} = await dbJQL
				.collection('opendb-city-china')
				.where(`code in ${JSON.stringify(codes)}`)
				.field(`first_letter,code,name`)
				.get({ getCount: true });
			return result({ errCode: 0, errMsg: 'success', data: cityData, total: count });
		} catch (err) {
			return result({ errCode: 500, errMsg: 'bug', custom: err });
		}
	}
};
