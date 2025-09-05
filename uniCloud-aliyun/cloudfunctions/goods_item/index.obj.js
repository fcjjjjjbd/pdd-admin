const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
  _before: function () {},

  // 开源我的列表
  async mylist() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let { data } = await dbJQL.collection("goods_detail").get();
    return data;
  },
  // 投诉列表
  async jubao() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let { data } = await dbJQL.collection("jubao_item").get();
    return data;
  },
  // 删除一个投诉
  async delejubao(param) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL.collection("jubao_item").doc(param).remove();
  },
  async goodsGet(params) {
    const db = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await db
      .collection("goods_detail")
      .where(` fenleiid == "${params.type}" `)
      .field("address,collect_count,goods_thumb,like_count,title")
      .skip(params.pageNo)
      .limit(params.pageSize)
      .get();
    return res;
  },
  // 详情页
  async detailGet(params) {
    const db = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res1 = await db
      .collection("goods_detail")
      .where(`_id == "${params}"`)
      .get();
    return res1;
  },

  async _timing() {
    const now = Date.now();
    return await db
      .collection("order-detail")
      .where({
        temptime: dbCmd.lt(now),
      })
      .remove();
  },
};
