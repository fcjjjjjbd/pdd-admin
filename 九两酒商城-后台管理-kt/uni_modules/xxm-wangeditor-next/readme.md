# xxm-wangeditor-next
适用于uniadmin后台管理系统的，富文本插件，依赖于wangeditor-next

## 下载

点击右上角“下载插件并导入HBuilderX”，将插件下载到本地uni_modules目录中



## 安装

无需import，可以直接在项目中使用xxm-select-image组件，导入插件后不能显示，请重启项目后再查看。

## 用法

```
<xxm-wangeditor-next  v-model:content="formData.content"></xxm-wangeditor-next>
```

**特别注意**

基于uniapp的特殊性，它将button按钮定义了特殊的样式，而wangeditor的功能按钮也用的button，而uniapp的权重高，导致样式出现问题，需要按照如下方法进行修改：

1. 按照uni_modules -> xxm-wangeditor-next -> common ->  editor-style.css  找到这个css文件

2. 将该css文件拷贝至项目根目录下static，比如static/css/editor-style.css

3. 在项目根目录下index.html引入该css，放置到head组件内

   ```
   <link rel="stylesheet" href="static/css/editor-style.css" />
   ```

   

## Props

| 参数    | 说明       | 必填项 | 类型   | 默认值 |
| ------- | ---------- | ------ | ------ | ------ |
| content | 富文本内容 | 是     | string | -      |



## 交流反馈

如果在使用中遇到问题，可以Q群内交流：686892688
