<template>
	<v-app id="inspire">
		<v-data-table :headers="headers" :items="roles" sort-by="nombre" class="elevation-1">
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title>Roles para Cuentas</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="900px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Rol</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="4" md="4">
											<v-text-field v-model="editedItem.nombre" label="Nombre de Rol"></v-text-field>
										</v-col>
										<v-col cols="12" sm="8" md="8">
											<v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<strong>Menu:</strong>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<div v-for="menu in editedItem.menus" :key="menu._id._id">
												<v-switch v-model="menu.activate" :label="menu._id.nombre"></v-switch>
												<div v-for="submenu in menu.submenus" :key="submenu._id._id" class="ml-3">
													<v-checkbox 
													v-model="submenu.activate" 
													color="red"
													:label="submenu._id.nombre">
													</v-checkbox>
												</div>
											</div>
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
			<template v-slot:item.acciones="{ item }">
				<v-chip color="primary" @click="editItem(item)">
					<v-icon left small>settings</v-icon>Configurar
				</v-chip>
				<v-chip color="error">
					<v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
				</v-chip>
			</template>
			<template v-slot:no-data>
				<v-btn color="primary" @click="initialize">Actualizar?</v-btn>
			</template>
		</v-data-table>
	</v-app>
</template>

<script>
import { validateLogin } from '../app/validateLogin';
import { getMenuBase } from '../app/getMenuBase';

export default {
	async asyncData({ store, redirect, $axios }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page
		return result ? { account: '' } : redirect('/login');
	},
	data: () => ({
		dialog: false,
		headers: [
			{
				text: 'Rol',
				align: 'start',
				sortable: false,
				value: 'nombre',
			},
			{
				text: 'Descripción',
				align: 'start',
				sortable: false,
				value: 'descripcion',
			},
			{
				text: 'Acciones',
				sortable: false,
				value: 'acciones',
			},
		],
		roles: [],

		editedIndex: -1,
		editedItem: {
			_id: '',
			nombre: '',
			descripcion: '',
			menus: [],
		},
		defaultItem: {
			_id: '',
			nombre: '',
			descripcion: '',
			menus: [],
		},
		menssageMenu: null,
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Rol' : 'Editar Rol';
		},
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
	},

	created() {
		this.$store.dispatch('getTokenCookie');
		this.initialize();
		this.getMenuBaseDefault();
	},

	methods: {
		getMenuBaseDefault() {
			this.$axios
				.get('/rol/getbase')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					//this.rolBase = data;
					this.defaultItem.menus = data.menus;
					this.editedItem.menus = data.menus;
					this.formatBase(this.defaultItem.menus);
				})
				.catch((error) => {
					this.messageMenu = 'Ocurrio un error';
				});
		},

		initialize() {
			this.message = null;
			this.$axios
				.get('/rol/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.roles = data;
				})
				.catch((error) => {
					this.message = 'Ocurrio un error';
				});
		},

		editItem(item) {
			this.editedIndex = this.roles.indexOf(item);
			this.editedItem = Object.assign({}, item);

			//comparing and formating menus
			let menusEditedItem = this.editedItem.menus;

			this.formatBase(this.defaultItem.menus);
			this.editedItem.menus = this.defaultItem.menus;
			
			menusEditedItem.forEach(menu => {
				this.editedItem.menus.forEach((menuEdited) => {
					if (menu._id._id === menuEdited._id._id) {
						menuEdited.activate = true;
					}
					menu.submenus?.forEach((submenu) => {
						menuEdited.submenus.find((submenuEdited) => {
							if (submenu._id._id === submenuEdited._id._id) {
								submenuEdited.activate = true;
							}
						});
					});
				});
			});

			this.dialog = true;
		},
		//to add  slots to validate if is activated a option in the rolbase menu
		formatBase(menus) {
			menus?.forEach((menu) => {
				menu.activate = false;
				let submenusTemp=[];
				menu.submenus?.forEach((submenu) => {
					submenu.activate = false;
					submenusTemp.push(submenu);
				});
				menu.submenus=submenusTemp;
			});
		},
		deleteItem(item) {
			const index = this.roles.indexOf(item);
			if (confirm('Seguro que deseas eliminar el Rol?')) {
				this.$axios
					.delete('/rol/eliminar', { _id: this.roles[index]._id })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.roles.splice(index, 1);
					})
					.catch((error) => {
						confirm('Ocurrió un problema al Eliminar.');
					});
			}
		},
		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.formatBase(this.defaultItem.menus);
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save() {
			let menuFormateado = getMenuBase(this.defaultItem.menus);
			let nuevoRol = {
				_id: this.editedItem._id,
				nombre: this.editedItem.nombre,
				descripcion: this.editedItem.descripcion,
				menus: menuFormateado,
			}; 

			if (this.editedIndex > -1) {
				this.$axios
					.post('/rol/actualizar', nuevoRol)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						Object.assign(this.roles[this.editedIndex], data);
						this.close();
					})
					.catch((error) => {
						this.messageDialog = 'Ocurrió un prolema al crear un nuevo Rol.';
					});
			} else {
				this.$axios
					.post('/rol/crear', nuevoRol)
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						this.roles.push(data);
						this.close();
					})
					.catch((error) => {
						this.messageDialog = 'Ocurrió un prolema al crear un nuevo Rol.';
					});
			}
		},
	},
};
</script>