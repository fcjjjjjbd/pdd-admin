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
  async list() {
    try {
      let cateTemp = dbJQL.collection("afenlei")
        .orderBy("sort", "asc")
        .getTemp();
      let goodsTemp = dbJQL.collection("afenleilist")
        .field("_id,name,category_id,sort,iconss")

        .orderBy("sort", "asc")
        .getTemp();
      let {
        data,
        errCode,
        count
      } = await dbJQL.collection(cateTemp, goodsTemp)
        .field("sort,title,_id.afenleilist as afenleilist")
        .get({
          getCount: true
        });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: "error",
        custom: "查询失败"
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
  }
}