const dbJQL = uniCloud.databaseForJQL();
const configCenter = require("uni-config-center/uni-id/config.json")
const {
	appid,
	appsecret: secret
} = configCenter['mp-weixin']['oauth']['weixin'];
dbJQL.setUser({
	role: ["admin"]
})
module.exports = {
	_before: function() { // 通用预处理器

	},
	//获取微信开发平台凭证token
	async getAccessToken() {
		let {
			data: {
				access_token,
				update_date
			} = {}
		} = await dbJQL.collection("wx-access-token").doc("wx-access-token-1").get({
			getOne: true
		})
		let currentData = Date.now();
		if ((currentData - update_date) > 6600 * 1000) {
			let {
				data: {
					access_token: resToken,
					errmsg
				}
			} = await uniCloud.request({
				url: "https://api.weixin.qq.com/cgi-bin/token",
				data: {
					grant_type: "client_credential",
					appid,
					secret
				}
			})
			if (!resToken) throw new Error(JSON.stringify(errmsg))
			access_token = resToken || errmsg;
			dbJQL.collection("wx-access-token").doc("wx-access-token-1").update({
				access_token: resToken,
				update_date: currentData
			})
		}
		return access_token;
	}
}