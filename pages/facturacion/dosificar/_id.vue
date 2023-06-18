<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" lg="12">
				<material-card color="blue" title="DOSIFICAR">
					<v-row>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="dos.autorizacion" label="Número de Autorización" outlined dense></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="dos.autorizacion" label="Número de Autorización" outlined dense></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="dos.llave" label="Llave de dosificación" outlined dense></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="dos.llave" label="Llave de dosificación" outlined dense></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6" lg="6">
							<v-text-field
								type="date"
								v-model="dos.fechaLimite"
								label="Fecha límite de emisión"
								outlined
								dense
							></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="6">
							<v-text-field
								type="date"
								v-model="dos.fechaLimite"
								label="Fecha límite de emisión"
								outlined
								dense
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="dos.inicial" label="Nro de factura inicial" outlined dense></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="dos.inicial" label="Nro de factura inicial" outlined dense></v-text-field>
						</v-col>
					</v-row>
					<v-text-field v-model="dos.tramite" label="Nro de trámite" outlined dense></v-text-field>

					<v-text-field v-model="dos.leyenda" label="Leyenda" outlined dense></v-text-field>

					<v-btn
						block
						@click="guardarDosificacion()"
						color="purple"
						dark
						large
					>GENERAR NUEVA DOSIFICACIÓN</v-btn>
				</material-card>
				<material-card color="orange">
					<v-simple-table class="table">
						<template>
							<thead>
								<tr>
									<th class="text-left">#</th>
									<th class="text-left">NRO AUTORIZACION</th>
									<th class="text-left">LLAVE</th>
									<th class="text-left">Fecha Limite</th>
									<th class="text-left">Nro Factura</th>
									<th class="text-left">Estado</th>
									<th class="text-left">OPCIONES</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(dosi,index) in dosificaciones" :key="dosi.autorizacion">
									<td>{{ index+1 }}</td>
									<td>{{ dosi.autorizacion }}</td>
									<td>{{ dosi.llave }}</td>
									<td>{{ dosi.fechaLimite.slice(0, 10) }}</td>
									<td>{{ dosi.nroFactura }}</td>
									<td>{{ dosi.estado }}</td>
									<td>
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
import { validateLogin } from '../../../app/validateLogin';
import swal from 'sweetalert';
export default {
	async asyncData({ store, redirect, $axios }) {
		let result = await validateLogin(store, $axios);
		return result ? { account: '' } : redirect('/login');
		this.dos.sucursal._id = this.$route.params.id;
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
	},
	mounted() {
		this.getDosificacion();
		this.dos.sucursal._id = this.$route.params.id;
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
		dos: {
			autorizacion: '',
			llave: '',
			fechaLimite: '',
			inicial: 0,
			tramite: '',
			leyenda: '',
			sucursal: {
				_id: '',
			},
			estado: 1,
			nroFactura: 1,
			tipo: 'PRINCIPAL',
		},
		dosificaciones: [],
	}),
	methods: {
		getDosificacion() {
			let app = this;
			app.$axios
				.post('/dosificacion/listar', app.dos.sucursal)
				.then((response) => {
					//console.log(response.data);
					app.dosificaciones = response.data;
				})
				.catch((error) => {
					console.log('ERROR EN LA BD ' + error);
				});
		},
		guardarDosificacion() {
			let app = this;
			swal({
				title: 'Estas Seguro?',
				text: 'Reemplazaras la dosificación actual!',
				icon: 'warning',
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
				if (willDelete) {
					if (!app.nuevo) {
						console.log(app.dos);
						app.$axios
							.post('/dosificacion/crear', app.dos)
							.then((res) => {
								app.getDosificacion();
								swal('Exito!', 'Datos modificados!', 'success');
							})
							.catch((e) => {
								console.log(e);
							});
					} else {
						swal('Exito!', 'Creado corretamente!', 'success');
					}
				}
			});
		},
	},
};
</script>
