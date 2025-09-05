# xxm-wx-mp-token
该插件是为了统一存储微信token凭证的，避免重复获取微信的api凭证

## 使用方法
1）从插件市场下载xxm-wx-mp-token插件

2）在uniCloud -> cloudfunctions中找到“xxm-wx-token-co”云对象，修改index.obj.js中的appid和secret，因为该项目是依赖于uni-id的，所以直接从uni-id的congfig.json中导入的appid和secret

```javascript
const configCenter = require("uni-config-center/uni-id/config.json")
const {
	appid,
	appsecret: secret
} = configCenter['mp-weixin']['oauth']['weixin'];
```

如果没有使用uni-id的话，可以直接不导入，直接填写自己小程序后台的appid和secret，如下所示：

```javascript
const appid="wx30f1d3a487cf9323a";
const secret="87a0ee0dc159db5f1b2f6b07a273f3abe";
```

3）在uniCloud -> database内有wx-access-token.schema.json（单击右键上传schema）、wx-access-token.init_data.json（初始化云数据数据）；

4）使用该xxm-wx-token-co云对象，示例：

```javascript
const tokenCloudObj = uniCloud.importObject("xxm-wx-token-co");
const token = await tokenCloudObj.getAccessToken();
```

