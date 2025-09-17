<template>
  <div class="main__content">

    <!-- Modals -->
    <video-info :visible.sync="videoInfoFlag" :data="updateFilmData" @close="closeForm()"></video-info>
    <show-video :visible.sync="videoShowFlag" :data="filmId" @close="closeForm()"></show-video>
    <tiket-modal :visible.sync="videoTiketFlag" type="film" @close="closeForm()"></tiket-modal>
    <filter-form :visible.sync="filterFormFlag" :data="videoData" type="film" @close="closeForm()" @start="fiterSet"></filter-form>

    <telegram-form :visible.sync="telegramFormFlag" :data="filmId" @close="closeForm()"></telegram-form>

    <setings-bd-form :visible.sync="setingsFormFlag" @close="closeForm()" @start="videosGet()"></setings-bd-form>

    <add-video-form :visible.sync="addVideoFormFlag" @close="closeForm()" @start="videosGet()"></add-video-form>
    <translations-form :visible.sync="translationsFormFlag" :data="filmData" @close="closeForm();videosGet()"></translations-form>
    <!-- End modals -->


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
                <div class="section__title-buttons">
                  <div class="section__title-button" v-if="isRight" @click="setingsFormFlag = true">
                    <i class="icon el-icon-setting"></i>
                    Управление
                  </div>

                  <div class="section__title-button" v-if="isRight" @click="addVideoFormFlag = true">
                    <i class="icon el-icon-plus"></i>
                    Добавить видео
                  </div>

                  <a href="/video/films" :class="{ activ: type == 'films'}" class="section__title-button-lin">
                    <i class="icon el-icon-video-camera"></i>
                    Фильмы
                  </a>
                  <a href="/video/serials" :class="{ activ: type == 'serials'}" class="section__title-button-lin">
                    <i class="icon el-icon-film"></i>
                    Сериалы
                  </a>
                  <a href="/video/lock" :class="{ activ: type == 'lock'}" class="section__title-button-lin">
                    <i class="icon el-icon-close"></i>
                    Заблокированные
                  </a>
                </div>
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
                  <div class="form__button-slise-input" @click="filterFormFlag = true">
                    <i class="icon el-icon-set-up"></i> Фильтр
                  </div>
                  <div class="form__button-slise-input" @click="clearFilter()">
                    <i class="icon el-icon-news"></i> Сброс
                  </div>
                </div>

                <div class="video__panel">
                  <div class="video__panel-function" v-if="!flagTelegramLink">
                    <span>Ссылка в фрейме</span>
                    <el-switch v-model="flagFraimeLink"></el-switch>
                  </div>
                  <div class="video__panel-function">
                    <span>Ссылка для телеграм канала</span>
                    <el-switch v-model="flagTelegramLink"></el-switch>
                  </div>

                  <!-- <div class="video__panel-function">
                    <span>Https ссылка </span>
                    <el-switch v-model="flagHttpsLink"></el-switch>
                  </div> -->
                </div>
                
                <el-table
                  :data="videos"
                  :row-key="row => row.id"
                  stripe
                  style="width: 100%">

                  <el-table-column
                    v-if="isRight"
                    type="selection"
                    width="45">
                  </el-table-column>

                  <el-table-column
                    width="36">
                    <template slot-scope="scope">
                      <a href="#" v-on:click.prevent="showInfo(scope.$index)">
                        <i class="fa fa-info-circle" aria-hidden="true" 
                          :class=" scope.row.description != '' && scope.row.genre != '' && scope.row.img != '' && scope.row.ru_name != '' ? 'info--grin' : 'info--red'">
                        </i>
                      </a>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="Тип"
                    width="52">
                    <!-- фильм сериал -->
                    <template slot-scope="scope">
                      <!-- <i class="el-icon-video-camera"></i> -->
                      <!-- <i class="el-icon-film"></i> -->
                      <div class="tag tag-border tag--icon" v-if="scope.row.tupe == 'movie'" title="фильм">Fi</div>
                      <div class="tag tag-border tag--icon" v-else title="сериал">Se</div>
                    
                    </template>
                  </el-table-column>

                  <el-table-column
                    min-width="300" 
                    prop="ru_name"
                    label="Название">
                    <template slot-scope="scope">
                      {{ scope.row.ru_name }}
                      <div>
                        <span v-if="scope.row.img"><img :src="scope.row.img + '@h100'" height="100"/></span>
                        <span v-if="scope.row.backdrop"><img :src="scope.row.backdrop + '@h100'" height="100"/></span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="Блокировка"
                    width="120">
                    <template slot-scope="scope">
                      <div class="tag tag-border tag--icon" v-for="(item, index) in scope.row.lock" :key="index">{{ item }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="Качество"
                    width="120">
                    <template slot-scope="scope">
                      <div class="tag">{{ scope.row.quality }}</div>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column
                    prop="translation"
                    label="Озвучка">
                  </el-table-column> -->

                  <el-table-column label="Озвучка" min-width="220" prop="translation">
                    <template slot-scope="scope">
                      <template v-if="scope.row.translations && scope.row.translations.length">
                        <template v-if="!isTrOpen(scope.row.id)">
                          <span>
                            <!-- {{ scope.row.translations.slice(0,2).map(t=>t.title).join(', ') }} -->
                            {{ scope.row.translations.length }}
                            <template v-if="scope.row.translations.length > 0">
                              <el-link type="primary" @click="toggleTr(scope.row.id)" style="margin-left:6px">Показать</el-link>
                            </template>
                          </span>
                        </template>
                        <div v-else>
                          <ol style="margin-left: 10px;">
                            <li v-for="(item, i) in scope.row.translations" :key="i">{{ item.title }}</li>
                          </ol>
                          <el-link type="primary" @click="toggleTr(scope.row.id)">Скрыть</el-link>
                        </div>
                      </template>
                      <span v-else>—</span>
                      <a href="#" class="icon-movie-edit" v-if="isRight" v-on:click.prevent="translationsFormFlag = true; filmData.id = scope.row.id; filmData.tupe = scope.row.tupe;" title="Управление переводами"><i class="fa fa-bars" aria-hidden="true"></i></a>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="КиноПоиск"
                    width="130">
                    <template slot-scope="scope">
                      <div class="tag" v-if="scope.row.kinopoisk != null">
                        <a :href="'https://www.kinopoisk.ru/film/'+ scope.row.kinopoisk" title="Перейти">
                          {{ scope.row.kinopoisk }}
                        </a> 
                        <i
                          class="el-icon-copy-document" aria-hidden="true" title="Скопировать"
                          style="margin-left:7px" @click="copyElement(String(scope.row.kinopoisk))">
                        </i>
                      </div>
                    </template>
                  </el-table-column>
                  
                  <el-table-column
                    label="IMDB"
                    width="145">
                    <template slot-scope="scope">
                      <div class="tag" v-if="scope.row.imdb != null">
                        <a :href="'https://www.imdb.com/title/'+ scope.row.imdb" title="Перейти">
                          {{ scope.row.imdb }}
                        </a> 
                        <i
                          class="el-icon-copy-document" aria-hidden="true" title="Скопировать"
                          style="margin-left:7px" @click="copyElement(scope.row.imdb)">
                        </i>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="Код"
                    width="140">
                    <template slot-scope="scope">
                      <a href="#" v-on:click.prevent="showFilm(scope.row.id)" title="Просмотр"><i class="fa fa-film" aria-hidden="true"></i></a>
                      <a href="#" v-on:click.prevent="copyAdress(scope.row.id)" title="Скопировать"><i class="fa fa-code" aria-hidden="true"></i></a>
                      <a href="#" v-on:click.prevent="videoTiketFlag = true" title="Обновление/Ошибка"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></a>
                      <!-- scope.row.id, scope.row.ru_name -->
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

  import VideoInfo from '~/components/VideoPage/VideoInfo';
  import ShowVideo from '~/components/VideoPage/ShowVideo';
  import FilterForm from '~/components/VideoPage/FilterForm';
  import TelegramForm from '~/components/VideoPage/TelegramForm';
  import SetingsBDForm from '~/components/VideoPage/SetingsBDForm';

  import AddVideoForm from '~/components/VideoPage/AddVideoForm';
  import TranslationsForm from '~/components/VideoPage/TranslationsForm';

  import TiketModal from '~/components/TiketsPage/TiketModal';

  export default {
    name: 'VideoPage',
    components: {
      'player-fin': player,
      'setings-bd-form': SetingsBDForm,

      'add-video-form': AddVideoForm,
      'translations-form': TranslationsForm,

      VideoInfo,
      ShowVideo,
      TiketModal,
      FilterForm,
      TelegramForm
    },
    props: ['type'],
    data(){return{

      videoInfoFlag: false, // Модалка с информацией о фильме
      updateFilmData: null, // данные для модалки, режим редактирования
      videoShowFlag: false, // Модалка предпросмотра фильма
      videoTiketFlag: false, // Модалка тикета
      filterFormFlag: false, // Модалка фильтра
      telegramFormFlag: false,
      setingsFormFlag: false,

      addVideoFormFlag: false,
      translationsFormFlag: false,
      addFileFormFlag: false,

      videoData: null, // Данные от запроса видео для модалки фильтра
      filter: {}, // Объект фильра, заполняется событием из модалки
      videos: [], // Массив видеоматериалов
      count: null,
      search: '', // Строка поиска


      flagFraimeLink: false,
      flagHttpsLink: false,
      flagTelegramLink: false,

      paginations: [],
      paginCount: 20,
      page: 1,

      filmId: 0,
      filmIndex: null,

      filmData: {
        id: 0,
        tupe: 'movie'
      },

      userInfo: null,
      trOpen: {}
    }},
    async created() {
      // хеш для страницы
      if( /page.*?(\d+)/.exec( window.location.hash ) != null) this.page = Number(/page.*?(\d+)/.exec( window.location.hash )[1]);


      // стартовая выборка списка фильмов
      if(this.type == 'films'){
        // this.filter = {};
        this.filter.type = 'movie';
      }else if(this.type == 'serials'){
        // this.filter = {};
        this.filter.type = 'episode';
      }else if(this.type == 'lock'){
        // this.filter = {};
        this.filter.lock = 'yes';
      }

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
        this.telegramFormFlag = false;
        this.setingsFormFlag = false;

        this.addVideoFormFlag = false;
        this.translationsFormFlag = false;
        this.addFileFormFlag = false;
      },

      // Скопировать адрес
      copyAdress: function(id){
        if (this.flagTelegramLink) {
          this.telegramFormFlag = true;
          this.filmId = id;
          return;
        }

        // let link = `://${this.userInfo.domain}/show/${id}`;
        // let link = `https://${this.userInfo.domain}/show/${id}`;
        // let link = `https://cdn0.cloudcdn.xyz/show/${id}`;

        let link = `https://cdn0.cdnhub.help/show/${id}`;
        if (window.location.hostname.includes('.local')) {
          link = `https://nginx.cis-bel-back.orb.local/show/${id}?domain=nginx.cis-bel-back.orb.local`
        }

        // if(this.flagHttpsLink){ link = 'https'+ link; }else{ link = 'http'+ link; }
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

      // Установить фильтр
      fiterSet(filter){
        this.filter = filter;
        this.videosGet();
      },


      clearFilter(){
        this.filter = {};
        this.search = '';
        this.videosGet();
        this.$router.push('video')
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
          search: this.search,
          ...this.filter
        };
        
        this.postMethod('getVideo', params).then((response) => {
          this.count = response.count;
          this.videos = response.items.map(item => {
            if(item.lock != null)item.lock = item.lock.split(',');
            return item;
          });

          this.videoData = response;

          // this.$refs.articles__scrol.scrollTop = 0;
        });
      },
      isTrOpen(id) {
        return !!this.trOpen[id];
      },
      toggleTr(id) {
        this.$set(this.trOpen, id, !this.trOpen[id]);
      }
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

  .icon-movie-edit {
    position: relative;
    top: 2px;
  }
  .icon-movie-edit .fa {
    padding-left: 5px;
    font-size: 18px;
  }


</style>