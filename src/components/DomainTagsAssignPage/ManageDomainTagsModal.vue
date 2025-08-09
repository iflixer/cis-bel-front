<template>
  <el-dialog
    title="Управление тегами домена"
    :visible.sync="visible"
    :before-close="close"
    width="520px">

    <div class="element-form">
      <label class="element-form__label">Домен</label>
      <div>{{ (domain && domain.name) ? domain.name : '' }}</div>
    </div>

    <el-form :model="form" label-width="120px">
      <el-form-item label="Теги">
        <el-select v-model="form.tag_ids" multiple filterable placeholder="Выберите теги" style="width:100%">
          <el-option v-for="t in allTags" :key="t.id" :label="t.name" :value="t.id">
            <span>{{ t.name }}</span>
            <span style="color:#999; margin-left:6px">— {{ t.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">Отмена</el-button>
      <el-button type="primary" @click="save">Сохранить</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ManageDomainTagsModal',
  props: {
    visible: { type: Boolean, default: false },
    domain: { type: Object, default: () => ({}) },
    allTags: { type: Array, default: () => [] }
  },
  data(){
    return {
      form: { tag_ids: [] }
    }
  },
  created(){
    this.init();
  },
  methods: {
    init(){
      const list = (this.domain && this.domain.tags) ? this.domain.tags : [];
      const current = list.map(t => t.id);
      this.form.tag_ids = current;
    },
    save(){
      this.postMethod('domaintags.setForDomain', {
        domain_id: this.domain.id,
        tag_ids: this.form.tag_ids
      }).then(() => { this.close(); })
    },
    close(){
      this.$emit('close');
      this.form.tag_ids = [];
    }
  },
  watch: {
    visible(v){ if(v) { this.init(); } },
    domain: {
      handler(){ if(this.visible) { this.init(); } },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.element-form__desc{ color:#666; font-size:12px; margin-top:4px; }
</style>
