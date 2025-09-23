import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

import { Notification } from 'element-ui';

import user from './modules/user';
import tikets from './modules/tikets';
import prices from './modules/prices';
import {router} from '~/router';

const siteUrl = '/api/';

Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    messages: [],
    route: null,
    apiURL: siteUrl
  },
  getters: {},
  mutations: {
    setRoute: (state, payload) => {
      state.route = payload;
    },
    
    delMessages: (state, payload) => {
      state.messages.splice(state.messages.indexOf(payload), 1);
    }
  },
  actions: {

    requestApi: ({state, dispatch, commit}, {url, data = null, method = 'POST'}) => {
      // console.log('Использование requestApi');

      return new Promise((resolve, reject) => {
        if (state.user.token && state.user.token.trim() !== '') {
          axios.defaults.headers.common['Authorization'] = `Bearer ${state.user.token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

        axios({ url: siteUrl + url, data, method})
        .then( async ({data: {data, messages}}) => {

          // dispatch('setMessages', messages);
          if(messages && messages.length > 0 ){
            messages.forEach(element => {
              const notificationType = element.type || element.tupe || 'info';
              Notification({ type: notificationType, title: 'Message', message: element.message, customClass: 'messages-ui' });
            });
          }

          if( messages && messages[0] && messages[0].code == 412){
            console.log('Token expired, attempting refresh...');
            if(await dispatch('resetToken')){
              console.log('Token refreshed successfully, retrying request...');
              const retryResponse = await dispatch('requestApi', {url, data, method});
              resolve(retryResponse);
              return;
            }else{
              console.log('Token refresh failed, redirecting to login...');
              commit('setToken', '');
              commit('setTokenRefresh', '');
              commit('setStatus', '');
              commit('setName', '');
              router.push({name: 'Authorization'});
              reject(new Error('Authentication failed'));
              return;
            }
          }
          
          if(data && data.operation === false){
            reject(data); 
          }else{
            resolve(data);
          }
            
        })
        .catch((error) => {
          console.error('API request failed:', error);
          if (error.response && error.response.status === 401) {
            commit('setToken', '');
            commit('setTokenRefresh', '');
            commit('setStatus', '');
            commit('setName', '');
            router.push({name: 'Authorization'});
          }
          Notification({ type: 'error', title: 'Ошибка', message: error.message || error, customClass: 'messages-ui' });
          reject(error);
        })
      });

    }
  },

  modules: {
    user,
    tikets,
    prices
  },
  strict: true,
  plugins: [createPersistedState({
    storage: window.localStorage,
    reducer: (state) => {
      return {
        user: state.user
      }
    }
  })]
});

window.addEventListener('storage', (e) => {
  if (e.key === 'vuex' && e.newValue) {
    try {
      const newState = JSON.parse(e.newValue);
      if (newState.user) {
        store.commit('setToken', newState.user.token || '');
        store.commit('setTokenRefresh', newState.user.tokenRefresh || '');
        store.commit('setStatus', newState.user.status || '');
        store.commit('setName', newState.user.name || '');
        
        if (!newState.user.token && router.currentRoute.name !== 'Authorization') {
          router.push({name: 'Authorization'});
        }

        else if (newState.user.token &&
                (router.currentRoute.name === 'Authorization' || 
                 router.currentRoute.name === 'Registration' ||
                 router.currentRoute.name === 'ForgotPassword' ||
                 router.currentRoute.name === 'ResetPassword')) {
          router.push({name: 'AdminPanel'});
        }
      }
    } catch (error) {
      console.error('Error parsing storage event:', error);
    }
  }
});

export default store;