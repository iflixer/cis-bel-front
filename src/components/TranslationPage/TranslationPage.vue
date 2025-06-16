<template>
  <div class="main__content">

    <update-translation-form :visible.sync="updateTranslationVisible" :data="updateData" @close="closeForm()"></update-translation-form>

    <div class="content-site">
      <slot name="menu"></slot>
      <div>
        <slot name="header"></slot>
        <main>
          <div class="main">

            <slot name="messages"></slot>

            <section class="section">
              <div>
                <h2 class="section__title">{{ title }}</h2>
              </div>
              <div class="section__content">

                <div class="search-block">
                  <el-input
                    class="form__input"
                    v-model="search"
                    placeholder="Поиск"
                    clearable>
                  </el-input>
                  <div class="form__button-slise-input" @click="videosGet()">
                    <i class="icon el-icon-search"></i> Искать
                  </div>
                  <div class="form__button-slise-input" @click="clearFilter()">
                    <i class="icon el-icon-news"></i> Сброс
                  </div>
                </div>
                
                <el-table
                  :data="videos"
                  stripe
                  style="width: 100%">

                  <el-table-column
                    type="selection"
                    width="45"></el-table-column>

                  <el-table-column
                    prop="id"
                    label="ID"
                    width="53">
                  </el-table-column>

                  <el-table-column
                    prop="id_VDB"
                    label="ID (VDB)"
                    width="100">
                  </el-table-column>

                  <el-table-column
                    prop="title"
                    label="Полное название">
                  </el-table-column>

                  <el-table-column
                    prop="tag"
                    label="Короткое название">
                  </el-table-column>

                  <el-table-column
                    prop="priority"
                    label="Приоритет"
                    width="100">
                  </el-table-column>

                  <el-table-column
                    prop="name"
                    label=""
                    width="60">
                    <template slot-scope="scope">
                      <div class="table__button" @click="openUpdate(scope.$index)">
                        <i class="el-icon-edit"></i>
                      </div>
                      
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
                    @current-change="videosGet">
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
  import player from '~/assets/js/vendor/player/src/App';

  import UpdateTranslationForm from '~/components/TranslationPage/UpdateTranslationForm';

  import TiketModal from '~/components/TiketsPage/TiketModal';

  export default {
    name: 'VideoPage',
    components: {
      'player-fin': player,
      UpdateTranslationForm
    },
    props: ['type'],
    data(){return{

      videoInfoFlag: false, // Модалка с информацией о фильме
      updateFilmData: null, // данные для модалки, режим редактирования
      videoShowFlag: false, // Модалка предпросмотра фильма
      videoTiketFlag: false, // Модалка тикета
      filterFormFlag: false, // Модалка фильтра
      setingsFormFlag: false,
      videoData: null, // Данные от запроса видео для модалки фильтра
      filter: {}, // Объект фильра, заполняется событием из модалки
      videos: null, // Массив видеоматериалов
      count: null,
      search: '', // Строка поиска


      flagFraimeLink: false,
      flagHttpsLink: false,

      paginations: [],
      paginCount: 20,
      page: 1,

      filmId: 0,
      filmIndex: null,

      userInfo: null,

      updateTranslationVisible: false,
      updateData: null
    }},
    async created() {
      // хеш для страницы
      if( /page.*?(\d+)/.exec( window.location.hash ) != null) this.page = Number(/page.*?(\d+)/.exec( window.location.hash )[1]);

      this.videosGet(this.page); 
      await this.getUserInfo();
    },

    computed: {
      title(){ return this.$router.currentRoute.meta.title},
      isRight(){ return this.$store.state.user.status == 'client' || this.$store.state.user.status == 'managing' ? false : true; },
      offsetPage: function () { return this.paginCount * (this.page - 1); },
    },

    mounted: function () {
      this.$nextTick(function () {})
    },

    methods: {

      async getUserInfo(){
        await this.postMethod('users.info').then(response => {
          this.userInfo = response;
        });
      },

      // Пердпросмотр фильма
      showFilm(id){
        this.filmId = id;
        this.videoShowFlag = true;
      },

      // Информация о фильме
      showInfo: function(index){
        this.updateFilmData = this.videos[index];
        this.videoInfoFlag = true;
        this.filmIndex = index;
      },

      // Добавление фильма
      addFilm: function(){
        this.modal = true;
        this.modalPage.add = true;
      },

      // Закрыть все модалки
      closeForm(){
        this.videoInfoFlag = false;
        this.videoShowFlag = false;
        this.videoTiketFlag = false;
        this.filterFormFlag = false;
        this.setingsFormFlag = false;
      },

      // Скопировать адрес
      copyAdress: function(id){
        let link = `://${this.userInfo.domain}/show/${id}`;

        if(this.flagHttpsLink){ link = 'https'+ link; }else{ link = 'http'+ link; }
        if(this.flagFraimeLink){link = '<iframe src="'+ link +'" frameborder="0" width="610" height="370" allowfullscreen></iframe>'}

        this.$copyText(link).then((e) => {
          this.$notify.success({ title: 'Успех', message: 'Элемент скопирован', customClass: 'messages-ui' });
        }, (e) => {
          this.$notify.error({ title: 'Ошибка', message: 'Ошибка копирования', customClass: 'messages-ui' });
          console.log(e)
        })
      },

      copyElement: function(text){
        this.$copyText(text).then((e) => {
          this.$notify.success({ title: 'Успех', message: 'Скопировано', customClass: 'messages-ui' });
        }, (e) => {
          this.$notify.error({ title: 'Ошибка', message: 'Ошибка копирования', customClass: 'messages-ui' });
          console.log(e)
        })
      },


      clearFilter(){
        this.search = '';
        this.videosGet();
        this.$router.push('translations')
      },

      openUpdate(index){
        this.updateData = this.videos[index]
        this.updateTranslationVisible = true;
      },
      closeForm() {
        this.updateTranslationVisible = false;
        // this.videosGet();
      },
      

      // Загрузка списка видео
      videosGet: function(page = 1){

        this.page = page;
        // console.log(page);
        window.location.hash = 'page'+ page;

        // Параметры запроса
        let params = {
          limit: this.paginCount,
          offset: this.offsetPage,
          search: this.search
        };
        
        this.postMethod('translations.search', params).then((response) => {
          this.count = response.count;
          this.videos = response.items.map(item => {
            if(item.lock != null)item.lock = item.lock.split(',');
            return item;
          });

          this.videoData = response;

          // this.$refs.articles__scrol.scrollTop = 0;
        });
      },

    }
  }
</script>


<style lang="scss">
  // 38cf99
  // 2fb887

  // #34db93
  // #40c173

  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #2fb887;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #38cf99;
    color: #fff;
  }
  
</style>


<style lang='scss' scoped>

  .video__panel{
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;

    &-function{
      padding: 0 10px;

      span{
        margin-right: 5px;
        color: #606266;
      }
    }
  }

  .fa{
    font-size: 20px;
    color: #cecece;
    padding: 0 5px 0 8px;
    position: relative;
    top: 0px;
  }

  .info--grin{color:#98d1bd;}
  .info--red{color:#d19898;}

  .search-block{
    display: flex;
    
    padding-bottom: 30px;
  }

  .articles__pagination{
    width: 100%;
    background: #fff;
    padding: 15px 0;
    box-shadow: 0px -1px 0px #dddddd;
    text-align: center;
    // position: fixed;
    bottom: 0;
  }

</style>