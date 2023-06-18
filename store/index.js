export const state = () => ({
    sidebar: false,
    token: null,
    usuario: {
        rol: {
            menus: []
        }

    },

});

export const mutations = {
    toggleSidebar(state) {
        state.sidebar = !state.sidebar;
    },
    setToken(state, token) {
        state.token = token;
    },
    setUsuario(state, usuario) {
        state.usuario = usuario;
    },
};

export const actions = {
    guardarToken(state, token) {
        this.commit("setToken", token);
    },
    guardarUsuario(state, usuario) {
        this.commit("setUsuario", usuario);
    },
    getTokenCookie(state) {
        let token = this.$cookies.get("token");
        this.$axios.defaults.headers.common["auth-token"] = token;
        this.commit("setToken", token);
    }

};

export const getters = {
    isToken(state) {
        return state.token ? true : false;
    },
    isUsuario(state) {
        return state.usuario.usuario ? true : false;
    },
    isSucursal(state) {
        return state.usuario.sucursal ? true : false;
    },
    getSucursal(state) {
        return state.usuario.sucursal;
    },
    getUsuario(state) {
        return state.usuario;
    }
};