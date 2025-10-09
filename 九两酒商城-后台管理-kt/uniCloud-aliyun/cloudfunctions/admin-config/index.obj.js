let dbJQL = uniCloud.databaseForJQL()
let {result}  = require("utils");
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({clientInfo})
	},
	async detail(){
		try{			
			let {data,errCode} = await dbJQL.collection("JLJ-config").doc("JLJ-config-id-1").get({getOne:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	//修改
	async update(params = {}){
		try{
			let {_id,...rest} = params
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			let {errCode,errMsg,updated} = await dbJQL.collection("JLJ-config").doc(_id).update({
				...rest
				
			})
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{updated}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}		
	},
}
