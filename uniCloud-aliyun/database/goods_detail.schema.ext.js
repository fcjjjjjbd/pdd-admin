// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db = uniCloud.database();
const dbCmd = db.command
module.exports = {
  trigger: {
    afterRead: async function(
      // 确定要监听的什么样的JQL指令
      {
        collection,
        operation,
        where,
        field,
        result
      } = {}) {
      // 当上述jql指令被触发时，将执行这里的代码。这里就是普通的uniCloud代码，可以调用uniCloud的各种api。
      console.log("这个触发器被触发了")
      // 只有详情页数据是一个
      //     let id = result.data[0]._id
      //     if (JSON.stringify(result.data.length) == 1) {
      //       let res = await db.collection('goods_detail').where({
      //         _id: id
      //       }).update({
      //         view_count: dbCmd.inc(2)
      //       })
      // }
    }
  }
}