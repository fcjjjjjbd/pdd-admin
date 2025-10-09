<script setup>
import {ref} from "vue";
import {routerTo, showLoading, showToast,uploadFileItem} from '@/utils/common.js'
const formRef = ref(null);
const formData = ref({
	service:"",
	privacy:""
})

const onSubmit = ()=>{
	
}

const onCancel = ()=>{
	
}
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
							<el-button type="primary" size="large" @click="onSubmit">确认修改</el-button>
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
