module.exports = {
  _before: function () {
    // 通用预处理器
  },

  async addtj(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL.collection("user-tuijian").add(params);
  },
  // 获取全部推荐
  async getrj(parms) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let blogTemp = dbJQL
      .collection("user-tuijian")
      .where(` status == 0 `)
      .orderBy("createTime desc")
      .getTemp();
    let cityTemp = dbJQL.collection("city_area").field("_id,name").getTemp();
    let userTemp = dbJQL
      .collection("uni-id-users")
      .field("_id,nickname")
      .getTemp();
    return dbJQL
      .collection(blogTemp, cityTemp, userTemp)
      .skip(parms.skip)
      .limit(parms.pageSize)
      .get();
  },
  // 自己发布的推荐
  async mytjff() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let blogTemp = dbJQL
      .collection("user-tuijian")
      .where(`  user_id==$cloudEnv_uid `)
      .orderBy("createTime desc")
      .getTemp();
    let userTemp = dbJQL
      .collection("uni-id-users")
      .field("_id,nickname")
      .getTemp();
    return dbJQL.collection(blogTemp, userTemp).get();
  },
};
