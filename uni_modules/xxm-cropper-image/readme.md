# xxm-cropper-image
适用于uniadmin的对图片进行裁剪，支持自由尺寸、固定常见比例（9/16、9/20、16/9）,可以通过鼠标滚轮进行缩放，可以对图片进行旋转。



## 下载

点击右上角“下载插件并导入HBuilderX”，将插件下载到本地uni_modules目录中



## 安装

无需import，可以直接在项目中使用该xxm-cropper-image组件



## 用法

```
<button @click="handleCropper">触发裁剪</button>

<xxm-cropper-image 
    ref="xxmCropperRef" 
    :maxImgSize="1200" 
    :tempurl="formData.avatar"
    @confirm="cropperChange"
>
</xxm-cropper-image>


const xxmCropperRef = ref(null);
//触发图片裁剪弹窗
const handleCropper =  ()=>{
	xxmCropperRef.value.open();
}
//点击确认裁剪按钮触发事件
const cropperChange = (e)=>{
	//获取blob格式的本地图
	console.log(e)
}
```



## Props

| 参数       | 说明             | 必填项 | 类型   | 默认值 |
| ---------- | ---------------- | ------ | ------ | ------ |
| tempurl    | 图片src地址      | 是     | String |        |
| maxImgSize | 图片裁剪最大尺寸 | 否     | Number | 1200   |





## 事件 Events

| 事件名  | 说明                                           | 返回值 |
| ------- | ---------------------------------------------- | ------ |
| confirm | 确认裁剪图片成功, 可以接收裁剪后的blob图片地址 | path   |



## 交流反馈

如果在使用中遇到问题，可以Q群内交流：686892688