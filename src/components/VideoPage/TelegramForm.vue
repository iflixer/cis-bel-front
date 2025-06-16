<template>
  <el-dialog
    title="Ссылка для Телеграм канала"
    :visible.sync="visibleStep"
    width="400px"
    :before-close="close">

        <el-select
          class="form__input"
          v-model="telegramQuery"
          value-key="value"
          @change="onChangeTelegramChannel"
          filterable
          collapse-tags
          placeholder="">

          <el-option v-for="(item, index) in telegramChannels" :value="item.name" :label="item.name" :key="index">
            <div class="stat-select stat-select-option">
              {{ item.name }}
            </div>
          </el-option>

          <template v-if="telegramQuery" #prefix>
            <div class="stat-select stat-select-option-selected prefix">
              {{ telegramQuery.name }}
            </div>
          </template>

        </el-select>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">Отмена</el-button>
      <el-button type="primary" @click="start()">Скопировать</el-button>
    </div>

  </el-dialog>
</template>

<script>
  export default {

    name: 'TelegramForm',
    props: ['visible', 'data'],
    data: () => ({
      visibleStep: false,
      modFilter: {},

      videoId: null,
      telegramQuery: null,
      telegramChannels: [],


      countries: null,
      genres: null,

      rangeId: 0,
      range: [
        { name:'Old', to:0, do:1950},
        { name:'50+', to:1950, do:1960},
        { name:'60+', to:1960, do:1970},
        { name:'70+', to:1970, do:1980},
        { name:'80+', to:1980, do:1990},
        { name:'90+', to:1990, do:2000},
        { name: '2000', to:2000, do:2001}
      ],


      panelGenres: false,
      panelCountries: false,
      panelYears: false,
    }),

    async created(){
      // массив для фильтра года
      for (let i = 2001; i <= new Date().getFullYear(); i++) {
        this.range.push({name:i, to:i, do:i, check: false});
      }
      this.range.push({name:'Все', to:0, do:new Date().getFullYear(), check: true});
      this.range = this.range.reverse();

      await this.getListDomains();

      console.log(this.range);
    },

    watch: {
      visible: function (newValue) {
        if(newValue) this.visibleStep = true;
      },

      data: function (newValue) {
        this.videoId = newValue;
        if(
          this.countries == null && 
          this.genres == null && 
          typeof newValue.countries != "undefined" && 
          typeof newValue.genres != "undefined"
        ){
          this.countries = this.modificationResponse(newValue.countries);
          this.genres = this.modificationResponse(newValue.genres);
        }
      }
    },

    methods: {

      async getListDomains() {
        var domains = [];
        var telegramChannels = [];
        var telegramQuery = null;
        await this.postMethod('domains.get').then(response => {
          domains = response.map(item => ({ id: item.id, name: item.name, status: item.status }));
          domains.forEach(function(item, key) {
            if (item.name.indexOf('@') !== -1 && item.status) {
              if (!telegramChannels.length)
                telegramQuery = item.name;

              telegramChannels.push(item);
            }
          });
          this.telegramChannels = telegramChannels;
          this.telegramQuery = telegramQuery;
        });
      },

      onChangeTelegramChannel(index) {
        // console.log(index);
      },

      close(){
        this.visibleStep = false;
        this.$emit('close');
      },

      start(){
        if (!this.telegramQuery) {
          this.$notify.error({ title: 'Ошибка', message: 'У вас нет ни одного подтверждённого телеграм канала', customClass: 'messages-ui' });
          return;
        }

        let gtc = this.telegramQuery.replace('@', '');
        let link = `https://tg.cdnhubstream.pro/share/${this.videoId}?tgc=${gtc}`;
        // console.log(link);

        this.$copyText(link).then((e) => {
          this.$notify.success({ title: 'Успех', message: 'Элемент скопирован', customClass: 'messages-ui' });
        }, (e) => {
          this.$notify.error({ title: 'Ошибка', message: 'Ошибка копирования', customClass: 'messages-ui' });
          console.log(e)
        })

        this.close();
      },

      clear(){
        this.$emit('start', {});
        this.close();
      },

      change(){
        // Добавить строку стран
        if( this.countries != null && this.countries.filter(function(e){return e.show}).length != 0){
          this.modFilter['countries'] = this.countries.reduce(function(acc,e){ if(e.show){acc.push(e.name)} return acc;}, []).join(',');
        }

        // Добавить строку жанров
        if( this.genres != null && this.genres.filter(function(e){return e.show}).length != 0){
          this.modFilter['genres'] = this.genres.reduce(function(acc,e){ if(e.show){acc.push(e.name)} return acc;}, []).join(',');
        }
        // Добавить года
        if(this.range.length > 7){
          this.modFilter['years'] = this.range[this.rangeId].to + ',' + this.range[this.rangeId].do;
        }
      },

      modificationResponse: function(object){
        return object.map(function(element){ 
          return { id: element.id, name: element.name, show: false };
        });
      },
    }

  }
</script>

<style>
  .el-input--prefix .el-input__inner {
    padding-left: 20px !important;
  }
  .el-select-dropdown__empty {
    background-color: #ffffff;
  }
</style>

<style lang='scss' scoped>
    
  .panels__panel{
      box-shadow: 0 1px 0 #e1e2e3;
      padding: 0 0 15px 0;
      margin-bottom: 20px;
      position: relative;
  }
  .panels__info{
      font-size: 12px;
      padding: 5px;
      border: 1px solid #aecbe7;
      background: #eef6ff;
      margin-bottom: 10px;
      border-radius: 3px;
      text-align: center;
  }
  .panels__title{
      display: block;
      font-family: 'Montserrat-Bold';
      font-size: 14px;
      padding: 0 0 15px 0;
      color: #595e65;
      text-transform: uppercase;
  }
  .panels__text{
      font-size: 14px;
      padding: 4px 0;
      color: #595e65;
  }
  .panels__input{
      width: 100%;
      display: block;
      color: #595e65;
      padding: 8px 15px;
      outline: none;
      border-radius: 4px;
      border: 1px solid #cacaca;
      background: #fff;
      margin-bottom: 10px;
  }
  .panels__input-let{
      display: inline-block;
      max-width: 80px;
      padding: 3px 8px;
      border-radius: 3px;
      border: 1px solid #aecbe7;
      margin: 0 5px;
      outline: none;
      color: #595e65;
  }

  .panels__progress-bar{
      height: 50px;
  }
  .panels__progress-text{
      font-size: 12px;
      color: #c0c1c2;
      padding-top: 10px;
  }
  .panels__progress{
      width: 100%;
      height: 3px;
      background: #cbd8ec;
  }
  .panels__progress-item{
      height: 3px;
      width: 0;
      background: #40c173;
  }

  .panels__range{
      width: 100%;
      height: 2px;
      background: #cbd8ec;
      position: relative;
  }
  .panels__range-bar{
      width: 50%;
      height: 2px;
      background: #40c173;
      position: absolute;
  }
  .panels__range-btn{
      position: absolute;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 20px;
      border: 1px solid #cbd8ec;
      top: -9px;
      cursor: pointer;
  }
  .panels__range-nom{
      padding: 10px 0;
      margin-bottom: 10px;
      overflow: hidden;
      font-size: 14px;
  }
  .panels__range-nom span:first-child{
      float: left;
  }
  .panels__range-nom span:last-child{
      float: right;
  }

  .el-select-dropdown__item:hover {
    background-color: #F5F7FA;
  }
  .el-select-dropdown__item {
    background-color: #ffffff;
  }

</style>