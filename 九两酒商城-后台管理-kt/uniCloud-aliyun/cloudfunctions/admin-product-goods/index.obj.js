let dbJQL = uniCloud.databaseForJQL()
let {result}  = require("utils");
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({clientInfo})
	},
	async add(params={}){
		try{
			if(!params.sku.every(item=>item.name && item.price && item._id)) return result({errCode:400,errMsg:"error",custom:"sku内name、price、_id必填"});
			params.sku = params.sku.map(item=>({				
				weight:500,
				status:true,
				...item
			}))			
			let {errCode,id,errMsg} = await dbJQL.collection("JLJ-mall-goods").add(params);
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:"新增失败"});
			return result({errCode:0,errMsg:"success",data:{id},custom:"新增成功"});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}		
	},
	async list({pageSize=10,pageCurrent=1,keyword=""}={}){
		try{
			pageSize = Math.min(100,pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;
			let wre = keyword ? `${new RegExp(keyword, 'i')}.test(name)` : {}		
			let listTemp = dbJQL.collection("JLJ-mall-goods").orderBy("create_date desc").skip(pageCurrent).limit(pageSize).getTemp()	
			let cateTemp = dbJQL.collection("JLJ-mall-category").field(`_id,name`).getTemp();
			
			let {errCode,data,count} = await dbJQL.collection(listTemp,cateTemp)
			.where(wre)
			.field(`_id,name,is_on_sale,is_hot,create_date,last_modify_date,arrayElemAt(category_id.name,0) as category_name,
			arrayElemAt(goods_banner_imgs,0) as goods_banner_img`)
			.get({getCount:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:"查询失败"});
			return result({errCode:0,errMsg:"success",data,total:count});			
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	async update({_id,...rest}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			if(!Object.keys(rest).length) return result({errCode:400,errMsg:"error",custom:"更新的内容不能为空"});
			if(rest.sku){
				if(!rest.sku.length) return result({errCode:400,errMsg:"error",custom:"sku不能为空"});
				if(!rest.sku.every(item=>item.name && item.price && item._id)) return result({errCode:400,errMsg:"error",custom:"sku内name、price、_id必填"});
				rest.sku = rest.sku.map(item=>({				
					weight:500,
					status:true,
					...item
				}))	
			}			
			let {errCode,errMsg,updated} = await dbJQL.collection("JLJ-mall-goods")
			.doc(_id).update({...rest,last_modify_date:Date.now()});
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{updated}});
			
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	async remove({_id}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			let {errCode,errMsg,deleted} = await dbJQL.collection("JLJ-mall-goods").doc(_id)
			.remove();
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{deleted}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	async detail({_id}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			let {errCode,data} = await dbJQL.collection("JLJ-mall-goods").doc(_id)
			.field(`_id,category_id,name,sku,goods_desc,goods_banner_imgs,is_on_sale,is_hot`)
			.get({getOne:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error"});
			return result({errCode:0,errMsg:"success",data});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	}
}
