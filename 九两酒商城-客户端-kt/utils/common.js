import XEUtils from 'xe-utils';
import dayjs from 'dayjs';
//页面间跳转
export function routerTo(url, type = 'navigateTo') {
	if (type == 'navigateTo') {
		uni.navigateTo({
			url,
			fail: (err) => {
				console.log(err);
				routerTo(url, 'reLaunch');
			}
		});
	} else if (type == 'reLaunch') {
		uni.reLaunch({
			url
		});
	} else if (type == 'redirectTo') {
		uni.redirectTo({
			url,
			fail: (err) => {
				console.log(err);
				routerTo(url, 'reLaunch');
			}
		});
	}
}

/**
 * 轻提醒
 * @param {String | Object} options
 * @param {String} options.title
 */
export function showToast(options = '') {
	if (typeof options === 'string')
		options = {
			title: options
		};

	const { title = '', duration = 2500, icon = 'none', mask = false } = options;

	return uni.showToast({
		title: JSON.stringify(title),
		icon,
		mask,
		duration,
		...options
	});
}

/**
 * 显示模态弹窗
 * @param options
 * @param {String} options.title
 * @param {String} options.content
 */
export function showModal(options = {}) {
	const { title = '提示', content = '', confirmText = '确认', cancelText = '取消', showCancel = true } = options;

	return new Promise((resolve, reject) => {
		uni.showModal({
			title,
			content,
			confirmText,
			cancelText,
			showCancel,
			success: (res) => {
				resolve(res.confirm);
			},
			fail: (err) => {
				reject(err);
			},
			...options
		});
	});
}

/**
 * 显示loading加载
 * @param {String | Object} options
 * @param {String} options.title
 */
export function showLoading(options = '') {
	if (typeof options === 'string')
		options = {
			title: options
		};
	const { title = '', mask = false } = options;
	return uni.showLoading({
		title,
		mask,
		...options
	});
}

export function hideLoading() {
	uni.hideLoading();
}

export function isEmpty(value) {
	return XEUtils.isEmpty(value);
}

export function getPageAndParams() {
	let { route, options } = getCurrentPages()[getCurrentPages().length - 1];
	let result = '/' + route + '?' + XEUtils.serialize(options);
	return encodeURIComponent(result);
}

//上传单张图片
export const uploadFileItem = async (url, rootPath = 'admin') => {
	let tempurl = url;
	return await uniCloud.uploadFile({
		filePath: tempurl,
		cloudPath: rootPath + '/' + dayjs().format('YYYYMMDD') + '/' + Date.now() + '.webp',
		cloudPathAsRealPath: true
	});
};

//截取字符串省略号
export function truncateString(str, maxLength) {
	return str?.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

export const showAuthorize = ({ scope = 'scope.userLocation', text = '您的位置信息' } = {}) => {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (setting) => {
				if (!setting.authSetting[scope]) {
					uni.showModal({
						title: '提示',
						content: `为了提供更好的服务，请允许小程序获取${text}`,
						confirmText: '去授权',
						success: (modal) => {
							if (modal.confirm) {
								uni.openSetting({
									success: (open) => {
										if (open.authSetting[scope]) {
											uni.showToast({
												icon: 'none',
												title: '授权成功'
											});
											resolve('授权成功');
										} else {
											uni.showToast({
												icon: 'none',
												title: '授权失败'
											});
											reject('授权失败');
										}
									}
								});
							} else {
								reject('授权失败');
							}
						}
					});
				}
			}
		});
	});
};
