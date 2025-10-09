<script setup>
import { computed, ref, shallowRef, unref } from 'vue';
const noticeText = `尊敬的商家:
\n我们是九两酒运营商，现诚挚邀请您加入我们的合作联盟，开启共赢之旅!
\n我们拥有一批忠实且具有高消费能力的酒品会员。与我们合作，能为您的店铺带来稳定的客源。我们会在会员体系内全力推广您的店铺，包括在小程序首页推荐、向会员发送专属优惠信息等，让更多会员选择您。
\n我们期待与餐饮、娱乐、休闲等各类商家合作，共同打造一个跨行业的优惠生态。现在就加入我们，共享商业繁荣!
\n合作优势:
\n精准客源导入:我们的会员都是有消费实力和消费欲望的优质客户。
\n提升品牌知名度:通过我们的平台宣传，您的店铺将被更多人知晓。
\n长期稳定合作:我们致力于长期合作，为双方带来持续利益。`;
const formData = ref({
	name: '',
	phone: '',
	store: '',
	area: [],
	address: '',
	house: '',
	state: 0,
	category_id: '',
	location: []
});
const formRules = {
	name: {
		rules: [{ required: true, errorMessage: '请输入姓名' }]
	},
	phone: {
		rules: [{ required: true, errorMessage: '请填写正确的手机号' }]
	},
	store: {
		rules: [{ required: true, errorMessage: '请输入商家名称' }]
	},
	category_id: {
		rules: [{ required: true, errorMessage: '请选择店铺类型' }]
	},
	area: {
		rules: [{ required: true, errorMessage: '请选择合作区域' }]
	},
	address: {
		rules: [{ required: true, errorMessage: '请选择地址' }]
	}
};
const state = ref(false);
const handleCategory = () => {};
const handleChooseLocation = () => {};

const submitForm = () => {};
</script>

<template>
	<view class="page-wrap">
		<view class="banner-wrap">
			<image class="image" src="/static/images/tmp_banner1.png" mode="aspectFill" />
		</view>
		<view class="section-title">
			<text class="text">关于我们</text>
		</view>
		<view class="about-us">
			<text>
				{{ noticeText }}
			</text>
		</view>
		<view class="section-title">
			<text class="text">加入我们</text>
		</view>
		<view class="form-wrap">
			<uni-forms ref="formRef" :modelValue="formData" :rules="formRules" label-width="80px" label-align="right">
				<view class="form-item-wrap">
					<uni-forms-item label="姓名" name="name" required>
						<view class="input-wrap">
							<uni-easyinput class="input" placeholder="清输入姓名" v-model.trim="formData.name" />
						</view>
					</uni-forms-item>
				</view>
				<view class="form-item-wrap">
					<uni-forms-item label="手机号" name="phone" required>
						<view class="input-wrap">
							<uni-easyinput class="input disabled-input-click" placeholder="清输入手机号" v-model.trim="formData.phone" />
							<button size="mini">获取手机号</button>
						</view>
					</uni-forms-item>
				</view>
				<view class="form-item-wrap">
					<uni-forms-item label="商家名称" name="store" required>
						<view class="input-wrap">
							<uni-easyinput class="input" placeholder="清输入商家名称" v-model.trim="formData.store" />
						</view>
					</uni-forms-item>
				</view>

				<view class="form-item-wrap">
					<uni-forms-item label="商家类型" name="category_id" required>
						<view class="input-wrap" @click.stop="handleCategory">
							<uni-easyinput class="input disabled-input-click" placeholder="请选择商家类型" value="" />
						</view>
					</uni-forms-item>
				</view>
				<view class="form-item-wrap">
					<uni-forms-item label="合作地区" name="area" required></uni-forms-item>
				</view>
				<view class="form-item-wrap">
					<uni-forms-item class="input" label="详细地址" name="address" required>
						<view class="input-wrap" @click.stop="handleChooseLocation">
							<uni-easyinput placeholder="请选择详细地址" :value="formData.address" />
						</view>
					</uni-forms-item>
				</view>
				<view class="form-item-wrap">
					<uni-forms-item label="门牌号" name="house">
						<view class="input-wrap">
							<uni-easyinput class="input" placeholder="清输入门牌号（选填）" v-model.trim="formData.house" />
						</view>
					</uni-forms-item>
				</view>
			</uni-forms>

			<view class="submit-wrap">
				<button type="primary" class="submit" :disabled="state" @click.stop="submitForm">立即提交</button>
			</view>
		</view>

		<view class="safe-area-box"></view>
	</view>
</template>

<style lang="scss" scoped>
.page-wrap {
	padding: 32rpx;
	.banner-wrap {
		width: 100%;
		height: 346rpx;
		overflow: hidden;
		.image {
			width: 100%;
		}
	}
	.section-title {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 24rpx 0;
		margin: 0 auto;

		.text {
			position: relative;
			font-size: 36rpx;
			font-weight: 500;
			color: #45c2d3;

			&:after {
				content: '';
				position: absolute;
				left: calc(50% - 16rpx);
				bottom: -16rpx;
				width: 32rpx;
				height: 6rpx;
				background-color: #45c2d3;
			}
		}
	}

	.about-us {
		width: 100%;
		margin-bottom: 24rpx;
		font-size: 28rpx;
		color: #333;
	}

	.form-wrap {
		padding: 22px 0;

		.form-item-wrap {
			.input-wrap {
				display: flex;
				.input {
					flex: 1;
				}
				.disabled-input-click {
					pointer-events: none;
				}
			}
		}

		.submit-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 32rpx 0;
			box-sizing: border-box;

			.submit {
				width: 100%;
			}
		}
	}
}
</style>
