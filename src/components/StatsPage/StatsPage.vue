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

                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="24">
                    <div class="stat__title">Пользователи</div>
                  </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="24">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ countUsers }}</div>
                        <div class="data-item__title">Всего пользователей</div>
                      </div>
                    </div>

                    <div class="chart">
                      <apexchart type="area" height="350" :options="chartOptions" :series="usersStat"></apexchart>
                    </div>

                  </el-col>
                </el-row>


                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="24">
                    <div class="stat__title">API</div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="12">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ reqwest }}</div>
                        <div class="data-item__title">Среднее число запросов</div>
                      </div>
                    </div>

                    <div class="chart">
                      <apexchart type="area" height="350" :options="chartOptions" :series="apiStat"></apexchart>
                    </div>
                    
                  </el-col>

                  <el-col :span="12">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ loading }}%</div>
                        <div class="data-item__title">Средняя нагрузка</div>
                      </div>
                    </div>

                    <div class="chart">
                      <apexchart type="area" height="350" :options="chartOptions" :series="systemStat"></apexchart>
                    </div>

                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="24">
                    <div class="stat__title">Просмотры</div>
                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" style="float:left">
                  <el-col :span="24" style="width:auto !important">
                    
                    <div class="stat__data">
                      
                      <div class="data-item stat-search" style="margin-right:20px" v-if="isRight">
                        <div class="data-item__title">
                          <label class="form__label" style="padding:0">Пользователь</label>
                        </div>
                        <div class="data-item__data">

                          <el-select
                            class="form__input"
                            v-model="userQuery"
                            value-key="value"
                            @change="onChangeUser"
                            filterable
                            collapse-tags
                            v-if="isNotUserStat"
                            placeholder="">

                            <el-option v-for="(item, index) in statusers" :value="item" :label="item.value" :key="index">
                              <div class="stat-select stat-select-option">
                                <div class="stat-select-title">{{ item.title }} <span style="color:#9da0a7">({{ item.score }} ₽)</span></div>
                                <div class="stat-select-info">Сегодня: <span style="">{{ item.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ item.viewads }}</span></div>
                              </div>
                            </el-option>

                            <template v-if="userQuery" #prefix>
                              <div class="stat-select stat-select-option-selected prefix">
                                <div class="stat-select-title">{{ userQuery.title }} <span style="color:#9da0a7">({{ userQuery.score }} ₽)</span></div>
                                <div class="stat-select-info">Сегодня: <span style="">{{ userQuery.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ userQuery.viewads }}</span></div>
                              </div>
                            </template>

                          </el-select>

                          <el-select
                            class="form__input"
                            v-model="userQuery"
                            value-key="value"
                            @change="onChangeUser"
                            filterable
                            collapse-tags
                            v-if="isUserStat"
                            disabled
                            placeholder="">

                            <el-option v-for="(item, index) in statusers" :value="item" :label="item.value" :key="index">
                              <div class="stat-select stat-select-option">
                                <div class="stat-select-title">{{ item.title }} <span style="color:#9da0a7">({{ item.score }} ₽)</span></div>
                                <div class="stat-select-info">Сегодня: <span style="">{{ item.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ item.viewads }}</span></div>
                              </div>
                            </el-option>

                            <template v-if="userQuery" #prefix>
                              <div class="stat-select stat-select-option-selected prefix">
                                <div class="stat-select-title">{{ userQuery.title }} <span style="color:#9da0a7">({{ userQuery.score }} ₽)</span></div>
                                <div class="stat-select-info">Сегодня: <span style="">{{ userQuery.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ userQuery.viewads }}</span></div>
                              </div>
                            </template>

                          </el-select>

                        </div>
                      </div>

                      <div class="data-item stat-search" style="margin-right:20px">
                        <div class="data-item__title">
                          <label class="form__label" style="padding:0">Домен или Телеграм канал</label>
                        </div>
                        <div class="data-item__data">

                          <el-select
                            class="form__input"
                            v-model="domainQuery"
                            value-key="value"
                            @change="onChangeDomain"
                            filterable
                            collapse-tags
                            placeholder="">

                            <el-option v-for="(item, index) in statdomains" :value="item" :label="item.value" :key="index">
                              <div class="stat-select stat-select-option">
                                <div class="stat-select-title">{{ item.title }}</div>
                                <div class="stat-select-info">Сегодня: <span style="">{{ item.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ item.viewads }}</span></div>
                              </div>
                            </el-option>

                            <template v-if="domainQuery" #prefix>
                              <div class="stat-select stat-select-option-selected prefix">
                                <div class="stat-select-title">{{ domainQuery.title }}</div>
                                <div class="stat-select-info">Сегодня: <span style="">{{ domainQuery.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ domainQuery.viewads }}</span></div>
                              </div>
                            </template>

                          </el-select>

                        </div>
                      </div>

                      <div class="data-item stat-search">
                        <div class="data-item__title">
                          <label class="form__label" style="padding:0">Период</label>
                        </div>
                        <div class="data-item__data">
                          
                          <el-select
                            class="form__input"
                            v-model="periodQuery"
                            value-key="value"
                            @change="onChangePeriod"
                            filterable
                            collapse-tags
                            placeholder="">

                            <el-option v-for="(item, index) in statperiods" :value="item" :label="item.value" :key="index">
                              <div class="stat-select stat-select-option">
                                <div class="stat-select-title">{{ item.title }}</div>
                                <div class="stat-select-info">Всего: <span style="">{{ item.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ item.viewads }}</span></div>
                              </div>
                            </el-option>

                            <template v-if="periodQuery" #prefix>
                              <div class="stat-select stat-select-option-selected prefix">
                                <div class="stat-select-title">{{ periodQuery.title }}</div>
                                <div class="stat-select-info">Всего: <span style="">{{ periodQuery.view }}</span> <span style="position:relative;top:-1px;font-size:9px">/</span> <span style="">{{ periodQuery.viewads }}</span></div>
                              </div>
                            </template>

                          </el-select>

                        </div>
                      </div>

                    </div>

                  </el-col>
                </el-row>
                <div style="clear:both"></div>

                <el-row type="flex" class="row-bg">
                  <el-col :span="24">
                    <div class="stat__data">
                      <div class="data-item" v-if="isRight">
                        <div class="data-item__data">{{ start }}</div>
                        <div class="data-item__title">Загрузки плеера</div>
                      </div>
                      <div class="data-item" v-if="isRight">
                        <div class="data-item__data">{{ startuniq }}</div>
                        <div class="data-item__title">Уникальные загрузки</div>
                      </div>
                      <div class="data-item">
                        <div class="data-item__data">{{ shows }}</div>
                        <div class="data-item__title" v-if="isRight">Запуски плеера</div>
                        <div class="data-item__title" v-if="isClient">Просмотры</div>
                      </div>
                      <div class="data-item" v-if="isRight">
                        <div class="data-item__data">{{ lowShow }}</div>
                        <div class="data-item__title">Полные просмотры видео</div>
                      </div>
                      <div class="data-item">
                        <div class="data-item__data">{{ showAds }}</div>
                        <div class="data-item__title" v-if="isRight">Просмотры рекламы</div>
                        <div class="data-item__title" v-if="isClient">Оплаченные просмотры</div>
                      </div>
                    </div>

                    <div class="chart">
                      <apexchart type="area" height="350" :options="chartOptions" :series="showStat"></apexchart>
                    </div>

                  </el-col>
                </el-row>

                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="24">
                    <div class="stat__title">Обращения</div>
                  </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" v-if="isRight && isNotUserStat">
                  <el-col :span="24">
                    <div class="stat__data">
                      <div class="data-item">
                        <div class="data-item__data">{{ tikets }}</div>
                        <div class="data-item__title">Тикеты</div>
                      </div>
                      <div class="data-item">
                        <div class="data-item__data">{{ films }}</div>
                        <div class="data-item__title">Заказы</div>
                      </div>
                      <div class="data-item">
                        <div class="data-item__data">{{ domains }}</div>
                        <div class="data-item__title">Модерация</div>
                      </div>
                    </div>

                    <div class="chart">
                      <apexchart type="area" height="350" :options="chartOptions" :series="tiketsStat"></apexchart>
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
  import "echarts/lib/echarts";
  import "echarts/lib/chart/line";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/title";
  import "echarts/lib/component/visualMap";
  import "echarts/lib/component/legend";
  import "echarts/lib/chart/pie";
  import echarts from "vue-echarts/components/ECharts";

  import VueApexCharts from 'vue-apexcharts';

  export default {
    name: "StatsPage",
    components: {
      echarts,
      apexchart: VueApexCharts,
    },
    props: ['user_id'],
    data: () => ({

      
      countUsers: 0,
      usersStat: [],

      apiStat: [],
      reqwest: 0,

      systemStat: [],
      loading: 0,

      showStat: [],
      shows: 0,
      lowShow: 0,
      showAds: 0,
      start: 0,
      startuniq: 0,

      tiketsStat: [],
      tikets: 0,
      domains: 0,
      films: 0,

      chartOptions: {
        chart: {
          height: 350,
          type: 'area'
        },
        theme: {
          palette: 'palette1' // upto palette10
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'dd.MM.yy'
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => { return Math.round(value) },
          },
        },
        tooltip: {
          x: {
            format: 'dd.MM.yy'
          },
        },
      },

      filter: {
        user_id: null,
        domain: null,
        period: null,
        userStatView: false
      },

      userQuery: null,
      statusers: [],

      domainQuery: null,
      statdomains: [],

      periodQuery: null,
      statperiods: [],

    }),

    async created() {
      if (this.user_id) {
        this.filter.userStatView = true;
        this.filter.user_id = this.user_id;
      }

      this.getStats();
    },
    mounted() {
      
    },

    computed: {
      title(){ return this.$router.currentRoute.meta.title},
      isRight(){ return this.$store.state.user.status == 'client' || this.$store.state.user.status == 'managing' ? false : true; },
      isClient(){ return this.$store.state.user.status == 'client' ? true : false; },
      isUserStat(){ return this.user_id ? true : false; },
      isNotUserStat(){ return this.user_id ? false : true; },
    },
    methods: {

      loadStat() {
        var params = this.filter;
        params.loadStat = true;

        this.postMethod("stats.get", params).then(({
          userdomains,
          userlist,
          shows: {start, startuniq, show, lowshow, showads, periods}
        }) => {

          if (this.$store.state.user.status != 'client') {

            // user list for stat

            /*this.statusers = userlist;
            if (!this.userQuery) {
              this.userQuery = this.statusers[0];
            }*/

          }

          // user stat domains

          this.statdomains = userdomains;
          if (!this.filter.domain) {
            if (this.filter.userStatView && this.filter.user_id) {
              for (var i = 0; i < this.statdomains.length; i++) {
                if (this.statdomains[i].id == this.filter.user_id) {
                  this.domainQuery = this.statdomains[i];
                  this.filter.domain = this.statdomains[i].value;
                }
              }
            } else {
              this.domainQuery = this.statdomains[0];
              this.filter.domain = this.statdomains[0].value;
            }
            
          }

          // user stat periods

          this.statperiods = periods;
          if (!this.filter.period) {
            this.periodQuery = this.statperiods[0];
            this.filter.period = this.statperiods[0].value;
          }

          // stat

          this.showStat = new Array();

          if (this.$store.state.user.status != 'client') {
            this.showStat.push({
              name: 'Загрузки плеера',
              data: start
            });
            this.start = start.reduce((sum, item) => sum + item[1], 0);

            this.showStat.push({
              name: 'Уникальные загрузки',
              data: startuniq
            });
            this.startuniq = startuniq.reduce((sum, item) => sum + item[1], 0);
          }

          this.showStat.push({
            name: this.$store.state.user.status != 'client' ? 'Запуски плеера' : 'Промотры',
            data: show
          });
          this.shows = show.reduce((sum, item) => sum + item[1], 0);

          if (this.$store.state.user.status != 'client') {
            this.showStat.push({
              name: 'Полные просмотры видео',
              data: lowshow
            });
            this.lowShow = lowshow.reduce((sum, item) => sum + item[1], 0);
          }

          this.showStat.push({
            name: this.$store.state.user.status != 'client' ? 'Просмотры рекламы' : 'Оплаченные просмотры',
            data: showads
          });
          this.showAds = showads.reduce((sum, item) => sum + item[1], 0);

        });
      },
      onChangeUser(index) {
        if (this.filter.user_id != index.id) {
          this.filter.user_id = index.id;
          this.filter.domain = null;
          this.filter.period = null;
          this.loadStat();
        }
      },
      onChangeDomain(index) {
        if (this.filter.domain != index.value) {
          this.filter.domain = index.value;
          this.filter.period = null;
          this.loadStat();
        }
      },
      onChangePeriod(index) {
        if (this.filter.period != index.value) {
          this.filter.period = index.value;
          this.loadStat();
        }
      },

      getStats() {
        let params = this.filter;

        this.postMethod("stats.get", params).then(({
          users,
          userdomains,
          userlist,
          tikets: {tikets, domains, films}, 
          shows: {start, startuniq, show, lowshow, showads, periods}, 
          system: {reqwest, loading}
        }) => {

          if (this.$store.state.user.status != 'client') {

            // user list for stat

            this.statusers = userlist;
            if (!this.userQuery) {
              this.userQuery = this.statusers[0];
            }

          }

          // user stat domains

          this.statdomains = userdomains;
          if (!this.domainQuery) {
            this.domainQuery = this.statdomains[0];
          }

          // user stat periods

          this.statperiods = periods;
          if (!this.periodQuery) {
            this.periodQuery = this.statperiods[0];
          }

          // users

          if (users.length > 0) {
            this.usersStat.push({
              name: 'Пользователи',
              data: users
            });
            this.countUsers = users.reduce((sum, item) => sum + item[1], 0);
          }

          // tickets

          if (tikets.length > 0) {
            this.tiketsStat.push({
              name: 'Тикеты',
              data: tikets
            });
            this.tikets = tikets.reduce((sum, item) => sum + item[1], 0);
          }
          if (films.length > 0) {
            this.tiketsStat.push({
              name: 'Заказы',
              data: films
            });
            this.films = films.reduce((sum, item) => sum + item[1], 0);
          }
          if (domains.length > 0) {
            this.tiketsStat.push({
              name: 'Модерация',
              data: domains
            });
            this.domains = domains.reduce((sum, item) => sum + item[1], 0);
          }

          // views

          if (this.$store.state.user.status != 'client') {
            this.showStat.push({
              name: 'Загрузки плеера',
              data: start
            });
            this.start = start.reduce((sum, item) => sum + item[1], 0);

            this.showStat.push({
              name: 'Уникальные загрузки',
              data: startuniq
            });
            this.startuniq = startuniq.reduce((sum, item) => sum + item[1], 0);
          }

          this.showStat.push({
            name: this.$store.state.user.status != 'client' ? 'Запуски плеера' : 'Промотры',
            data: show
          });
          this.shows = show.reduce((sum, item) => sum + item[1], 0);

          if (this.$store.state.user.status != 'client') {
            this.showStat.push({
              name: 'Полные просмотры видео',
              data: lowshow
            });
            this.lowShow = lowshow.reduce((sum, item) => sum + item[1], 0);
          }

          this.showStat.push({
            name: this.$store.state.user.status != 'client' ? 'Просмотры рекламы' : 'Оплаченные просмотры',
            data: showads
          });
          this.showAds = showads.reduce((sum, item) => sum + item[1], 0);

          // api

          if (reqwest.length > 0) {
            this.apiStat.push({
              name: 'Запросы к api',
              data: reqwest
            });
            this.reqwest = Math.round( reqwest.reduce((sum, item) => sum + item[1], 0) / reqwest.length );
          }

          if (loading.length > 0) {
            this.systemStat.push({
              name: 'Загрузка системы',
              data: loading
            });
            this.loading = Math.round( loading.reduce((sum, item) => sum + item[1], 0) / loading.length );
          }

        });
      },

      
    }
  };
</script>

<style lang='scss' scoped>
.el-col {
  margin: 10px;
}

.chart{
  position: relative;
  left: -18px;
}

.stat__title {
  font-family: "Montserrat-Medium";
  font-size: 22px;
  padding: 60px 0 15px 0;
}
.stat__data {
  display: flex;
}

.data-item {
  padding-right: 80px;
}
.data-item.stat-search {
  box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  border-radius: 9px;
  padding: 7px 10px;
}
.data-item__data {
  font-family: "Montserrat-Bold";
  font-size: 30px;
}
.data-item__title {
  font-size: 12px;
  color: #757575;
}
</style>


<style lang='scss'>
  .apexcharts-tooltip-marker {
    margin-top: -13px !important;
    margin-right: 7px !important;
  }

  .el-autocomplete .el-input .el-input__clear {
    top: -3px !important;
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
  }
  .stat-select.stat-select-option-selected {
    padding-top: 4px !important;
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
  .stat-select-info {
    text-align: left !important;
    line-height: 14px !important;
    font-weight: normal !important;
    color: #9da0a7 !important;
  }
  .stat-select-info span {
    
  }
  .stat-search .el-select .el-input .el-input__inner {
    color: transparent;
    min-width: 232px;
  }
  .stat-search .el-select .el-input.is-focus .el-input__inner {
    background-color: #f2f4f8;
    padding-left: 20px;
    position: relative;
    z-index: 1;
    color: #969db7;
  }
</style>