let dbJQL = uniCloud.databaseForJQL();
let {
  result
} = require('utils');
module.exports = {
  _before: function() {
    const clientInfo = this.getClientInfo();
    dbJQL = uniCloud.databaseForJQL({
      clientInfo
    });
  },
  // 新增
  async add(params = {}) {
    try {
      let {
        errCode,
        errMsg,
        id
      } = await dbJQL.collection('JLJ-express-template').add({
        ...params
      });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: 'error',
        custom: errMsg
      });
      if (params.is_default) {
        dbJQL.collection('JLJ-express-template').where(`_id != '${id}'`).update({
          is_default: false
        });
      }
      return result({
        errCode: 0,
        errMsg: 'success',
        data: {
          id
        }
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: 'bug',
        custom: err
      });
    }
  },
  async list({
    pageSize = 10,
    pageCurrent = 1
  } = {}) {
    try {
      pageSize = Math.min(100, pageSize);
      pageCurrent = (pageCurrent - 1) * pageSize;
      let {
        errCode,
        errMsg,
        count,
        data
      } = await dbJQL
        .collection('JLJ-express-template')
        .orderBy('is_default desc,last_modify_date desc')
        .field(`_id,name,is_default,create_date,last_modify_date`)
        .skip(pageCurrent)
        .limit(pageSize)
        .get({
          getCount: true
        });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: 'error',
        custom: '查询失败'
      });
      return result({
        errCode: 0,
        errMsg: 'success',
        data,
        total: count
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: 'bug',
        custom: err
      });
    }
  },
  async update(params = {}) {
    try {
      let {
        _id,
        ...rest
      } = params;

      let {
        errCode,
        errMsg,
        updated
      } = await dbJQL
        .collection('JLJ-express-template')
        .doc(_id)
        .update({
          ...rest,
          last_modify_date: Date.now()
        });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: 'error',
        custom: errMsg
      });

      if (rest.is_default) {
        dbJQL.collection('JLJ-express-template').where(`_id != '${_id}'`).update({
          is_default: false
        });
      }

      return result({
        errCode: 0,
        errMsg: 'success',
        data: {
          updated
        }
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: 'bug',
        custom: err
      });
    }
  },
  async remove({
    _id
  } = {}) {
    try {
      if (!_id) return result({
        errCode: 400,
        errMsg: 'error',
        custom: '_id不能为空'
      });
      let {
        errCode,
        deleted,
        errMsg
      } = await dbJQL.collection('JLJ-express-template').where(`_id == '${_id}'`).remove();
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: 'error',
        custom: errMsg
      });
      return result({
        errCode: 0,
        errMsg: 'success',
        data: {
          deleted
        }
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: 'bug',
        custom: err
      });
    }
  },
  async detail({
    _id
  } = {}) {
    try {
      if (!_id) return result({
        errCode: 400,
        errMsg: 'error',
        custom: '_id不能为空'
      });
      let {
        errCode,
        data
      } = await dbJQL.collection('JLJ-express-template').doc(_id).field(`_id,name,is_default,rules,remote`).get({
        getOne: true
      });
      if (errCode !== 0) return result({
        errCode: 400,
        errMsg: 'error'
      });
      return result({
        errCode: 0,
        errMsg: 'success',
        data
      });
    } catch (err) {
      return result({
        errCode: 500,
        errMsg: 'bug',
        custom: err
      });
    }
  }
};