<script setup>
import { ref, unref } from 'vue';
import { routerTo, showLoading, showModal, showToast } from '@/utils/common.js';
import { getSmallImg } from '@/utils/tools.js';
import dayjs from 'dayjs';
const loading = ref(false);
const expressCloudObj = uniCloud.importObject('admin-express-template', { customUI: true });
const tableData = ref([]);
const query = ref({
	pageSize: 10,
	pageCurrent: 1,
	total: 0,
	keyword: ''
});
const search = () => {
	query.value.pageCurrent = 1;
	getData();
};
//修改默认模板事件
const defaultChange = async (e, index) => {
	try {
		loading.value = true;
		let { errCode } = await expressCloudObj.update({ _id: unref(tableData)[index]._id, is_default: e });
		if (errCode !== 0) return showToast('更新失败');
		tableData.value[index].is_default = e;
		showToast('修改成功');
	} catch (err) {
		console.log(err);
	} finally {
		loading.value = false;
	}
};

const delTable = async (id) => {
	try {
		if (!(await showModal({ content: '是否确认删除?' }))) return;
		let { errCode } = await expressCloudObj.remove({ _id: id });
		if (errCode !== 0) return showToast('删除失败');
		showToast('删除成功');
		getData();
	} catch (err) {
		console.log(err);
		showToast(err.errMsg);
	}
};

const getData = async () => {
	try {
		loading.value = true;
		let { errCode, data, total } = await expressCloudObj.list(query.value);
		if (errCode !== 0) return showToast('数据查询有误');
		tableData.value = data;
		query.value.total = total;
	} catch (err) {
		console.log(err);
		showToast(err);
	} finally {
		loading.value = false;
	}
};

getData();
</script>

<template>
	<view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<button class="uni-button" type="primary" size="mini" @click="routerTo('./edit')">{{ $t('common.button.add') }}</button>
			</view>
		</view>
	</view>
	<view class="uni-container">
		<el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
			<el-table-column prop="name" show-overflow-tooltip label="模板名称" width="200" />
			<el-table-column label="默认模板">
				<template #default="scope">
					<div>
						<el-switch :model-value="scope.row.is_default" @change="defaultChange($event, scope.$index)" />
					</div>
				</template>
			</el-table-column>
			<el-table-column label="发布日期">
				<template #default="scope">
					<div class="time">
						{{ dayjs(scope.row.create_date).format('YYYY-MM-DD HH:mm') }}
					</div>
				</template>
			</el-table-column>

			<el-table-column label="更新日期">
				<template #default="scope">
					<div class="time">
						{{ dayjs(scope.row.last_modify_date).format('YYYY-MM-DD HH:mm') }}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template #default="scope">
					<div>
						<el-button type="primary" @click="routerTo('./edit?id=' + scope.row._id)">{{ $t('common.button.edit') }}</el-button>
						<el-button type="danger" @click="delTable(scope.row._id)">{{ $t('common.button.delete') }}</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</view>
</template>

<style lang="scss" scoped></style>
