<script setup>
import {ref, unref} from "vue";
import dayjs from "dayjs";
import {routerTo, showLoading, showModal, showToast} from "@/utils/common.js"
import {getSmallImg} from "@/utils/tools.js"
const loading=ref(false);
const newsCloudObj = uniCloud.importObject("admin-news",{customUI:true})
const query = ref({
	pageSize:10,
	pageCurrent:1,
	total:0,
	keyword:""
})
const multipleSelection = ref([]);
const tableData = ref([])

const search = ()=>{
	query.value.pageCurrent = 1;
	getData()
}

const delTable = async(id)=>{	
	try{
		if(!await showModal({content:"是否确认删除?"})) return;		
		let delIds = (id && typeof id == 'string') ? [id] : unref(multipleSelection).map(item=>item._id);
		showLoading("执行中..")
		let {errCode,errMsg,data} = await newsCloudObj.remove(delIds);
		if(errCode!==0) return showToast("删除失败");
		showToast("删除成功");
		getData()
	}catch(err){
		showModal(err);
		console.log(err);
	}finally{
		uni.hideLoading()
	}
	
}

const handleChange = (e)=>{	
	query.value.pageCurrent = e;
	getData()
}

const handleSelectionChange =(val)=>{
	console.log(val);
	multipleSelection.value = val
}


//修改状态
const statusChange = async(index)=>{
	try{
		let row = unref(tableData)[index];
		loading.value = true
		row.article_status = 1 - row.article_status
		let {errCode,errMsg,data} = await newsCloudObj.update({_id:row._id,article_status:row.article_status})
		if(errCode!==0) return showToast("更新失败");		
	}catch(err){
		console.log(err);
	}finally{
		loading.value = false;
	}	
}


//修改推荐
const stickyChange = async(index)=>{
	try{
		let row = unref(tableData)[index];
		loading.value = true
		row.is_sticky = !row.is_sticky
		let {errCode,errMsg,data} = await newsCloudObj.update({_id:row._id,is_sticky:row.is_sticky})
		if(errCode!==0) return showToast("更新失败");		
	}catch(err){
		console.log(err);
	}finally{
		loading.value = false;
	}	
}

const previewImg = (index)=>{
	if(!unref(tableData)[index].avatar) return;
	uni.previewImage({
		urls:[unref(tableData)[index].avatar]
	})
}


const getData = async()=>{
	try{
		loading.value = true;
		let {errCode,data,total}= await newsCloudObj.list(query.value);
		if(errCode!==0) return showToast("数据查询有误");
		tableData.value = data;
		query.value.total = total
	}catch(err){
		console.log(err);
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
				<button class="uni-button" type="warn" size="mini" :disabled="!multipleSelection.length"
					@click="delTable">{{$t('common.button.batchDelete')}}</button>				
			</view>
		</view>
		<view class="uni-container">
			<el-table v-loading="loading" :data="tableData" stripe border  style="width: 100%"
			@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="title" show-overflow-tooltip label="标题" width="200" />
				<el-table-column label="缩略图" width="130">
					<template #default="scope">
						<div class="avatar">
						  <image @click="previewImg(scope.$index)" :src="getSmallImg(scope.row.avatar,100)" mode="aspectFill"></image>					  
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="nickname" label="发布人" width="120" show-overflow-tooltip/>
				<el-table-column prop="view_count" label="阅读数" width="120" />
				<el-table-column label="是否可见">
					<template #default="scope">
						<div>
						  <el-switch :model-value="scope.row.article_status" 
						  :active-value="1"
						  :inactive-value="0"
						  @change="statusChange(scope.$index)"
						  />						  
						</div>
					</template>
				</el-table-column>
				
				<el-table-column label="是否推荐">
					<template #default="scope">
						<div>
						  <el-switch :model-value="scope.row.is_sticky" 
						  @change="stickyChange(scope.$index)"/>						  
						</div>
					</template>
				</el-table-column>
				
				
				<el-table-column label="发布日期">
					<template #default="scope">
						<div>
						  {{dayjs(scope.row.publish_date).format("YYYY-MM-DD HH:mm") }}						  
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
	.uni-container{
		.avatar{
			image{
				width: 100px;
				height: 60px;
			}
		}
	}
</style>
