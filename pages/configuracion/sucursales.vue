<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" lg="12">
				<v-snackbar v-model="snackbar" right top color="deep-purple accent-4">
					{{ text }}
					<template v-slot:action="{ attrs }">
						<v-btn color="white" text v-bind="attrs" @click="snackbar = false">Cerrar</v-btn>
					</template>
				</v-snackbar>
				<v-card flat>
					<v-data-table :headers="headers" :items="sucursales" sort-by="nombre" class="elevation-2">
						<template v-slot:top>
							<v-toolbar flat color="white">
								<v-dialog v-model="dialog" max-width="900px">
									<template v-slot:activator="{ on, attrs }">
										<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">NUEVA SUCURSAL</v-btn>
									</template>
									<v-card>
										<v-card-title>
											<span class="headline">{{ formTitle }}</span>
										</v-card-title>

										<v-card-text>
											<v-container>
												<v-row>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														class="mr-2"
														v-model="editSucursal.nombre"
														label="Nombre Sucursal"
														dense
													></v-text-field>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														v-model="editSucursal.direccion"
														label="Dirección"
														dense
													></v-text-field>
												</v-row>
												<v-row>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														class="mr-2"
														v-model="editSucursal.zona"
														label="Zona"
														dense
													></v-text-field>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														v-model="editSucursal.idCiudad"
														label="Ciudad"
														dense
													></v-text-field>
												</v-row>
												<v-row>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														class="mr-2"
														v-model="editSucursal.telefono"
														label="Teléfono"
														dense
													></v-text-field>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														v-model="editSucursal.actividad"
														label="Actividad económica"
														dense
													></v-text-field>
												</v-row>
												<v-row>
													<v-col cols="12" md="6" lg="6">
														<v-switch v-model="editSucursal.web" class="ma-2" label="Mostrar en Pagina web"></v-switch>
													</v-col>
													<v-col cols="12" md="6" lg="6">
														<v-switch v-model="editSucursal.casaMatriz" class="ma-2" label="Casa Matriz"></v-switch>
													</v-col>
												</v-row>
												<v-row>
													<v-col cols="12" md="12" lg="12">
														<v-switch
															v-model="editSucursal.crearAlmacen"
															class="ma-2"
															label="Crear ALMACEN CENTRAL de la Sucursal?"
														></v-switch>
													</v-col>
												</v-row>
												{{editSucursal}}
											</v-container>
										</v-card-text>

										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
											<v-btn color="blue darken-1" text @click="save">Save</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
							</v-toolbar>
						</template>
						<template v-slot:item.web="{ item }">
							<v-chip v-if="item.web" color="primary">SI</v-chip>
							<v-chip v-else color="error">NO</v-chip>
						</template>
						<template v-slot:item.estado="{ item }">
							<v-chip v-if="item.estado" color="primary">Activado</v-chip>
							<v-chip v-else color="error">Desactivado</v-chip>
						</template>
						<template v-slot:item.actions="{ item }">
							<v-chip v-if="!item.estado" color="primary">
								<v-icon>mdi-check</v-icon>Activar
							</v-chip>
							<v-btn fab dark small color="blue" class="ml-2 mr-2" @click="editItem(item)">
								<v-icon>mdi-pencil</v-icon>
							</v-btn>
							<v-btn fab small color="error" @click="deleteItem(item)">
								<v-icon>mdi-delete</v-icon>
							</v-btn>
						</template>
						<template v-slot:no-data>
							<v-btn color="primary" @click="initialize">Actualizar</v-btn>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { validateLogin } from '../../app/validateLogin';
export default {
	async asyncData({ store, redirect, $axios }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		return result ? { account: '' } : redirect('/login');
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
	},
	data: () => ({
		dialog: false,
		headers: [
			{
				text: 'Nombre',
				align: 'start',
				sortable: false,
				value: 'nombre',
			},
			{ text: 'Zona', value: 'zona' },
			{ text: 'Web', value: 'web' },
			{ text: 'Estado', value: 'estado' },
			{ text: 'Opciones', value: 'actions', sortable: false },
		],
		snackbar: false,
		sucursales: [],
		text: '',
		editedIndex: -1,
		editSucursal: {
			miempresa: {
				_id: '',
			},
			nombre: '',
			direccion: '',
			zona: '',
			idcuidad: '',
			telefono: '',
			activad: '',
			idEncargadoPer: '',
			nroVenta: 0,
			nroNota: 0,
			nroGasto: 0,
			web: false,
			latlng: {
				lat: '',
				lng: '',
			},
			nroLote: 0,
			nroCotizacion: 0,
			nroCatalogo: 0,
			casaMatriz: false,
			estado: true,
			crearAlmacen: true,
			auditoria: '',
		},
		defaultItem: {
			miempresa: {
				_id: '',
			},
			nombre: '',
			direccion: '',
			zona: '',
			idcuidad: '',
			telefono: '',
			activad: '',
			idEncargadoPer: '',
			nroVenta: 0,
			nroNota: 0,
			nroGasto: 0,
			web: false,
			latlng: {
				lat: '',
				lng: '',
			},
			nroLote: 0,
			nroCotizacion: 0,
			nroCatalogo: 0,
			casaMatriz: false,
			estado: true,
			crearAlmacen: true,
			auditoria: '',
		},
		miempresa: {},
		message: null,
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nueva Sucursal' : 'Editar Sucursal';
		},
	},
	watch: {
		dialog(val) {
			val || this.close();
		},
	},
	mounted() {},

	created() {
		this.initialize();
	},
	methods: {
		initialize() {
			let app = this;
			this.getEmpresa();
			this.message = null;
			app.$axios
				.post('/sucursal/listar')
				.then((response) => {
					console.log(response.data);
					app.sucursales = response.data;
				})
				.catch((error) => {
					console.log('ERROR EN LA BD');
				});
		},
		getEmpresa() {
			let app = this;
			this.$axios
				.get('/miempresa/ver')
				.then((response) => {
					app.editSucursal.miempresa._id = response.data._id;
				})
				.catch((error) => {
					console.log('ERROR EN LA BD');
				});
		},
		editItem(item) {
			this.editedIndex = this.sucursales.indexOf(item);
			this.editSucursal = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			const index = this.sucursales.indexOf(item);
			if (confirm('Seguro que deseas eliminar el Rol?')) {
				this.$axios
					.delete('/categoria/eliminar', { _id: this.sucursales[index]._id })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.sucursales.splice(index, 1);
					})
					.catch((error) => {
						confirm('Ocurrió un problema al Eliminar.');
					});
			}
		},

		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editSucursal = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save() {
			let app = this;
			if (app.editedIndex > -1) {
				app.$axios
					.put('/sucursal/actualizar', app.editSucursal)
					.then((res) => {
						Object.assign(app.sucursales[app.editedIndex], res.data);
						app.snackbar = true;
						app.text = 'Cambios realizados correctamente';
						app.close();
					})
					.catch((error) => {
						app.messageDialog = 'Ocurrió un prolema al crear un nueva Categoria.';
					});
			} else {
				app.$axios
					.post('/sucursal/crear', app.editSucursal)
					.then((res) => {
						console.log(res.data);
						app.sucursales.push(res.data);
						app.close();
					})
					.catch((error) => {
						app.messageDialog = 'Ocurrió un prolema al crear un nueva Categoria.';
					});
			}
		},
	},
};
</script>