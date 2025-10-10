//  throw new Error(JSON.stringify(addDataList))
const db = uniCloud.database();
const dbCmd = db.command

module.exports = {
  trigger: {
    afterCreate: async function({
      collection,
      operation,
      docId,
      updateData,
      clientInfo,
      addDataList, //捕获新增的对象
      result
    } = {}) {
      let [{
        goods_id
      }] = addDataList

      await db.collection("goods_detail").doc(goods_id).update({
        "collect_count": dbCmd.inc(1)
      })
    },
    afterDelete: async function({
      collection,
      operation,
      docId,
      updateData,
      clientInfo,
      where,
      result
    } = {}) {
      let {
        goods_id
      } = where
      let res = await db.collection("goods_detail").where({
        _id: goods_id
      }).update({
        "collect_count": dbCmd.inc(-1)
      })
    }
  }
}