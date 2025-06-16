<template>
  <div v-if="ad">

    <el-dialog
      title="Редактировать объявление"
      :visible.sync="visibleStep"
      width="1000px"
      :before-close="close">

        <label class="form__label">Полное название</label>
        <el-input
          class="form__input"
          v-model="ad.title"
          clearable>
        </el-input>

        <label class="form__label">Краткое название</label>
        <el-input
          class="form__input"
          v-model="ad.tag"
          clearable>
        </el-input>

        <label class="form__label">Приоритет</label>
        <el-input
          class="form__input"
          v-model="ad.priority"
          clearable>
        </el-input>

        <div slot="footer" class="dialog-footer">
          <el-button @click="close">Отмена</el-button>
          <el-button type="primary" @click="handle();">Сохранить</el-button>
        </div>

    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'UpdateTranslationForm',
    props: ['visible', 'data'],
    data: () => ({
      visibleStep: false,

      bodyBaner: null,

      ad: null,

      fileList: []
    }),
    async created() {

      
      
    },
    computed:{
      
    },
    watch: {
      visible: function (newValue, oldValue) {
        if (newValue) {
          this.visibleStep = true;
        }
      },
      data: function (newValue) {
        if (newValue) {
          console.log(this.data);
          this.ad = this.data;
        }
      }
    },
    methods: {
      close(){
        this.visibleStep = false;
        this.$emit('close');
      },


      handle(){
        this.postMethod('translations.update', {
          ad: this.ad
        })
        .then((e) => {
          this.close();
        });
      },

    }
  }
</script>

<style lang='scss' scoped>
  .body-content{
    padding: 20px 0;
  }
  .button-type{
    display: block;
    margin: 0 0 10px 0;
    width: 100%;
    font-size: 15px;
    line-height: 20px;

    & .icon{
      position: relative;
      top: 2px;
      font-size: 20px;
      margin-right: 10px;
    }
  }
</style>