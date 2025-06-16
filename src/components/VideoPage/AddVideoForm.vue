<template>
  <el-dialog
    title="Добавление видео"
    :visible.sync="visibleStep"
    width="800px"
    :before-close="close">

    <label class="form__label" for="">Тип</label>
    <el-radio-group size="small" v-model="ad.type">
      <el-radio-button label="movie">Фильм</el-radio-button>
      <el-radio-button label="episode">Сериал</el-radio-button>
    </el-radio-group>

    <label class="form__label">Качество</label>
    <el-input
      class="form__input"
      v-model="ad.quality"
      clearable>
    </el-input>

    <label class="form__label">Кинопоиск ID</label>
    <el-input
      class="form__input"
      v-model="ad.kinopoisk"
      clearable>
    </el-input>

    <label class="form__label">IMDb ID</label>
    <el-input
      class="form__input"
      v-model="ad.imdb"
      clearable>
    </el-input>

    <label class="form__label">Блокировка</label>
    <div class="modal__info-film-text">
      <div>
        <div class="cheked">
          <input class="cheked__input" type="checkbox" v-model="ad.lock.RU" name="" id="chekedContryRu">
          <label class="cheked__label" for="chekedContryRu"><div></div></label>
        </div>
        Россия
      </div>
    </div>
    <div class="modal__info-film-text">
      <div>
        <div class="cheked">
          <input class="cheked__input" type="checkbox" v-model="ad.lock.UA" name="" id="chekedContryUa">
          <label class="cheked__label" for="chekedContryUa"><div></div></label>
        </div>
        Украина
      </div>
    </div>
    <div class="modal__info-film-text">
      <div>
        <div class="cheked">
          <input class="cheked__input" type="checkbox" v-model="ad.lock.SNG" name="" id="chekedContrySng">
          <label class="cheked__label" for="chekedContrySng"><div></div></label>
        </div>
        СНГ
      </div>
    </div>
    <div class="modal__info-film-text">
      <div>
        <div class="cheked">
          <input class="cheked__input" type="checkbox" v-model="ad.lock.FULL" name="" id="chekedContryFull">
          <label class="cheked__label" for="chekedContryFull"><div></div></label>
        </div>
        Полная
      </div>
    </div>

    <label class="form__label">Видео файл</label>
    <div style="border: 1px solid #EBEEF5; padding: 5px;">

      <label class="form__label">Converter ID</label>
      <el-input
        class="form__input"
        v-model="ad.converter"
        clearable>
      </el-input>

      <label class="form__label">Перевод</label>
      <!-- <el-select
        class="form__input"
        v-model="ad.translation"
        clearable>
        <el-option
          v-for="item in translations"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select> -->
      <el-autocomplete
        class="form__input"
        v-model="ad.translation"
        :fetch-suggestions="getVoices"
        placeholder="Перевод"
        :trigger-on-focus="false"
        :clearable="true"
        @select="handleSelectVoice"
        @clear="clearVoice"
        size="small"
      ></el-autocomplete>

      <label class="form__label" v-if="ad.type == 'episode'">Сезон</label>
      <el-input
        class="form__input"
        v-if="ad.type == 'episode'"
        v-model="ad.season"
        clearable>
      </el-input>

      <label class="form__label" v-if="ad.type == 'episode'">Серия</label>
      <el-input
        class="form__input"
        v-if="ad.type == 'episode'"
        v-model="ad.episode"
        clearable>
      </el-input>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">Отмена</el-button>
      <el-button type="primary" @click="handle();">Сохранить</el-button>
    </div>

  </el-dialog>
</template>

<script>
  export default {

    name: 'AddVideoForm',
    props: ['visible', 'data'],
    data: () => ({
      visibleStep: false,
      modFilter: {},


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

      ad: {
        type: 'movie',
        lock: {}
      },

      translations: null
    }),

    created(){
      // массив для фильтра года
      /*for (let i = 2001; i <= new Date().getFullYear(); i++) {
        this.range.push({name:i, to:i, do:i, check: false});
      }
      this.range.push({name:'Все', to:0, do:new Date().getFullYear(), check: true});
      this.range = this.range.reverse();

      console.log(this.range);*/

      // this.postMethod('videos.translations', []).then((response) => {
      //   this.translations = response;
      // });
    },

    watch: {
      visible: function (newValue) {
        if(newValue) this.visibleStep = true;
      },

      data: function (newValue) {
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

      getVoices(query, callback) {
          // this.clearVoice();

          this.postMethod('videos.translations', {
            query: query
          }).then((response) => {
            callback(response);
          });

      },

      handleSelectVoice(item) {
        this.ad.translationId = item.id;
        this.ad.translation = item.value;
      },

      clearVoice() {
          this.ad.translation = null;
      },




      close(){
        this.visibleStep = false;
        this.$emit('close');
      },

      start(){
        this.$emit('start', this.modFilter);
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

      handle(){
        this.postMethod('videos.addVideo', {
          ad: this.ad
        })
        .then((e) => {
          if (!e.error) {
            this.ad = {
              type: 'movie',
              lock: {}
            };

            this.close();
          }
        });
      },
    }

  }
</script>

<style lang='scss' scoped>
  
  .el-select-dropdown__item {
    background-color: #ffffff;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #F5F7FA;
  }

</style>