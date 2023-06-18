<template>
	<div>Desplegando el producto: {{item.nombre}}</div>
</template>
<script>
import { validateLogin } from '../../../app/validateLogin';
export default {
	async asyncData({ error, params, $axios, redirect, store}) {
        let result = await validateLogin(store, $axios);
        if(result){
            return $axios
			.post(`/item/listar`,{_id:params.id})
			.then((res) => {
				let item = res.data;
				return { item };
			})
			.catch((e) => {
				error({ statusCode: 404, message: 'Producto no existe.' });
            });
        }else{
            return redirect('/login');
        }
	},
	created() {
		console.log("The new Item is:");
		console.log(this.item)
	},
};
</script>