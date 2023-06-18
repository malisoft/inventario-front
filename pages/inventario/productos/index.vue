<template>
	<v-card flat>
		<v-data-table :headers="headers" :items="productos" sort-by="nombre" class="elevation-1">
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-dialog v-model="dialog" max-width="700px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
								<v-icon left>add</v-icon>Nuevo Producto
							</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="5" md="5">
											<v-text-field v-model="editedItem.nombre" label="Nombre de Producto"></v-text-field>
										</v-col>
										<v-col cols="12" sm="5" md="5">
											<v-select
												v-model="editedItem.categoria"
												:items="categorias"
												:hint="`Descripción de Categoria: ${editedItem.categoria.descripcion}`"
												item-text="nombre"
												item-value="_id"
												label="Categoria"
												persistent-hint
												return-object
												single-line
											></v-select>
										</v-col>
										<v-col cols="12" sm="2" md="2">
											<CategoriaCrear :categorias="categorias" v-model="editedItem.categoria" />
											<!-- <CategoriaCrear :categorias="categorias" :categoria="editedItem.categoria" /> -->
										</v-col>
										<v-col cols="12" sm="6" md="6">
											<v-switch v-model="editedItem.peresedero" label="Producto peresedero"></v-switch>
										</v-col>
									</v-row>	
								</v-container>
							</v-card-text>
							<small class="mx-3 red--text">{{message}}</small>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
								<v-btn :loading="loadingSave" color="blue darken-1" text @click="save">Guardar</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-chip color="blue" dark :to="`/inventario/productos/editar/${item._id}`">
					<v-icon left>settings</v-icon>Editar
				</v-chip>
				<v-btn fab dark small color="purple" :to="`/inventario/productos/${item._id}`">
					<v-icon>mdi-eye</v-icon>
				</v-btn>
				<v-btn fab dark small color="primary" class="ml-2 mr-2" @click="editItem(item)">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
				<v-btn fab small color="error" @click="deleteItem(item)">
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</template>
			<template v-slot:no-data>
				<v-btn :loading="loading" color="primary" @click="initialize">Actualizar</v-btn>
			</template>
		</v-data-table>
	</v-card>
</template>
<script>
import { validateLogin } from '../../../app/validateLogin';
import CategoriaCrear from '../../../components/inventario/categoria/crear';
export default {
	async asyncData({ store, redirect, $axios }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page

		//************NUEW VARIABLES HERE**************/

		//********END DECLARATION OF VARIABLES*********/

		return result ? { account: '' } : redirect('/login');
	},
	components: {
		CategoriaCrear,
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');

		this.initialize();
	},
	data: () => ({
		dialog: false,
		loading: false,
		loadingModelo: false,
		loadingSave:false,
		headers: [
			{ text: 'ID', value: '_id' },
			{ text: 'Codigo', value: 'codigo' },
			{ text: 'Sufijo', value: 'sufijo' },
			{ text: 'Fecha Creado', value: 'createdAt' },
			{
				text: 'Nombre',
				align: 'start',
				sortable: false,
				value: 'nombre',
			},
			{ text: 'Categoria', value: 'categoria.nombre' },
			{ text: 'Opciones', value: 'actions', sortable: false },
		],
		productos: [],
		categorias: [],
		editedIndex: -1,
		editedItem: {
			nombre: '',
			categoria: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			peresedero:true,
		},
		defaultItem: {
			nombre: '',
			categoria: {
				_id: '',
				nombre: '',
				descripcion: '',
			},
			peresedero:true,
		},
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nueva Producto' : 'Editar Producto';
		},
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
	},

	methods: {
		initialize() {
			this.cargarProductos();
			//assets
			this.cargarCategorias();
		},
		cargarProductos() {
			this.loading = true;
			this.$axios
				.post('/item/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.productos = data;
					console.log(data);
					this.loading = false;
				})
				.catch((error) => {
					this.loading = false;
				});
		},
		cargarCategorias() {
			this.message = null;
			this.$axios
				.post('/categoria/listar', { estado: true })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.categorias = data;
				})
				.catch((error) => {
					this.message = 'Ocurrió un error al cargar Categorias.';
				});
		},

		editItem(item) {
			this.editedIndex = this.categorias.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			const index = this.productos.indexOf(item);
			if (confirm('Seguro que quieres eliminar Producto?')) {
				this.$axios
					.post('/item/eliminar', item)
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						//Object.assign(this.categorias[this.editedIndex], this.editedItem);
						this.productos.splice(index, 1);
					})
					.catch((error) => {
						console.error('Ocurrio un error');
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
			this.loadingSave=true;
			if (this.editedIndex > -1) {
				this.$axios
					.put('/item/actualizar', {
						nombre: this.editedItem.nombre,
						categoria: this.editedItem.categoria._id,
					})
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						Object.assign(this.categorias[this.editedIndex], data);
						this.close();
						this.loadingSave=false;
					})
					.catch((error) => {
						this.message = 'Ocurrio un error';
						this.loadingSave=false;
					});
			} else {
				this.$axios
					.post('/item/crear', {
						nombre: this.editedItem.nombre,
						categoria: this.editedItem.categoria._id,
						peresedero:this.editedItem.peresedero
					})
					.then((response) => {
						return response.data;
					})
					.then((data) => {
						this.productos.push(data);
						this.close();
						this.loadingSave=false;
					})
					.catch((error) => {
						this.message = 'Ocurrio un error';
						this.loadingSave=false;
					});
			}
		},
	},
};
</script>