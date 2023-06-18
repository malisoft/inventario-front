<template>
	<div>
		<v-card>
			<v-toolbar flat>
				<v-toolbar-title>Administrar Campos</v-toolbar-title>
			</v-toolbar>

			<v-tabs fixed-tabs light slider-color="primary">
				<v-tab>Campos Adicionales</v-tab>
				<v-tab>Marcas</v-tab>
				<v-tab>Categorias</v-tab>
				<v-tab>Proveedores</v-tab>
				<v-tab>Precios</v-tab>

				<v-tab-item>
					<Campos />
				</v-tab-item>
				<v-tab-item>
					<Marca />
				</v-tab-item>
				<v-tab-item>
					<Categoria />
				</v-tab-item>
				<v-tab-item>
					<Proveedor />
				</v-tab-item>
				<v-tab-item>
					<Precio />
				</v-tab-item>
			</v-tabs>
		</v-card>
	</div>
</template>
<script>
import { validateLogin } from '../../app/validateLogin';
import Marca from '../../components/inventario/marca/index';
import Campos from '../../components/inventario/campos/index';
import Categoria from '../../components/inventario/categoria/index';
import Proveedor from '../../components/inventario/proveedor/index';
import Precio from '../../components/inventario/precio/index';
export default {
	async asyncData({ store, redirect, $axios }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page

		//************NUEW VARIABLES HERE**************/

		//********END DECLARATION OF VARIABLES*********/

		return result ? { account: '' } : redirect('/login');
	},
	components: {
		Marca,
		Campos,
		Categoria,
		Proveedor,
		Precio,
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
	},
};
</script>