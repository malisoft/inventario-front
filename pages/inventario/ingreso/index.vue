<template>
	<v-card id="prueba">
		<v-card-title primary-title class="purple justify-center white--text">ABASTECER</v-card-title>
		<v-card-text>
			<v-container>
				<v-row align="center" justify="center" dense>
					<v-col cols="12" sm="6" md="6">
						<SucursalSelect v-model="sucursal" />
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<AlmacenSelect v-model="almacen" :sucursal="sucursal" />
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<v-menu
							v-model="menuFecha"
							:close-on-content-click="false"
							:nudge-right="40"
							transition="scale-transition"
							offset-y
							min-width="290px"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="lote.fecha"
									label="Fecha"
									prepend-icon="event"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker v-model="lote.fecha" @input="menuFecha = false"></v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<ProveedorSelect v-model="lote.proveedor" />
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<v-select
							v-model="lote.tipo_documento"
							:items="['FACTURA','RECIBO']"
							label="Tipo de Documento"
							required
						></v-select>
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<v-text-field v-model="lote.documento" type="text" label="Documento"></v-text-field>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-text>
			<v-container fluid>
				<v-row>
					<v-col cols="12" sm="7" md="7">
						<v-data-table dense :headers="headersMovimiento" :items="itemsAbastecer" class="elevation-1">
							<template v-slot:top>
								<v-toolbar dense flat color="blue">
									<v-toolbar-title class="white--text">Detalle</v-toolbar-title>
								</v-toolbar>
							</template>
							<template v-slot:item.fechaVencimiento="{ item }">
								<v-text-field
									v-if="!item.items.peresedero"
									v-model="item.fechaVencimiento"
									readonly
									dense
									@click="modificarVencimiento(item)"
								></v-text-field>
							</template>
							<template v-slot:item.cantidad="{ item }">
								<v-text-field
									type="number"
									v-model="item.cantidad"
									class="mb-n2"
									dense
									@input="precioInput(item)"
								></v-text-field>
							</template>
							<template v-slot:item.precio="{ item }">
								<v-text-field
									type="number"
									v-model="item.precio"
									class="mb-n2"
									dense
									@input="precioInput(item)"
								></v-text-field>
							</template>
							<template v-slot:item.precioTotal="{ item }">
								<v-text-field
									type="number"
									v-model="item.precioTotal"
									class="mb-n2"
									dense
									@input="precioTotalInput(item)"
								></v-text-field>
							</template>
							<template v-slot:item.opciones="{ item }">
								<v-chip color="error" @click="quitarItemAbastecer(item)">
									<v-icon left>clear</v-icon>Quitar
								</v-chip>
								<!-- <v-simple-checkbox v-model="item.glutenfree" disabled></v-simple-checkbox> -->
							</template>
						</v-data-table>
					</v-col>
					<v-col cols="12" sm="5" md="5">
						<v-data-table
							:loading="loadingItemsProducto"
							:search="searchItem"
							dense
							:headers="headersProducto"
							:items="itemsProducto"
							class="elevation-1"
						>
							<template v-slot:top>
								<div class="blue">
									<v-text-field
										class="mx-2"
										v-model="searchItem"
										append-icon="search"
										label="Búsqueda"
										single-line
										dark
										hide-details
									></v-text-field>
								</div>

								<v-toolbar dense flat color="blue">
									<v-toolbar-title class="white--text">Listado de todos los items</v-toolbar-title>
								</v-toolbar>
							</template>
							<template v-slot:item.opciones="{ item }">
								<!-- <v-simple-checkbox v-model="item.glutenfree" disabled></v-simple-checkbox> -->
								<v-chip color="purple" dark @click="agregarItem(item)">
									<v-icon>add</v-icon>Agregar
								</v-chip>
							</template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-actions>
			<v-btn
				:loading="loadingAbastecer"
				block
				color="primary"
				@click="ingresarAlmacen"
			>Ingresar a almacen</v-btn>
		</v-card-actions>
		<v-dialog
			ref="dialog"
			v-model="dialogVencimiento"
			:return-value.sync="fechaVencimientoEdited"
			persistent
			width="290px"
		>
			<v-date-picker v-model="fechaVencimientoEdited" scrollable>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="dialogVencimiento = false">Cancelar</v-btn>
				<v-btn text color="primary" @click="guardarVecimiento">Aceptar</v-btn>
			</v-date-picker>
		</v-dialog>
	</v-card>
</template>

<script>
import { validateLogin } from '../../../app/validateLogin';
import AlmacenSelect from '../../../components/inventario/ingreso/almacen/select';
import ProveedorSelect from '../../../components/inventario/proveedor/select';
import SucursalSelect from '../../../components/inventario/ingreso/sucursal/select';

export default {
	async asyncData({ store, redirect, $axios, query }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page

		//************NUEW VARIABLES HERE**************/

		//********END DECLARATION OF VARIABLES*********/
		return result ? { account: '' } : redirect('/login');
	},
	components: {
		AlmacenSelect,
		ProveedorSelect,
		SucursalSelect,
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
		//Your code

		this.cargarItems();
		//this.cargarProveedores();
	},
	mounted() {},
	computed: {},
	data() {
		return {
			menu: false,
			menuFecha: false,
			//modal: false,
			//for vencimiento dialog
			dialogVencimiento: false,
			indexFechaVencimientoEdited: -1,
			fechaVencimientoEdited: new Date().toISOString().substr(0, 10),
			fechaVencimientoDefault: new Date().toISOString().substr(0, 10),

			loadingItemsProducto: false,
			loadingAbastecer: false,
			sucursal: {
				_id: '',
				nombre: '',
				direccion: '',
			},
			sucursalDefault: {
				_id: '',
				nombre: '',
				direccion: '',
			},
			almacen: {
				_id: '',
				nombre: '',
				detalle: '',
			},
			almacenDefault: {
				_id: '',
				nombre: '',
				detalle: '',
			},
			lote: {
				proveedor: {
					_id: '',
					representante: '',
					telefono: '',
				},
				//nroLote: '',
				tipo_documento: 'FACTURA',
				documento: '',
				fecha: new Date().toISOString().substr(0, 10),
				//fechaVencimiento: new Date().toISOString().substr(0, 10),
			},
			loteDefault: {
				proveedor: {
					_id: '',
					representante: '',
					telefono: '',
				},
				nroLote: '',
				tipo_documento: 'FACTURA',
				documento: '',
				fecha: new Date().toISOString().substr(0, 10),
				fechaVencimiento: new Date().toISOString().substr(0, 10),
			},
			headersMovimiento: [
				{
					text: 'Codigo',
					value: 'items.codigo',
					align: 'start',
					class: 'blue white--text',
				},
				{
					text: 'Producto',
					value: 'items.nombre',
					class: 'blue white--text',
				},
				{
					text: 'Fecha Vencimiento',
					value: 'fechaVencimiento',
					class: 'blue white--text',
				},
				{
					text: 'Cantidad',
					value: 'cantidad',
					class: 'blue white--text',
				},
				{
					text: 'Precio Unitario',
					value: 'precio',
					class: 'blue white--text',
				},
				{
					text: 'Precio Total',
					value: 'precioTotal',
					class: 'blue white--text',
				},
				{
					text: 'Opciones',
					value: 'opciones',
					class: 'blue white--text',
					sortable: false,
				},
			],
			searchItem: '',
			itemsAbastecer: [],
			itemsProducto: [],
			itemProductoEdited: {
				items: {
					_id: '',
					codigo: '',
					nombre: '',
					peresedero: true,
				},
				cantidad: 1,
				precio: 1,
				precioTotal: 1,
				fechaVencimiento: new Date().toISOString().substr(0, 10),
			},
			itemProductoDefault: {
				items: {
					_id: '',
					codigo: '',
					nombre: '',
					peresedero: true,
				},
				cantidad: 1,
				precio: 1,
				precioTotal: 1,
				fechaVencimiento: new Date().toISOString().substr(0, 10),
			},
			headersProducto: [
				{
					text: 'Codigo',
					value: 'codigo',
					align: 'start',
					class: 'blue white--text',
				},
				{
					text: 'Producto',
					value: 'nombre',
					class: 'blue white--text',
				},
				{
					text: 'Opciones',
					value: 'opciones',
					class: 'blue white--text',
					sortable: false,
				},
			],
			reporte: {
				miempresa: {
					_id: '',
					nit: '',
				},
				movimiento: {
					_id: '',
					fecha: '',
					dominio: {
						_id: '',
						nombre: '',
					},
					hasta: {
						_id: '',
						nombre: '',
					},
				},
				almacen: {
					_id: '',
					nombre: '',
				},
				movimientodet: [],
			},
		};
	},
	methods: {
		modificarVencimiento(item) {
			this.indexFechaVencimientoEdited = this.itemsAbastecer.indexOf(item);
			this.fechaVencimientoEdited = item.fechaVencimiento;
			this.dialogVencimiento = true;
		},
		guardarVecimiento() {
			this.itemsAbastecer[this.indexFechaVencimientoEdited].fechaVencimiento = this.fechaVencimientoEdited;
			this.dialogVencimiento = false;
		},
		precioTotalInput(item) {
			item.precio = item.precioTotal / item.cantidad;
			item.precio = item.precio.toFixed(2);
		},
		precioInput(item) {
			item.precioTotal = item.precio * item.cantidad;
			item.precioTotal = item.precioTotal.toFixed(2);
		},
		clear() {
			this.sucursal = Object.assign({}, this.sucursalDefault);
			this.almacen = Object.assign({}, this.almacenDefault);
			this.lote = Object.assign({}, this.loteDefault);
			this.itemsAbastecer = [];
		},
		cargarItems() {
			this.loadingItemsProducto = true;
			this.$axios
				.post('/item/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.itemsProducto = data;
					this.loadingItemsProducto = false;
				})
				.catch((error) => {
					console.error(error);
					this.loadingItemsProducto = false;
				});
		},
		agregarItem(item) {
			let consultaSiYaExiste = false;
			this.itemsAbastecer.forEach((itemAbastecer) => {
				if (itemAbastecer.items._id == item._id) consultaSiYaExiste = true;
			});
			if (!consultaSiYaExiste) {
				this.itemProductoEdited.items = Object.assign({}, item);
				this.itemsAbastecer.push(this.itemProductoEdited);
				this.itemProductoEdited = Object.assign({}, this.itemProductoDefault);
			} else {
				console.log('ya existe');
			}
		},
		quitarItemAbastecer(item) {
			const index = this.itemsAbastecer.indexOf(item);
			this.itemsAbastecer.splice(index, 1);
		},
		ingresarAlmacen() {
			this.$swal({
				title: 'Estas Seguro?',
				text: 'Se subira los detalles de abastecimiento de productos.',
				icon: 'warning',
				buttons: true,
				dangerMode: true,
			}).then((willToDoSomething) => {
				if (willToDoSomething) {
					this.loadingAbastecer = true;
					this.$axios
						.post('/abastecer/crear', {
							lote: this.lote,
							sucursal: this.sucursal,
							almacen: this.almacen,
							itemsAbastecer: this.itemsAbastecer,
							movimientoTipo: 'ABASTECER',
						})
						.then((response) => {
							return response.data;
						})
						.then((data) => {
							this.loadingAbastecer = false;
							this.$swal('Exito!', 'Creado corretamente!', 'success');
							let routeData = this.$router.resolve({
								path: '/inventario/ingreso/reporte',
								query: { movimiento: data.movimiento._id },
							});
							window.open(routeData.href, '_blank');
							//this.reporte.miempresa = Object.assign({}, data.miempresa);
							//this.reporte.movimiento = Object.assign({}, data.movimiento);
							//this.reporte.almacen = Object.assign({}, this.almacen);
							//this.reporte.movimientodet = Object.assign({}, this.itemsAbastecer); */
							this.clear();
						})
						.catch((error) => {
							console.error(error);
							this.loadingAbastecer = false;
							this.$swal('Algo Salio mal!', 'No se pudo cargar los datos al servidor.', 'error');
						});
				}
			});
		},
	},
};
</script>