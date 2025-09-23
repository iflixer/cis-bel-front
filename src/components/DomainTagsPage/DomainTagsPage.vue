<template>
  <div class="main__content">

    <modal-add-tag v-if="addTagShow" :visible="addTagShow" @close="closeModal()"></modal-add-tag>
    <modal-update-tag v-if="updateTagShow" :visible="updateTagShow" :tag="tagsList[index]" @close="closeModal()"></modal-update-tag>

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
                  <div class="section__title-button" @click="addTagShow = true">
                    <i class="icon el-icon-plus"></i>
                    Создать тег
                  </div>
                  <div class="section__title-button-rever" @click="deleteTags()">
                    <i class="icon el-icon-delete"></i>
                    Удалить выбранные
                  </div>
                </div>
                
              </div>
              <div class="section__content">

                <section class="articles">
                  <el-table
                    :data="tagsList"
                    stripe
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                      type="selection"
                      width="45">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="Название"
                      width="200">
                    </el-table-column>
                    <el-table-column
                      prop="value"
                      label="Значение">
                      <template slot-scope="scope">
                        <div class="tag-value-cell">{{ scope.row.value }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      label="Тип"
                      width="150">
                      <template slot-scope="scope">
                        {{ scope.row.type || 'domain_type' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label=""
                      width="120">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                          <div class="table__button" @click="updateTag(scope.$index)"><i class="el-icon-edit"></i></div>
                          <div class="table__button" @click="deleteTag(scope.row.id)"><i class="el-icon-delete"></i></div>
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

  import addTag from '~/components/DomainTagsPage/ModalFormAddTag';
  import updateTag from '~/components/DomainTagsPage/ModalFormUpdateTag';

  export default {
    name: 'DomainTagsPage',
    props: ['data'],
    components:{
      'modal-add-tag': addTag,
      'modal-update-tag': updateTag
    },
    data: function(){return{
      tagsList: [],
      addTagShow: false,
      updateTagShow: false,
      selectedData: [],
      index: 0
    }},
    created: function () {
      this.getTags();
    },
    computed:{
      title(){ return this.$router.currentRoute.meta.title},
    },
    methods: {

      getTags: function(){
        this.postMethod('domaintags.get', {})
        .then(response => {
          this.tagsList = response;
          this.$forceUpdate();
        })
        .catch(error => {
          console.log(error);
        });
      },

      updateTag(index){
        this.index = index;
        this.$nextTick(() => { this.updateTagShow = true; });
      },

      closeModal(){
        this.updateTagShow = false;
        this.addTagShow = false;
        this.getTags();
      },

      deleteTag: function(id){
        this.$confirm('Вы уверены, что хотите удалить этот тег?', 'Подтверждение', {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {
          this.postMethod('domaintags.delete', {
            id: id
          }).then(() => {
            this.getTags();
          })
        }).catch(() => {

        });
      },

      deleteTags: function(){
        if(this.selectedData.length === 0){
          this.$message({
            type: 'warning',
            message: 'Не выбраны теги для удаления'
          });
          return;
        }

        this.$confirm('Вы уверены, что хотите удалить выбранные теги?', 'Подтверждение', {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {
          const deletePromises = this.selectedData.map(tag => {
            return this.postMethod('domaintags.delete', {
              id: tag.id
            });
          });

          Promise.all(deletePromises).then(() => {
            this.getTags();
            this.selectedData = [];
          }).catch(error => {
            console.log(error);
            this.getTags();
          });
        }).catch(() => {

        });
      },

      handleSelectionChange(list){
        this.selectedData = list;
      }

    }
  }
</script>

<style lang='scss' scoped>

  .tag-value-cell {
    max-width: 500px;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .table__buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  .table__buttons .table__button {
    float: none;
    margin-left: 0;
  }

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

</style>
