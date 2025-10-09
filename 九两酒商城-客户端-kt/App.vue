<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "static/css/iconfont.css";
	view{
		box-sizing: border-box;
	}
	.safe-area-box{
		width: 100%;
		height: env(safe-area-inset-bottom);
	}
</style>
