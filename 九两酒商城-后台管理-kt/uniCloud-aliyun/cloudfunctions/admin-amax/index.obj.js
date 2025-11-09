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
  // 广告;列表
  async list({
    pageSize = 10,
    pageCurrent = 1,
    keyword = ""
  } = {}) {
    try {
      pageSize = Math.min(100, pageSize);
      pageCurrent = (pageCurrent - 1) * pageSize;
      let wre = keyword ? `${new RegExp(keyword, 'i')}.test(content)` : {}
      let listTemp = dbJQL.collection("pdd-adv").orderBy("like_count desc").skip(pageCurrent).limit(
        pageSize).getTemp()
      let cateTemp = dbJQL.collection("afenleilist").field(`_id,name`).getTemp();

      let {
        errCode,
        data,
        count
      } = await dbJQL.collection(listTemp, cateTemp)
        .where(wre)
        .field(
          `_id,phone,content,arrayElemAt(imageValue.fileID,0) as goods_banner_img,arrayElemAt(category_id.name,0) as category_name`
        )
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
  },
  async remove({
    _id
  } = {}) {
    try {
      if (!_id)
        return result({
          errCode: 400,
          errMsg: "error",
          custom: "_id不能为空"
        });
      let {
        errCode,
        errMsg,
        deleted
      } = await dbJQL
        .collection("pdd-adv")
        .doc(_id)
        .remove();
      if (errCode !== 0)
        return result({
          errCode: 400,
          errMsg: "error",
          custom: errMsg
        });
      return result({
        errCode: 0,
        errMsg: "success",
        data: {
          deleted
        }
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: "bug",
        custom: err
      });
    }
  },
  // 开源文章
  async openlist({
    pageSize = 10,
    pageCurrent = 1,
    keyword = ""
  } = {}) {
    try {
      pageSize = Math.min(100, pageSize);
      pageCurrent = (pageCurrent - 1) * pageSize;
      let wre = keyword ? `${new RegExp(keyword, 'i')}.test(content)` : {}
      let listTemp = dbJQL.collection("aopen-wen").orderBy("like_count desc").skip(pageCurrent).limit(
        pageSize).getTemp()
      let cateTemp = dbJQL.collection("aopen-fenlei").field(`_id,name`).getTemp();

      let {
        errCode,
        data,
        count
      } = await dbJQL.collection(listTemp, cateTemp)
        .where(wre)
        .field(
          `_id,view_count,publish_date,name,arrayElemAt(imageValue.fileID,0) as goods_banner_img,arrayElemAt(category_id.name,0) as category_name`
        )
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
  },
  async removeopen({
    _id
  } = {}) {
    try {
      if (!_id)
        return result({
          errCode: 400,
          errMsg: "error",
          custom: "_id不能为空"
        });
      let {
        errCode,
        errMsg,
        deleted
      } = await dbJQL
        .collection("aopen-wen")
        .doc(_id)
        .remove();
      if (errCode !== 0)
        return result({
          errCode: 400,
          errMsg: "error",
          custom: errMsg
        });
      return result({
        errCode: 0,
        errMsg: "success",
        data: {
          deleted
        }
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: "bug",
        custom: err
      });
    }
  }
}