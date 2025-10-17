const getUserInfo = async function(that) {
  const token = that.getUniIdToken()
  const clientInfo = that.getClientInfo()
  const uniIDIns = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
    clientInfo
  })
  return await uniIDIns.checkToken(token)
}

module.exports = {
  getUserInfo
}