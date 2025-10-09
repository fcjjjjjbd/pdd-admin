import { ref ,nextTick} from 'vue';

export function useCropper(cropperRef){
	const options = ref({
		outputType:"webp",
		autoCrop:true,
		fixed:false,
		fixedNumber:[9,16],
		infoTrue:true,
		full:true,
		maxImgSize:3000,
		fillColor:"#000",
		active:0
	})
	
	
	const fnConfig = ref([
		{type:"auto",text:"自由裁剪",icon:"icon-expend"},
		{type:"1/1",text:"1 / 1",icon:""},
		{type:"9/16",text:"9 / 16",icon:""},
		{type:"9/20",text:"9 / 20",icon:""},
		{type:"16/9",text:"16 / 9",icon:""},
		{type:"rotate",text:"向右旋转",icon:"icon-rotate-right"},
		{type:"zoomin",text:"放大",icon:"icon-zoomin"},
		{type:"zoomout",text:"缩小",icon:"icon-zoomout"}
	])
	
	
	
	const editImg = (type,index) => {	
	  switch (type) {
	    case "rotate":
	      return cropperRef.value.rotateRight();
	    case "zoomin":
	      return cropperRef.value.changeScale();
	    case "zoomout":
	      return cropperRef.value.changeScale(-1);
	    case "auto":
	      options.value.fixed = false;
		  options.value.active = index;
	      break;
	    case "1/1":
	    case "9/16":
	    case "9/20":
	    case "16/9":
	      options.value.fixed = true;
	      const ratio = fnConfig.value.find(find => find.type === type).text.split("/");
	      options.value.fixedNumber = ratio;
		  options.value.active = index;
	      break;
	    default:
	      // 可以在这里处理其他情况或者不处理
	      break;
	  }
	  nextTick(() => {
	    cropperRef.value.goAutoCrop();
	  });
	};
	
	
	
	return {
		options,
		fnConfig,
		editImg
	}
}