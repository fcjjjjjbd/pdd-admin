// 开源
let dbJQL = uniCloud.databaseForJQL()
let {
  result
} = require("utils");
module.exports = {
  _before: function() { // 通用预处理器
    const clientInfo = this.getClientInfo();
    dbJQL = uniCloud.databaseForJQL({
      clientInfo
    })
  },
  // 获取分类数组
  async list() {
    try {
      let {
        errCode,
        errMsg,
        count,
        data
      } = await dbJQL.collection("aopen-fenlei")
        .where(` is_on_sale == true `)
        .orderBy("sort asc")
        .field(`_id,name`)
        .get({
          getCount: true
        });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: "error",
        custom: errMsg
      });
      return result({
        errCode: 0,
        errMsg: "success",
        data,
        total: count
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: "bug",
        custom: err
      })
    }
  },





}