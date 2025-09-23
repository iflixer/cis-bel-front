import axios from 'axios';

const state = {
  priceMatrix: [],
  domainTypes: [],
  geoGroups: [],
  basePrice: 0,
  loading: false,
  error: null
};

const mutations = {
  SET_PRICE_MATRIX(state, matrix) {
    state.priceMatrix = matrix;
  },
  SET_DOMAIN_TYPES(state, types) {
    state.domainTypes = types;
  },
  SET_GEO_GROUPS(state, groups) {
    state.geoGroups = groups;
  },
  SET_BASE_PRICE(state, price) {
    state.basePrice = price;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  UPDATE_PRICE_IN_MATRIX(state, { geoGroupId, domainTypeName, priceCents }) {
    const matrixRow = state.priceMatrix.find(row => row.geo_group_id === geoGroupId);
    if (matrixRow && matrixRow.prices[domainTypeName]) {
      matrixRow.prices[domainTypeName].price_cents = priceCents;
    }
  }
};

const actions = {
  async fetchPriceMatrix({ commit, rootState }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const response = await axios({
        method: 'post',
        url: `${rootState.apiURL}front/prices.getMatrix`,
        headers: {
          'Authorization': `Bearer ${rootState.user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.data) {
        const data = response.data.data;
        commit('SET_PRICE_MATRIX', data.matrix || []);
        commit('SET_DOMAIN_TYPES', data.domain_types || []);
        commit('SET_GEO_GROUPS', data.geo_groups || []);
        commit('SET_BASE_PRICE', data.base_price || 0);
      }

      if (response.data.messages && response.data.messages.length > 0) {
        response.data.messages.forEach(message => {
          if (message.tupe === 'error') {
            throw new Error(message.message);
          }
        });
      }

      return response.data;
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || 'Ошибка загрузки матрицы цен';
      commit('SET_ERROR', errorMessage);
      throw new Error(errorMessage);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updatePrice({ commit, rootState }, { geoGroupId, domainTypeName, priceCents }) {
    try {
      const formData = new FormData();
      formData.append('geo_group_id', geoGroupId);
      formData.append('domain_type_name', domainTypeName);
      formData.append('price_cents', priceCents);

      const response = await axios({
        method: 'post',
        url: `${rootState.apiURL}front/prices.update`,
        headers: {
          'Authorization': `Bearer ${rootState.user.token}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      });

      if (response.data.messages && response.data.messages.length > 0) {
        response.data.messages.forEach(message => {
          if (message.tupe === 'error') {
            throw new Error(message.message);
          }
        });
      }

      commit('UPDATE_PRICE_IN_MATRIX', { geoGroupId, domainTypeName, priceCents });

      return response.data;
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || 'Ошибка обновления цены';
      throw new Error(errorMessage);
    }
  },

  async clearPriceCache({ rootState }) {
    try {
      const response = await axios({
        method: 'post',
        url: `${rootState.apiURL}front/prices.clearCache`,
        headers: {
          'Authorization': `Bearer ${rootState.user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.messages && response.data.messages.length > 0) {
        response.data.messages.forEach(message => {
          if (message.tupe === 'error') {
            throw new Error(message.message);
          }
        });
      }

      return response.data;
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || 'Ошибка очистки кеша';
      throw new Error(errorMessage);
    }
  },

  async getPrice({ rootState }, { geoGroupId, domainType }) {
    try {
      const formData = new FormData();
      formData.append('geo_group_id', geoGroupId);
      formData.append('domain_type', domainType);

      const response = await axios({
        method: 'post',
        url: `${rootState.apiURL}front/prices.getPrice`,
        headers: {
          'Authorization': `Bearer ${rootState.user.token}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      });

      if (response.data.messages && response.data.messages.length > 0) {
        response.data.messages.forEach(message => {
          if (message.tupe === 'error') {
            throw new Error(message.message);
          }
        });
      }

      return (response.data.data && response.data.data.price_cents) || 0;
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || 'Ошибка получения цены';
      throw new Error(errorMessage);
    }
  },

  async getDomainTypes({ commit, rootState }) {
    try {
      const response = await axios({
        method: 'post',
        url: `${rootState.apiURL}front/prices.getDomainTypes`,
        headers: {
          'Authorization': `Bearer ${rootState.user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.data) {
        commit('SET_DOMAIN_TYPES', response.data.data);
      }

      if (response.data.messages && response.data.messages.length > 0) {
        response.data.messages.forEach(message => {
          if (message.tupe === 'error') {
            throw new Error(message.message);
          }
        });
      }

      return response.data.data;
    } catch (error) {
      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message || 'Ошибка получения типов доменов';
      throw new Error(errorMessage);
    }
  }
};

const getters = {
  getPriceForGeoAndDomain: (state) => (geoGroupId, domainTypeName) => {
    const row = state.priceMatrix.find(r => r.geo_group_id === geoGroupId);
    if (row && row.prices[domainTypeName]) {
      return row.prices[domainTypeName].price_cents;
    }
    return state.basePrice;
  },
  
  getDomainTypeNames: (state) => {
    return state.domainTypes.reduce((acc, type) => {
      acc[type.domain_type] = type.domain_type_name;
      return acc;
    }, {});
  },
  
  getGeoGroupNames: (state) => {
    return state.geoGroups.reduce((acc, group) => {
      acc[group.id] = group.name;
      return acc;
    }, {});
  },
  
  isLoading: (state) => state.loading,
  hasError: (state) => !!state.error,
  getError: (state) => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};