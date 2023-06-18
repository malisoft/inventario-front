<template>
	<v-row>
		<v-col cols="12" sm="10" md="10">
			<v-select
				v-model="categoriaEdited"
				:items="categorias"
				:loading="loading"
				:hint="`Descripción de Categoria: ${categoria.descripcion}`"
				label="Categoria"
				item-text="nombre"
				item-value="_id"
				:error="message"
				persistent-hint
				return-object
				single-line
			></v-select>
		</v-col>
		<v-col cols="12" sm="2" md="2">
			<Crear v-model="categoriaEdited" :categorias="categorias"/>
		</v-col>
	</v-row>
</template>
<script>
import Crear from './crear';

export default {
	model: {
		prop: 'categoria',
		event: 'input',
	},
	props: {
		categoria: { type: Object },
	},
	components: {
		Crear,
	},
	data() {
		return {
			categoriaEdited: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			categorias: [],
			loading: false,
			message: null,
		};
	},
	created() {
		Object.assign(this.categoriaEdited, this.categoria);
		this.initialize();
	},
	methods: {

		initialize() {
			this.loading = true;
			this.$axios
				.post('/categoria/listar', { estado: true })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.categorias = data;
					this.loading = false;
				})
				.catch((error) => {
					this.loading = false;
					this.message = 'Ocurrió un error cargando Categorias.';
				});
		},
	},
	watch: {
		categoriaEdited(categoria) {
			this.$emit('input', categoria);
		},
	},
};
</script>