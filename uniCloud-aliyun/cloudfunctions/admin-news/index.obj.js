let dbJQL = uniCloud.databaseForJQL()
let {result}  = require("utils");
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({clientInfo})
	}, 
	async add(params={}){			
		try{
			const randomInt = Math.floor(Math.random() * 51) + 50;
			params.view_count = randomInt;
			let {errCode,errMsg,id} = await dbJQL.collection("JLJ-news-articles").add(params)
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{id}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}		
	},
	async list({pageSize=10,pageCurrent=1,keyword=""}={}){
		try{
			pageSize = Math.min(100,pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;
			let wre = keyword ? `${new RegExp(keyword, 'i')}.test(title)` : {}			
			let listTemp = dbJQL.collection("JLJ-news-articles")
			.where(wre)
			.orderBy("publish_date desc")
			.skip(pageCurrent)
			.limit(pageSize)
			.getTemp();			
			let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();			
			let {errCode,data,count,errMsg} = await dbJQL.collection(listTemp,userTemp)
			.field(`_id,arrayElemAt(user_id.nickname,0) as nickname,title,article_status,view_count,is_sticky,avatar,publish_date`).get({getCount:true});			
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data,total:count});			
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	//删除
	async remove(ids=[]){
		try{
			if(!Array.isArray(ids)) return result({errCode:400,errMsg:"error",custom:"ids字段必须为数组类型"});
			if(!ids.length) return result({errCode:400,errMsg:"error",custom:"要删除的id不能为空"});
			
			let {errCode,errMsg,deleted} = await dbJQL.collection("JLJ-news-articles")
			.where(`_id in ${JSON.stringify(ids)}`).remove()
			if(!errCode===0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{deleted}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	
	//修改
	async update(params = {}){
		try{
			let {_id,...rest} = params
			if(!_id) return result({errCode:400,errMsg:"error",custom:"_id不能为空"});
			let {errCode,errMsg,updated} = await dbJQL.collection("JLJ-news-articles").doc(_id).update({
				...rest,
				last_modify_date:Date.now()
			})
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data:{updated}});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}		
	},
	
	//获取一条数据
	async detail(id=""){
		try{
			if(!id) return result({errCode:400,errMsg:"error",custom:"id不能为空"});
			let {data,errCode} = await dbJQL.collection("JLJ-news-articles").doc(id).field(`_id,title,article_status,view_count,is_sticky,avatar,publish_date,content`).get({getOne:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	}
}
