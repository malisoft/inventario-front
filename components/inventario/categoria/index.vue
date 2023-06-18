<template>
	<v-card flat>
		<v-data-table :headers="headers" :items="categorias" sort-by="nombre" class="elevation-1">
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-dialog v-model="dialog" max-width="600px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nueva Categoria</v-btn>
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
							
							<small class="mx-3 red--text">{{message}}</small>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
								<v-btn color="blue darken-1" text @click="save">Save</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.estado="{ item }">
					<v-chip v-if="item.estado" color="primary">Activado</v-chip>
				
					<v-chip v-else color="error">Desactivado</v-chip>
				
			</template>
			<template v-slot:item.actions="{ item }">
				<v-chip  v-if="!item.estado" color="primary" @click="activateItem(item)">
					<v-icon>mdi-check</v-icon>Activar
				</v-chip>
				<v-chip v-else color="error" @click="deactivateItem(item)">
					<v-icon>mdi-window-close</v-icon>Desactivar
				</v-chip>
				<v-btn fab dark small color="blue" class="ml-2 mr-2" @click="editItem(item)">
                    <v-icon>mdi-pencil</v-icon>         
                </v-btn>
				<v-btn fab small color="error" @click="deleteItem(item)">
                    <v-icon>
                        mdi-delete
                    </v-icon>
                </v-btn>
			</template>
			<template v-slot:no-data>
				<v-btn color="primary" :loading="loading" @click="initialize">Actualizar</v-btn>
			</template>
		</v-data-table>
	</v-card>
</template>
<script>
export default {
	data: () => ({
		dialog: false,
		loading:false,
		headers: [
			{
				text: 'Nombre',
				align: 'start',
				value: 'nombre',
			},
			{ text: 'Descripción', value: 'descripcion' },
			{ text: 'Estado', value: 'estado' },
			{ text: 'Opciones', value: 'actions', sortable: false },
		],
		categorias: [],
		editedIndex: -1,
		editedItem: {
			nombre: '',
			descripcion: '',
			estado: true,
		},
		defaultItem: {
			nombre: '',
			descripcion: '',
			estado: true,
		},
		message:null,
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nueva Categoria' : 'Editar Categiria';
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
			this.loading=false;
			this.$axios
				.post('/categoria/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.categorias = data;
					this.loading=false;
				})
				.catch((error) => {
					this.loading=false;
				});
		},

		editItem(item) {
			this.editedIndex = this.categorias.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			const index = this.categorias.indexOf(item);
			if (confirm('Seguro que deseas eliminar el Rol?')) {
				this.$axios
					.delete('/categoria/eliminar', { _id: this.categorias[index]._id })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.categorias.splice(index, 1);
					})
					.catch((error) => {
						confirm('Ocurrió un problema al Eliminar.');
					});
			}
		},

		activateItem(item){
            this.$axios
					.put('/categoria/activar', { _id: item._id })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						item.estado=true;
					})
					.catch((error) => {
						confirm('Ocurrió un problema al activar.');
					});
        },
        deactivateItem(item){
            this.$axios
					.put('/categoria/desactivar', { _id: item._id })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						item.estado=false;
					})
					.catch((error) => {
						confirm('Ocurrió un problema al desactivar.');
					});
		},
		

		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save() {
			if (this.editedIndex > -1) {
				this.$axios
					.post('/categoria/actualizar', this.editedItem)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						Object.assign(this.categorias[this.editedIndex], data);
						this.close();
					})
					.catch((error) => {
						this.messageDialog = 'Ocurrió un prolema al crear un nueva Categoria.';
					});
			} else {
				this.$axios
					.post('/categoria/crear', this.editedItem)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.categorias.push(data);
						this.close();
					})
					.catch((error) => {
						this.messageDialog = 'Ocurrió un prolema al crear un nueva Categoria.';
					});
			}
		},
	},
};
</script>