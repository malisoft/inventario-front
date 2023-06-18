<template>
	<div>
		<v-card>
			<v-toolbar flat>
				<v-toolbar-title>Items en almacenes</v-toolbar-title>
			</v-toolbar>

			<v-tabs fixed-tabs light slider-color="primary">
				<v-tab>Datos del Item</v-tab>
				<v-tab>Texto Producto</v-tab>
				<v-tab>Foto o Imagen</v-tab>

				<v-tab-item>
					<Datos :item="item" />
				</v-tab-item>
				<v-tab-item>
					<!-- <Editor :value="item.textoCliente"></Editor> -->
					<EditorTiny
						api-key="no-api-key"
						:init="{
							height: 500,
							menubar: false,
							plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount'
							],
							toolbar:
							'codesample | bold italic sizeselect fontselect fontsizeselect | hr alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | insertfile undo redo | forecolor backcolor emoticons | code',
						}"
					/>
				</v-tab-item>
				<v-tab-item></v-tab-item>
			</v-tabs>
		</v-card>
	</div>
</template>
<script>
import { validateLogin } from '../../../../app/validateLogin';
import Datos from '../../../../components/inventario/item/datos';
import Editor from '../../../../components/helper/Editor.vue';

import EditorTiny from '@tinymce/tinymce-vue';

export default {
	async asyncData({ error, params, $axios, redirect, store }) {
		let result = await validateLogin(store, $axios);
		if (result) {
			return $axios
				.post(`/item/listar`, { _id: params.id })
				.then((res) => {
					let item = res.data;
					return { item };
				})
				.catch((e) => {
					error({ statusCode: 404, message: 'Producto no existe.' });
				});
		} else {
			return redirect('/login');
		}
	},
	components: {
		Datos,
		Editor,
		EditorTiny,
	},
	created() {},
};
</script>