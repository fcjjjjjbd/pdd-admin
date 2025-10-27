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

  async categorylist({
    pageSize = 10,
    pageCurrent = 1,
    category_id = ""
  } = {}) {
    try {
      pageSize = Math.min(100, pageSize);
      pageCurrent = (pageCurrent - 1) * pageSize;

      let {
        errCode,
        errMsg,
        data,
        count
      } = await dbJQL.collection("aopen-wen")
        .where(` category_id == "${category_id}" `)
        .orderBy("publish_date asc")
        .skip(pageCurrent).limit(pageSize)
        .field(`_id,name,goods_thumb`)
        .get();
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
  // 我的列表
  async myopen() {
    try {
      let {
        errCode,
        errMsg,
        count,
        data
      } = await dbJQL.collection("aopen-wen")
        .where(` user_id==$cloudEnv_uid `)
        .orderBy("publish_date desc")
        .field(`_id,name,goods_thumb`)
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
  // 删除一个技术文章
  async remove(id) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo()
    });
    return await dbJQL.collection("aopen-wen").doc(id).remove();
  },
  //获取修改详情文章
  async detailxg(id = "") {
    try {
      if (!id) return result({
        errCode: 400,
        errMsg: "error",
        custom: "id不能为空"
      });
      let {
        data,
        errCode
      } = await dbJQL.collection("aopen-wen").doc(id).get({
        getOne: true
      });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: "error",
        custom: errMsg
      });
      return result({
        errCode: 0,
        errMsg: "success",
        data
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: "bug",
        custom: err
      })
    }
  },
  async add(params = {}) {
    try {
      const randomInt = Math.floor(Math.random() * 51) + 50;
      params.view_count = randomInt;
      let {
        errCode,
        errMsg,
        id
      } = await dbJQL.collection("aopen-wen").add(params)
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: "error",
        custom: errMsg
      });
      return result({
        errCode: 0,
        errMsg: "success",
        data: {
          id
        }
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: "bug",
        custom: err
      })
    }
  },
  //修改
  async update(params = {}) {
    try {
      let {
        _id,
        ...rest
      } = params
      if (!_id) return result({
        errCode: 400,
        errMsg: "error",
        custom: "_id不能为空"
      });
      let {
        errCode,
        errMsg,
        updated
      } = await dbJQL.collection("aopen-wen").doc(_id).update({
        ...rest
      })
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: "error",
        custom: errMsg
      });
      return result({
        errCode: 0,
        errMsg: "success",
        data: {
          updated
        }
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