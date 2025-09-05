let dbJQL = uniCloud.databaseForJQL()
let dbCmd = dbJQL.command;
let db = uniCloud.database();
let _dbCmd = db.command; 

let {result}  = require("utils");
module.exports = {
	_before: function () { // 通用预处理器
		const clientInfo = this.getClientInfo();
		dbJQL = uniCloud.databaseForJQL({clientInfo})
	},
	async list({pageSize=10,pageCurrent=1}={}){
		try{
			pageSize = Math.min(30,pageSize);
			pageCurrent = (pageCurrent - 1) * pageSize;					
			let listTemp = dbJQL.collection("JLJ-news-articles")
			.where(`article_status == 1`)
			.orderBy("publish_date desc")
			.skip(pageCurrent)
			.limit(pageSize)
			.getTemp();			
			let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();			
			let {errCode,data,count,errMsg} = await dbJQL.collection(listTemp,userTemp)
			.field(`_id,arrayElemAt(user_id.nickname,0) as nickname,title,avatar,publish_date`).get({getCount:true});
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data,total:count});			
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	//获取一条数据
	async detail(id=""){
		try{
			if(!id) return result({errCode:400,errMsg:"error",custom:"id不能为空"});			
			let listTemp = dbJQL.collection("JLJ-news-articles")
			.where(`_id == "${id}" && article_status == 1`)
			.getTemp();	
					
			let userTemp = dbJQL.collection("uni-id-users").field("_id,nickname").getTemp();
						
			let {errCode,data} = await dbJQL.collection(listTemp,userTemp).field(`_id,title,article_status,view_count,is_sticky,avatar,publish_date,content,arrayElemAt(user_id.nickname,0) as nickname`).get({getOne:true});	
					
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			db.collection("JLJ-news-articles").doc(id).update({view_count:_dbCmd.inc(3)})
			return result({errCode:0,errMsg:"success",data});
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	},
	//首页推荐公告
	async sticky(){
		try{
			let {data,errCode,count} = await dbJQL.collection("JLJ-news-articles")
			.where(`article_status == 1 && is_sticky == true`)
			.orderBy("publish_date desc")
			.skip(0)
			.limit(5)
			.field(`title`)
			.get();		
			if(errCode!==0) return result({errCode:400,errMsg:"error",custom:errMsg});
			return result({errCode:0,errMsg:"success",data,total:count});	
		}catch(err){
			return result({errCode:500,errMsg:"bug",custom:err})
		}
	}
	
}
