<script setup>
import { computed, ref, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { goBack, routerTo, showLoading, showToast, uploadFileItem } from '@/utils/common.js';
import { uuid } from '@/utils/tools.js';
import { Delete, Plus } from '@element-plus/icons-vue';
const expressCloudObj = uniCloud.importObject('admin-express-template', { customUI: true });
const pageType = computed(() => (unref(id) ? '修改' : '新增'));

let id;
const formRef = ref(null);
const ruleItem = () => ({ first_weight: null, first_weight_price: null, continuous_weight: null, continuous_weight_price: null });
const formData = ref({
	name: '',
	is_default: false,
	rules: ruleItem(),
	remote: [
		{
			code: null,
			rules: ruleItem()
		}
	]
});
const validateRules = (rule, value, callback) => {
	if (!Object.keys(value).length) {
		callback(new Error('常规区域运费必填'));
	} else if (!(value.first_weight && value.first_weight_price && value.continuous_weight && value.continuous_weight_price)) {
		callback(new Error('rules内首重、首重价格、续重、续重价格必填'));
	} else {
		callback();
	}
};

const rules = ref({
	name: [
		{ required: true, message: '商品标题必填', trigger: 'blur' },
		{ min: 2, max: 30, message: '字符在2-30间', trigger: 'blur' }
	],
	type: [{ required: true, message: '模板类型', trigger: 'change' }],
	rules: [{ required: true, validator: validateRules, trigger: 'blur' }]
});

onLoad((e) => {
	id = e.id;
	if (id) getDetail();
	uni.setNavigationBarTitle({
		title: pageType.value
	});
});

const delRemote = (index) => {
	formData.value.remote.splice(index, 1);
};

const addRemote = () => {
	formData.value.remote.push({
		code: null,
		rules: ruleItem()
	});
};

const onSubmit = async () => {
	try {
		if (!(await formRef.value.validate(() => {}))) return showToast('存在校验不通过的字段');
		showLoading({ mask: true });
		let _formData = JSON.parse(JSON.stringify(formData.value));

		if (_formData.rules.first_weight_price) _formData.rules.first_weight_price *= 100;
		if (_formData.rules.continuous_weight_price) _formData.rules.continuous_weight_price *= 100;

		_formData.remote = _formData.remote.filter((item) => item.code) || [];

		_formData.remote.forEach((item) => {
			if (item.rules.first_weight_price) item.rules.first_weight_price *= 100;
			if (item.rules.continuous_weight_price) item.rules.continuous_weight_price *= 100;
		});

		let { errCode } = unref(id) ? await expressCloudObj.update({ _id: unref(id), ..._formData }) : await expressCloudObj.add(unref(_formData));
		if (errCode !== 0) return showToast(pageType.value + '失败');
		showToast(pageType.value + '成功');
		routerTo('./list');
	} catch (err) {
		console.log(err);
		showToast(err);
	} finally {
		uni.hideLoading();
	}
};

const getDetail = async () => {
	try {
		let { errCode, data } = await expressCloudObj.detail({ _id: id });
		if (errCode != 0) return showToast('数据查询有误');
		if (!data.remote) {
			data.remote = [
				{
					code: null,
					rules: ruleItem()
				}
			];
		} else {
			data.remote.forEach((item) => {
				if (item.rules.first_weight_price) item.rules.first_weight_price /= 100;
				if (item.rules.continuous_weight_price) item.rules.continuous_weight_price /= 100;
			});
		}
		if (data.rules.first_weight_price) data.rules.first_weight_price /= 100;
		if (data.rules.continuous_weight_price) data.rules.continuous_weight_price /= 100;
		formData.value = data;
		console.log(data);
	} catch (err) {
		console.log(err);
		showToast(err);
	}
};
</script>

<template>
	<view class="uni-container">
		<el-row>
			<el-col :span="20" :offset="2">
				<el-form ref="formRef" :model="formData" :rules="rules" label-width="120">
					<el-form-item label="模板名称" prop="name">
						<el-input v-model="formData.name" placeholder="请输入模板名称" />
					</el-form-item>

					<el-form-item label="常规区域" prop="rules">
						<el-row :gutter="10">
							<el-col :span="6">
								<el-input-number :min="1" v-model="formData.rules.first_weight" placeholder="首重" :step="100">
									<template #suffix>
										<text>克</text>
									</template>
								</el-input-number>
							</el-col>
							<el-col :span="6">
								<el-input-number :min="0" v-model="formData.rules.first_weight_price" placeholder="首重价格" :precision="2">
									<template #prefix>
										<text>￥</text>
									</template>
								</el-input-number>
							</el-col>
							<el-col :span="6">
								<el-input-number :min="1" v-model="formData.rules.continuous_weight" placeholder="续重" :step="100">
									<template #suffix>
										<text>克</text>
									</template>
								</el-input-number>
							</el-col>
							<el-col :span="6">
								<el-input-number :min="0" v-model="formData.rules.continuous_weight_price" placeholder="续重价格" :precision="2">
									<template #prefix>
										<text>￥</text>
									</template>
								</el-input-number>
							</el-col>
						</el-row>
					</el-form-item>

					<el-form-item label="偏远区域">
						<el-row v-for="(item, index) in formData.remote" :key="index">
							<el-col :span="24" style="margin-bottom: 10px">
								<el-row :gutter="10">
									<el-col :span="6">
										<uni-data-select collection="opendb-city-china" field="code as value, name as text,type" where="type == 0" :page-size="50" v-model="item.code" :clear="false" />
									</el-col>
									<el-col :span="16">
										<view class="remoteBtn">
											<el-button v-if="formData.remote.length > 1" @click="delRemote(index)" type="danger" :icon="Delete" circle />
											<el-button v-if="index == formData.remote.length - 1 && formData.remote.length < 9" @click="addRemote" type="success" :icon="Plus" circle />
										</view>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="24">
								<el-row :gutter="10">
									<el-col :span="6">
										<el-input-number :min="1" v-model="item.rules.first_weight" placeholder="首重" :step="100">
											<template #suffix>
												<text>克</text>
											</template>
										</el-input-number>
									</el-col>
									<el-col :span="6">
										<el-input-number :min="0" v-model="item.rules.first_weight_price" placeholder="首重价格" :precision="2">
											<template #prefix>
												<text>￥</text>
											</template>
										</el-input-number>
									</el-col>
									<el-col :span="6">
										<el-input-number :min="1" v-model="item.rules.continuous_weight" placeholder="续重" :step="100">
											<template #suffix>
												<text>克</text>
											</template>
										</el-input-number>
									</el-col>
									<el-col :span="6">
										<el-input-number :min="0" v-model="item.rules.continuous_weight_price" placeholder="续重价格" :precision="2">
											<template #prefix>
												<text>￥</text>
											</template>
										</el-input-number>
									</el-col>
								</el-row>
							</el-col>
							<el-col>
								<el-divider border-style="dashed" />
							</el-col>
						</el-row>
					</el-form-item>

					<el-form-item label="默认模板">
						<el-switch v-model="formData.is_default" />
					</el-form-item>
					<el-form-item></el-form-item>
					<el-form-item>
						<el-button type="primary" size="large" @click="onSubmit">确认{{ pageType }}</el-button>
						<el-button size="large" @click="goBack">返回</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</view>
</template>

<style lang="scss" scoped>
.rouleCol {
	display: flex;
	align-items: center;
}
.el-input-number {
	width: 100%;
}
.el-divider--horizontal {
	margin: 15px 0;
}
.remoteBtn {
	display: flex;
}
</style>
