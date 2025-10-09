<script setup>
import { computed, nextTick, ref, shallowRef, unref } from 'vue';
import { showModal } from '../../utils/common';
const formRef = ref(null);
const areaValue = ref(null);
const formData = ref({
	name: '',
	phone: '',
	area: [],
	address: '',
	house: '',
	location: [],
	is_default: false
});
const formRules = {
	name: {
		rules: [
			{
				required: true,
				errorMessage: '请输入收货人姓名'
			}
		]
	},
	phone: {
		rules: [
			{
				required: true,
				errorMessage: '请填写正确的手机号',
				validateFunction: (rule, value, data, callback) => {
					return /^1[3-9]\d{9}$/.test(value);
				}
			}
		]
	},
	area: {
		rules: [
			{
				required: true,
				errorMessage: '请选择合作区域'
			},
			{
				validateFunction: function (rule, value, data, callback) {
					if (value.length !== 3) {
						callback('请选择完整的省市区');
					}
					return true;
				}
			}
		]
	},
	address: {
		rules: [
			{
				required: true,
				errorMessage: '请选择地址'
			}
		]
	}
};

const handleChooseLocation = async () => {
	let { address, longitude, latitude } = await uni.chooseLocation({});
	formData.value.address = address;
	formData.value.location = [longitude, latitude];
};

const onCitychange = (e) => {
	formData.value.area = e.detail.value;
};

const defaultChange = (e) => {
	formData.value.is_default = e.detail.value;
};

const handleRemove = async () => {
	if (!(await showModal({ content: '是否确认删除该收货地址？' }))) return;
	console.log('确认删除');
};

const submitForm = async () => {
	await unref(formRef).validate();
};
</script>

<template>
	<view class="page-wrap">
		<view class="form-wrap">
			<uni-forms ref="formRef" :modelValue="formData" :rules="formRules" label-width="80px" label-align="right">
				<view class="form-item-wrap">
					<uni-forms-item label="收货人" name="name" required>
						<view class="input-wrap">
							<uni-easyinput class="input" placeholder="清输入收货人" v-model.trim="formData.name" />
						</view>
					</uni-forms-item>
				</view>
				<view class="form-item-wrap">
					<uni-forms-item label="联系电话" name="phone" required>
						<view class="input-wrap">
							<uni-easyinput class="input disabled-input-click" placeholder="清输入联系电话" v-model.trim="formData.phone" />
						</view>
					</uni-forms-item>
				</view>

				<view class="form-item-wrap">
					<uni-forms-item label="省市区" name="area" required>
						<uni-data-picker
							class="input"
							placeholder="请选择省市区"
							popup-title="请选择省市区"
							collection="opendb-city-china"
							field="code as value, name as text"
							orderby="value asc"
							:step-searh="true"
							self-field="code"
							parent-field="parent_code"
							@change="onCitychange"
							v-model="areaValue"></uni-data-picker>
					</uni-forms-item>
				</view>

				<view class="form-item-wrap">
					<uni-forms-item label="详细地址" name="address" required>
						<view class="input-wrap" @click.stop="handleChooseLocation">
							<uni-easyinput disabled class="input" placeholder="请选择详细地址" :value="formData.address" />
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

				<view class="form-item-wrap">
					<uni-forms-item label="默认地址" name="is_default">
						<view class="input-wrap">
							<switch :checked="formData.is_default" @change="defaultChange" color="#BDAF8D" style="transform: scale(0.6); transform-origin: left center" />
						</view>
					</uni-forms-item>
				</view>
			</uni-forms>

			<view class="submit-wrap">
				<button class="btn" v-if="false" type="warn" plain @click.stop="handleRemove">删除收货地址</button>
				<button class="btn submit" @click.stop="submitForm">提交</button>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.form-wrap {
	padding: 30rpx;
	.form-item-wrap {
		.input-wrap {
			display: flex;

			.input {
				flex: 1;
			}

			.disabled-input-click {
				pointer-events: none;
			}

			:deep(.is-disabled) {
				background: #fff !important;
				color: #333 !important;
				border-color: #dcdfe6 !important;
			}
		}
	}

	.submit-wrap {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		padding: 32rpx 0;
		box-sizing: border-box;
		gap: 30rpx;
		.btn {
			width: 100%;
			border-radius: 100rpx;
		}
		.submit {
			background-color: $uni-color-primary;
			color: #fff;
		}
	}
}
</style>
