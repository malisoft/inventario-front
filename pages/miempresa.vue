<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12" lg="6">
				<material-card color="orange" title="DATOS DE LA EMPRESA">
					<v-text-field v-model="miempresa.nombre" label="Nombre de la empresa" required></v-text-field>
					<v-text-field v-model="miempresa.nit" label="Nit de la Empresa"></v-text-field>
					<v-row>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="miempresa.colorOscuro" :counter="7" label="Color Oscuro"></v-text-field>
						</v-col>
						<v-col cols="12" md="6" lg="6">
							<v-text-field v-model="miempresa.colorClaro" :counter="7" label="Color Claro"></v-text-field>
						</v-col>
					</v-row>
					<div class="my-2">
						<v-btn block @click="actualizarEmpresa()" color="purple" dark large>Guardar Cambios</v-btn>
					</div>
				</material-card>
			</v-col>
			<v-col cols="12" lg="6">
				<material-card color="blue" title="LOGO DE LA EMPRESA">DATA: {{miempresa}}</material-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { validateLogin } from '../app/validateLogin';
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
	}),
	methods: {
		complete(index) {
			this.list[index] = !this.list[index];
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
	},
};
</script>
