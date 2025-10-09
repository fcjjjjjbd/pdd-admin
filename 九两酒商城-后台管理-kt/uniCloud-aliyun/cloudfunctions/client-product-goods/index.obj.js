let dbJQL = uniCloud.databaseForJQL()
let {result}  = require("utils");
let {processedData,skuSort}  = require("./hooks.js")
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({clientInfo})
	},
	async list(){
		try{
			let cateTemp = dbJQL.collection("JLJ-mall-category")
			.field(`_id,name`)
			.orderBy("sort asc")
			.getTemp();
			let goodsTemp = dbJQL.collection("JLJ-mall-goods")
			.where(`is_on_sale == true`)
			.field(`_id,
			ifNull(arrayElemAt(goods_banner_imgs,0),'') as goods_banner_img,
			sku,
			name,category_id`)
			.getTemp();
			
			let {data,errCode,count} = await dbJQL.collection(cateTemp,goodsTemp)
			.field(`_id._value as _id,name,_id["JLJ-mall-goods"] as goods`)
			.get({getCount:true});	
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:"查询失败"});	
			data = processedData(data)		
			return result({errCode:0,errMsg:"success",data,total:count});	
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}	
	},
	
	async detail({_id}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			let {errCode,data} = await dbJQL.collection("JLJ-mall-goods")
			.where(`_id == "${_id}" && is_on_sale == true`)			
			.field(`_id,name,sku,goods_desc,goods_banner_imgs`)
			.get({getOne:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error"});
			if(!data) return result({errCode:400,errMsg:"error",custom:"商品不存在或已下架"});
			return result({errCode:0,errMsg:"success",data});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	async goodsList({pageSize=10,pageCurrent=1,keyword="",isHot=false}={}){
		try{
			pageSize = isHot ? 6 : Math.min(50,pageSize);
			pageCurrent = isHot ? 0 : (pageCurrent - 1) * pageSize;
			let wre = `is_on_sale == true`
			if(isHot) wre+=`&& is_hot == true`
			if(keyword) wre+=`&& ${new RegExp(keyword, 'i')}.test(name)`
			let {errCode,data,count} = await dbJQL.collection("JLJ-mall-goods")
			.where(wre)
			.orderBy("create_date desc").skip(pageCurrent).limit(pageSize)
			.field(`_id,name,sku,
			ifNull(arrayElemAt(goods_banner_imgs,0),'') as goods_banner_img`)
			.get({getCount:true})
			
			data = skuSort(data)
			
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:"查询失败"});
			return result({errCode:0,errMsg:"success",data,total:count});			
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	}
}
