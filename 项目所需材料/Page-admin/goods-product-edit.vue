<script setup>
import { computed, ref, unref } from 'vue';
import {onLoad} from "@dcloudio/uni-app"
import {goBack, routerTo, showLoading, showToast,uploadFileItem} from '@/utils/common.js'
let id;
const formRef = ref(null);
const formData = ref({
	name:"",
	category_id:"",
	is_on_sale:true,
	is_hot:false,
	goods_desc:""
})

const rules = ref({
	name:[
		{ required: true, message: '商品标题必填', trigger: 'blur' },
		{ min: 2, max: 30, message: '字符在2-30间', trigger: 'blur' }
	],
	category_id:[
		{ required: true, message: '商品分类必选', trigger: 'change' },
	]
})

const pageType = computed(()=>unref(id)?'修改':"新增")


onLoad((e)=>{	
	uni.setNavigationBarTitle({
		title:pageType.value
	})
})

const onSubmit = async()=>{
	if(!await formRef.value.validate(()=>{})) return showToast("存在校验不通过的字段")
}
</script>

<template>
	<link rel="stylesheet" href="static/css/editor-style.css" />
	<view class="uni-container">
		<el-row>
			<el-col :span="20" :offset="2">
				<el-form 
					ref="formRef"				    
				    :model="formData"
				    :rules="rules"
				    label-width="100">
						<el-form-item label="商品名称" prop="name">
							  <el-input v-model="formData.name" placeholder="请输入商品名称"/>
						</el-form-item>
					
						<el-form-item label="所属分类" prop="category_id">
							  <el-select v-model="formData.category_id" placeholder="请选择商品分类">
								  <el-option label="分类名称1" value="1"></el-option>
								  <el-option label="分类名称2" value="2"></el-option>
								  <el-option label="分类名称3" value="3"></el-option>
							  </el-select>
						</el-form-item>
						
						<el-form-item label="缩略图">
							商品缩略图
						</el-form-item>
						
						
						<el-form-item label="商品规格">
							商品规格
						</el-form-item>
						
						<el-form-item label="是否上架">
							<el-switch v-model="formData.is_on_sale" />
						</el-form-item>
						
						<el-form-item label="热销推荐">
							<el-switch v-model="formData.is_hot" />
						</el-form-item>
						
						
						<el-form-item label="主体内容" prop="goods_desc">
							  <xxm-wangeditor-next v-model:content="formData.goods_desc"></xxm-wangeditor-next>
						</el-form-item>
						
						<el-form-item></el-form-item>
						
						<el-form-item >
							<el-button type="primary" size="large" @click="onSubmit">确认{{pageType}}</el-button>
							<el-button size="large" @click="goBack">返回</el-button>
						</el-form-item>
						
				</el-form>
			</el-col>
		</el-row>
	</view>
</template>

<style lang="scss" scoped>
	
</style>
