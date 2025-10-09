let dbJQL = uniCloud.databaseForJQL()
let {result}  = require("utils");
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({clientInfo})
	},
	async add(params={}){
		try{			
			let {errCode,errMsg,id} = await dbJQL.collection("JLJ-mall-category").add(params)
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{id}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}		
	},
	async list(){
		try{
			let {errCode,errMsg,count,data} = await dbJQL.collection("JLJ-mall-category")
			.orderBy("sort asc")
			.field(`_id,name,sort,description,create_date`)
			.get({getCount:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data,total:count});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	async remove({_id}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			
			let {total} = await dbJQL.collection("JLJ-mall-goods").where(`category_id == "${_id}"`).count()
			if(total) return result({errCode:400,errMsg:"warn",custom:"该分类下存在关联商品，不允许删除"});
						
			let {errCode,errMsg,deleted} = await dbJQL.collection("JLJ-mall-category").doc(_id).remove();
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{deleted}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	async update({_id,...rest}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			if(!Object.keys(rest).length) return result({errCode:400,errMsg:"error",custom:"更新的内容不能为空"});
			let {errCode,errMsg,updated} = await dbJQL.collection("JLJ-mall-category").doc(_id).update(rest);
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{updated}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	async detail({_id}={}){
		try{
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			let {errCode,data} = await dbJQL.collection("JLJ-mall-category").doc(_id)
			.field(`_id,sort,name,create_date,description`)
			.get({getOne:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error"});
			return result({errCode:0,errMsg:"success",data});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	}
}
