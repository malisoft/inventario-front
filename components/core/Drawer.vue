<template>
	<v-navigation-drawer
		id="app-drawer"
		v-model="inputValue"
		:src="image"
		app
		color="grey darken-2"
		dark
		floating
		mobile-breakpoint="991"
		persistent
		width="260"
	>
		<template v-slot:img="attrs">
			<v-img v-bind="attrs" gradient="to top, rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)" />
		</template>

		<v-list-item two-line>
			<v-list-item-avatar color="white">
				<v-img src="https://cdn.vuetifyjs.com/images/logos/v.png" height="34" width="34" contain />
			</v-list-item-avatar>
			<v-list-item-content>
				<v-list-item-title class="title">{{getUsuario.usuario}}</v-list-item-title>
				<v-list-item-subtitle>{{getUsuario.rol}}</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>

		<v-divider class="mx-3 mb-3" />

		<v-list nav>
			<!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
			<div />
			<v-list-group v-for="(menu, i) in menus" :key="i" :prepend-icon="menu._id.icono" no-action>
				<template v-slot:activator>
					<v-list-item-content>
						<v-list-item-title v-text="menu._id.nombre"></v-list-item-title>
					</v-list-item-content>
				</template>

				<v-list-item
					v-for="subItem in menu.submenus"
					:key="subItem._id.nombre"
					active-class="deep-purple accent-4 white--text"
					:to="subItem._id.url"
				>
					<v-list-item-content>
						<v-list-item-title v-text="subItem._id.nombre"></v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-group>
		</v-list>

		<!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
		<!-- <v-list nav>
			
			<div />

			<v-list-item
				v-for="(link, i) in links"
				:key="i"
				:to="link.to"
				active-class="primary white--text"
			>
				<v-list-item-action>
					<v-icon>{{ link.icon }}</v-icon>
				</v-list-item-action>

				<v-list-item-title v-text="link.text" />
			</v-list-item>
		</v-list>-->

		<template v-slot:append>
			<v-list nav>
				<v-list-item to="#">
					<v-list-item-action>
						<v-icon>mdi-package-up</v-icon>
					</v-list-item-action>
					<v-list-item-title class="font-weight-light">Something else</v-list-item-title>
				</v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex';

export default {
	props: {
		opened: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		menus: [],
	}),

	computed: {
		...mapState('app', ['image', 'color']),
		inputValue: {
			get() {
				return this.$store.state.app.drawer;
			},
			set(val) {
				this.setDrawer(val);
			},
		},
		getUsuario() {
			let { rol, usuario } = this.$store.getters.getUsuario;
			let { menus } = rol;

			this.menus = menus;
			return { usuario, rol: rol.nombre };
		},
	},

	methods: {
		...mapMutations('app', ['setDrawer', 'toggleDrawer']),
	},
};
</script>
