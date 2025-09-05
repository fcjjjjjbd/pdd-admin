<script setup>
import {computed, ref, unref} from "vue";
import {hideLoading, routerTo, showLoading, showToast,uploadFileItem} from '@/utils/common.js'
import XEUtils from 'xe-utils'
const configCloudObj = uniCloud.importObject("admin-config",{customUI:true});
const formRef = ref(null);
const formData = ref({
	service:"",
	privacy:""
})
const tempFormData = ref(null);
const state = computed(()=>XEUtils.isEqual(unref(formData),unref(tempFormData)))
const onSubmit = async()=>{
	try{
		showLoading()
		let {errCode} = await configCloudObj.update(unref(formData));
		if(errCode!==0) showToast("修改失败");
		showToast("修改成功")
		getData();
	}catch(err){
		console.log(err);
		showToast(err)
	}
	
}

const onCancel = ()=>{
	formData.value = {...tempFormData.value}
}

const getData = async()=>{
	try{		
		let {data,errCode} = await configCloudObj.detail();			
		formData.value = {...data};
		tempFormData.value = {...data};
	}catch(err){
		console.log(err);
		showToast(err)
	}	
}

getData();
</script>

<template>
	<view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />			
		</view>
		
		<view class="uni-container">
			<el-row>
				<el-col :span="20" :offset="2">
					<el-form
					    ref="formRef"				    
					    :model="formData"					    
					    label-width="150"
					  >
						<el-form-item label="用户服务协议">
						      <el-input
						          v-model="formData.service"
						          :autosize="{ minRows: 4, maxRows: 10 }"
						          type="textarea"
						          placeholder="请输入用户服务协议"
						       />
						</el-form-item>
						
						<el-form-item label="隐私政策条款">
						      <el-input
						          v-model="formData.privacy"
						          :autosize="{ minRows: 4, maxRows: 10 }"
						          type="textarea"
						          placeholder="请输入隐私政策条款"
						       />
						</el-form-item>
						
						<el-form-item >
							<el-button :disabled="state" type="primary" size="large" @click="onSubmit">确认修改</el-button>
							<el-button size="large" @click="onCancel">取消</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</view>		
	</view>
</template>

<style lang="scss" scoped>
	
</style>
