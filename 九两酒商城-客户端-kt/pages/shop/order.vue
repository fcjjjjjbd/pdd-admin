<script setup>
import { ref, computed, unref, watch } from "vue";
import { routerTo, showToast } from "@/utils/common.js";
import dayjs from "dayjs";
import { useOrderStore } from "@/stores/order.js";
import { useLocationStore } from "@/stores/location.js";
import { useSelfTake, useTransport, usePay } from "./orderHooks.js";
import { formatPrice } from "../../utils/format.js";
import { uuid } from "@/utils/tools.js";
import { add as xe_add } from "xe-utils";
const deliveryType = ref(0);
const { selfTakeInfo, selfPickDateLimit, handleTakePhone } = useSelfTake();
const {
  transportType,
  transportRef,
  transportList,
  transportSelect,
  handleTransport,
  getTransportFee,
} = useTransport();
const { payRef, paySuccess, payCancel, payFail, payCreate } =
  usePay(deliveryType);
const merchantCloudObj = uniCloud.importObject("client-merchant", {
  customUI: true,
});
const addressCloudObj = uniCloud.importObject("client-user-address", {
  customUI: true,
});
const orderCloudObj = uniCloud.importObject("client-create-order", {
  customUI: true,
});
const locationStore = useLocationStore();
const orderStore = useOrderStore();

const payType = ref(0);
const addressState = ref(false);
const express_fee = computed(() => {
  if (unref(deliveryType) == 1) {
    return unref(transportList)[unref(transportType)]?.fee;
  }
  return 0;
});
const total_fee = computed(() => {
  return xe_add(orderStore.orderPriceTotal, unref(express_fee));
});
locationStore.doLocation().finally(async () => {
  let { errCode, data: [item = {}] = [] } = await merchantCloudObj.list({
    locating: locationStore.location,
    pageSize: 1,
  });
  orderStore.merchantInfo = item;
});

const getAddress = async () => {
  try {
    let { errCode, data: [item = {}] = [] } = await addressCloudObj.list({
      pageSize: 1,
    });
    orderStore.addressInfo = item;
    addressState.value = true;
  } catch (err) {
    console.log(err);
  }
};

const submitOrder = async () => {
  let orderFormData = {
    payment_method: unref(payType),
    order_no: uuid(),
    delivery_type: unref(deliveryType),
    goods_list: unref(orderStore.mapGoodsList),
  };
  let { _id: merchant_id } = orderStore.merchantInfo;
  if (unref(deliveryType) == 0) {
    let { phone, time } = unref(selfTakeInfo);
    if (!merchant_id) return showToast("请选择供货商家");
    if (!time) return showToast("请填写提货时间");
    if (!/^1[3-9]\d{9}$/.test(phone)) return showToast("请填写正确的手机号");
    orderFormData.transport_info = {};
    orderFormData.self_take_info = {
      user_phone: phone,
      user_time: time,
      merchant_id,
    };
  }
  if (unref(deliveryType) == 1) {
    if (unref(transportType) < 0) return showToast("请选择配送方式");
    let { _id: address_id } = orderStore.addressInfo;
    if (!address_id) return showToast("请选择收货地址");
    orderFormData.self_take_info = {};
    orderFormData.transport_info = {
      type: unref(transportType),
      merchant_id,
      address_id,
    };
  }
  let { data, errCode } = await orderCloudObj.order(orderFormData);
  if (errCode !== 0) return showToast("创建订单有误，请刷新重试");
  payRef.value.createOrder({
    provider: "wxpay",
    total_fee: data?.total_fee,
    type: "goods",
    order_no: data?.order_no,
    description: data?.description,
  });
};

watch(
  () => deliveryType.value,
  (nv, ov) => {
    if (nv == 1) {
      if (addressState.value) return;
      getAddress();
    }
  }
);

watch(
  () => ({
    merchantInfo: orderStore.merchantInfo,
    addressInfo: orderStore.addressInfo,
  }),
  (nv, ov) => {
    if (nv.merchantInfo._id && nv.addressInfo._id) {
      getTransportFee();
    }
  }
);
</script>

<template>
  <view class="page-wrap">
    <view class="address-info-wrap">
      <view class="tabs-wrap">
        <view class="tabs">
          <view
            class="tab-item"
            :class="{ active: deliveryType === 0 }"
            @click="deliveryType = 0"
          >
            <text class="iconfont icon-Newuserzone"></text>
            <text class="text">自提</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: deliveryType === 1 }"
            @click="deliveryType = 1"
          >
            <text class="iconfont icon-map"></text>
            <text class="text">配送</text>
          </view>
        </view>
      </view>

      <view class="content-wrap">
        <view class="store-wrap">
          <view
            class="top-wrap"
            @click="routerTo('/pages/merchant/store?type=select')"
          >
            <view class="left-wrap">
              <view class="label">供货商家：</view>
              <view class="name">{{
                orderStore.merchantInfo?.store || "请选择"
              }}</view>
              <view class="address" v-if="orderStore.merchantInfo._id">
                {{
                  orderStore.merchantInfo?.address +
                  orderStore.merchantInfo?.house
                }}
              </view>
            </view>
            <view class="right-wrap">
              <uni-icons class="arrow" type="right" size="30rpx" color="#aaa" />
            </view>
          </view>
        </view>

        <view class="self-pick-box" v-if="deliveryType === 0">
          <view class="row-wrap pick-user-wrap">
            <view class="label">预留电话：</view>
            <view class="value-wrap">
              <view class="text-wrap">
                <input
                  type="number"
                  placeholder="取货人联系电话"
                  v-model.number="selfTakeInfo.phone"
                  style="text-align: right"
                  :maxlength="11"
                  @blur="handleTakePhone"
                />
              </view>
              <uni-icons
                class="arrow"
                type="compose"
                color="#aaaaaa"
                size="20"
              />
            </view>
          </view>

          <view class="row-wrap pick-time-wrap">
            <view class="label">自提时间：</view>
            <view class="value-wrap">
              <view class="text-wrap">
                <uni-datetime-picker
                  v-model="selfTakeInfo.time"
                  :start="selfPickDateLimit[0]"
                  :end="selfPickDateLimit[1]"
                  :border="false"
                  :clear-icon="false"
                  :hide-second="true"
                />
              </view>
              <uni-icons
                class="arrow"
                type="right"
                color="#aaaaaa"
                size="30rpx"
              />
            </view>
          </view>
        </view>

        <view class="delivery-box" v-if="deliveryType === 1">
          <view
            class="row-wrap address-wrap"
            @click="routerTo('/pages/my/address?type=select')"
          >
            <view class="left-wrap">
              <view class="label">收货信息：</view>
              <view class="name" v-if="orderStore.addressInfo?._id"
                >{{ orderStore.addressInfo.name }}，{{
                  orderStore.addressInfo.phone
                }}</view
              >
              <view class="name" v-else style="font-weight: bold"
                >请选择收货地址</view
              >
              <view class="address" v-if="orderStore.addressInfo?._id">{{
                orderStore.addressInfo.address + orderStore.addressInfo.house
              }}</view>
            </view>
            <view class="right-wrap">
              <uni-icons class="arrow" type="right" size="30rpx" color="#aaa" />
            </view>
          </view>

          <view class="row-wrap pick-user-wrap">
            <view class="label">配送方式</view>
            <view class="value-wrap" @click="handleTransport">
              <view class="text-wrap" v-if="transportList[transportType]?.name"
                >{{ transportList[transportType].name }}费￥{{
                  formatPrice(transportList[transportType]?.fee)
                }}</view
              >
              <uni-icons
                class="arrow"
                type="right"
                color="#aaaaaa"
                size="30rpx"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="goods-list-wrap">
      <view
        class="goods-item"
        v-for="(item, index) in orderStore.orderGoodsList"
        :key="item._id"
      >
        <card-goods-info :info="item" :type="4" />
      </view>
    </view>

    <view class="pay-type-wrap">
      <view class="title">支付方式</view>
      <view class="type-list">
        <view class="type-item" @click.stop="payType = 0">
          <view class="label-wrap">
            <radio
              :checked="payType === 0"
              activeBackgroundColor="#EF5350"
              style="transform: scale(0.6)"
            />
            <text class="iconfont icon-weixinzhifu"></text>
            <view class="label">微信支付</view>
          </view>
          <view class="value-wrap">支付成功后获得50积分</view>
        </view>
        <view class="type-item" @click.stop="payType = 1">
          <view class="label-wrap">
            <radio
              :checked="payType === 1"
              activeBackgroundColor="#EF5350"
              style="transform: scale(0.6)"
            />
            <text class="iconfont icon-jifen1"></text>
            <view class="label">积分支付</view>
          </view>
          <view class="value-wrap">当前积分100分</view>
        </view>
      </view>
    </view>

    <view class="amount-wrap">
      <view class="head-wrap">
        <view class="left-wrap">
          <text class="label">商品金额</text>
          <text class="total">共{{ orderStore.orderGoodsTotal }}件商品</text>
        </view>
        <view class="right-wrap"
          >￥{{ formatPrice(orderStore.orderPriceTotal) }}</view
        >
      </view>

      <view class="row-item">
        <view class="label">优惠券</view>
        <view class="value-wrap">
          <view class="value">未选择优惠券</view>
          <uni-icons class="arrow" type="right" size="30rpx" color="#aaaaaa" />
        </view>
      </view>

      <view class="row-item">
        <view class="label">配送费</view>
        <view class="value-wrap">
          <view class="value">￥{{ formatPrice(express_fee) }}</view>
        </view>
      </view>

      <view class="row-item">
        <view class="label">积分抵扣</view>
        <view class="value-wrap">
          <view class="value">
            <view v-if="payType !== 1">
              <text>不使用积分</text>
            </view>
            <template v-else>
              <text>积分不足</text>
            </template>
          </view>
        </view>
      </view>

      <view class="footer-wrap">
        <text>合计：￥{{ formatPrice(total_fee) }}</text>
      </view>
    </view>

    <view class="confirm-bar">
      <view class="flex-box">
        <view class="left-wrap">
          <text>
            合计：
            <text class="price">￥{{ formatPrice(total_fee) }}</text>
          </text>
        </view>
        <view class="right-wrap">
          <button class="confirm-btn" @click="submitOrder">提交订单</button>
        </view>
      </view>
      <view class="safe-area-box"></view>
    </view>

    <view class="safe-area-box"></view>

    <uv-action-sheet
      ref="transportRef"
      :actions="transportList"
      title="配送方式"
      @select="transportSelect"
    ></uv-action-sheet>

    <uni-pay
      :toSuccessPage="false"
      ref="payRef"
      @success="paySuccess"
      @cancel="payCancel"
      @fail="payFail"
      @create="payCreate"
    ></uni-pay>
  </view>
</template>

<style lang="scss" scoped>
.page-wrap {
  min-height: 50vh;
  background: #f8f8f8;
  padding-bottom: 100rpx;
  .address-info-wrap {
    width: 686rpx;
    margin: 0rpx auto 32rpx;
    border-radius: 10rpx;
    .tabs-wrap {
      height: 80rpx;
      display: flex;
      align-items: flex-end;
      .tabs {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;
        height: 60rpx;
        background: #e8e6e9;
        border-radius: 10rpx 10rpx 0 0;

        .tab-item {
          height: 60rpx;
          display: flex;
          flex: 1;
          max-width: 45%;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          gap: 10rpx;
          transition: 0.3s;
          .iconfont {
            font-size: 34rpx;
          }
        }
        .tab-item.active {
          background: #fff;
          height: 80rpx;
          width: 55%;
          max-width: none;
          border-radius: 15rpx 15rpx 0 0;
        }
        .tab-item:nth-child(1).active {
          clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);
        }
        .tab-item:nth-child(2).active {
          clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
        }
      }
    }
    .content-wrap {
      min-height: 100rpx;
      background: #fff;
      padding: 32rpx 0;
      .store-wrap {
        padding: 0 32rpx;
        .top-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          padding-bottom: 20rpx;
          .left-wrap {
            padding-right: 20rpx;
            .label {
              font-size: 28rpx;
              color: #999;
            }
            .name {
              font-size: 34rpx;
              font-weight: 600;
              padding: 10rpx 0;
            }
            .address {
              font-size: 28rpx;
              color: #666;
            }
          }
        }
      }
      .row-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 32rpx;
        .label {
          flex-shrink: 0;
          font-size: 28rpx;
          color: #999;
        }
        .value-wrap {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .text-wrap {
            padding-right: 20rpx;
          }
        }
      }
      .pick-user-wrap {
        .ipt {
          text-align: right;
          font-size: 28rpx;
        }
      }
      .address-wrap {
        .left-wrap {
          padding-right: 20rpx;
          .label {
            font-size: 28rpx;
            color: #999;
          }
          .name {
            font-size: 32rpx;
            padding: 10rpx 0;
          }
          .address {
            font-size: 26rpx;
            color: #666;
          }
        }
      }
    }
  }

  .goods-list-wrap {
    width: 686rpx;
    padding: 32rpx;
    margin: 0 auto 32rpx;
    background-color: #fff;
    border-radius: 10rpx;
    .goods-item {
      margin-bottom: 32rpx;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .pay-type-wrap {
    width: 686rpx;
    padding: 32rpx;
    margin: 0 auto 32rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10rpx;
    .title {
      font-size: 32rpx;
      margin-bottom: 32rpx;
    }
    .type-list {
      .type-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        .label-wrap {
          display: flex;
          align-items: center;
          gap: 6rpx;
          .iconfont {
            font-size: 40rpx;
          }
          .label {
            font-size: 30rpx;
          }
        }
        .value-wrap {
          font-size: 28rpx;
          color: #aaa;
        }
      }
      .type-item:first-child {
        .iconfont {
          color: #15ba11;
        }
      }
      .type-item:last-child {
        .iconfont {
          color: $uni-color-primary;
        }
      }
    }
  }
  .amount-wrap {
    width: 686rpx;
    padding: 32rpx;
    margin: 0 auto 32rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10rpx;
    .head-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32rpx;
      .left-wrap {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        .total {
          margin-left: 8rpx;
          font-size: 28rpx;
          color: #999;
        }
      }
      .right-wrap {
        font-size: 32rpx;
      }
    }
    .row-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      font-size: 28rpx;
      .label {
        flex-shrink: 0;
        color: #666;
      }
      .value-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #aaa;

        .value {
          margin-right: 4rpx;
        }
      }
    }
    .footer-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 28rpx;
      box-sizing: border-box;
      border-top: 1px solid #efefef;
      margin-top: 10rpx;
    }
  }
  .confirm-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 750rpx;
    padding: 0 32rpx;
    background-color: #fff;
    box-shadow: 0 -8rpx 8rpx 1px #efefef;
    box-sizing: border-box;
    .flex-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      .left-wrap {
        display: flex;
        align-items: center;
        height: 100%;
        .price {
          font-size: 32rpx;
          color: $uni-color-error;
          font-weight: 500;
        }
      }
      .right-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        .confirm-btn {
          height: 66rpx;
          padding: 0 32rpx;
          line-height: 66rpx;
          font-size: 32rpx;
          color: #fff;
          border-radius: 66rpx;
          background-color: $uni-color-error;
        }
      }
    }
  }
}
</style>
