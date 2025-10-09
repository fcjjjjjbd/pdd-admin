import dayjs from 'dayjs';
//获取缩略图
export function getSmallImg(url, width = 100) {
	if (url) return url + '?x-oss-process=image/resize,w_' + width;
	else return '/static/images/notPic.png';
}

export function calculateDistance(point1, point2) {
	// 从数组中提取经纬度，数组格式为 [经度, 纬度]
	const lon1 = point1[0];
	const lat1 = point1[1];
	const lon2 = point2[0];
	const lat2 = point2[1];

	// 地球半径（公里）
	const R = 6371;

	// 将角度转换为弧度
	const toRadians = (degree) => degree * (Math.PI / 180);

	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	// 计算距离并格式化输出（保留1位小数）
	const distance = R * c;
	return `${distance.toFixed(1)}km`;
}

export function uuid() {
	// 生成17位的时间字符串（YYYYMMDDHHmmssSSS）
	const baseTime = dayjs().format('YYYYMMDDHHmmssSSS');

	// 生成5位随机数（00000-99999），确保补足5位
	const randomNum = Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, '0');

	// 拼接后总长度为 17 + 5 = 22 位
	const result = baseTime + randomNum;
	return result;
}
