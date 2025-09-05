//返回code码
function giveCode(value) {
    let codeObj = {
        0: 0,      // 成功的代码
        400: 400,  // 出错代码
        500: 500   // 服务内部出错
    };

    // 检查传入的 value 是否在 codeObj 中
    if (codeObj.hasOwnProperty(value)) {
        return codeObj[value];
    } else {
        return value;  // 如果不在 codeObj 中，返回原样传入的 value
    }
}

//返回的提示文字的格式化
function giveMsg(str){
	let msgObj={
		"success":"执行成功",
		"error":"执行失败",
		"add":'新增成功',
		"download":"下载成功",		
		"required":"缺少参数",
		"time":"请求过于频繁",		
		"bug":"后端接口出错，请向管理反馈",
		"warn":"操作警告"
	}
	return msgObj[str]
}

//返回数据方法
function result({ errCode, errMsg, data, total, custom } = {}) {
    let msgCustom = custom ? "，" + custom : "";
    // 动态构建返回对象
    const response = {
        errCode: giveCode(errCode),
        errMsg: giveMsg(errMsg) + msgCustom,
    };
    // 如果传入了 data，则添加到返回对象中
    if (data !== undefined) {
        response.data = data;
    }
    // 如果传入了 total，则添加到返回对象中
    if (total !== undefined) {
        response.total = total;
    }
    return response;
}



module.exports = {
	result
}
