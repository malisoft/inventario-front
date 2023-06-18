<template>
	<v-dialog v-model="dialog" max-width="600px" persistent>
		<template v-slot:activator="{ on, attrs }">
			<v-btn fab small color="primary" class="mt-3 ml-n2" v-bind="attrs" v-on="on">
				<v-icon>add</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title>
				<span class="headline">Nueva Marca</span>
			</v-card-title>

			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12" sm="5" md="5">
							<v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
						</v-col>
						<v-col cols="12" sm="7" md="7">
							<v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>

			<v-card-text class="headline">Modelos</v-card-text>

			<v-card-text>
				<!-- <Modelo :_id="editedItem._id" :modelos="modelos" :editedMarca="editedIndex" ref="modelos" /> -->
				<Modelo :_id="editedItem._id" :modelos="editedItem.modelos" :editedMarca="-1" />
			</v-card-text>

			<small class="red--text mx-4">{{message}}</small>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
				<v-btn color="blue darken-1" :loading="loadingSave" text @click="save">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import Modelo from '../../../components/inventario/modelo/index';
export default {
	model: {
		prop: 'marca',
		event: 'input',
	},
	props: {
		marca: { type: Object },
		marcas: { type: Array },
	},
	components: {
		Modelo,
	},

	data: () => ({
		loadingSave: false,
		message: null,
		dialog: false,
		loading: false,
		editedItem: {
			_id: '',
			nombre: '',
			descripcion: '',
			modelos: [],
		},
		defaultItem: {
			_id: '',
			nombre: '',
			descripcion: '',
			modelos: [],
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
			this.loadingSave = true;
			this.$axios
				.post('/marca/crear', this.editedItem)
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					this.marcas.push(data);
					this.$emit('input', data);
					this.loadingSave = false;
					this.close();
				})
				.catch((error) => {
					this.loadingSave = false;
					this.message = 'Ocurrio un error';
				});
		},
	},
};
</script>