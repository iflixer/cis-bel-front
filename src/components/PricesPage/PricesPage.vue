<template>
  <div class="main__content">
    <div class="content-site">
      <slot name="menu"></slot>
      <div>
        <slot name="header"></slot>
        <main>
          <div class="main">
            <section class="section">
              <div>
                <h2 class="section__title">{{ title }}</h2>
                <div class="section__title-buttons">
                  <div class="section__title-button" @click="clearCache">
                    <i class="icon el-icon-refresh"></i>
                    Очистить кеш
                  </div>
                  <div class="section__title-button" @click="loadMatrix">
                    <i class="icon el-icon-refresh"></i>
                    Обновить данные
                  </div>
                </div>
              </div>
              
              <div class="section__content">
                <div v-if="loading" class="loading-indicator">
                  <el-loading text="Загрузка матрицы цен..."></el-loading>
                </div>

                <div v-else-if="priceMatrix && priceMatrix.length > 0" class="price-matrix">
                  <div class="matrix-info">
                    <p><strong>Базовая цена:</strong> ${{ formatDollars(basePrice) }}</p>
                    <p class="matrix-description">
                      Матрица цен позволяет настроить стоимость просмотра видео для разных географических регионов и типов доменов.
                      Кликните на ячейку для редактирования цены. Цены отображаются в долларах США.
                    </p>
                  </div>

                  <div class="matrix-table-container">
                    <table class="price-matrix-table">
                      <thead>
                        <tr>
                          <th class="matrix-header-corner">Регион / Тип домена</th>
                          <th 
                            v-for="domainType in domainTypes" 
                            :key="domainType.domain_type_name"
                            class="matrix-header-col"
                          >
                            {{ domainType.domain_type_name }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in priceMatrix" :key="row.geo_group_id">
                          <td class="matrix-row-header">
                            {{ row.geo_group_name }}
                          </td>
                          <td 
                            v-for="domainType in domainTypes" 
                            :key="domainType.domain_type_name"
                            class="matrix-cell"
                            @click="openEditModal(row.geo_group_id, row.geo_group_name, domainType.domain_type_name, row.prices[domainType.domain_type_name] ? row.prices[domainType.domain_type_name].price_cents : basePrice)"
                          >
                            <span class="price-value">
                              ${{ formatDollars(row.prices[domainType.domain_type_name] ? row.prices[domainType.domain_type_name].price_cents : basePrice) }}
                            </span>
                            <i class="el-icon-edit price-edit-icon"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-else-if="!loading" class="no-data">
                  <el-alert
                    title="Нет данных"
                    description="Не удалось загрузить матрицу цен. Попробуйте обновить страницу."
                    type="warning"
                    show-icon>
                  </el-alert>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
    <el-dialog
      title="Редактирование цены"
      :visible.sync="editModalVisible"
      width="400px"
      :before-close="closeEditModal"
    >
      <div v-if="editingPriceData">
        <div class="modal-field">
          <label><strong>Географическая группа:</strong></label>
          <p>{{ editingPriceData.geoGroupName }}</p>
        </div>
        
        <div class="modal-field">
          <label><strong>Тип домена:</strong></label>
          <p>{{ editingPriceData.domainType }}</p>
        </div>
        
        <div class="modal-field">
          <label><strong>Цена (USD):</strong></label>
          <el-input-number
            v-model="editingPriceDollars"
            :min="0"
            :precision="2"
            :step="0.01"
            placeholder="0.00"
            style="width: 100%"
          ></el-input-number>
          <small class="price-hint">
            Введите цену в долларах (например: 1.50 для $1.50)
          </small>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditModal">Отмена</el-button>
        <el-button type="primary" @click="savePriceFromModal" :loading="saving">
          Сохранить
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'PricesPage',
  data() {
    return {
      title: 'Управление ценами',
      loading: false,
      saving: false,
      editModalVisible: false,
      editingPriceData: null,
      editingPriceDollars: 0
    };
  },
  computed: {
    ...mapState('prices', [
      'priceMatrix',
      'domainTypes',
      'geoGroups',
      'basePrice'
    ])
  },
  async created() {
    await this.loadMatrix();
  },
  methods: {
    ...mapActions('prices', [
      'fetchPriceMatrix',
      'updatePrice',
      'clearPriceCache'
    ]),

    async loadMatrix() {
      this.loading = true;
      try {
        await this.fetchPriceMatrix();
      } catch (error) {
        this.$message.error('Ошибка загрузки матрицы цен: ' + error.message);
      } finally {
        this.loading = false;
      }
    },

    openEditModal(geoGroupId, geoGroupName, domainType, currentPriceCents) {
      this.editingPriceData = {
        geoGroupId,
        geoGroupName,
        domainType
      };
      this.editingPriceDollars = this.centsToDollars(currentPriceCents);
      this.editModalVisible = true;
    },

    closeEditModal() {
      this.editModalVisible = false;
      this.editingPriceData = null;
      this.editingPriceDollars = 0;
    },

    async savePriceFromModal() {
      if (!this.editingPriceData) return;
      
      this.saving = true;
      try {
        const priceCents = this.dollarsToCents(this.editingPriceDollars);
        
        await this.updatePrice({
          geoGroupId: this.editingPriceData.geoGroupId,
          domainTypeName: this.editingPriceData.domainType,
          priceCents: priceCents
        });
        
        this.$message.success('Цена успешно обновлена');
        this.closeEditModal();

        await this.loadMatrix();
      } catch (error) {
        this.$message.error('Ошибка обновления цены: ' + error.message);
      } finally {
        this.saving = false;
      }
    },

    async clearCache() {
      try {
        await this.clearPriceCache();
        this.$message.success('Кеш цен успешно очищен');
        await this.loadMatrix();
      } catch (error) {
        this.$message.error('Ошибка очистки кеша: ' + error.message);
      }
    },

    centsToDollars(cents) {
      return parseFloat((cents / 100).toFixed(2));
    },

    dollarsToCents(dollars) {
      return Math.round(dollars * 100);
    },

    formatDollars(cents) {
      return (cents / 100).toFixed(2);
    }
  }
};
</script>

<style scoped>
.price-matrix {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.matrix-info {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.matrix-info p {
  margin: 5px 0;
}

.matrix-description {
  color: #666;
  font-size: 14px;
}

.matrix-table-container {
  overflow-x: auto;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.price-matrix-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.price-matrix-table th,
.price-matrix-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ebeef5;
}

.matrix-header-corner {
  background: #f5f7fa;
  font-weight: bold;
  color: #303133;
  position: sticky;
  left: 0;
  z-index: 10;
}

.matrix-header-col {
  background: #f5f7fa;
  font-weight: bold;
  color: #303133;
  min-width: 120px;
}

.matrix-row-header {
  background: #fafafa;
  font-weight: bold;
  color: #303133;
  position: sticky;
  left: 0;
  z-index: 5;
  text-align: left;
  min-width: 150px;
}

.matrix-cell {
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.matrix-cell:hover {
  background: #f0f9ff;
}

.price-value {
  display: inline-block;
  font-weight: 500;
  color: #303133;
}

.price-edit-icon {
  display: none;
  margin-left: 8px;
  color: #409eff;
}

.matrix-cell:hover .price-edit-icon {
  display: inline;
}

.modal-field {
  margin-bottom: 20px;
}

.modal-field label {
  display: block;
  margin-bottom: 5px;
  color: #606266;
  font-size: 14px;
}

.modal-field p {
  margin: 0 0 10px 0;
  color: #303133;
  font-weight: 500;
}

.price-hint {
  display: block;
  margin-top: 5px;
  color: #909399;
  font-size: 12px;
}

.loading-indicator {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data {
  padding: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .matrix-table-container {
    font-size: 12px;
  }
  
  .price-matrix-table th,
  .price-matrix-table td {
    padding: 8px 6px;
  }
  
  .matrix-header-col {
    min-width: 100px;
  }
  
  .matrix-row-header {
    min-width: 120px;
  }
}
</style>