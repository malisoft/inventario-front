<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" lg="12">
				<material-card color="orange" title="CODIGOS DE CONTROL">
					<v-simple-table>
						<template>
							<thead>
								<tr>
									<th class="text-left">NRO. AUTORIZACION</th>
									<th class="text-left">NRO. FACTURA</th>
									<th class="text-left">NIT CLIENTE</th>
									<th class="text-left">FECHA</th>
									<th class="text-left">MONTO</th>
									<th class="text-left">LLAVE DE DOSIFICACIÓN</th>
									<th class="text-left">GENERAR</th>
									<th class="text-left">COD. CONTROL</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item,index) in items" :key="item.nombre">
									<td>
										<v-text-field
											v-model="item.autorizacion"
											dense
											outlined
											label="Nro. Autorizacion"
											autocomplete="off"
										></v-text-field>
									</td>
									<td>
										<v-text-field
											v-model="item.factura"
											dense
											outlined
											label="Nro. Factura"
											autocomplete="off"
										></v-text-field>
									</td>
									<td>
										<v-text-field v-model="item.nit" dense outlined label="Nit Cliente" autocomplete="off"></v-text-field>
									</td>
									<td>
										<v-text-field
											v-model="item.fecha"
											dense
											outlined
											label="Nro. Autorizacion"
											autocomplete="off"
											type="date"
										></v-text-field>
									</td>
									<td>
										<v-text-field
											v-model="item.monto"
											dense
											outlined
											label="Monto de la transacción"
											autocomplete="off"
										></v-text-field>
									</td>
									<td>
										<v-text-field
											v-model="item.llave"
											dense
											outlined
											label="LLave de Dosificación"
											autocomplete="off"
										></v-text-field>
									</td>
									<td>
										<v-btn @click="calculaControl(index)" color="purple" dark>
											<v-icon>flash_on</v-icon>
										</v-btn>
									</td>
									<td>
										<v-text-field
											v-model="item.control"
											dense
											outlined
											disabled
											label="CODIGO DE CONTROL"
											autocomplete="off"
										></v-text-field>
									</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>

					<div class="my-2">
						<v-btn block @click="agregarItem()" color="blue" dark large>
							<v-icon>gamepad</v-icon>AGREGAR PRUEBA
						</v-btn>
					</div>
					{{items}}
				</material-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { validateLogin } from '../../app/validateLogin';

import { controlCode } from '../../app/codigoControl/cc';

import swal from 'sweetalert';
import moment from 'moment';
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
		items: [],
	}),
	methods: {
		agregarItem() {
			let app = this;
			app.items.push({
				autorizacion: '',
				factura: '',
				nit: '',
				fecha: '',
				fechaMod: '',
				monto: '',
				montoTotal: '',
				llave: '',
				control: '',
			});
		},
		calculaControl(index) {
			let app = this;
			try {
				app.items.forEach(function (item, indice, array) {
					if (index == indice) {
						var fechaF = new Date(item.fecha);
						var ano = fechaF.getFullYear();
						var mes = fechaF.getMonth() + 1;
						var dia = fechaF.getDate() + 1;
						if (mes < 10) mes = '0' + mes;
						if (dia < 10) dia = '0' + dia;

						let fechaHoy = ano + '' + mes + '' + dia;
						item.fechaMod = fechaHoy;
						item.montoTotal = Math.round(item.monto);
						item.control = controlCode(
							item.autorizacion,
							item.factura,
							item.nit,
							fechaHoy,
							item.montoTotal,
							item.llave
						);
					}
				});
			} catch (error) {
				console.log(error);
			}
		},
	},
	mounted() {},
};
</script>
