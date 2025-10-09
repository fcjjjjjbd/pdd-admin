<template>		
	<link rel="stylesheet" href="uni_modules/xxm-wangeditor-next/common/editor-style.css" />
    <div style="border: 1px solid #ccc;width: 100%;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"		
		@onChange = "handleBlur"
      />
    </div>
	
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted, watch} from 'vue'
import { DomEditor } from '../@wangeditor-next/editor/index.mjs'
import { Editor, Toolbar } from '../@wangeditor-next/editor-for-vue/index.esm.js'

import { showToast, uploadFileItem,cloudToHttps } from '../../common/utils.js'

const props = defineProps(["content"])
const emits = defineEmits(["update:content"]);

const mode = ref("default")
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref(props.content);

watch(()=>props.content,(nv)=>{
	valueHtml.value = nv;
})



// 模拟 ajax 异步获取内容
onMounted(() => {
	
})

const toolbarConfig = {
	excludeKeys:["group-video","insertImage"]
}




const editorConfig = { 
	placeholder: '请输入内容...',
	autoFocus:false,
	MENU_CONF:{}
}

editorConfig.MENU_CONF['uploadImage'] = {
    // 自定义上传    
    async customUpload(file, insertFn) {			
		try{
			uni.showLoading();
			const blogUrl = URL.createObjectURL(file)			
			let cloudFile = await uploadFileItem(blogUrl,"plugin");
			uni.hideLoading()
			let fileurl = cloudToHttps(cloudFile.fileID)        
			insertFn(fileurl)
		}catch(err){
			uni.hideLoading()
			showToast({title:err})
		}
		
    }
}



// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const handleBlur =  (e)=>{	
	emits("update:content",valueHtml.value)
	
}


</script>

<style scoped lang="scss">
.w-e-full-screen-container{
	z-index: 1000;
}

</style>