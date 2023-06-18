<template>
	<v-card>
		<v-card-title primary-title class="purple justify-center white--text">TRANSPASOS</v-card-title>
		<small class="red--text">{{message}}</small>
		<v-card-text>
			<v-container>
				<v-row align="center" justify="center" dense>
					<v-col cols="12" sm="12" md="12">
						<strong>ALMACEN:</strong>
					</v-col>
					<v-col cols="12" sm="9" md="9">
						<AlmacenSelect v-model="almacen" :sucursal="sucursal" />
					</v-col>
					<v-col cols="12" sm="3" md="3">
						<v-switch v-model="visible" flat :label="`Estado: ${visible?'Visible':'Invisible'}`"></v-switch>
					</v-col>
				</v-row>
				<v-row align="center" justify="center" dense>
					<v-col cols="12" sm="12" md="12">
						<strong>ALMACEN DESTINO:</strong>
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<SucursalSelect v-model="sucursalDestino" :exclude="sucursal" />
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<AlmacenSelect v-model="almacenHasta" :sucursal="sucursalDestino" />
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<v-menu
							v-model="fechaMenu"
							:close-on-content-click="false"
							:nudge-right="40"
							transition="scale-transition"
							offset-y
							min-width="290px"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="fecha"
									label="Fecha"
									prepend-icon="event"
									readonly
									v-bind="attrs"
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker v-model="fecha" @input="fechaMenu = false"></v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<v-textarea v-model="detalle" filled auto-grow label="Detalle" rows="2" row-height="20"></v-textarea>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-text>
			<!-- TABLA PARA LOS PRODUCTOS POR EL ALMACEN EN UNA SUCURSAL -->
			<v-container fluid>
				<v-row>
					<v-col cols="12" sm="7" md="7">
						<v-data-table
							dense
							:headers="headersTranspaso"
							:items="itemsSelected"
							class="elevation-1"
						>
							<template v-slot:top>
								<v-toolbar dense flat color="blue">
									<v-toolbar-title class="white--text">Detalle de transpaso</v-toolbar-title>
								</v-toolbar>
							</template>
							<template v-slot:item.cantidadTransferir="{ item }">
								<v-text-field
									:disabled="item.lotesSelected.length>0?true:false"
									type="number"
									v-model="item.cantidadTransferir"
									class="mb-n2"
									dense
								></v-text-field>
							</template>

							<template v-slot:item.lotes="{ item }">
								<v-chip
									dense
									:color="`${item.lotesSelected.length>0?'blue':'success'}`"
									@click="elegirLotesItems(item)"
								>
									<v-icon left>mdi-library-books</v-icon>
									Lotes {{item.lotesSelected.length}}
								</v-chip>
							</template>
							<template v-slot:item.opciones="{ item }">
								<v-chip 
									dense 
									color="error" 
									@click="quitarSeleccionado(item)"
								>
									<v-icon left>mdi-close</v-icon>Quitar
								</v-chip>
							</template>
						</v-data-table>
					</v-col>
					<v-col cols="12" sm="5" md="5">
						<v-data-table
							:headers="headers"
							:search="searchItem"
							:items="items"
							:loading="loadingProductosAlmacen"
							class="elevation-1"
							dense
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
									<v-toolbar-title class="white--text">Listado de items en el Almacen</v-toolbar-title>
								</v-toolbar>
							</template>
							<template v-slot:item.opciones="{ item }">
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
			<v-btn color="orange" block dark @click="transpasar">TRANSPASAR</v-btn>
		</v-card-actions>
		<v-dialog v-model="dialogLotesItem" max-width="900" persistent>
			<v-card :loading="loadingLotesItem">
				<v-card-title primary-title class="purple justify-center white--text">Elije Lotes a descontar</v-card-title>
				<v-card-text>
					<strong>Producto: {{editedLotesItems.items.nombre}}</strong>
				</v-card-text>
				<v-card-text>
					<v-data-table
						v-model="editedLotesItems.lotesSelected"
						:headers="headersLotesItems"
						:items="editedLotesItems.lotes"
						class="elevation-1"
						:loading="loadingLotesItem"
						show-select
						item-key="_id"
						dense
					>
						<template v-slot:item.cantidadTransferir="{ item }">
							<v-text-field type="number" v-model="item.cantidadTransferir" class="mb-n2" dense></v-text-field>
						</template>
					</v-data-table>
				</v-card-text>
				<v-card-text>
					<strong>Cantidad Total:{{getCantidadTotal}}</strong>
				</v-card-text>

				<v-card-actions>
					<v-btn class="mx-1" color="error" width="50%" @click="cerrarLotesItem">Cancelar</v-btn>
					<v-btn class="mx-1" color="success" width="50%" @click="guardarLotesItem">Aceptar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>

	<!-- <v-btn class="ml-1 mr-1" color="error" width="50%" @click="transpasarCancel">Cancelar</v-btn>
	<v-btn class="mr-1" color="success" width="50%" @click="enviarTranspaso">Enviar</v-btn>-->
</template>

<script>
import { validateLogin } from '../../app/validateLogin';
import AlmacenSelect from '../../components/inventario/ingreso/almacen/select';
import SucursalSelect from '../../components/inventario/ingreso/sucursal/select';
export default {
	components: {
		AlmacenSelect,
		SucursalSelect,
	},
	async asyncData({ store, redirect, $axios }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page

		//************NUEW VARIABLES HERE**************/

		//********END DECLARATION OF VARIABLES*********/

		return result ? { account: '' } : redirect('/login');
	},
	data() {
		return {
			//Mensajes si error
			message: null,

			//Dialogos
			dialogLotesItem: false,

			//loadings
			loadingProductosAlmacen: false,
			loadingLotesItem: false,

			//almacenDesde
			visible: true,
			sucursal: {
				_id: '',
				nombre: '',
			},
			almacen: {
				_id: '',
				nombre: '',
			},

			//almacenHasta
			sucursalDestino: {
				_id: '',
				nombre: '',
			},
			almacenHasta: {
				_id: '',
				nombre: '',
			},
			fecha: new Date().toISOString().substr(0, 10),
			detalle: '',
			fechaMenu: false,

			//Manejadores de Array's de items
			itemsSelected: [],
			items: [],
			//LotesItems: [],
			//LotesItemsSelected: [],
			indexLotesItems: 0,
			editedLotesItems: {
				_id: '',
				/* nombre: '',
				 */
				items: {
					_id: '',
					nombre: '',
				},
				lotes: [],
				lotesSelected: [],
				cantidadTransferir: 0,
			},
			defaultLotesItems: {
				_id: '',
				/* nombre: '',
				 */
				items: {
					_id: '',
					nombre: '',
				},
				lotes: [],
				lotesSelected: [],
				cantidadTransferir: 0,
			},
			//headers para las tablas
			searchItem: '',
			headersLotesItems: [
				{
					text: 'Nro. Lote',
					value: 'lote.nroLote',
					class: 'blue white--text',
				},
				{
					text: 'Vencimiento',
					value: 'lote.fechaVencimiento',
					class: 'blue white--text',
				},
				{
					text: 'Cantidad',
					value: 'cantidad',
					class: 'blue white--text',
				},
				{
					text: 'A Transferir',
					value: 'cantidadTransferir',
					class: 'blue white--text',
				},
			],
			headers: [
				{
					text: 'Codigo',
					value: 'items.codigo',
					class: 'blue white--text',
				},
				{
					text: 'Producto',
					value: 'items.nombre',
					class: 'blue white--text',
				},
				{
					text: 'Cantidad',
					value: 'cantidad',
					class: 'blue white--text',
				},
				{
					text: 'Opciones',
					value: 'opciones',
					class: 'blue white--text',
				},
			],
			headersTranspaso: [
				{
					text: 'Codigo',
					value: 'items.codigo',
					class: 'blue white--text',
				},
				{
					text: 'Producto',
					value: 'items.nombre',
					class: 'blue white--text',
				},
				{
					text: 'Cantidad',
					value: 'cantidad',
					class: 'blue white--text',
				},
				{
					text: 'Cantidad a Transferir',
					value: 'cantidadTransferir',
					class: 'blue white--text',
				},
				{
					text: 'Lotes',
					value: 'lotes',
					class: 'blue white--text',
				},
				{
					text: 'Opciones',
					value: 'opciones',
					class: 'blue white--text',
				},
			],
		};
	},
	computed: {
		getCantidadTotal() {
			this.editedLotesItems.cantidadTransferir = 0;
			this.editedLotesItems.lotesSelected.forEach((element) => {
				this.editedLotesItems.cantidadTransferir =
					this.editedLotesItems.cantidadTransferir + parseInt(element.cantidadTransferir);
			});
			/* this.LotesItemsSelected.forEach((element) => {
				this.editedLotesItems.cantidadTransferir =
					this.editedLotesItems.cantidadTransferir + parseInt(element.cantidadTransferir);
			}); */
			return this.editedLotesItems.cantidadTransferir;
		},
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
		if (this.$store.getters.isSucursal) {
			this.sucursal = this.$store.getters.getSucursal;
		} else {
			this.message = 'No tiene asignado una sucursal.';
		}
	},
	methods: {
		agregarItem(itemTranspasar){
			let consultaSiYaExiste = false;
			this.itemsSelected.forEach((element) => {
				if (itemTranspasar.items._id == element.items._id) consultaSiYaExiste = true;
			});
			if (!consultaSiYaExiste) {
				//this.itemProductoEdited.items = Object.assign({}, item);
				let newItem = {
					items: itemTranspasar.items,
					cantidad: itemTranspasar.cantidad,
					lotes: [],
					lotesSelected: [],
					cantidadTransferir: 0,
				};
				this.itemsSelected.push(newItem);
				//this.itemProductoEdited = Object.assign({}, this.itemProductoDefault);
			} else {
				console.log('ya existe');
			}
		},
		cerrarLotesItem() {
			this.dialogLotesItem = false;
			this.editedLotesItems = Object.assign({}, this.defaultLotesItems);
			//this.editedLotesItems.cantidadTransferir = 0;
			this.indexLotesItems = -1;
			/* this.LotesItems = [];
			this.LotesItemsSelected=[] */
		},
		formatearLotesItem(data) {
			data.forEach((loteItem) => {
				loteItem.cantidadTransferir = 0;
				loteItem.lotesSelected = [];
			});
			this.editedLotesItems.lotes = data;
		},
		guardarLotesItem() {
			Object.assign(this.itemsSelected[this.indexLotesItems], this.editedLotesItems);
			this.cerrarLotesItem();
		},
		elegirLotesItems(item) {
			this.indexLotesItems = this.itemsSelected.indexOf(item);
			//Object.assign(this.editedLotesItems, item);
			this.editedLotesItems = Object.assign({}, item);
			console.log(this.editedLotesItems);
			this.dialogLotesItem = true;
			this.loadingLotesItem = true;
			this.$axios
				.post('/almacenitem/listar', { almacen: this.almacen._id, items: item.items })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.loadingLotesItem = false;
					this.formatearLotesItem(data);
				})
				.catch((error) => {
					this.loadingLotesItem = false;
					this.message = 'Ocurrió un error cargando lotes para el item.';
				});
		},
		quitarSeleccionado(item) {
			const index = this.itemsSelected.indexOf(item);
			this.itemsSelected.splice(index, 1);
		},
		transpasar() {
			console.log({
				sucursalDestino: this.sucursalDestino,
				almacenHasta: this.almacenHasta,
				almacenDesde: this.almacen,
				itemsTranspasar: this.itemsSelected,
			});
			this.$axios
				.post('/movimiento/transpasar', {
					fecha: this.fecha,
					glosa: this.detalle,
					sucursalDestino: this.sucursalDestino,
					almacenHasta: this.almacenHasta,
					almacenDesde: this.almacen,
					itemsTranspasar: this.itemsSelected,
				})
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					//this.loadingProductosAlmacen = false;
					//this.items = data;
				})
				.catch((error) => {
					//this.loadingProductosAlmacen = false;
					this.message = 'Ocurrió un error cargando Los productos de almacen.';
				});
		},
		cargarProductosAlmacen() {
			this.message = null;
			this.loadingProductosAlmacen = true;
			this.$axios
				.post('/almacenitem/listar', { almacen: this.almacen._id })
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.loadingProductosAlmacen = false;
					this.items = data;
				})
				.catch((error) => {
					this.loadingProductosAlmacen = false;
					this.message = 'Ocurrió un error cargando Los productos de almacen.';
				});
		},
	},
	watch: {
		almacen(val) {
			this.cargarProductosAlmacen();
		},
	},
};
</script>