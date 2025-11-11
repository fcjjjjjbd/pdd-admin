<script setup>
import {ref, unref} from "vue";
import {routerTo, showLoading, showModal, showToast} from "@/utils/common.js"
import {getSmallImg} from "@/utils/tools.js"
import dayjs from "dayjs";
const loading=ref(false);
const goodsCloudObj = uniCloud.importObject("admin-product-goods",{customUI:true});
const tableData = ref([])
const query = ref({
	pageSize:10,
	pageCurrent:1,
	total:0,
	keyword:""
})


const search = ()=>{
	query.value.pageCurrent = 1;
	getData()
}

const previewImg = (index)=>{
	if(!unref(tableData)[index].goods_banner_img) return;
	uni.previewImage({
		urls:[unref(tableData)[index].goods_banner_img]
	})
}



const handleChange = (e)=>{	
	query.value.pageCurrent = e;
	getData()
}

const delTable = async(id)=>{
	try{
		if(!await showModal({content:"是否确认删除?"})) return 
		let {errCode} = await goodsCloudObj.remove({_id:id})
		if(errCode!==0) return showToast("删除失败");
		showToast("删除成功");
		getData()
	}catch(err){
		console.log(err);
		showToast(err.errMsg)
	}
	
}

const saleChange = async(e,index)=>{
	try{
		loading.value = true;
		let {errCode} = await goodsCloudObj.update({_id:unref(tableData)[index]._id,is_on_sale:e})
		if(errCode!==0) return showToast("更新失败");
		tableData.value[index].is_on_sale = e;
		showToast("修改成功");
	}catch(err){
		console.log(err)
	}finally{
		loading.value = false;
	}
}

const hotChange = async(e,index)=>{
	try{
		loading.value = true;
		let {errCode} = await goodsCloudObj.update({_id:unref(tableData)[index]._id,is_hot:e})
		if(errCode!==0) return showToast("更新失败");
		tableData.value[index].is_hot = e;
		showToast("修改成功");
	}catch(err){
		console.log(err)
	}finally{
		loading.value = false;
	}
}

const getData = async()=>{
	try{
		loading.value = true;
		let {errCode,data,total}= await goodsCloudObj.list(query.value);
		if(errCode!==0) return showToast("数据查询有误");
		tableData.value = data;
		query.value.total = total
	}catch(err){
		console.log(err);
		showToast(err)
	}finally{
		loading.value = false;
	}
	
}

getData();

</script>

<template>
	<view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query.keyword" @confirm="search" 
				:placeholder="$t('common.placeholder.query')" />
				<button class="uni-button hide-on-phone" type="default" size="mini" @click="search">{{$t('common.button.search')}}</button>
				<button class="uni-button" type="primary" size="mini" @click="routerTo('./edit')">{{$t('common.button.add')}}</button>						
			</view>
		</view>
		
		
		<view class="uni-container">
			<el-table v-loading="loading" :data="tableData" stripe border  style="width: 100%">
				<el-table-column label="缩略图" width="130">
					<template #default="scope">
						<div class="avatar">
						  <image @click="previewImg(scope.$index)" 
						  :src="getSmallImg(scope.row.goods_banner_img,100)" mode="aspectFill"></image>					  
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="name" show-overflow-tooltip label="商品名称" width="200" />
				<el-table-column prop="category_name" show-overflow-tooltip label="所属分类"/>
				<el-table-column label="是否上架">
					<template #default="scope">
						<div>
						  <el-switch :model-value="scope.row.is_on_sale"						  
						  @change="saleChange($event,scope.$index)"
						  />						  
						</div>
					</template>
				</el-table-column>				
					
				<el-table-column label="发布日期">
					<template #default="scope">
						<div class="time">
						  {{dayjs(scope.row.create_date).format("YYYY-MM-DD HH:mm") }}						  
						</div>
					</template>
				</el-table-column>
				
			
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<div>
						  <el-button type="primary" @click="routerTo('./edit?id='+scope.row._id)">{{$t("common.button.edit")}}</el-button>				  
						  <el-button type="danger" @click="delTable(scope.row._id)">{{$t("common.button.delete")}}</el-button>					  
						</div>
					</template>
				</el-table-column>
			</el-table>
			
			
			<view class="pagination">
				<el-pagination hide-on-single-page background layout="prev, pager, next" :total="query.total" 
				:default-page-size="query.pageSize"
				@current-change="handleChange"
				/>
			</view>
		</view>
		
		
		
	</view>
</template>

<style lang="scss" scoped>
	.avatar{
		width: 100px;
		height: 100px;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.time{
		font-size: 12px;
		color:#888;
	}
</style>
