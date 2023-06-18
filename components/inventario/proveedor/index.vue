<template>
	<v-card flat>
		<v-data-table :headers="headers" :items="proveedores" sort-by="nombre" class="elevation-1">
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-dialog v-model="dialog" max-width="600px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Proveedor</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="6">
											<v-text-field v-model="editedItem.nit" label="Nit"></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="6">
											<v-text-field v-model="editedItem.telefono" label="Telefono"></v-text-field>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="6">
											<v-text-field v-model="editedItem.direccion" label="Dirección"></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="6">
											<v-text-field v-model="editedItem.representante" label="Representante"></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
								<v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
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
				<v-btn fab dark small color="blue" class="ml-2 mr-2" @click="editItem(item)">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
				<v-btn fab small color="error" @click="deleteItem(item)">
					<v-icon>mdi-delete</v-icon>
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
	created() {
		this.initialize();
	},
	data: () => ({
		dialog: false,
		loading: false,
		headers: [
			{
				text: 'Nit',
				align: 'start',
				sortable: false,
				value: 'nit',
			},
			{ text: 'Nombre', value: 'nombre' },
			{ text: 'Representante', value: 'representante' },
			{ text: 'Telefono', value: 'telefono' },
			{ text: 'Dirección', value: 'direccion' },
			{ text: 'Opciones', value: 'actions', sortable: false },
		],
		proveedores: [],
		editedIndex: -1,
		editedItem: {
			nit: '',
			nombre: '',
			representante:'',
			telefono:'',
			direccion:'',
			estado: true,
		},
		defaultItem: {
			nit: '',
			nombre: '',
			representante:'',
			telefono:'',
			direccion:'',
			estado: true,
		},
		message: null,
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Proveedor' : 'Editar Proveedor';
		},
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
	},

	methods: {
		initialize() {
			this.loading = false;
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
				});
		},

		editItem(item) {
			this.editedIndex = this.proveedores.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			const index = this.proveedores.indexOf(item);
			if (confirm('Seguro que deseas eliminar el Proveedor?')) {
				this.$axios
					.delete('/proveedor/eliminar', item)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.proveedores.splice(index, 1);
					})
					.catch((error) => {
						confirm('Ocurrió un problema al Eliminar.');
					});
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
			if (this.editedIndex > -1) {
				this.$axios
					.put('/proveedor/actualizar', this.editedItem)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						Object.assign(this.proveedores[this.editedIndex], data);
						this.close();
					})
					.catch((error) => {
						this.messageDialog = 'Ocurrió un prolema al actualizar.';
					});
			} else {
				this.$axios
					.post('/proveedor/crear', this.editedItem)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.proveedores.push(data);
						this.close();
					})
					.catch((error) => {
						this.messageDialog = 'Ocurrió un prolema al crear.';
					});
			}
		},
	},
};
</script>