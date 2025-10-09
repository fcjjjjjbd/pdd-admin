<template>
	<view class="picGroup">
		<template v-if="!isGroup">
			<view :style="{width:width+'px',aspectRatio:ratio}" class="box add" v-if="!picurl" @click="selectPicurl">
				<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
			</view>
			<view :style="{width:width+'px',aspectRatio:ratio}" class="box pic" v-else>
				<image :src="picurl" mode="aspectFit"></image>
				<view class="mask">
					<view class="icon" @click="editImg">
						<uni-icons type="compose" size="20" color="#fff"></uni-icons>
					</view>
					<view class="icon" @click="delImg">
						<uni-icons type="trash" size="20" color="#fff"></uni-icons>
					</view>
				</view>
			</view>
		</template>
		
		<template v-else>
			<view :style="{width:width+'px',aspectRatio:ratio}" class="box pic" 
			v-for="(pic,index) in picurls" :key="index">
				<image :src="pic" mode="aspectFit"></image>
				<view class="mask">
					<view class="icon" @click="editImg(index)">
						<uni-icons type="compose" size="20" color="#fff"></uni-icons>
					</view>
					<view class="icon" @click="delImg(index)">
						<uni-icons type="trash" size="20" color="#fff"></uni-icons>
					</view>
				</view>
			</view>
			<view :style="{width:width+'px',aspectRatio:ratio}" class="box add" 
			v-if="picurls.length < limit" @click="selectPicurl">
				<uni-icons type="plusempty" size="30" color="#999"></uni-icons>
			</view>
		</template>
		
		
		
		<xxm-cropper-image ref="cropperRef" :maxImgSize="maxImgSize" :tempurl="tempurl"
		 @confirm="cropperChange"	 
		 ></xxm-cropper-image>
	</view>
</template>

<script setup>
import {computed, ref,unref} from "vue";
const props = defineProps({
	picurl:{
		type:String,
		default:""
	},
	picurls:{
		type:Array,
		default:()=>[]
	},
	limit:{
		type:Number,
		default:1
	},
	maxImgSize:{
		type:Number,
		default:1200
	},
	width:{
		type:Number,
		default:200
	},
	ratio:{
		type:String,
		default:"16 / 9"
	}
})
const tempurl = ref(props.picurl);
const isGroup = computed(()=>props.limit > 1 ? true :false);
const emits = defineEmits(["update:picurl","update:picurls"])
const cropperRef = ref(null);
const currentIndex = ref(0)
const selectPicurl = ()=>{
	uni.chooseImage({
		count:props.limit,
		success:res=>{
			unref(isGroup) ? 
			emits("update:picurls",[...props.picurls,...res.tempFilePaths].slice(0,props.limit)) : emits("update:picurl",res.tempFilePaths[0])
		}
	})
}

const delImg =(index)=>{
	if(unref(isGroup)){
		let temPicurls = props.picurls;
		temPicurls.splice(index,1);
		emits("update:picurls",temPicurls)
	}else{
		emits("update:picurl","")
	}		
}

const editImg = (index)=>{	
	if(unref(isGroup)){
		currentIndex.value = index;
		tempurl.value = props.picurls[index]
	}else{
		tempurl.value = props.picurl
	}
	cropperRef.value.open();
}

const  cropperChange = (e)=>{
	if(unref(isGroup)){
		let temPicurls = props.picurls;
		temPicurls.splice(currentIndex.value,1,e);
		emits("update:picurls",temPicurls)
	}else{
		emits("update:picurl",e)
	}	
}

</script>

<style lang="scss" scoped>
.picGroup{
	display: flex;
	flex-wrap: wrap;
	gap:10px;
	.box{			
		border:1px solid #e4e4e4;
		border-radius: 5px;
		overflow: hidden;
	}
	.add{
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.pic{
		position: relative;
		background: conic-gradient(#ccc 0 25%,#fff 25% 50%,#ccc 50% 75%,#fff 75%);
		background-size: 10px 10px;
		image{
			width: 100%;
			height: 100%;
		}
		.mask{
			position: absolute;
			bottom:0;
			left:0;
			width: 100%;
			height: 30px;
			background: rgba(0,0,0,0.4);
			display: flex;
			align-items: center;
			justify-content: center;
			.icon{					
				flex:1;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}
		}
	}
}
</style>