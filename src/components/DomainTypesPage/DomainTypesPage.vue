<template>
  <div class="main__content">

    <modal-add-type v-if="addTypeShow" :visible="addTypeShow" @close="closeModal()"></modal-add-type>
    <modal-update-type v-if="updateTypeShow" :visible="updateTypeShow" :domainType="typesList[index]" @close="closeModal()"></modal-update-type>

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
                  <div class="section__title-button" @click="addTypeShow = true">
                    <i class="icon el-icon-plus"></i>
                    Создать тип домена
                  </div>
                  <div class="section__title-button-rever" @click="deleteTypes()">
                    <i class="icon el-icon-delete"></i>
                    Удалить выбранные
                  </div>
                </div>
                
              </div>
              <div class="section__content">

                <section class="articles">
                  <el-table
                    :data="typesList"
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
                        <div class="type-value-cell">{{ scope.row.value }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label=""
                      width="120">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                          <div class="table__button" @click="updateType(scope.$index)"><i class="el-icon-edit"></i></div>
                          <div class="table__button" @click="deleteType(scope.row.id)"><i class="el-icon-delete"></i></div>
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

  import addType from '~/components/DomainTypesPage/ModalFormAddType';
  import updateType from '~/components/DomainTypesPage/ModalFormUpdateType';

  export default {
    name: 'DomainTypesPage',
    props: ['data'],
    components:{
      'modal-add-type': addType,
      'modal-update-type': updateType
    },
    data: function(){return{
      typesList: [],
      addTypeShow: false,
      updateTypeShow: false,
      selectedData: [],
      index: 0
    }},
    created: function () {
      this.getTypes();
    },
    computed:{
      title(){ return this.$router.currentRoute.meta.title},
    },
    methods: {

      getTypes: function(){
        this.postMethod('domaintypes.get', {})
        .then(response => {
          this.typesList = response;
          this.$forceUpdate();
        })
        .catch(error => {
          console.log(error);
        });
      },

      updateType(index){
        this.index = index;
        this.$nextTick(() => { this.updateTypeShow = true; });
      },

      closeModal(){
        this.updateTypeShow = false;
        this.addTypeShow = false;
        this.getTypes();
      },

      deleteType: function(id){
        this.$confirm('Вы уверены, что хотите удалить этот тип домена?', 'Подтверждение', {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {
          this.postMethod('domaintypes.delete', {
            id: id
          }).then(() => {
            this.getTypes();
          })
        }).catch(() => {

        });
      },

      deleteTypes: function(){
        if(this.selectedData.length === 0){
          this.$message({
            type: 'warning',
            message: 'Не выбраны типы доменов для удаления'
          });
          return;
        }

        this.$confirm('Вы уверены, что хотите удалить выбранные типы доменов?', 'Подтверждение', {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'warning'
        }).then(() => {
          const deletePromises = this.selectedData.map(domainType => {
            return this.postMethod('domaintypes.delete', {
              id: domainType.id
            });
          });

          Promise.all(deletePromises).then(() => {
            this.getTypes();
            this.selectedData = [];
          }).catch(error => {
            console.log(error);
            this.getTypes();
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

  .type-value-cell {
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