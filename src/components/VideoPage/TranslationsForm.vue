<template>
  <el-dialog
    title="Управление переводами"
    :visible.sync="visibleStep"
    width="800px"
    :before-close="close">

    <div class="section__title-button addfilebutton" @click="addFileFormFlag = true">
      <i class="icon el-icon-plus"></i>
      Добавить файл
    </div>

    <el-table
      :data="voices"
      stripe
      style="width: 100%">

      <el-table-column
        label="ID"
        width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column
        label="Сезон"
        v-if="data.tupe == 'episode'"
        width="65">
        <template slot-scope="scope">
          {{ scope.row.season }}
        </template>
      </el-table-column>

      <el-table-column
        label="Серия"
        v-if="data.tupe == 'episode'"
        width="65">
        <template slot-scope="scope">
          {{ scope.row.episode }}
        </template>
      </el-table-column>

      <el-table-column
        label="Перевод">
        <template slot-scope="scope">
          {{ scope.row.translation }}
        </template>
      </el-table-column>

      <el-table-column
        label="Источник"
        width="65">
        <template slot-scope="scope">
          {{ scope.row.db }}
        </template>
      </el-table-column>

      <el-table-column
        label=""
        width="52">
        <template slot-scope="scope">
          <a href="#" v-on:click.prevent="deleteFile(scope.row.id, data.id, data.tupe)" title="Удалить"><i class="fa fa-trash" aria-hidden="true"></i></a>
        </template>
      </el-table-column>

    </el-table>

    <add-file-form :visible.sync="addFileFormFlag" :data="data" @close="closeForm()"></add-file-form>

  </el-dialog>
</template>

<script>
  import AddFileForm from '~/components/VideoPage/AddFileForm';

  export default {

    name: 'TranslationsForm',
    components: {
      'add-file-form': AddFileForm
    },
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

      voices: [],

      addFileFormFlag: false
    }),

    created(){
      // массив для фильтра года
      // for (let i = 2001; i <= new Date().getFullYear(); i++) {
      //   this.range.push({name:i, to:i, do:i, check: false});
      // }
      // this.range.push({name:'Все', to:0, do:new Date().getFullYear(), check: true});
      // this.range = this.range.reverse();

      // console.log(this.range);
    },

    watch: {
      visible: function (newValue) {
        if(newValue) this.visibleStep = true;

        if (this.visibleStep == true) {
          this.postMethod('videos.voiceManage', {
            id: this.data.id,
            type: this.data.tupe
          }).then((response) => {
            this.voices = response.voices;
          });
        }
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

      close(){
        this.visibleStep = false;
        this.voices = [];
        this.$emit('close');
      },

      closeForm(){
        this.postMethod('videos.voiceManage', {
          id: this.data.id,
          type: this.data.tupe
        }).then((response) => {
          this.voices = response.voices;
        });

        this.addFileFormFlag = false;
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

      deleteFile: function(id, dataId, dataTupe) {
        this.postMethod('videos.deleteFile', {
          id: id
        }).then((response) => {
          
          this.postMethod('videos.voiceManage', {
            id: dataId,
            type: dataTupe
          }).then((response) => {
            this.voices = response.voices;
          });

        });
      }
    }

  }
</script>

<style lang='scss' scoped>
    
  .addfilebutton {
    margin: -82px;
    position: relative;
    right: 107px;
  }

  .fa {
    font-size: 20px;
    color: #cecece;
    padding: 0 5px 0 8px;
    position: relative;
    top: 0px;
  }

</style>