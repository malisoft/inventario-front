<template>
	<v-dialog v-model="dialog" max-width="600px" persistent>
		<template v-slot:activator="{ on, attrs }">
			<!-- <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Modelo</v-btn> -->
			<v-btn fab small color="primary" class="mt-3 ml-n2" v-bind="attrs" v-on="on">
				<v-icon>add</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title>
				<span class="headline">Nuevo Proveedor</span>
			</v-card-title>

			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12" sm="6" md="6">
							<v-text-field v-model="editedItem.nit" label="Nit"></v-text-field>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-text-field v-model="editedItem.telefono" label="Telefono"></v-text-field>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-text-field v-model="editedItem.direccion" label="Dirección"></v-text-field>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-text-field v-model="editedItem.representante" label="Representante"></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<small class="red--text mx-4">{{message}}</small>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
				<v-btn :loading="loading" color="blue darken-1" text @click="save">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	model: {
		prop: 'proveedor',
		event: 'input',
	},
	props: {
		proveedor: { type: Object },
		proveedores: { type: Array },
	},
	data: () => ({
		message: null,
		dialog: false,
		loading: false,
		editedItem: {
			nit: '',
			nombre: '',
			representante:'',
			telefono:'',
			direccion:'',
			estado: true,
		},
		defaultItem: {
			nit: '',
			nombre: '',
			representante:'',
			telefono:'',
			direccion:'',
			estado: true,
		},
	}),

	watch: {
		dialog(val) {
			val || this.close();
		},
	},

	methods: {
		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
			});
		},
		save() {
			this.$axios
				.post('/proveedor/crear', this.editedItem)
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.proveedores.push(data);
					this.$emit('input', data);
					this.$emit('change');
					this.close();
				})
				.catch((error) => {
					this.message = 'Ocurrio un error';
				});
		},
	},
};
</script>