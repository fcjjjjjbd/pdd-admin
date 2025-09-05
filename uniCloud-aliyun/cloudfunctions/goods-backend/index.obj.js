//  商品后端
const utils = require("self-utils");
const db = uniCloud.database();

module.exports = {
  _before: async function () {
    this.userInfo = await utils.getUserInfo(this);
  },
  // 明码标价分类的显示
  async getmmbj(parms) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL
      .collection("detail_price")
      .where(` detail_id =="${parms}"`)
      .get();
  },
  // 新增师傅自己信息
  async addsfinfo(parms) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL.collection("shifu-selfinfo").add(parms);
  },
  // 修改师傅自己信息
  async updatasfinfo(parms) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let param = {
      ...parms,
    };
    delete param._id;

    return await dbJQL
      .collection("shifu-selfinfo")
      .where(` _id=="${parms._id}"`)
      .update(param);
  },
  // 获取师傅自己信息
  async getsfinfo() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL
      .collection("shifu-selfinfo")
      .where(`user_id==$cloudEnv_uid  `)
      .get();
  },
  // 删除商品的云存储url多个图片
  async deletimg(url) {
    const db = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let result = await uniCloud.deleteFile({
      fileList: [url],
    });
  },
  // 获取广告费列表
  async getadvlist(parms) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL
      .collection("pay-order")
      .where(`classifyid == "${parms.classifyid}" && status == 1 `)
      .orderBy("total_fee", "desc")
      .field("content,order_no,phone,total_fee,status,user_id")
      .skip(parms.skip)
      .limit(parms.pageSize)
      .get();
  },
  // 获取我的订单
  async getorderinfo() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return dbJQL
      .collection("order-detail")
      .where(`user_id==$cloudEnv_uid `)
      .field(
        "addressobj,category_id.name as fenlei,title,status,goods_thumb,price,grade,pronum"
      )
      .get();
  },
  // 新增订单
  async addorderinfo(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL.collection("order-detail").add(params);
  },
  // 新增地址信息
  async addressinfo(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    if (params.selected) {
      await dbJQL
        .collection("ds-address")
        .where(`user_id==$cloudEnv_uid `)
        .update({
          selected: false,
        });
    }
    return await dbJQL.collection("ds-address").add(params);
  },
  // 当前地址列表
  async getressinfo() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL
      .collection("ds-address")
      .where(`user_id==$cloudEnv_uid `)
      .orderBy("selected desc, time desc")
      .get();
  },
  // 设置默认地址
  async updatamoren(id) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    await dbJQL
      .collection("ds-address")
      .where(`user_id==$cloudEnv_uid `)
      .update({
        selected: false,
      });
    await dbJQL.collection("ds-address").doc(id).update({
      selected: true,
    });
  },
  // 订单获取默认地址信息
  async getaddresss() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL
      .collection("ds-address")
      .where(`user_id==$cloudEnv_uid  && selected == true`)
      .field("phone,area_code,area_name,address,username")
      .get();
  },
  // 首页分类
  async searchfenlei() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL
      .collection("afenlei")
      .field("title as name,sort")
      .orderBy("sort", "asc")
      .get();
    return res;
  },
  // 分类列表
  async searchfenleilist() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL
      .collection("afenleilist")
      .orderBy("sort", "asc")
      .get();
    return res;
  },
  // 回收列表
  async huishoulist() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL
      .collection("afenleilist")
      .where(` category_id == '676c645155b337bf5239177f' `)
      .orderBy("sort", "asc")
      .get();
    return res;
  },
  //修改首页分类
  async updatafeipin(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let id = params._id;
    delete params._id;
    let res = await dbJQL
      .collection("afenleilist")
      .where(` _id == "${id}"`)
      .update(params);
    return res;
  },

  // 新增分类列表
  async addfeipinlist(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    return await dbJQL.collection("afenleilist").add(params);
  },
  // 新增首页分类列表
  async addfenlei(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL.collection("afenleilist").add(params);
  },
  // 修改分类列表
  async updatafenlei(params = {}) {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let id = params._id;
    delete params._id;
    let res = await dbJQL
      .collection("afenleilist")
      .where(` _id == "${id}"`)
      .update(params);
    return res;
  },
  // 热门搜索ahotsearch
  async searchhot() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL.collection("ahotsearch").orderBy("sort", "asc").get();
    return res;
  },
  // 商家说明
  async sjgg() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL.collection("asjgungang").orderBy("sort", "asc").get();
    return res;
  },
  //用户说明
  async usergg() {
    const dbJQL = uniCloud.databaseForJQL({
      clientInfo: this.getClientInfo(),
    });
    let res = await dbJQL
      .collection("ausergungang")
      .orderBy("sort", "asc")
      .get();
    return res;
  },
  // 删除所有没有支付订单
  async _timing() {
    await db
      .collection("pay-order")
      .where({
        status: 0,
      })
      .remove();
    await db
      .collection("uni-pay-orders")
      .where({
        status: 0,
      })
      .remove();
  },
};

function getOrderId() {
  return;
}
