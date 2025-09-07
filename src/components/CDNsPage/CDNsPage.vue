<template>
  <div class="main__content">

    <cdn-edit-modal v-if="editCdnShow" :visible="editCdnShow" :cdn="cdnsList[editIndex]" @close="closeModal()"></cdn-edit-modal>

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

                <section class="articles">
                  <el-table
                    :data="cdnsList"
                    stripe
                    style="width: 100%"
                    v-loading="loading">
                    
                    <el-table-column
                      prop="id"
                      label="ID"
                      width="80"
                      sortable>
                    </el-table-column>

                    <el-table-column
                      prop="host"
                      label="Хост"
                      sortable>
                    </el-table-column>

                    <el-table-column
                      prop="node_name"
                      label="Имя узла"
                      sortable>
                    </el-table-column>

                    <el-table-column
                      prop="weight"
                      label="Вес"
                      width="100"
                      sortable>
                    </el-table-column>

                    <el-table-column
                      label="Статус"
                      width="120">
                      <template slot-scope="scope">
                        <span v-if="scope.row.active == 1" class="tag">Активен</span>
                        <span v-else class="tag-border">Неактивен</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="comment"
                      label="Комментарий">
                      <template slot-scope="scope">
                        <span v-if="scope.row.comment">{{ scope.row.comment }}</span>
                        <span v-else class="text-muted">—</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="last_report"
                      label="Последний отчет"
                      width="180">
                      <template slot-scope="scope">
                        <span v-if="scope.row.last_report">{{ formatDate(scope.row.last_report) }}</span>
                        <span v-else class="text-muted">—</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="Действия"
                      width="120">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                            <div class="table__button" @click="editCdn(scope.$index)"><i class="el-icon-edit"></i></div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
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
import CdnEditModal from '~/components/CDNsPage/CDNEditModal';

export default {
  name: 'CDNsPage',
  props: ['data'],
  components: {
    'cdn-edit-modal': CdnEditModal
  },
  data: function(){
    return {
      cdnsList: [],
      editCdnShow: false,
      editIndex: 0,
      loading: false
    }
  },
  created: function () {
    this.getCdns();
  },
  computed: {
    title() { 
      return this.$router.currentRoute.meta.title
    }
  },
  methods: {

    getCdns: function(){
      this.loading = true;
      this.postMethod('cdns.get', {})
        .then(response => {
          this.cdnsList = response;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error('Ошибка загрузки CDN');
        });
    },

    editCdn(index){
      this.editCdnShow = true;
      this.editIndex = index;
    },

    closeModal(){
      this.editCdnShow = false;
      this.getCdns();
    },

    formatDate(dateString) {
      if (!dateString) return '—';
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

  }
}
</script>

<style lang='scss' scoped>

.articles{
  width: 100%;
  min-height: 0;
  overflow: hidden;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -moz-flex;
  display: -webkit-flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  flex-grow: 10;
  padding: 0 10px;
}

.table__buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.table__button:hover{
  border: 1px solid #1bd361;
  color: #1bd361;
}

.text-muted {
  color: #999;
  font-style: italic;
}

.tag {
  display: inline;
  background: #40c173;
  color: rgba(255, 255, 255, 0.9);
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-family: 'Montserrat-Bold';
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.tag-border {
  display: inline;
  background: #f56c6c;
  color: rgba(255, 255, 255, 0.9);
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-family: 'Montserrat-Bold';
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

@media all and (min-width: 1440px) {
  .tag,
  .tag-border {
    font-size: 12px;
  }
}

</style>