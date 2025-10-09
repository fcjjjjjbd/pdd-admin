<script setup>
import { computed, ref, unref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { goBack, routerTo, showLoading, showToast, uploadFileItem } from '@/utils/common.js';
import { Delete, Plus } from '@element-plus/icons-vue';
let id;

const formRef = ref(null);
const formData = ref({
	name: '',
	phone: '',
	store: '',
	category_id: '',
	area: [],
	address: '',
	house: '',
	location: [],
	state: 0,
	pics: [],
	video: '',
	wx_store_id: ''
});
const formRules = ref({
	store: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
	name: [{ required: true, message: '请输入商家联系人', trigger: 'blur' }],
	phone: [{ required: true, message: '请输入商家联系电话', trigger: 'blur' }],
	category_id: [{ required: true, message: '请选择商家类型', trigger: 'blur' }]
});

onLoad((e) => {
	id = e.id;
	if (id) getDetail();
});

const getDetail = async () => {
	try {
	} catch (err) {
		console.log(err);
		showToast(err);
	}
};

const onSubmit = async () => {
	try {
		if (!(await formRef.value.validate(() => {}))) return showToast('存在校验不通过的字段');
		console.log(formData.value);
	} catch (err) {
		console.log(err);
		showToast(err.errMsg);
	}
};
</script>

<template>
	<view class="uni-container">
		<el-row>
			<el-col :span="20" :offset="2">
				<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100">
					<el-form-item label="商家名称" prop="store">
						<el-input v-model="formData.store" placeholder="请输入商家名称" />
					</el-form-item>

					<el-form-item label="商家类型" prop="category_id">
						<uni-data-select class="input" collection="JLJ-merchant-category" field="_id as value, name as text" v-model="formData.category_id" />
					</el-form-item>

					<el-form-item label="联系人" prop="name">
						<el-input v-model="formData.name" placeholder="请输入联系人" />
					</el-form-item>

					<el-form-item label="联系电话" prop="phone">
						<el-input v-model="formData.phone" placeholder="请输入联系电话" />
					</el-form-item>

					<el-form-item label="商家地区" prop="area">
						<el-input v-model="formData.area" placeholder="请输入商家地区" disabled />
					</el-form-item>

					<el-form-item label="详细地址" prop="address">
						<el-input v-model="formData.address" placeholder="请输入详细地址" disabled />
					</el-form-item>

					<el-form-item label="商家环境" prop="pics"></el-form-item>

					<el-form-item label="商家视频" prop="video">
						<el-button type="primary">选择</el-button>
					</el-form-item>

					<el-form-item label="审核状态" prop="video">
						<el-radio-group v-model="formData.state">
							<el-radio :value="0">审核中</el-radio>
							<el-radio :value="1">审核通过</el-radio>
							<el-radio :value="2">停运</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item props="wx_store_id" label="微信商户号">
						<el-input v-model="formData.wx_store_id" placeholder="" disabled></el-input>
					</el-form-item>

					<el-form-item></el-form-item>

					<el-form-item>
						<el-button type="primary" size="large" @click="onSubmit">确认修改</el-button>
						<el-button size="large" @click="goBack">返回</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</view>
</template>

<style lang="scss" scoped></style>
