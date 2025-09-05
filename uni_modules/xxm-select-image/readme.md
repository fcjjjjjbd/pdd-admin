# xxm-select-image
适用于uniadmin的图片选择插件，通过该插件可以对图片进行比例裁剪，生成blob格式的临时地址。



## 下载

点击右上角“下载插件并导入HBuilderX”，将插件下载到本地uni_modules目录中



## 安装

无需import，可以直接在项目中使用xxm-select-image组件，导入插件后不能显示，请重启项目后再查看。



## 用法
单张图片示例：
```
<xxm-select-image :width="200" v-model:picurl="formData.avatar"></xxm-select-image>
```
多张图片示例：
```
<xxm-select-image :width="100" v-model:picurls="formData.imgs" :limit="3"></xxm-select-image>
```


## Props

| 参数       | 说明               | 必填项 | 类型   | 默认值 |
| ---------- | ------------------ | ------ | ------ | ------ |
| picurl     | 图片src地址        | 是     | String |        |
| width      | 选择图片的可视大小 | 否     | Number | 200    |
| ratio      | 可视区域显示比例   | 否     | String | 16 / 9 |
| maxImgSize | 图片裁剪最大尺寸   | 否     | Number | 1200   |
| limit | 选择图片的数量   | 否     | Number | 1   |
| picurls | limit大于1传递的属性   | 是     | Array | []   |



## 交流反馈

如果在使用中遇到问题，可以Q群内交流：686892688