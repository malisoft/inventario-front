export const validateLogin = async(store, $axios) => {
    store.dispatch("getTokenCookie");
    if (store.getters.isToken) {
        if (store.getters.isUsuario) {
            return true;
        } else {
            let result = await $axios
                .get(`/autologin`)
                .then(res => {
                    return res.data;
                })
                .then(data => {
                    store.dispatch("guardarUsuario", data)
                    return true;
                })
                .catch(e => {
                    return false;;
                });
            return result
        }
    } else {
        store.dispatch("getTokenCookie");
        if (store.getters.isToken) {
            let result = await $axios
                .get(`/autologin`)
                .then(res => {
                    return res.data;
                })
                .then(data => {
                    store.dispatch("guardarUsuario", data)
                    return true;
                })
                .catch(e => {
                    return false;;
                });
            return result
        } else {
            return false
        }

    }

}