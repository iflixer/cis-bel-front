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
              </div>
              <div class="section__content">
                <el-row type="flex" class="row-bg controls-section">
                  <el-col :span="24">
                    <div class="stat__data">
                      <div class="data-item stat-search" style="margin-right:20px">
                        <div class="data-item__title">
                          <label class="form__label" style="padding:0">Период</label>
                        </div>
                        <div class="data-item__data period-controls">
                          <el-select
                              class="form__input period-select"
                              v-model="selectedPeriod"
                              value-key="value"
                              @change="onPeriodChange"
                              filterable
                              placeholder="Выберите период">

                            <el-option
                                v-for="(period, index) in availablePeriods"
                                :value="period"
                                :label="period.title"
                                :key="index">
                              <div class="stat-select stat-select-option">
                                <div class="stat-select-title">{{ period.title }}</div>
                              </div>
                            </el-option>

                            <template v-if="selectedPeriod" #prefix>
                              <div class="stat-select stat-select-option-selected prefix">
                                <div class="stat-select-title">{{ selectedPeriod.title }}</div>
                              </div>
                            </template>
                          </el-select>
                          <el-button
                              class="refresh-button"
                              type="primary"
                              @click="loadStats"
                              :loading="loading"
                              icon="el-icon-refresh">
                            {{ loading ? 'Загрузка...' : 'Обновить' }}
                          </el-button>
                        </div>
                      </div>

                      <div class="data-item stat-search" v-if="selectedPeriod && selectedPeriod.value === 'custom'">
                        <div class="data-item__title">
                          <label class="form__label" style="padding:0">Выберите даты</label>
                        </div>
                        <div class="data-item__data">
                          <el-date-picker
                              v-model="customDateRange"
                              type="daterange"
                              range-separator=""
                              start-placeholder="Начальная дата"
                              end-placeholder="Конечная дата"
                              format="dd.MM.yyyy"
                              value-format="yyyy-MM-dd"
                              @change="onCustomDateChange">
                          </el-date-picker>
                        </div>
                      </div>

                    </div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg">
                  <el-col :span="24">
                    <div class="stat__title">Сводка по оплатам</div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg">
                  <el-col :span="8">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ summary.total_views }}</div>
                        <div class="data-item__title">Всего платных просмотров</div>
                      </div>
                    </div>
                  </el-col>

                  <el-col :span="8">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ formatCurrency(summary.total_revenue) }}</div>
                        <div class="data-item__title">Общий доход (USD)</div>
                      </div>
                    </div>
                  </el-col>

                  <el-col :span="8">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ formatCurrency(summary.avg_price_per_view) }}</div>
                        <div class="data-item__title">Средняя цена за 1К просмотров (USD)</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" v-if="domainGeoBreakdown.length > 0">
                  <el-col :span="24">
                    <div class="stat__title">Детализация по доменам и географическим группам</div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg breakdown-section" v-if="domainGeoBreakdown.length > 0">
                  <el-col :span="20">
                    <div v-for="domain in domainGeoBreakdown" :key="domain.domain_id" class="domain-breakdown">
                      <div class="domain-header">
                        <h3>{{ domain.domain_name }}</h3>
                        <div class="domain-summary">
                          <span class="domain-views">{{ domain.total_views }} просмотров</span>
                          <span class="domain-price">{{ formatCurrency(domain.price_per_1k) }}/1K</span>
                          <span class="domain-sum">{{ formatCurrency(domain.total_sum) }}</span>
                        </div>
                      </div>

                      <div class="geo-breakdown-table" v-if="domain.geo_groups.length > 0">
                        <el-table :data="domain.geo_groups" style="width: 100%">
                          <el-table-column prop="geo_group_name" label="Географическая группа"
                                           min-width="150"></el-table-column>
                          <el-table-column prop="views" label="Просмотры" width="150" sortable></el-table-column>
                          <el-table-column
                              prop="price_per_1k"
                              label="Цена за 1К просмотров"
                              width="280"
                              sortable
                              :formatter="formatTableCurrency">
                          </el-table-column>
                          <el-table-column
                              prop="sum"
                              label="Сумма (USD)"
                              width="150"
                              sortable
                              :formatter="formatTableCurrency">
                          </el-table-column>
                        </el-table>
                      </div>

                      <div v-if="domain.geo_groups.length === 0" class="no-geo-data">
                        <p>Нет данных по географическим группам для этого домена</p>
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" v-if="domainGeoBreakdown.length === 0 && !loading">
                  <el-col :span="24">
                    <div class="no-data-message">
                      <i class="el-icon-info"></i>
                      <p>Нет данных для отображения в выбранном периоде</p>
                    </div>
                  </el-col>
                </el-row>

              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientPayStatsPage",
  components: {},
  data: () => ({
    loading: false,

    selectedPeriod: null,
    customDateRange: null,
    availablePeriods: [
      {title: 'Вчера', value: 'yesterday'},
      {title: 'Последние 7 дней', value: '7days'},
      {title: 'Последние 30 дней', value: '30days'},
      {title: 'Выбрать период', value: 'custom'}
    ],

    summary: {
      total_views: 0,
      total_revenue: 0,
      avg_price_per_view: 0
    },

    domainGeoBreakdown: []
  }),

  async created() {
    this.selectedPeriod = this.availablePeriods[2];
    await this.loadStats();
  },

  computed: {
    title() {
      return this.$router.currentRoute.meta.title;
    }
  },

  methods: {
    async loadStats() {
      this.loading = true;

      try {
        const params = {
          period: this.selectedPeriod ? this.selectedPeriod.value : 'yesterday'
        };

        if (this.selectedPeriod && this.selectedPeriod.value === 'custom' && this.customDateRange) {
          params.custom_range = {
            start: this.customDateRange[0],
            end: this.customDateRange[1]
          };
        }

        const response = await this.postMethod("clientpaystats.get", params);

        if (response) {
          const rawSummary = response.summary || {
            total_views: 0,
            total_revenue: 0,
            avg_price_per_view: 0
          };

          this.summary = {
            total_views: rawSummary.total_views,
            total_revenue: this.convertCentsToUSD(rawSummary.total_revenue),
            avg_price_per_view: this.convertCentsToUSD(rawSummary.avg_price_per_view)
          };

          this.domainGeoBreakdown = this.processDomainGeoData(response.domain_breakdown || []);
          if (response.available_periods) {
            this.availablePeriods = response.available_periods;
          }
        }

        if (response && response.messages && response.messages.length > 0) {
          response.messages.forEach(message => {
            this.$message({
              message: message,
              type: 'info'
            });
          });
        }

      } catch (error) {
        console.error('Error loading client pay stats:', error);
        this.$message({
          message: 'Ошибка при загрузке статистики оплат',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    processDomainGeoData(domainBreakdown) {
      return domainBreakdown.map(domain => {
        const processedGeoGroups = (domain.geo_groups || []).map(geo => {
          const priceUSD = this.convertCentsToUSD(geo.watch_price);
          const displayName = `${geo.geo_group_name} ($${priceUSD.toFixed(2)}/1K)`;

          return {
            ...geo,
            geo_group_name: displayName,
            price_per_1k: priceUSD,
            sum: this.convertCentsToUSD(geo.revenue)
          };
        });

        return {
          domain_name: domain.domain_name,
          domain_id: domain.domain_id,
          total_views: domain.total_views,
          total_sum: this.convertCentsToUSD(domain.total_revenue),
          price_per_1k: this.convertCentsToUSD(domain.watch_price),
          geo_groups: processedGeoGroups
        };
      });
    },

    convertCentsToUSD(cents) {
      return cents / 100;
    },

    onPeriodChange() {
      if (this.selectedPeriod && this.selectedPeriod.value !== 'custom') {
        this.customDateRange = null;
        this.loadStats();
      }
    },

    onCustomDateChange() {
      if (this.customDateRange && this.customDateRange.length === 2) {
        this.loadStats();
      }
    },

    formatCurrency(value) {
      if (value === null || value === undefined) {
        return '$0.00';
      }
      return `$${parseFloat(value).toFixed(2)}`;
    },

    formatTableCurrency(row, column, cellValue) {
      return this.formatCurrency(cellValue);
    }
  }
};
</script>

<style lang='scss' scoped>
.el-col {
  margin: 10px;
}


.stat__title {
  font-family: "Montserrat-Medium";
  font-size: 22px;
  padding: 60px 0 15px 0;
}

.stat__data {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}

.data-item {
  padding-right: 20px;
  margin-bottom: 10px;
}

.data-item.stat-search {
  box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  border-radius: 9px;
  padding: 7px 10px;
  min-width: 200px;
}

.data-item__data {
  font-family: "Montserrat-Bold";
  font-size: 30px;
}

.data-item__title {
  font-size: 12px;
  color: #757575;
  margin-bottom: 5px;
}

.controls-section {
  margin-bottom: 20px;
}

.controls-section .stat__data {
  justify-content: flex-start;
  align-items: flex-end;
  gap: 20px;
}

.breakdown-section {
  margin-top: 20px;
}

.domain-breakdown {
  margin-bottom: 30px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.domain-header {
  background-color: #f5f7fa;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.domain-header h3 {
  font-family: "Montserrat-Medium";
  font-size: 18px;
  margin: 0;
  color: #333;
}

.domain-summary {
  display: flex;
  gap: 20px;
  align-items: center;
}

.domain-views {
  font-size: 14px;
  color: #666;
}

.domain-price {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

.domain-sum {
  font-family: "Montserrat-Bold";
  font-size: 16px;
  color: #409eff;
}

.geo-breakdown-table {
  padding: 0;
}

.no-geo-data {
  padding: 20px;
  text-align: center;
  color: #999;
}

.no-data-message {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-data-message i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.no-data-message p {
  font-size: 16px;
  margin: 0;
}

.period-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.period-select {
  flex: 1;
}

.refresh-button {
  flex-shrink: 0;
}

.period-select .el-input__inner {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.period-select .el-input__inner::placeholder {
  color: #c0c4cc !important;
}
</style>

<style lang='scss'>
.el-date-editor {
  width: 100% !important;
}

.stat-search .el-select .el-input .el-input__inner {
  color: transparent;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}

.stat-search .el-select .el-input.is-focus .el-input__inner {
  background-color: #f2f4f8;
  padding-left: 20px;
  position: relative;
  z-index: 1;
  color: #969db7;
}

.stat-search .el-select .el-input .el-input__suffix {
  display: flex;
  align-items: center;
}

.stat-search .el-select .el-input .el-input__prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  left: 0;
  right: 0;
  pointer-events: none;
}

.stat-search .el-select .el-input .el-input__prefix .stat-select.prefix {
  width: 100%;
  justify-content: center;
  text-align: center;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.stat-search .el-select .el-input .el-input__inner::placeholder {
  text-align: center;
  justify-content: center;
  color: #c0c4cc;
}

.stat-select {
  font-family: "Montserrat-Regular";
  font-size: 13px !important;
  cursor: pointer !important;
  user-select: none !important;
}

.stat-select.stat-select-option {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  display: flex !important;
  align-items: center !important;
}

.stat-select.stat-select-option-selected {
  padding-top: 4px !important;
  display: flex !important;
  align-items: center !important;
}

.stat-select-title {
  text-align: left !important;
  line-height: 14px !important;
  font-weight: 700 !important;
}

.stat-select.prefix .stat-select-title {
  color: #44ecb0 !important;
  font-weight: 700 !important;
}
</style>