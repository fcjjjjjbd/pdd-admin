const { encryption } = require('xxm-wx-crypto');

module.exports = {
	_before: function () {
		// 通用预处理器
	},
	async demo() {
		return await encryption({
			url_path: 'https://api.weixin.qq.com/cgi-bin/express/intracity/querystore'
		});
	}
};
