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

                <div class="search-block">
                  <el-select
                    class="form__input search-input"
                    v-model="searchUser"
                    placeholder="Выберите пользователя"
                    filterable
                    clearable
                    @change="domainsGet()">
                    <el-option
                      v-for="user in usersList"
                      :key="user"
                      :label="user"
                      :value="user">
                    </el-option>
                  </el-select>
                  <el-select
                    class="form__input search-input"
                    v-model="searchDomain"
                    placeholder="Выберите домен"
                    filterable
                    clearable
                    @change="domainsGet()">
                    <el-option
                      v-for="domain in domainNamesList"
                      :key="domain"
                      :label="domain"
                      :value="domain">
                    </el-option>
                  </el-select>
                  <div class="form__button-slise-input" @click="clearFilter()">
                    <i class="icon el-icon-refresh"></i> Сброс
                  </div>
                </div>

                <el-table
                  :data="domainsList"
                  stripe
                  style="width: 100%"
                  @sort-change="handleSortChange">

                  <el-table-column
                    prop="id"
                    label="ID"
                    width="80"
                    sortable="custom">
                  </el-table-column>

                  <el-table-column
                    prop="name"
                    label="Домен"
                    sortable="custom">
                  </el-table-column>

                  <el-table-column
                    prop="user_login"
                    label="Пользователь"
                    width="180"
                    sortable="custom">
                  </el-table-column>

                  <el-table-column
                    prop="domain_type_name"
                    label="Тип домена"
                    width="180"
                    sortable="custom">
                    <template slot-scope="scope">
                      <span v-if="scope.row.domain_type_name">{{ scope.row.domain_type_name }}</span>
                      <span v-else class="text-muted">—</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="status"
                    label="Статус"
                    width="150"
                    sortable="custom">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 0" class="tag tag-color--yellow">Ожидание</span>
                      <span v-if="scope.row.status == 1" class="tag tag-color--green">Активен</span>
                      <span v-if="scope.row.status == 2" class="tag tag-color--red">Отклонен</span>
                    </template>
                  </el-table-column>

                </el-table>

                <div class="articles__pagination">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="count"
                    :page-size="paginCount"
                    :current-page="page"
                    @current-change="domainsGet">
                  </el-pagination>
                </div>

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
    name: 'DomainsPage',
    props: ['data'],
    data(){return{
      domainsList: [],
      count: 0,
      searchUser: '',
      searchDomain: '',
      usersList: [],
      domainNamesList: [],
      paginCount: 20,
      page: 1,
      orderBy: 'id',
      orderDirection: 'DESC'
    }},
    async created() {
      if( /page.*?(\d+)/.exec( window.location.hash ) != null) {
        this.page = Number(/page.*?(\d+)/.exec( window.location.hash )[1]);
      }
      await this.loadFilterOptions();
      this.domainsGet(this.page);
    },

    computed: {
      title(){ return this.$router.currentRoute.meta.title},
      offsetPage: function () { return this.paginCount * (this.page - 1); },
    },

    methods: {

      async loadFilterOptions(){
        let params = {
          limit: 1000,
          offset: 0
        };

        await this.postMethod('domains.getAll', params).then((response) => {
          const uniqueUsers = [...new Set(response.items.map(item => item.user_login))];
          this.usersList = uniqueUsers.filter(user => user).sort();

          const uniqueDomains = [...new Set(response.items.map(item => item.name))];
          this.domainNamesList = uniqueDomains.filter(domain => domain).sort();
        });
      },

      clearFilter(){
        this.searchUser = '';
        this.searchDomain = '';
        this.page = 1;
        this.domainsGet();
        this.$router.push('/domains');
      },

      handleSortChange({column, prop, order}){
        if (prop && order) {
          this.orderBy = prop;
          this.orderDirection = order === 'ascending' ? 'ASC' : 'DESC';
          this.page = 1;
          this.domainsGet();
        }
      },

      domainsGet: function(page = 1){
        this.page = page;
        window.location.hash = 'page'+ page;

        let params = {
          limit: this.paginCount,
          offset: this.offsetPage,
          search_user: this.searchUser,
          search_domain: this.searchDomain,
          order_by: this.orderBy,
          order_direction: this.orderDirection
        };

        this.postMethod('domains.getAll', params).then((response) => {
          this.count = response.count;
          this.domainsList = response.items;
        });
      },

    }
  }
</script>

<style lang='scss' scoped>

  .search-block {
    display: flex;
    gap: 10px;
    padding: 0 10px 15px 10px;
    align-items: center;
  }

  .search-input {
    flex: 1;
    max-width: 250px;
  }

  .text-muted {
    color: #999;
  }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 3px;
    font-size: 12px;
    font-family: 'Montserrat-Medium';
  }

  .tag-color--green {
    background: #67c23a;
    color: #fff;
  }

  .tag-color--yellow {
    background: #e6a23c;
    color: #fff;
  }

  .tag-color--red {
    background: #f56c6c;
    color: #fff;
  }

  .articles__pagination {
    padding: 15px 0;
    box-shadow: 0px -1px 0px #dddddd;
    text-align: center;
  }

</style>
