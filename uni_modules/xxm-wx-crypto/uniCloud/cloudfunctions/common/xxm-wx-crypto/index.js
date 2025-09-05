const crypto = require("crypto");
const {
	appid,
	secret,
	aes_sn,
	aes_key,
	rsa_sn,
	rsa_key
} = require('./config.js');
const tokenCloudObj = uniCloud.importObject("xxm-wx-token-co");
const dbJQL = uniCloud.databaseForJQL();
dbJQL.setUser({
	role: ["admin"]
})


//加密函数
const encryption = async (params) => {
	const local_sym_sn = aes_sn;
	const local_sym_key = aes_key; //（在公众平台获取加密密钥）
	const local_appid = appid;
	const {
		url_path,
		...queryList
	} = params; //（这里是调用同城配送接口）
	const local_ts = Math.floor(Date.now() / 1000) //加密签名使用的统一时间戳
	const nonce = crypto.randomBytes(16).toString('base64').replace(/=/g, '')

	const reqex = {
		_n: nonce,
		_appid: local_appid,
		_timestamp: local_ts
	}
	const real_req = Object.assign({}, reqex, queryList) // 生成并添加安全校验字段
	const plaintext = JSON.stringify(real_req)

	const aad = `${url_path}|${local_appid}|${local_ts}|${local_sym_sn}`
	const real_key = Buffer.from(local_sym_key, "base64")
	const real_iv = crypto.randomBytes(12)
	const real_aad = Buffer.from(aad, "utf-8")
	const real_plaintext = Buffer.from(plaintext, "utf-8")


	const cipher = crypto.createCipheriv("aes-256-gcm", real_key, real_iv)
	cipher.setAAD(real_aad)

	let cipher_update = cipher.update(real_plaintext)
	let cipher_final = cipher.final()
	const real_ciphertext = Buffer.concat([cipher_update, cipher_final])
	const real_authTag = cipher.getAuthTag()

	const iv = real_iv.toString("base64")
	const data = real_ciphertext.toString("base64")
	const authtag = real_authTag.toString("base64")



	const req_data = {
		iv,
		data,
		authtag,
	}
	const new_req = {
		req_ts: local_ts,
		req_data: JSON.stringify(req_data)
	}

	const local_sn = rsa_sn;
	const local_private_key = rsa_key;


	const payload = `${url_path}\n${local_appid}\n${new_req.req_ts}\n${new_req.req_data}`

	const data_buffer = Buffer.from(payload, 'utf-8')


	const key_obj = {
		key: local_private_key,
		padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
		saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST // salt长度，需与SHA256结果长度(32)一致
	}

	const sig_buffer = ss_buffer = crypto.sign(
		'RSA-SHA256',
		data_buffer,
		key_obj
	)


	const sig = sig_buffer.toString('base64')


	// 发送请求
	const result = await uniCloud.request({
		url: `${url_path}?access_token=${await tokenCloudObj.getAccessToken()}`,
		method: 'POST',
		header: {
			'Content-Type': 'application/json;charset=utf-8',
			'Accept': 'application/json',
			'Wechatmp-Appid': local_appid,
			'Wechatmp-TimeStamp': new_req.req_ts,
			'Wechatmp-Signature': sig,
		},
		dataType: 'json',
		data: new_req.req_data
	});
	return decrypt(result, params)
}


/* 解密操作 */
const decrypt = async (result, params) => {
	const local_sym_sn = aes_sn;
	const local_sym_key = aes_key; //（在公众平台获取加密密钥）
	const local_appid = appid;
	const {
		url_path,
		...queryList
	} = params; //（这里是调用同城配送接口）
	const resp_ts = result.header['wechatmp-timestamp'];
	const aad = `${url_path}|${local_appid}|${resp_ts}|${local_sym_sn}`
	console.log(aad);
	const real_aad = Buffer.from(aad, "utf-8")
	const real_key = Buffer.from(local_sym_key, "base64")
	console.log("Key length:", real_key.length); // 应为 32
	const real_iv = Buffer.from(result.data.iv, "base64")
	const real_data = Buffer.from(result.data.data, "base64")
	const real_authtag = Buffer.from(result.data.authtag, "base64")

	const decipher = crypto.createDecipheriv("aes-256-gcm", real_key, real_iv)
	decipher.setAAD(real_aad)
	decipher.setAuthTag(real_authtag)

	let decipher_update = decipher.update(real_data)
	let decipher_final = decipher.final()

	const real_deciphertext = Buffer.concat([decipher_update, decipher_final])

	const deciphertext = real_deciphertext.toString("utf-8")
	const real_resp = JSON.parse(deciphertext)

	return real_resp;
}


module.exports = {
	encryption
}