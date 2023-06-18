<template>
    <v-select 
    v-model="sucursalEdited" 
    label="Sucursal" 
    :items="sucursales" 
    :loading="loading"
    item-text="nombre"
    item-value="_id"
    return-object
    persistent-hint
    required></v-select>
</template>
<script>
export default {
	model: {
		prop: 'sucursal',
		event: 'input',
	},
	props: {
		sucursal: { type: Object, required: true },
		exclude:{ type: Object },
	},
	data() {
		return {
			sucursalEdited: {
				_id: '',
				nombre: '',
				direccion: '',
			},
			sucursalDefault: {
				_id: '',
				nombre: '',
				direccion: '',
			},
			sucursales: [],
			loading: false,
			message: null,
		};
	},
	created() {
		Object.assign(this.sucursalEdited, this.sucursal);
		this.initialize();
	},
	methods: {
		initialize() {
			this.loading = true;
			this.$axios
				.post('/sucursal/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					if(this.exclude){
						data.forEach(sucursalItem => {
							if(this.exclude._id!==sucursalItem._id){
								this.sucursales.push(sucursalItem)
							}
						});
					}else{
						this.sucursales = data;
					}
					this.loading = false;
				})
				.catch((error) => {
					this.loading = false;
					this.message = 'Ocurrió un error cargando sucursales.';
				});
		},
	},
	watch: {
		sucursalEdited(sucursal) {
			if (!sucursal._id == '') this.$emit('input', sucursal);
		},
		sucursal(sucursal) {
			if (sucursal._id == '') this.sucursalEdited = Object.assign({}, this.sucursalDefault);
		},
	},
};
</script>