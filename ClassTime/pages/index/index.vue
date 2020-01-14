<template>
	<view>
		<view>index2</view>
		<footerNav :msg="footer"></footerNav>
	</view>
</template>
<script>
	import footerNav from "@/components/footer/footer_nav.vue"
	
	export default {
	    components: {
			footerNav
		},
		data(){
			return{				
				footer: 'index'
			}
		}
		
	}
	
</script>