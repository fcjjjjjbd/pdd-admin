const UniSecCheck = require("uni-sec-check")
module.exports = {
  _before: function() { // 通用预处理器

  },
  // 评论内容检测
  async textcheck(content, openid, scene = 2, version = 2) {
    const uniSecCheck = new UniSecCheck({ // 创建内容安全检测模块实例
      provider: 'mp-weixin', // 指定所使用服务的提供商，目前仅支持mp-weixin
      requestId: this.getUniCloudRequestId() // 请求Id 对哪个图片id进行校验的
    })
    let checkres = await uniSecCheck.textSecCheck({
      content,
      openid,
      scene,
      version
    })
    if (checkres.errCode === "uni-sec-check-risk-content") {
      return {
        Code: 400,
        result: checkres.result,
        errMsg: checkres.errMsg
      }
    } else if (checkres.errCode) {
      return {
        Code: 400,
        result: checkres.result,
        errMsg: checkres.errMsg
      }
    }
    return {
      Code: 0,
      result: checkres.result,
      errMsg: checkres.errMsg
    }
  },
  // 检测图片
  meiticheck() {

  }

}