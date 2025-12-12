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
                  <el-input
                    v-model="searchQuery"
                    placeholder="Поиск по ID Kinopoisk / VideoDB / ID видео / названию"
                    @keyup.enter.native="searchVideos"
                    clearable
                    class="search-input">
                  </el-input>
                  <div class="search-block__button" @click="searchVideos">
                    <i class="el-icon-search"></i>
                    Найти
                  </div>
                </div>

                <section v-if="searchResults.length > 0" class="search-results">
                  <h3 class="subsection-title">Результаты поиска</h3>
                  <el-table
                    :data="searchResults"
                    stripe
                    style="width: 100%">
                    <el-table-column
                      prop="id"
                      label="ID"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="ru_name"
                      label="Название"
                      min-width="200">
                    </el-table-column>
                    <el-table-column
                      prop="kinopoisk"
                      label="Kinopoisk ID"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="id_VDB"
                      label="VideoDB ID"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="year"
                      label="Год"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="tupe"
                      label="Тип"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      label="Статус"
                      width="120">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.blacklisted" type="danger" size="small">В черном списке</el-tag>
                        <el-tag v-else type="success" size="small">Активно</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label=""
                      width="180">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                          <el-button
                            v-if="!scope.row.blacklisted"
                            type="danger"
                            size="mini"
                            @click="addToBlacklist(scope.row)">
                            Заблокировать
                          </el-button>
                          <el-button
                            v-else
                            type="success"
                            size="mini"
                            @click="removeFromBlacklist(scope.row)">
                            Разблокировать
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </section>

                <!-- Blacklisted videos list -->
                <section class="blacklist-section">
                  <h3 class="subsection-title">Видео в черном списке ({{ count }})</h3>
                  <el-table
                    :data="blacklistedVideos"
                    stripe
                    style="width: 100%"
                    v-loading="loading">
                    <el-table-column
                      prop="id"
                      label="ID"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="ru_name"
                      label="Название"
                      min-width="200">
                    </el-table-column>
                    <el-table-column
                      prop="kinopoisk"
                      label="Kinopoisk ID"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="id_VDB"
                      label="VideoDB ID"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="year"
                      label="Год"
                      width="80">
                    </el-table-column>
                    <el-table-column
                      prop="tupe"
                      label="Тип"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      label=""
                      width="150">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                          <el-button
                            type="success"
                            size="mini"
                            @click="removeFromBlacklist(scope.row)">
                            Разблокировать
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- Pagination -->
                  <el-pagination
                    v-if="count > paginCount"
                    background
                    layout="prev, pager, next"
                    :total="count"
                    :page-size="paginCount"
                    :current-page="page"
                    @current-change="getBlacklistedVideos">
                  </el-pagination>
                </section>

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
    name: 'BlacklistPage',
    props: ['data'],
    data: function() {
      return {
        searchQuery: '',
        searchResults: [],
        blacklistedVideos: [],
        count: 0,
        page: 1,
        paginCount: 20,
        loading: false
      }
    },
    created: function() {
      this.getBlacklistedVideos(1);
    },
    computed: {
      title() {
        return this.$router.currentRoute.meta.title;
      },
      offsetPage() {
        return this.paginCount * (this.page - 1);
      }
    },
    methods: {
      getBlacklistedVideos: function(page) {
        this.page = page;
        this.loading = true;

        this.postMethod('blacklist.get', {
          limit: this.paginCount,
          offset: this.offsetPage
        })
        .then(response => {
          this.blacklistedVideos = response.items;
          this.count = response.count;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
      },

      searchVideos: function() {
        if (!this.searchQuery.trim()) {
          this.$message({
            type: 'warning',
            message: 'Введите поисковый запрос'
          });
          return;
        }

        this.postMethod('blacklist.search', {
          search: this.searchQuery
        })
        .then(response => {
          this.searchResults = response;
          if (response.length === 0) {
            this.$message({
              type: 'info',
              message: 'Видео не найдено'
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      },

      addToBlacklist: function(video) {
        this.$confirm('Вы уверены, что хотите добавить "' + video.ru_name + '" в черный список?', 'Подтверждение', {
          confirmButtonText: 'Заблокировать',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {
          this.postMethod('blacklist.add', {
            id: video.id
          })
          .then(() => {
            // Update search results
            const index = this.searchResults.findIndex(v => v.id === video.id);
            if (index !== -1) {
              this.$set(this.searchResults[index], 'blacklisted', true);
            }
            // Refresh blacklist
            this.getBlacklistedVideos(this.page);
          })
          .catch(error => {
            console.log(error);
          });
        }).catch(() => {});
      },

      removeFromBlacklist: function(video) {
        this.$confirm('Вы уверены, что хотите убрать "' + video.ru_name + '" из черного списка?', 'Подтверждение', {
          confirmButtonText: 'Разблокировать',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {
          this.postMethod('blacklist.remove', {
            id: video.id
          })
          .then(() => {
            const index = this.searchResults.findIndex(v => v.id === video.id);
            if (index !== -1) {
              this.$set(this.searchResults[index], 'blacklisted', false);
            }
            this.getBlacklistedVideos(this.page);
          })
          .catch(error => {
            console.log(error);
          });
        }).catch(() => {});
      }
    }
  }
</script>

<style lang='scss' scoped>
  .search-block {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;

    .search-input {
      max-width: 500px;
    }

    &__button {
      padding: 10px 20px;
      background: #38cf99;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;

      &:hover {
        background: #2fb887;
      }
    }
  }

  .subsection-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }

  .search-results {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .blacklist-section {
    margin-top: 20px;
  }

  .table__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
</style>
