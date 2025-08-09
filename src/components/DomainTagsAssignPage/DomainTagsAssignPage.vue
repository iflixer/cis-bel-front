<template>
  <div class="main__content">

    <manage-domain-tags-modal
      v-if="manageModal"
      :visible="manageModal"
      :domain="domains[index]"
      :all-tags="allTags"
      @close="closeModal"/>

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
                  <el-table :data="domains" stripe style="width: 100%">
                    <el-table-column prop="name" label="Домен" width="260"/>
                    <el-table-column prop="user_email" label="Почта пользователя" width="260"/>
                    <el-table-column label="Теги">
                      <template slot-scope="scope">
                        <template v-if="scope.row.tags && scope.row.tags.length">
                          <span v-for="t in scope.row.tags" :key="t.id" class="tag tag--icon tag-color--gray tag--icon--icon">{{ t.name }}</span>
                        </template>
                        <span v-else style="color:#999">Нет</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="" width="140">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                          <div class="table__button" @click="openManage(scope.$index)"><i class="el-icon-setting"></i></div>
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
import ManageDomainTagsModal from '~/components/DomainTagsAssignPage/ManageDomainTagsModal';

export default {
  name: 'DomainTagsAssignPage',
  components: { 'manage-domain-tags-modal': ManageDomainTagsModal },
  data(){
    return {
      domains: [],
      allTags: [],
      manageModal: false,
      index: 0
    }
  },
  created(){
    this.loadData();
  },
  computed: {
    title(){ return this.$router.currentRoute.meta.title },
  },
  methods: {
    async loadData(){
      try{
        const [domains, tags] = await Promise.all([
          this.postMethod('domaintags.domainsList', {}),
          this.postMethod('domaintags.getAll', {})
        ]);
        this.domains = domains;
        this.allTags = tags;
      }catch(e){ console.log(e); }
    },
    openManage(i){
      this.index = i;
      this.$nextTick(() => { this.manageModal = true; });
    },
    closeModal(){
      this.manageModal = false;
      this.loadData();
    }
  }
}
</script>

<style lang="scss" scoped>
.table__buttons{ display:flex; justify-content:flex-end; align-items:center; gap:8px; }
.table__buttons .table__button{ float:none; margin-left:0; }
</style>

