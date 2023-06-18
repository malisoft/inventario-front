<template>
	<v-row class="my-n3">
		<v-col cols="12" sm="10" md="10">
			<v-select
				v-model="proveedorEdited"
				label="Proveedores"
				:items="proveedores"
				:loading="loading"
				item-text="nombre"
				item-value="_id"
				return-object
				persistent-hint
				required
			></v-select>
		</v-col>
		<v-col cols="12" sm="2" md="2">
			<Crear v-model="proveedorEdited" :proveedores="proveedores" />
		</v-col>
	</v-row>
</template>
<script>
import Crear from "./crear"
export default {
	model: {
		prop: 'proveedor',
		event: 'input',
	},
	props: {
		proveedor: { type: Object, required: true },
	},
	components:{
		Crear
	},
	data() {
		return {
			proveedorEdited: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			proveedorDefault: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			proveedores: [],
			loading: false,
			message: null,
		};
	},
	created() {
		Object.assign(this.proveedorEdited, this.proveedor);
		this.initialize();
	},
	methods: {
		initialize() {
			this.loading = true;
			this.$axios
				.post('/proveedor/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.proveedores = data;
					this.loading = false;
				})
				.catch((error) => {
					this.loading = false;
					this.message = 'Ocurrió un error cargando Proveedores.';
				});
		},
	},
	watch: {
		proveedorEdited(proveedor) {
			if (!proveedor._id == '') this.$emit('input', proveedor);
		},
		proveedor(proveedor) {
			if (proveedor._id == '') this.proveedorEdited = Object.assign({}, this.proveedorDefault);
		},
	},
};
</script>