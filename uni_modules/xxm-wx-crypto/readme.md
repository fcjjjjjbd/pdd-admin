# xxm-wx-crypto  
微信小程序服务端API请求处理，封装整合公共模块，实现加密/解密/签名/验签

## 使用说明
1）下载插件到项目，在unicloud -> cloudfunctions -> common 目录下会新增xxm-wx-crypto公共模块，修改目录下的config.js，设置你自己小程序后台对称密钥和非对称秘钥，获取秘钥的方法，见文档：地址；

2）同时会携带项目依赖函数xxm-wx-token-co该函数，无需任何操作；

3）**重要：** 在uniCloud -> database内有wx-access-token.schema.json（单击右键上传schema）、wx-access-token.init_data.json（初始化云数据数据）；

4）在需要的云函数/云对象文件夹上，单击右键“管理公共模块或扩展库依赖”，选择项目下的公共模块，勾选"xxm-wx-crypto"公共模块；

![](https://s3.bmp.ovh/imgs/2025/08/19/dc5f532eb48504c5.png)

5）应用：导入公共模块“xxm-wx-crypto”内的encryption方法

```javascript
const {	encryption } = require("xxm-wx-crypto");
```

6）以微信同城配送加密API接口为例，调用同城中查询门店接口

```javascript
async demoFn() {
    return await encryption({
        url_path: "https://api.weixin.qq.com/cgi-bin/express/intracity/querystore"
    });
}
```

输出结果：

```JavaScript
{
	"errcode": 0,
	"errmsg": "ok",
	"appid": "wx3f17cf93d3a4823a",
	"store_list": [{
		"wx_store_id": "4000000000017626017",
		"out_store_id": "",
		"city_id": 370100,
		"address_info": {
			"province": "山东省",
			"city": "济南市",
			"area": "历下区",
			"street": "舜华路街道",
			"house": "工业南路57号",
			"lat": 36.685902,
			"lng": 117.128315,
			"phone": "18866669999"
		},
		"order_pattern": 1,
		"service_trans_prefer": ""
	}],
	"_n": "83c77a542ce4be19d4b319ec2edcc453",
	"_appid": "wx3f17cf93d3a4823a",
	"_timestamp": 1755578704
}
```

