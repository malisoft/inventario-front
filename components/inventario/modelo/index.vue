<template>
	<v-data-table :headers="headers" :items="modelos" sort-by="nombre" class="elevation-1">
		<template v-slot:top>
			<v-toolbar flat color="white">
				<v-spacer></v-spacer>
				<v-dialog v-model="dialog" max-width="600px" persistent>
					<template v-slot:activator="{ on, attrs }">
						<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Modelo</v-btn>
					</template>
					<v-card>
						<v-card-title>
							<span class="headline">{{ formTitle }}</span>
						</v-card-title>

						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12" sm="5" md="5">
										<v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
									</v-col>
									<v-col cols="12" sm="7" md="7">
										<v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						<small class="red--text mx-4">{{message}}</small>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
							<v-btn color="blue darken-1" text @click="save">Save</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-chip dark color="blue" class="ml-2 mr-2" @click="editItem(item)">
				<v-icon>mdi-pencil</v-icon>
			</v-chip>
			<v-chip dark color="error" @click="deleteItem(item)">
				<v-icon>mdi-delete</v-icon>
			</v-chip>
		</template>
		<template v-slot:no-data>
			<v-btn color="primary" :loading="loadingModelos" @click="initialize">Actualizar</v-btn>
		</template>
	</v-data-table>
</template>
<script>
export default {
	props: {
		_id: { type: String },
		modelos: { type: Array },
		editedMarca: { type: Number },
	},
	data: () => ({
		message: null,
		dialog: false,
		loadingModelos: false,
		headers: [
			{
				text: 'Nombre',
				align: 'start',
				sortable: false,
				value: 'nombre',
			},
			{ text: 'Descripción', value: 'descripcion' },
			{ text: 'Opciones', value: 'actions', sortable: false },
		],
		/* modelos: [], */
		editedIndex: -1,
		editedItem: {
			_id: '',
			nombre: '',
			descripcion: '',
			marca: '',
		},
		defaultItem: {
			_id: '',
			nombre: '',
			descripcion: '',
			marca: '',
		},
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nueva Modelo' : 'Editar Modelo';
		},
		getModelos() {
			console.log('_id de marca modificado recargando');
		},
	},

	watch: {
		_id(val) {
			val === '' ? console.log('Nuevos modelos') : this.initialize();
		},
		dialog(val) {
			val || this.close();
		},
	},

	methods: {
		initialize() {
			this.editedItem.marca = this._id;
			this.defaultItem.marca = this._id;
			this.loadingModelos = true;
			this.$axios
				.post('/modelo/listar', { marca: this._id })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					data.forEach((modelo) => {
						this.modelos.push(modelo);
					});
					this.loadingModelos = false;
				})
				.catch((error) => {
					this.loadingModelos = false;
				});
		},

		editItem(item) {
			this.editedIndex = this.modelos.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			const index = this.modelos.indexOf(item);
			if (confirm('Seguro que quieres eliminar el Modelo?')) {
				this.$axios
					.post
					('/modelo/eliminar', item)
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						this.modelos.splice(index, 1);
					})
					.catch((error) => {
						console.error("No se pudo elimianr modelo")
					});
			} else {
				console.error("No elimiando")
			}
		},

		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save() {
			if (this.editedMarca > -1) {
				if (this.editedIndex > -1) {
					this.$axios
						.put('/modelo/actualizar', this.editedItem)
						.then((response) => {
							return response.data;
						})
						.then((data) => {
							Object.assign(this.modelos[this.editedIndex], data);
							//this.modelos = [];
							this.close();
						})
						.catch((error) => {
							this.message = 'Ocurrio un error';
						});
				} else {
					console.log('Creando este mdelo');
					console.log(this.editedItem);
					this.$axios
						.post('/modelo/crear', this.editedItem)
						.then((response) => {
							return response.data;
						})
						.then((data) => {
							this.modelos.push(data);

							console.log(data);
							//this.modelos = [];
							this.close();
						})
						.catch((error) => {
							this.message = 'Ocurrio un error';
						});
				}
			} else {
				console.log('es una nueva marca añadir productos sin registrar');
				if (this.editedIndex > -1) {
					Object.assign(this.modelos[this.editedIndex], this.editedItem);
				} else {
					this.modelos.push(this.editedItem);
				}
				this.close();
			}
			/* if (this.editedIndex > -1) {
				Object.assign(this.modelos[this.editedIndex], this.editedItem);
			} else {
				this.modelos.push(this.editedItem);
			} */
			//this.close();
		},
	},
};
</script>