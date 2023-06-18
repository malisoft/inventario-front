<template>
	<v-card outlined flat elevation-10 class="mx-2 my-2">
		<v-card-title elevation-10>Precios</v-card-title>
		<v-card-text>
			<v-text-field v-for="precio in precios" :key="precio._id"  type="number" label="Precio por mayor" outlined color></v-text-field>
		</v-card-text>
	</v-card>
</template>
<script>
export default {
	props: {
		item: { type: Object, required: true },
	},
	data() {
		return {
			precios: [],
		};
	},
	created() {
        this.initialize();
        //this.loadPrecioItem();
	},
	methods: {
		initialize() {
			this.$axios
				.post('/precio/listar')
				.then((response) => {
					return response.data;
				})
				.then((data) => {
                    //console.log(data);
                    this.precios=data;
				});
		},
	},
};
</script>