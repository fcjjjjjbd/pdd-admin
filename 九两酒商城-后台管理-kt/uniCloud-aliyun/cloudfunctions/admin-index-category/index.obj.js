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

  //新增商家类型
  async add(params = {}) {
    try {
      let {
        id,
        errCode,
        errMsg
      } = await dbJQL.collection("afenlei").add(params);
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
      })
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: "bug",
        custom: err
      })
    }
  },
  //获取商家类型列表
  async list() {
    try {
      let {
        errCode,
        data
      } = await dbJQL.collection("afenlei")
        .field("_id,  name,sort")
        .orderBy("sort asc").get();
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
  //修改
  async update({
    _id,
    ...rest
  } = {}) {
    try {
      if (!_id) return result({
        errCode: 400,
        errMsg: "error",
        custom: "_id不能为空"
      });
      if (!Object.keys(rest).length) return result({
        errCode: 400,
        errMsg: "error",
        custom: "更新的内容不能为空"
      });
      let {
        errCode,
        errMsg,
        updated
      } = await dbJQL.collection("afenlei").doc(_id).update({
        ...rest
      });
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
  },
  //删除
  async remove({
    _id
  } = {}) {
    try {
      if (!_id) return result({
        errCode: 400,
        errMsg: "error",
        custom: "_id不能为空"
      });

      let {
        errCode,
        errMsg,
        deleted
      } = await dbJQL.collection("afenlei").doc(_id).remove();
      if (errCode !== 0) return result({
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
      })
    }
  },
  //一条记录
  async detail({
    _id
  } = {}) {
    try {
      if (!_id) return result({
        errCode: 400,
        errMsg: "error",
        custom: "_id不能为空"
      });
      let {
        errCode,
        data
      } = await dbJQL.collection("JLJ-merchant-category").doc(_id)
        .field(`_id,sort,name,create_date`)
        .get({
          getOne: true
        });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: "error"
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
  }

}