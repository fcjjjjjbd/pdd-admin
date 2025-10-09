const tokenCloudObj = uniCloud.importObject("xxm-wx-token-co");
let {result}  = require("utils");
module.exports = {
	_before: function () { // 通用预处理器

	},
	//unicloud云对象内的phone方法，params是客户端传来的值
	async phone(params) {		try {			let access_token = await tokenCloudObj.getAccessToken();			let {				data: {					phone_info: {						phoneNumber					} = {}				} = {}			} = await uniCloud.request({				url: "https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=" +					access_token,				method: "POST",				data: {					code: params.code				}			})			return result({				errCode: 0,				errMsg: "success",				data: {					phoneNumber				}			});		} catch (err) {			return result({				errCode: 500,				errMsg: "bug",				custom: err			})		}	}

}
