function skuSort(data){
	return data.map(good => {
		// 1. 对 sku 按 price 排序
		const sortedSkus = [...good.sku].sort((a, b) => a.price - b.price);
	
		// 2. 获取第一个 SKU（最低价）
		const minPriceSku = sortedSkus[0] || {};
	
		// 3. 返回新对象，移除 sku 数组，只保留 price 和 market_price
		const {
			sku,
			...restGood
		} = good; // 移除 sku 字段
		return {
			...restGood,
			price: minPriceSku.price,
			market_price: minPriceSku.market_price ?? null, // 处理 undefined
		};
	})
}


function processedData(data) {
	return data.map(category => ({
		...category,
		goods: skuSort(category.goods)
	}));
}


module.exports = {
	processedData,
	skuSort
}