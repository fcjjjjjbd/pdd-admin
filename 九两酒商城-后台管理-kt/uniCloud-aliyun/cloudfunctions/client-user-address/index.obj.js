let dbJQL = uniCloud.databaseForJQL();
let dbCmd = dbJQL.command;
let { result } = require("utils");
module.exports = {
  _before: function () {
    // 通用预处理器
    const clientInfo = this.getClientInfo();
    dbJQL = uniCloud.databaseForJQL({
      clientInfo,
    });
  },
  async add(params = {}) {
    try {
      if (!(Array.isArray(params.location) && params.location.length === 2))
        return result({
          errCode: 400,
          errMsg: "required",
          custom: "没有传递用户经纬度location",
        });
      //地理位置转换
      let location = {
        type: "Point",
        coordinates: params.location,
      };

      let { errCode, errMsg, id } = await dbJQL
        .collection("JLJ-user-address")
        .add({ ...params, location });
      if (errCode !== 0)
        return result({ errCode: 400, errMsg: "error", custom: errMsg });
      if (params.is_default) {
        dbJQL
          .collection("JLJ-user-address")
          .where(`_id != '${id}' && user_id == $cloudEnv_uid`)
          .update({ is_default: false });
      }

      return result({ errCode: 0, errMsg: "success", data: { id } });
    } catch (err) {
      return result({ errCode: 500, errMsg: "bug", custom: err });
    }
  },
  async addweb(params = {}) {
    try {
      let { errCode, errMsg, id } = await dbJQL
        .collection("JLJ-user-address")
        .add({ ...params });
      if (errCode !== 0)
        return result({ errCode: 400, errMsg: "error", custom: errMsg });
      if (params.is_default) {
        dbJQL
          .collection("JLJ-user-address")
          .where(`_id != '${id}' && user_id == $cloudEnv_uid`)
          .update({ is_default: false });
      }

      return result({ errCode: 0, errMsg: "success", data: { id } });
    } catch (err) {
      return result({ errCode: 500, errMsg: "bug", custom: err });
    }
  },
  async list({ pageSize = 10, pageCurrent = 1 } = {}) {
    try {
      pageSize = Math.min(20, pageSize);
      pageCurrent = (pageCurrent - 1) * pageSize;
      let { errCode, data, count, errMsg } = await dbJQL
        .collection("JLJ-user-address")
        .where(`user_id == $cloudEnv_uid`)
        .field(`_id,name,phone,area,address,house,is_default,location`)
        .orderBy("is_default desc,last_modify_date desc")
        .skip(pageCurrent)
        .limit(pageSize)
        .get({ getCount: true });
      if (errCode !== 0)
        return result({ errCode: 400, errMsg: "error", custom: errMsg });
      return result({ errCode: 0, errMsg: "success", data, total: count });
    } catch (err) {
      return result({ errCode: 500, errMsg: "bug", custom: err });
    }
  },
  async detail({ _id } = {}) {
    try {
      if (!_id)
        return result({ errCode: 400, errMsg: "error", custom: "_id不能为空" });
      let { errCode, data } = await dbJQL
        .collection("JLJ-user-address")
        .where(`user_id == $cloudEnv_uid && _id == '${_id}'`)
        .field(`_id,name,phone,area,address,house,is_default,location`)
        .get({ getOne: true });
      if (errCode !== 0) return result({ errCode: 400, errMsg: "error" });
      return result({ errCode: 0, errMsg: "success", data });
    } catch (err) {
      return result({ errCode: 500, errMsg: "bug", custom: err });
    }
  },
  async update(params = {}) {
    try {
      let { _id, ...rest } = params;
      if (rest.location) {
        if (!(Array.isArray(rest.location) && rest.location.length === 2))
          return result({
            errCode: 400,
            errMsg: "required",
            custom: "没有传递经纬度location",
          });
        let locationObj = {
          type: "Point",
          coordinates: rest.location,
        };
        rest.location = locationObj;
      }

      let { errCode, errMsg, updated } = await dbJQL
        .collection("JLJ-user-address")
        .doc(_id)
        .update({ ...rest });
      if (errCode !== 0)
        return result({ errCode: 400, errMsg: "error", custom: errMsg });

      if (rest.is_default) {
        dbJQL
          .collection("JLJ-user-address")
          .where(`_id != '${_id}' && user_id == $cloudEnv_uid`)
          .update({ is_default: false });
      }

      return result({ errCode: 0, errMsg: "success", data: { updated } });
    } catch (err) {
      return result({ errCode: 500, errMsg: "bug", custom: err });
    }
  },
  async remove({ _id } = {}) {
    try {
      if (!_id)
        return result({ errCode: 400, errMsg: "error", custom: "_id不能为空" });
      let { errCode, deleted, errMsg } = await dbJQL
        .collection("JLJ-user-address")
        .where(`_id == '${_id}' && user_id == $cloudEnv_uid`)
        .remove();
      if (errCode !== 0)
        return result({ errCode: 400, errMsg: "error", custom: errMsg });
      return result({ errCode: 0, errMsg: "success", data: { deleted } });
    } catch (err) {
      return result({ errCode: 500, errMsg: "bug", custom: err });
    }
  },
};
