const { encryption } = require('xxm-wx-crypto');
/* data1 网络请求完整的数据{name,sku:[]}    data2客户端传的goods_id和sku_id及number */
function matchedGoodsFn(data1, data2) {
	return data2.map((item) => {
		let goods = data1.find((g) => g._id == item.goods_id);
		if (goods) {
			let sku = goods.sku.find((s) => s._id == item.sku_id);
			if (sku) {
				return {
					...item,
					goods_banner_img: goods?.goods_banner_img || '',
					goods_name: goods.name,
					sku_name: sku.name,
					price: sku.price,
					weight: sku.weight
				};
			}
		}
		return null;
	});
}

function goods_total(data) {
	return data.reduce(
		(acc, current) => {
			acc.goods_fee += current.number * current.price;
			acc.goods_number += current.number;
			acc.goods_weight += current.number * current.weight;
			return acc;
		},
		{ goods_fee: 0, goods_number: 0, goods_weight: 0 }
	);
}

function goodsDesc(matchedGoods) {
	return matchedGoods.length > 1 ? `${matchedGoods[0].goods_name} 等${matchedGoods.length}件产品` : matchedGoods[0].goods_name;
}

function cargoInfo(matchedGoods) {
	let total = goods_total(matchedGoods);
	return {
		cargo_name: goodsDesc(matchedGoods),
		cargo_type: 8,
		cargo_num: total.goods_number,
		cargo_price: total.goods_fee,
		cargo_weight: total.goods_weight
	};
}

async function sameCity({ merchantData, addressData, matchedGoods } = {}) {
	return ({ errcode, est_fee, distance, errmsg } = await encryption({
		url_path: 'https://api.weixin.qq.com/cgi-bin/express/intracity/preaddorder',
		wx_store_id: merchantData.wx_store_id,
		user_name: addressData.name,
		user_phone: addressData.phone,
		user_lng: addressData.location.coordinates[0],
		user_lat: addressData.location.coordinates[1],
		user_address: addressData.address + addressData.house,
		cargo: cargoInfo(matchedGoods)
	}));
}

function expressFn(template, matchedGoods) {
	let { goods_weight: weight } = goods_total(matchedGoods);
	// 解构运费模板参数
	const { first_weight, first_weight_price, continuous_weight, continuous_weight_price } = template;

	// 如果重量小于等于首重，直接返回首重价格
	if (weight <= first_weight) {
		return first_weight_price;
	}

	// 计算超出首重的部分
	const excessWeight = weight - first_weight;

	// 计算需要多少个续重单位（向上取整）
	const continuousUnits = Math.ceil(excessWeight / continuous_weight);

	// 总费用 = 首重价格 + 续重单位数 × 续重价格
	return first_weight_price + continuousUnits * continuous_weight_price;
}

module.exports = {
	sameCity,
	matchedGoodsFn,
	expressFn,
	goods_total,
	goodsDesc,
	cargoInfo
};
