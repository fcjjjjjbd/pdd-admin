const db = uniCloud.database()
const dbCmd = db.command
module.exports = {
  trigger: {
    afterCreate: async function({
      collection,
      operation,
      addDataList,
      clientInfo,
      result
    } = {}) {
      let [{
        like_type,
        comment_id,
        soup_id
      }] = addDataList
      if (like_type == 1) {
        let res = await db.collection('goods_comment').doc(comment_id).update({
          "like_count": dbCmd.inc(1)
        });
      } else if (like_type == 0) {
        let res = await db.collection('pdd-adv').doc(soup_id).update({
          "like_count": dbCmd.inc(1)
        });
      }
    },
    afterDelete: async function({
      collection,
      operation,
      where,
      field
    } = {}) {
      let {
        like_type,
        comment_id,
        soup_id
      } = where
      if (like_type == 1) {
        let res = await db.collection('goods_comment').doc(comment_id).update({
          "like_count": dbCmd.inc(-1)
        });
      } else if (like_type == 0) {
        let res = await db.collection("pdd-adv").where({
          _id: soup_id
        }).update({
          "like_count": dbCmd.inc(-1)
        });
      }
    }
  }
}