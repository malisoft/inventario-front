<template>
	<v-card flat>
		<v-data-table :headers="headers" :items="precios" sort-by="nombre" class="elevation-1">
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-dialog v-model="dialog" max-width="600px" persistent>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Precio</v-btn>
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
								<v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
								<v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
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
				<v-btn :loading="loading" color="primary" @click="initialize">Actualizar</v-btn>
			</template>
		</v-data-table>
	</v-card>
</template>
<script>
import Modelo from '../modelo/index';
export default {
	data: () => ({
		title: '',
		dialog: false,
		headers: [
			{
				text: 'Nombre',
				align: 'start',
				value: 'nombre',
			},
			{ text: 'Descripción', value: 'descripcion' },
			{ text: 'Opciones', value: 'actions', sortable: false },
		],
		precios: [],
		editedIndex: -1,
		editedItem: {
			_id:'',
			nombre: '',
			descripcion: '',
			modelos:[]
		},
		defaultItem: {
			_id:'',
			nombre: '',
			descripcion: '',
			modelos:[]
		},
		message: null,
		loading: false,
	}),
	components: {
		Modelo,
	},
	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Precio' : 'Editar Precio';
		},
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
	},

	created() {
		this.initialize();
	},

	methods: {
		initialize() {
			this.message = null;
			this.loading = true;
			this.$axios
				.post('/precio/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.precios = data;
					this.loading = false;
				})
				.catch((error) => {
					this.message = 'Ocurrio un error';
					this.loading = false;
				});
		},

		editItem(item) {
			this.editedIndex = this.precios.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			const index = this.precios.indexOf(item);
			if (confirm('Seguro que quieres eliminar ese Precio?')) {
				this.$axios
					.post
					('/precio/eliminar', item)
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						this.precios.splice(index, 1);
					})
					.catch((error) => {
						console.error("No se pudo eliminar el precio.")
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
			this.message = null;
			if (this.editedIndex > -1) {
				this.$axios
					.put('/precio/actualizar', this.editedItem)
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						Object.assign(this.precios[this.editedIndex], data);
						this.close();
					})
					.catch((error) => {
						this.message = 'Ocurrio un error';
					});
			} else {
				this.$axios
					.post('/precio/crear', this.editedItem)
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						this.precios.push(data);
						this.close();
					})
					.catch((error) => {
						this.message = 'Ocurrio un error';
					});
			}
		},
	},
};
</script>