<template>
	<v-select
		v-model="almacenEdited"
		:items="almacenes"
		:loading="loading"
		label="Almacen"
		item-text="nombre"
		item-value="_id"
		:error="message"
		persistent-hint
		return-object
		single-line
	></v-select>
</template>
<script>
export default {
	model: {
		prop: 'almacen',
		event: 'input',
	},
	props: {
		almacen: { type: Object, required: true },
		sucursal: { type: Object },
	},
	data() {
		return {
			almacenEdited: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			almacenDefault: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			almacenes: [],
			loading: false,
			message: null,
		};
	},
	created() {
		Object.assign(this.almacenEdited, this.almacen);
		this.initialize();
	},
	methods: {
		initialize() {
			if (!this.sucursal._id == '') {
				this.loading = true;
				this.$axios
					.post('/almacen/listar', { sucursal: this.sucursal._id })
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						this.almacenes = data;
						this.loading = false;
						if (this.almacenes.length < 1) {
							this.$emit('input', this.almacenDefault);
						}
					})
					.catch((error) => {
						this.loading = false;
						this.message = 'Ocurrió un error cargando almacenes.';
					});
			} else {
				console.log('no hay almacenes que cargar');
			}
		},
	},
	watch: {
		almacenEdited(almacen) {
			if (!almacen._id == '') this.$emit('input', almacen);
		},
		sucursal(sucursal) {
			this.initialize();
		},
		almacen(almacen) {
			if (almacen._id == '') this.almacenEdited = Object.assign({}, this.almacenDefault);
		},
	},
};
</script>