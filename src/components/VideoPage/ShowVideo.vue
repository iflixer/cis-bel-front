<template>
  <div>
    <el-dialog
      title="Предпросмотр"
      :visible.sync="visibleStep"
      width="800px"
      :before-close="close">

      <div v-if="visibleStep && videoId > 0" style="position:relative;padding-bottom:53.10%;padding-top:25px;height:0">
        <iframe :src="`${playerBase}/show/${videoId}`" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import player from '~/assets/js/vendor/player/src/App';
  export default {
    name: 'ShowVideo',
    computed: {
      playerBase () {
        if (window.location.hostname.includes('.local')) {
          return 'https://nginx.cis-bel-back.orb.local'
        }
        return 'https://player0.flixcdn.space'
      }
    },
    components: {
      'player-fin': player
    },
    props: ['visible', 'data'],
    data: () => ({
      visibleStep: false,
      videoId: 0,
      // dataFilm: null
    }),

    async created() {
    },
    
    watch: {
      visible: function (newValue) {
        if(newValue) this.visibleStep = true;
      },

      data: function (newValue) {
        this.getVideoData(newValue);
      },
    },
    methods: {
      close(){
        this.visibleStep = false;
        // this.dataFilm = null;
        this.$emit('close');
      },

      getVideoData(id){
        if(id != 0){
          this.videoId = id;
          /*this.postMethod('videos.dataFilm', {id}).then(({dataplayer, playList}) => {
            this.dataFilm = { style: JSON.parse(dataplayer), list: playList};
          });*/
        }
      },


    }
  }
</script>

<style lang='scss' scoped>

</style>