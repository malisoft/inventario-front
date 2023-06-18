<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" lg="12">
				<material-card color="orange">
					<v-simple-table class="table">
						<template>
							<thead>
								<tr>
									<th class="text-left">#</th>
									<th class="text-left">SUCURSAL</th>
									<th class="text-left">CIUDAD</th>
									<th class="text-left">ZONA</th>
									<th class="text-left">ACTIVIDAD</th>
									<th class="text-left">CASA MATRIZ</th>
									<th class="text-left">OPCIONES</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item,index) in sucursales" :key="item.nombre">
									<td>{{ index+1 }}</td>
									<td>{{ item.nombre }}</td>
									<td>{{ item.ciudad }}</td>
									<td>{{ item.zona }}</td>
									<td></td>
									<td>{{ item.casaMatriz }}</td>
									<td>
										<v-btn :to="'./dosificar/'+item._id" color="purple" dark small>
											<v-icon>offline_bolt</v-icon>Dosificar
										</v-btn>

										<v-btn @click="quitarItem(index)" color="red" dark small>
											<v-icon>disabled_by_default</v-icon>
										</v-btn>
									</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
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
	mounted() {
		this.getSucursales();
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
		sucursales: [],
		guardarActivo: 1,
	}),
	methods: {
		getSucursales() {
			let app = this;
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
};
</script>
