<template>
	<v-app>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col cols="12" sm="8" md="4">
					<v-card class="elevation-12">
						<v-toolbar color="primary" dark flat>
							<v-toolbar-title>Login form</v-toolbar-title>
						</v-toolbar>
						<v-card-text>
							<v-form>
								<v-text-field
									label="Login"
									name="login"
									prepend-icon="mdi-account"
									type="text"
									v-model="account.usuario"
								></v-text-field>

								<v-text-field
									id="password"
									label="Password"
									name="password"
									prepend-icon="mdi-lock"
									type="password"
									v-model="account.password"
								></v-text-field>
							</v-form>
						</v-card-text>
						<small class="mx-2 red--text">{{message}}</small>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="login">Login</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script>
import { validateLogin } from "../app/validateLogin";
export default {
	layout: 'blank',
	async asyncData({ route, store, $axios ,redirect}) {

		let result = await validateLogin(store,$axios);
		console.log(result);
		let account = {
			usuario: '',
			password: '',
		};
		let message = null;
		return !result?{account,message} : redirect("/");
		/* 
		
		store.dispatch('autoLogin');
		return store.getters.isLogged?redirect('/'):{account,message} */
	},

	methods: {
		login() {
			//we make the login with the api and redirect if it's true to home page /
			this.message = null;
			this.$axios
				.post('/login', this.account)
				.then((response) => {
					return response.data;
				})
				.then((data) => {
					let { authToken } = data;
					this.$store.dispatch('guardarToken', authToken);
					this.$cookies.set('token', authToken);
					this.$router.push('/');
				})
				.catch((error) => {
					this.message = error.response ? error.response.data.message : 'Ocurrio un error.';
				});
		},
	},
};
</script>
