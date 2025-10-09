function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
}



export function compressAndConvertToWebP(blob, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = blob;

    img.onload = () => {
      // 创建一个canvas元素
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // 使用canvas的toBlob方法将图像转换为WebP格式
      canvas.toBlob((webpBlob) => {
        const webpBlobUrl = URL.createObjectURL(webpBlob);
        resolve(webpBlobUrl);
      }, 'image/webp', quality);
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}



/**
 * 轻提醒
 * @param {String | Object} options
 * @param {String} options.title
 */
export function showToast(options = '') {
  if (typeof options === 'string') options = {title: options}

  const {title = "", duration = 2500, icon = "none", mask = false} = options

  return uni.showToast({
    title,
    icon,
    mask,
    duration,
    ...options
  })
}

//上传一张图片
export const uploadFileItem = async(url,rootPath="admin")=>{
	let tempurl = await compressAndConvertToWebP(url);
	return await uniCloud.uploadFile({
		filePath:tempurl,
		cloudPath:rootPath+"/"+getCurrentDate()+"/"+Date.now()+".webp",
		cloudPathAsRealPath:true
	})
}

//cloud地址转换成https地址
export const cloudToHttps = (str) => {
  if (str.startsWith('http')) return str;
  return str.replace("cloud://", "https://")
    .replace(str.split("/")[2], str.split("/")[2] + ".normal.cloudstatic.cn");
}