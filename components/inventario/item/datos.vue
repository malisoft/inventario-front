<template>
	<v-row no-gutters>
		<v-col cols="12" xs="12" sm="12" md="7" lg="7">
			<v-card outlined flat elevation-10 class="mx-2 my-2">
				<v-card-title>Datos Generales</v-card-title>
				<v-card-text>
					<v-card :disabled="!editarDatos">
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12" sm="6" md="6">
										<v-text-field v-model="editedItem.codigo" label="Codigo Interno"></v-text-field>
									</v-col>
									<v-col cols="12" sm="4" md="4">
										<v-text-field v-model="editedItem.sufijo" :label="`${sufijoError?'Sufijo Ocupado':'Agregar Sufijo'}`" :error="sufijoError"></v-text-field>
									</v-col>
									<v-col cols="12" sm="2" md="2">
										<v-btn color="primary" label="Validar Sufijo" fab dark @click="validarSufijo" :loading="loadingValidateSufijo">
											<v-icon >{{sufijoAceptado?'mdi-check':'mdi-eye'}}</v-icon>
										</v-btn>
									</v-col>
									<v-col cols="12" sm="12" md="12">
										<v-text-field v-model="editedItem.codBarras" label="Codigo de barras"></v-text-field>
									</v-col>
									<v-col cols="12" sm="12" md="12">
										<v-text-field v-model="editedItem.nombre" label="Nombre del Producto"></v-text-field>
									</v-col>
									<v-col cols="12" sm="12" md="12">
										<v-text-field v-model="editedItem.descripcion" label="Descripción del Producto"></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="6">
										<!-- <SelectCategoria :categoria="editedItem.categoria" /> -->
										<SelectCategoria v-model="editedItem.categoria" />
									</v-col>
									<v-col cols="12" sm="6" md="6">
										<!-- <SelectMarca v-model="editedItem.marca" @change="actualizarModelos"/> -->
										<SelectMarca v-model="editedItem.marca" />
									</v-col>
									<v-col cols="12" sm="6" md="6">
										<!-- <SelectModelo v-model="editedItem.modelo" :marca="editedItem.marca" @change="actualizarModelos"/> -->
										<SelectModelo v-model="editedItem.modelo" :marca="editedItem.marca" />
									</v-col>
									<v-col cols="12" sm="6" md="6">
											<v-checkbox v-model="editedItem.peresedero" :label="`Producto ${editedItem.peresedero?'peresedero':'no peresedero'}`"></v-checkbox>
										</v-col>
								</v-row>
							</v-container>
						</v-card-text>
					</v-card>
				</v-card-text>
				<small class="red--text">{{message}}</small>
				<v-card-actions>
					<div v-if="editarDatos">
						<v-btn small elevation="2" color="error" @click="editarDatos=false">Cancelar</v-btn>
						<v-btn
							:loading="loadingDatos"
							small
							elevation="2"
							color="success"
							@click="actualizarDatos"
						>Guardar</v-btn>
					</div>
					<div v-else>
						<v-btn small elevation="2" color="primary" @click="editarDatos=true">Editar</v-btn>
					</div>
				</v-card-actions>
			</v-card>
		</v-col>
		<v-col cols="12" xs="12" sm="12" md="5" lg="5">
			<Precios :item="item" />
		</v-col>
	</v-row>
</template>
<script>
import SelectCategoria from '../categoria/select';
import SelectMarca from '../marca/select';
import SelectModelo from '../modelo/select';
import Precios from './precios';
export default {
	props: {
		item: { type: Object },
	},
	components: {
		SelectCategoria,
		SelectMarca,
		SelectModelo,
		Precios,
	},
	created() {
		/* this.editedItem = Object.assign({}, this.item); */
		Object.assign(this.editedItem, this.item);
	},
	data: () => ({
		sufijoAceptado:false,
		sufijoError:false,
		loadingDatos: false,
		loadingValidateSufijo:false,
		message: null,
		editarDatos: false,
		editedItem: {
			codigo: '',
			sufijo:'',
			codBarras: '',
			nombre: '',
			descripcion: '',
			peresedero: true,
			categoria: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			proveedor: {
				_id: '',
				nombre: '',
				representante: '',
				telefono: '',
				nit: '',
				direccion: '',
				auditoria: '',
			},
			marca: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			modelo: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
		},
	}),

	computed: {},

	watch: {
		/* editedItem(val){
			console.log("cambiando")
		} */
	},

	methods: {
		validarSufijo(){
			this.loadingValidateSufijo=true;
			this.$axios
				.post('/item/sufijo', { sufijo: this.editedItem.sufijo })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.loadingValidateSufijo=false;
					this.sufijoError=false;
					this.sufijoAceptado=true;
				})
				.catch((error) => {
					this.sufijoError=true;
					this.sufijoAceptado=false;
					this.loadingValidateSufijo=false;
				});
		},
		actualizarDatos() {
			let datosUpdate = {};
			if (!this.editedItem.codigo == '') {
				Object.assign(datosUpdate, { codigo: this.editedItem.codigo });
			}
			if (!this.editedItem.sufijo == '') {
				Object.assign(datosUpdate, { sufijo: this.editedItem.sufijo });
			}
			if (!this.editedItem.codBarras == '') {
				Object.assign(datosUpdate, { codBarras: this.editedItem.codBarras });
			}
			if (!this.editedItem.descripcion == '') {
				Object.assign(datosUpdate, { descripcion: this.editedItem.descripcion });
			}

			if (!this.editedItem.marca._id == '') {
				Object.assign(datosUpdate, { marca: this.editedItem.marca._id });
			}
			if (!this.editedItem.modelo._id == '') {
				Object.assign(datosUpdate, { modelo: this.editedItem.modelo._id });
			}

			Object.assign(datosUpdate, { _id: this.editedItem._id });
			Object.assign(datosUpdate, { nombre: this.editedItem.nombre });
			Object.assign(datosUpdate, { categoria: this.editedItem.categoria._id });
			Object.assign(datosUpdate, { peresedero: this.editedItem.peresedero });

			this.message = null;
			this.loadingDatos = true;
			this.$axios
				.put('/item/actualizar', { ...datosUpdate })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.editarDatos = false;
					this.loadingDatos = false;
				})
				.catch((error) => {
					this.loadingDatos = false;
					this.editarDatos = false;
					this.message = 'Ocurrió un error cargando marcas.';
				});
		},
	},
};
</script>