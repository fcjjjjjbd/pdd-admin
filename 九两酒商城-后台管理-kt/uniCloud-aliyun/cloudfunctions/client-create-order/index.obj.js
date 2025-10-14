let dbJQL = uniCloud.databaseForJQL();
let dbCmd = dbJQL.command;
let { result } = require('utils');
let { sameCity, matchedGoodsFn, expressFn, goods_total, goodsDesc, cargoInfo } = require('./hooks.js');
let transList = [
	{
		index: 0,
		name: '同城配送',
		subname: '最快30分钟送达',
		disabled: true,
		fee: 999
	},
	{
		index: 1,
		name: '快递配送',
		subname: '普通快递送全国',
		disabled: false,
		fee: 999
	}
];
module.exports = {
	_before: function () {
		// 通用预处理器
		// 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({
			clientInfo
		});
	},
	async transportFee({ merchantId, addressId, goodsList = [] } = {}) {
		let goods_ids = goodsList.map((item) => item.goods_id);
		let tasks = [
			dbJQL.collection('JLJ-merchant-list').doc(merchantId).field(`wx_store_id,area`).get({ getOne: true }),
			dbJQL.collection('JLJ-user-address').doc(addressId).field(`name,area,address,house,phone,location`).get({ getOne: true }),
			dbJQL
				.collection('JLJ-mall-goods')
				.where(`_id in ${JSON.stringify(goods_ids)}`)
				.field(`name,sku`)
				.get(),
			dbJQL.collection('JLJ-express-template').where(`is_default==true`).field(`name,rules,remote`).get({ getOne: true })
		];

		let [{ data: merchantData }, { data: addressData }, { data: goodsData }, { data: expressData }] = await Promise.all(tasks);
		let matchedGoods = matchedGoodsFn(goodsData, goodsList);
		if (merchantData.area[1].value == addressData.area[1].value) {
			let { errcode, est_fee, distance, errmsg } = await sameCity({ merchantData, addressData, matchedGoods });
			if (errcode != 0) return result({ errCode: 400, errMsg: 'error', custom: errmsg });
			transList[0] = { ...transList[0], fee: est_fee, disabled: false };
		} else {
			transList[0] = { ...transList[0], disabled: true, subname: '超出配送范围' };
		}

		let remote = expressData.remote.find((find) => find.code == addressData.area[0].value);
		let rules = expressData.rules;
		if (remote) rules = remote.rules;

		let expressFee = expressFn(rules, matchedGoods);
		transList[1] = { ...transList[1], fee: expressFee };
		return result({ errCode: 0, errMsg: 'success', data: transList });
	},
	//订单创建
	async order(params = {}) {
		let { goods_list, delivery_type, order_no, payment_method, self_take_info, transport_info } = params;
		let merchant_id = self_take_info?.merchant_id || transport_info?.merchant_id;
		let { address_id, type: transport_type = -1 } = transport_info || {};
		let goods_ids = goods_list.map((item) => item.goods_id);

		let tasks = [
			dbJQL.collection('JLJ-merchant-list').doc(merchant_id).field(`wx_store_id,area,address,house,store`).get({ getOne: true }),
			dbJQL
				.collection('JLJ-mall-goods')
				.where(`_id in ${JSON.stringify(goods_ids)}`)
				.field(`name,sku,arrayElemAt(goods_banner_imgs,0) as goods_banner_img`)
				.get()
		];
		if (delivery_type == 0) tasks.push(Promise.resolve({ data: {} }), Promise.resolve({ data: {} }));
		if (delivery_type == 1) tasks.push(dbJQL.collection('JLJ-express-template').where(`is_default==true`).field(`name,rules,remote`).get({ getOne: true }), dbJQL.collection('JLJ-user-address').doc(address_id).field(`name,area,address,house,phone,location`).get({ getOne: true }));

		let [{ data: merchantData }, { data: goodsData }, { data: expressData }, { data: addressData }] = await Promise.all(tasks);

		let matchedGoods = matchedGoodsFn(goodsData, goods_list);
		let { goods_fee } = goods_total(matchedGoods);
		let total_fee = goods_fee;
		let transport_fee;
		if (delivery_type == 1) {
			if (transport_type == 0) {
				let { errcode, est_fee, distance, errmsg } = await sameCity({ merchantData, addressData, matchedGoods });
				if (errcode != 0) return result({ errCode: 400, errMsg: 'error', custom: errmsg });
				transport_fee = est_fee;
				total_fee += est_fee;
			}
			if (transport_type == 1) {
				let remote = expressData.remote.find((find) => find.code == addressData.area[0].value);
				let rules = expressData.rules;
				if (remote) rules = remote.rules;

				let expressFee = expressFn(rules, matchedGoods);
				transport_fee = expressFee;
				total_fee += expressFee;
			}
		}

		let { errCode, id } = await dbJQL.collection('JLJ-pay-order').add({
			payment_method,
			order_no,
			goods_list: matchedGoods,
			goods_price: goods_fee,
			description: goodsDesc(matchedGoods),
			total_fee,
			transport_fee,
			delivery_type,
			self_take_info: {
				...self_take_info,
				merchant_address: merchantData.address + merchantData.house,
				merchant_store: merchantData.store
			},
			transport_info: {
				...transport_info,
				merchant_address: merchantData.address + merchantData.house,
				merchant_store: merchantData.store,
				wx_store_id: merchantData.wx_store_id,
				user_address: addressData.address + addressData.house,
				user_name: addressData.name,
				user_phone: addressData.phone,
				user_area: addressData.area,
				user_location: addressData.location,
				cargo: cargoInfo(matchedGoods)
			}
		});
		if (errCode !== 0) return result({ errCode: 500, errMsg: 'bug', custom: err });
		return result({ errCode: 0, errMsg: 'success', data: { total_fee, order_no, description: goodsDesc(matchedGoods) } });
	}
};
