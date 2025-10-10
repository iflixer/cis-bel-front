export default {
  state: {
    token: '',
    tokenRefresh: '',
    status: '',
    name: '',
    isRefreshingToken: false,
    lastAuthCheck: null,
    authCheckCache: false
  },
  getters: {

  },
  mutations: {
    setToken(state, payload){
      state.token = payload;
      state.lastAuthCheck = null;
      state.authCheckCache = false;
    },
    setTokenRefresh(state, payload){
      state.tokenRefresh = payload;
    },
    setStatus(state, payload){
        state.status = payload;
    },
    setName(state, payload){
        state.name = payload;
    },
    setRefreshingToken(state, payload){
        state.isRefreshingToken = payload;
    },
    setAuthCheckCache(state, payload){
        state.authCheckCache = payload;
        state.lastAuthCheck = Date.now();
    }
  },

  actions: {
    userRegistr: ({commit, dispatch}, user) => {
      return new Promise((resolve) => {
        dispatch('requestApi', {url: 'oauth/registr', data: user})
        .then(({bearer_token, refresh_token, right, name}) => {
          commit('setToken', bearer_token);
          commit('setTokenRefresh', refresh_token);
          commit('setStatus', right);
          commit('setName', name);
          resolve();
        }).catch((error) => {
          console.log(error);
        })
      });
    },

    userForgotPassword: ({commit, dispatch}, user) => {
      return new Promise((resolve) => {
        dispatch('requestApi', {url: 'oauth/forgot-password', data: user})
        .then(({bearer_token, refresh_token, right, name}) => {
          commit('setToken', bearer_token);
          commit('setTokenRefresh', refresh_token);
          commit('setStatus', right);
          commit('setName', name);
          resolve();
        }).catch((error) => {
          console.log(error);
        })
      });
    },

    userResetPassword: ({commit, dispatch}, user) => {
      return new Promise((resolve) => {
        dispatch('requestApi', {url: 'oauth/reset-password', data: user})
        .then(({bearer_token, refresh_token, right, name}) => {
          commit('setToken', bearer_token);
          commit('setTokenRefresh', refresh_token);
          commit('setStatus', right);
          commit('setName', name);
          resolve();
        }).catch((error) => {
          console.log(error);
        })
      });
    },

    userLogin: ({commit, dispatch}, user) => {
      return new Promise((resolve) => {
        dispatch('requestApi', {url: 'oauth/login', data: user})
        .then(({bearer_token, refresh_token, right, name}) => {
          commit('setToken', bearer_token);
          commit('setTokenRefresh', refresh_token);
          commit('setStatus', right);
          commit('setName', name);
          resolve();
        }).catch((error) => {
          console.log(error);
        })
      });
    },

    userLogout: ({commit, dispatch}) => {
      return new Promise((resolve) => {
          dispatch('requestApi', {url: 'oauth/exits', data: {}})
          .then(() => {
            commit('setToken', '');
            commit('setTokenRefresh', '');
            commit('setStatus', '');
            commit('setName', '');
            resolve();
          }).catch((error) => {
            console.log(error);
          })
      });
    },

    resetToken: async ({state, dispatch, commit}) => {
      console.log('Использование resetToken');

      if(state.isRefreshingToken){
        console.log('Token refresh already in progress, waiting...');
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if(!state.isRefreshingToken){
              clearInterval(checkInterval);
              resolve(state.token && state.token.trim() !== '');
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve(false);
          }, 5000);
        });
      }

      if(state.tokenRefresh != ''){
        commit('setRefreshingToken', true);
        try{
          const response = await dispatch('requestApi', {url: 'oauth/token', data: {token: state.tokenRefresh}});
          commit('setToken', response.bearer_token);
          commit('setAuthCheckCache', true);
          return true;
        }catch(e){
          commit('setAuthCheckCache', false);
          return false;
        }finally{
          commit('setRefreshingToken', false);
        }
      }else{
        return false;
      }
    },

    isAuth: async ({state, dispatch, commit}) => {
      console.log('Использование isAuth');

      const cacheTimeout = 2000;
      if(state.lastAuthCheck && (Date.now() - state.lastAuthCheck) < cacheTimeout){
        console.log('Using cached auth result:', state.authCheckCache);
        return state.authCheckCache;
      }

      if(state.token && state.token.trim() !== '' && state.token !== '123'){
        commit('setAuthCheckCache', true);
        return true;
      }

      if(state.tokenRefresh && state.tokenRefresh.trim() !== ''){
        const refreshResult = await dispatch('resetToken');
        return refreshResult;
      }

      commit('setAuthCheckCache', false);
      return false;
    }
  }
}