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
					<v-data-table :headers="headers" :items="usuarios" sort-by="nombre" class="elevation-2">
						<template v-slot:top>
							<v-toolbar flat color="white">
								<v-dialog v-model="dialog" max-width="900px">
									<template v-slot:activator="{ on, attrs }">
										<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">NUEVO USUARIO</v-btn>
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
														v-model="editUsuario.nombre"
														label="Carnet"
														dense
													></v-text-field>
													<v-select
														cols="12"
														md="6"
														lg="6"
														:items="departamentos"
														v-model="editUsuario.idciudad"
														item-text="detalle"
														item-value="_id"
														label="Procedencia"
														persistent-hint
														return-object
														single-line
														dense
													></v-select>
												</v-row>
												<v-row>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														class="mr-2"
														v-model="editUsuario.nombre"
														label="Nombre"
														dense
													></v-text-field>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														v-model="editUsuario.direccion"
														label="Apellido"
														dense
													></v-text-field>
												</v-row>
												<v-row>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														class="mr-2"
														v-model="editUsuario.zona"
														label="Teléfono"
														dense
													></v-text-field>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														v-model="editUsuario.idCiudad"
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
														v-model="editUsuario.telefono"
														label="Teléfono"
														dense
													></v-text-field>
													<v-text-field
														cols="12"
														md="6"
														lg="6"
														v-model="editUsuario.actividad"
														label="Actividad económica"
														dense
													></v-text-field>
												</v-row>
												<v-row>
													<v-col cols="12" md="6" lg="6">
														<v-switch v-model="editUsuario.web" class="ma-2" label="Mostrar en Pagina web"></v-switch>
													</v-col>
													<v-col cols="12" md="6" lg="6">
														<v-switch v-model="editUsuario.casaMatriz" class="ma-2" label="Casa Matriz"></v-switch>
													</v-col>
												</v-row>
												<v-row>
													<v-col cols="12" md="12" lg="12">
														<v-switch
															v-model="editUsuario.crearAlmacen"
															class="ma-2"
															label="Crear ALMACEN CENTRAL de la Sucursal?"
														></v-switch>
													</v-col>
												</v-row>
												{{editUsuario}}
											</v-container>
										</v-card-text>

										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
											<v-btn color="blue darken-1" text @click="save">Save</v-btn>
										</v-card-actions>
									</v-card>
								</v-dialog>
								<v-dialog v-model="Dcontrasenia" max-width="500px">
									<v-card>
										<v-card-title>
											<span class="headline">ESTABLECER CONTRASEÑA</span>
										</v-card-title>

										<v-card-text>
											<v-container>
												<v-text-field v-model="editUsuario.nombre" label="Nueva Contraseña" dense></v-text-field>
												<v-text-field v-model="editUsuario.direccion" label="Repita Contraseña" dense></v-text-field>
											</v-container>
										</v-card-text>

										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn color="blue darken-1" text @click="closeContra">Cancelar</v-btn>
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
							<v-btn dark small color="orange" class="ml-2 mr-2" @click="editItemContra(item)">
								<v-icon>mdi-alert</v-icon>Contraseña
							</v-btn>
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
		departamentos: [],
		Dcontrasenia: false,
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
		usuarios: [],
		text: '',
		editedIndex: -1,
		editUsuario: {
			miempresa: {
				_id: '',
			},
			nombre: '',
			direccion: '',
			zona: '',
			idciudad: { _id: '' },
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
			return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario';
		},
	},
	watch: {
		dialog(val) {
			val || this.close();
		},
	},
	mounted() {
		this.getDeparatamentos();
	},

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
					//console.log(response.data);
					app.usuarios = response.data;
				})
				.catch((error) => {
					console.log('ERROR EN LA BD');
				});
		},
		getDeparatamentos() {
			let app = this;
			this.$axios
				.post('/dominio/listar', { tipo: 'DEP' })
				.then((response) => {
					app.departamentos = response.data;
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
					app.editUsuario.miempresa._id = response.data._id;
				})
				.catch((error) => {
					console.log('ERROR EN LA BD');
				});
		},
		editItem(item) {
			this.editedIndex = this.usuarios.indexOf(item);
			this.editUsuario = Object.assign({}, item);
			this.dialog = true;
		},
		editItemContra(item) {
			this.editedIndex = this.usuarios.indexOf(item);
			this.editUsuario = Object.assign({}, item);
			this.Dcontrasenia = true;
		},

		deleteItem(item) {
			const index = this.usuarios.indexOf(item);
			if (confirm('Seguro que deseas eliminar el Rol?')) {
				this.$axios
					.delete('/categoria/eliminar', { _id: this.usuarios[index]._id })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.usuarios.splice(index, 1);
					})
					.catch((error) => {
						confirm('Ocurrió un problema al Eliminar.');
					});
			}
		},
		closeContra() {
			this.Dcontrasenia = false;
			this.$nextTick(() => {
				this.editUsuario = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},
		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editUsuario = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save() {
			let app = this;
			if (app.editedIndex > -1) {
				app.$axios
					.put('/sucursal/actualizar', app.editUsuario)
					.then((res) => {
						Object.assign(app.usuarios[app.editedIndex], res.data);
						app.snackbar = true;
						app.text = 'Cambios realizados correctamente';
						app.close();
					})
					.catch((error) => {
						app.messageDialog = 'Ocurrió un prolema al crear un nueva Categoria.';
					});
			} else {
				app.$axios
					.post('/sucursal/crear', app.editUsuario)
					.then((res) => {
						console.log(res.data);
						app.usuarios.push(res.data);
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