<script setup>
import {ref} from "vue";
import {onLoad} from "@dcloudio/uni-app";
import {hideLoading, routerTo, showLoading, showToast} from "@/utils/common";
import {mutations, store} from "@/uni_modules/uni-id-pages/common/store";
const uniIdCo = uniCloud.importObject('uni-id-co',{customUI:true})

const agreements = ref(null);

let uniIdRedirectUrl = '';

onLoad((e) => {
  uniIdRedirectUrl = e.uniIdRedirectUrl
})

const wxLogin = async () => {
	try{
		if(!agreements.value.isAgree) return agreements.value.popup(wxLogin)
		showLoading({title:"登录中",mask:true})
		let {code} = await uni.login()
		let {errCode,...rest} = await uniIdCo.loginByWeixin({code});
		if(errCode!==0) return showToast("登录失败请重试")
		mutations.loginSuccess({
			...rest,
			uniIdRedirectUrl:decodeURIComponent(uniIdRedirectUrl)
		})
	}catch(err){
		console.log(err);
		showToast(err)
	}finally{
		hideLoading()
	}
	
	
}

const gotoPwd = ()=>{
  routerTo('/uni_modules/uni-id-pages/pages/login/login-withpwd?uniIdRedirectUrl='+uniIdRedirectUrl,'redirectTo')
}

</script>

<template>
  <view class="page-wrap">
    
    <view class="page-content">
      <view class="logo-wrap">
        <view class="pic">
          <image src="/static/images/logo.png" mode="aspectFill"></image>
        </view>
        <view class="text">
          <view class="big">九两酒商城</view>
          <view class="small">品质生活畅享美酒</view>
        </view>
      </view>

      <view class="group">
        <view class="btn weixin" hover-class="btnHover" hover-start-time="50" hover-stay-time="50"
              @click.stop="wxLogin">
          <uni-icons type="weixin" size="30" color="#fff"></uni-icons>
          <text>微信一键登录</text>
        </view>
        <view class="btn pwd" hover-class="btnHover" @click="gotoPwd">
          <uni-icons type="locked-filled" size="25" color="#BDAF8D"></uni-icons>
          <text>账号密码登录</text>
        </view>
      </view>

      <view class="agreement">
        <uni-id-pages-agreements scope="login" ref="agreements"></uni-id-pages-agreements>
      </view>
    </view>

  </view>
</template>

<style scoped lang="scss">
.page-wrap {
  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 50vh;
    padding-top: 200rpx;

    .logo-wrap {
      display: flex;
      justify-content: center;

      .pic {
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 20rpx;
        color: #BDAF8D;

        .big {
          font-size: 60rpx;
          line-height: 1em;
          font-weight: bold;
        }

        .small {
          font-size: 22rpx;
          letter-spacing: 0.76em;
        }
      }
    }

    .group {
      padding: 160rpx 60rpx 40rpx;
      display: flex;
      flex-direction: column;
      gap: 40rpx;

      .btn {
        width: 100%;
        height: 100rpx;
        border: 1px solid #BDAF8D;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10rpx;
        font-size: 40rpx;
        color: #BDAF8D;

        text {
          padding-left: 10rpx;
        }
      }

      .weixin {
        background: #BDAF8D;
        color: #fff;
      }

      .btnHover {
        transform: scale(0.98);
      }
    }

    .agreement {
      padding: 0 60rpx 0;
    }
  }
}
</style>
