<template>
	<v-row>
		<v-col cols="12" sm="10" md="10">
			<v-select
				v-model="marcaEdited"
				:items="marcas"
				:loading="loading"
				:hint="`Descripción de Marca: ${marcaEdited.descripcion}`"
				label="Marca"
				item-text="nombre"
				item-value="_id"
				:error="message"
				persistent-hint
				return-object
				single-line
			></v-select>
		</v-col>
		<v-col cols="12" sm="2" md="2">
			<Crear :marcas="marcas" v-model="marcaEdited"/>
		</v-col>
	</v-row>
</template>
<script>
import Crear from './crear';

export default {
	model: {
		prop: 'marca',
		event: 'input',
	},
	props: {
		marca: { type: Object },
	},
	components: {
		Crear,
	},
	data() {
		return {
            marcaEdited:{
                _id:'',
                nombre:'',
                descripcion:''
            },
			marcas: [],
			loading: false,
			message: null,
		};
	},
	created() {
        Object.assign(this.marcaEdited, this.marca);
		this.initialize();
	},
	methods: {
		initialize() {
			this.loading = true;
			this.message=null;
			this.$axios
				.post('/marca/listar', { estado: true })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.marcas = data;
					this.loading = false;
				})
				.catch((error) => {
					this.loading = false;
					this.message = 'Ocurrió un error cargando marcas.';
				});
		},
    },
    watch:{
        marcaEdited(marca){
			//Object.assign(this.marca, marca);	
			this.$emit('input', marca);
			this.$emit('change');
        }
    }
};
</script>