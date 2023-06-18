<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" lg="12">
				<v-card>
					<v-row>
						<v-col cols="12" md="4" lg="4" class="text-center">
							LOGO
							<br />SUCURSAL
						</v-col>
						<v-col cols="12" md="4" lg="4">
							<table>
								<tr>
									<td style="text-align:right">SUCURSAL:</td>
									<td></td>
								</tr>
								<tr>
									<td style="text-align:right">NRO. AUTORIZACIÓN:</td>
									<td></td>
								</tr>
								<tr>
									<td style="text-align:right">FACTURA:</td>
									<td></td>
								</tr>
								<tr>
									<td style="text-align:right">FECHA:</td>
									<td></td>
								</tr>
							</table>
						</v-col>
						<v-col cols="12" md="4" lg="4">
							<table>
								<tr>
									<td style="text-align:right">FECHA LIMITE:</td>
									<td></td>
								</tr>
								<tr>
									<td style="text-align:right">DIAS RESTANTES:</td>
									<td></td>
								</tr>
								<tr>
									<td colspan="2">ACTIVIDAD:</td>
								</tr>
							</table>
						</v-col>
					</v-row>
				</v-card>
				<material-card color="orange">
					<v-row>
						<v-col cols="12" md="6" lg="5">
							<v-text-field v-model="datosFactura.nombre" label="Nit del Cliente" required></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="5">
							<v-text-field v-model="datosFactura.nit" label="Nombre o Razon Social del Cliente"></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="2">
							<v-btn @click="actualizarEmpresa()" color="info" dark large>Clientes</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6" lg="4">
							<v-text-field v-model="item.nombre" :counter="7" label="Producto"></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="1">
							<v-btn @click="actualizarEmpresa()" color="info" dark large>PRODUCTOS</v-btn>
						</v-col>
						<v-col cols="12" md="6" lg="1">
							<v-text-field v-model="item.cantidad" :counter="7" label="Cantidad"></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="1">
							<v-btn @click="item.cantidad++" color="green" dark small>+</v-btn>
							<v-btn @click="item.cantidad--" color="red" dark small>-</v-btn>
						</v-col>
						<v-col cols="12" md="6" lg="4">
							<v-text-field v-model="item.precio" :counter="7" label="Precio"></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="1">
							<v-btn @click="agregarItem()" color="green" dark large>Agregar</v-btn>
						</v-col>
					</v-row>
					<v-simple-table>
						<template>
							<thead>
								<tr>
									<th class="text-left">CODIGO</th>
									<th class="text-left">PRODUCTO</th>
									<th class="text-left">CANTIDAD</th>
									<th class="text-left">COSTO U.</th>
									<th class="text-left">SUBTOTAL</th>
									<th class="text-left">QUITAR</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item,index) in items" :key="item.nombre">
									<td>{{ item.iditem }}</td>
									<td>{{ item.nombre }}</td>
									<td>
										<v-text-field
											v-model="item.cantidad"
											@input="calculaSubtotal(index)"
											type="number"
											outlined
										></v-text-field>
									</td>
									<td>
										<v-text-field
											v-model="item.precio"
											@input="calculaSubtotal(index)"
											type="number"
											suffix="Bs"
											outlined
										></v-text-field>
									</td>
									<td>{{ item.subtotal }}</td>
									<td>
										<v-btn @click="quitarItem(index)" color="red" dark small>
											<v-icon>delete</v-icon>
										</v-btn>
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td colspan="4"></td>
									<th>TOTAL: {{datosFactura.total}} Bs</th>
									<td></td>
								</tr>
							</tfoot>
						</template>
					</v-simple-table>

					<div class="my-2">
						<v-btn block @click="actualizarEmpresa()" color="purple" dark large>FACTURAR</v-btn>
					</div>
				</material-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { validateLogin } from '../../app/validateLogin';
import swal from 'sweetalert';
export default {
	async asyncData({ store, redirect, $axios }) {
		let result = await validateLogin(store, $axios);
		return result ? { account: '' } : redirect('/login');
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
	},
	data: () => ({
		miempresa: {
			_id: '',
			nombre: '',
			nit: '',
			colorOscuro: '',
			colorClaro: '',
		},
		nuevo: false,
		datosFactura: {},
		item: {
			iditem: 0,
			nombre: '',
			cantidad: 1,
			precio: 0,
			total: 0,
		},
		items: [],
		guardarActivo: 1,
	}),
	methods: {
		complete(index) {
			this.list[index] = !this.list[index];
		},

		limpiaItem() {
			let app = this;
			app.item.iditem = 0;
			app.item.nombre = '';
			app.item.cantidad = 1;
			app.item.precio = 0;
			app.item.total = 0;
		},
		agregarItem() {
			let app = this;
			if (app.item.nombre != '') {
				var entra = 'SI';
				app.items.forEach(function (row, indice, array) {
					if (
						row.nombre == app.item.nombre &&
						row.precio == app.item.precio &&
						row.iditem == app.item.iditem
					) {
						row.cantidad = row.cantidad + app.item.cantidad;
						entra = 'NO';
					}
				});
				if (entra == 'SI') {
					let subtotal = app.item.cantidad * app.item.precio;
					app.items.push({
						iditem: app.item.iditem,
						nombre: app.item.nombre,
						cantidad: app.item.cantidad,
						precio: app.item.precio,
						subtotal: subtotal.toFixed(2),
					});
				}

				app.limpiaItem();
				this.canculaTotal();
			} else {
				swal('Error', 'Debe definir un producto antes de agregar', 'error');
			}
		},
		quitarItem(index) {
			this.items.splice(index, 1);
			this.canculaTotal();
		},
		canculaTotal() {
			let app = this;
			var total = 0;
			app.items.forEach(function (row, indice, array) {
				total += parseFloat(row.subtotal);
			});
			//app.datosFactura.total = Math.round(total, -2);
			app.datosFactura.total = parseFloat(total.toFixed(2));
		},
		calculaSubtotal(index) {
			let app = this;
			var subtotal = 0;
			var totalt = 0;
			app.items.forEach(function (item, indice, array) {
				totalt = parseFloat(item.cantidad) * parseFloat(item.precio);
				item.subtotal = totalt.toFixed(2);
				subtotal = subtotal + totalt;
			});
			app.items.total = subtotal.toFixed(2);
			app.canculaTotal();
		},

		getEmpresa() {
			let app = this;
			app.$axios
				.get('/miempresa/ver')
				.then((response) => {
					app.miempresa = response.data;
				})
				.catch((error) => {
					console.log('ERROR EN LA BD');
				});
		},
		actualizarEmpresa() {
			let app = this;
			swal({
				title: 'Estas Seguro?',
				text: 'Se actualizaran los datos en todo el sistema!',
				icon: 'warning',
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
				if (willDelete) {
					if (!app.nuevo) {
						//editar
						app.$axios
							.put('/miempresa/actualizar', app.miempresa)
							.then((res) => {
								//console.log(res.data);
								swal('Exito!', 'Datos modificados!', 'success');
							})
							.catch((e) => {
								console.log(e);
							});
					} else {
						//guardar
						app.$axios
							.post('/miempresa/crear', app.miempresa)
							.then((res) => {
								swal('Exito!', 'Creado corretamente!', 'success');
							})
							.catch((e) => {
								console.log(e);
							});
					}
				}
			});
		},
	},
	mounted() {
		this.getEmpresa();
		this.limpiaItem();
	},
};
</script>
