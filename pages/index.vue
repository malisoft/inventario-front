<template>
	<div>Bienvenido al sistema de facturación</div>
</template>

<script>
import { validateLogin } from '../app/validateLogin';
export default {
	async asyncData({ store, redirect, $axios }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page

		//************NUEW VARIABLES HERE**************/

		//********END DECLARATION OF VARIABLES*********/

		return result ? { account: '' } : redirect('/login');
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch("getTokenCookie");
	},
	methods: {
		
	},
};
</script>