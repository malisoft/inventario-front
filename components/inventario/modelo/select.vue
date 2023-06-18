<template>
	<v-row>
		<v-col cols="12" sm="10" md="10">
			<v-select
				v-model="modeloEdited"
				:items="modelos"
				:loading="loading"
				:hint="`Descripción de Modelo: ${modeloEdited.descripcion}`"
				label="Modelos"
				item-text="nombre"
				item-value="_id"
				:error="message"
				persistent-hint
				return-object
				single-line
			></v-select>
		</v-col>
		<v-col cols="12" sm="2" md="2">
			<!-- <Crear :marcas="marcas" v-model="modeloEdited"/> -->
		</v-col>
	</v-row>
</template>
<script>
//import Crear from './crear';

export default {
	model: {
		prop: 'modelo',
		event: 'input',
	},
	props: {
		modelo: { type: Object },
		marca:{type:Object}
	},
	components: {
		//Crear,
	},
	data() {
		return {
            modeloEdited:{
                _id:'',
                nombre:'',
                descripcion:''
            },
			modelos: [],
			loading: false,
			message: null,
		};
	},
	created() {
        Object.assign(this.modeloEdited, this.modelo);
		this.initialize();
	},
	methods: {
		initialize() {
			console.log("inicializando")
			console.log(this.marca)
			if(!this.marca._id) return;
			if(!this.marca._id==="") return;
			console.log("esta buscando")
			this.loading = true;
			this.message=null;
			this.$axios
				.post('/modelo/listar', { marca: this.marca._id })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.modelos = data;
					this.loading = false;
				})
				.catch((error) => {
					this.loading = false;
					this.message = 'Ocurrió un error cargando marcas.';
				});
		},
    },
    watch:{
        modeloEdited(modelo){
			//Object.assign(this.marca, marca);	
			this.$emit('input', modelo);
		},
		marca(marca){
			this.initialize()
		}
		
    }
};
</script>