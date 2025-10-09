//获取缩略图
export function getSmallImg(url, width = 100) {
  if (url) return url + "?x-oss-process=image/resize,w_" + width;
  else return "/static/images/notPic.png"
}

export function uuid(length=8){
	// 确保最小长度为8
	const safeLength = Math.max(8, length);
	
	// 获取当前时间戳（base36编码）
	const timestamp = Date.now().toString(36); // 通常8-10位
	
	// 如果请求长度小于时间戳长度，直接返回时间戳前safeLength位
	if (safeLength <= timestamp.length) {
		return timestamp.slice(0, safeLength);
	}
	
	// 生成随机部分补全长度
	const randomPartLength = safeLength - timestamp.length;
	let randomPart = '';
	const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
	
	for (let i = 0; i < randomPartLength; i++) {
		randomPart += chars[Math.floor(Math.random() * chars.length)];
	}
	
	return timestamp + randomPart;
}