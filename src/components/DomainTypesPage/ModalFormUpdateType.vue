<template>
  <el-dialog
    title="Редактирование типа домена"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="closeModal">
    
    <form @submit.prevent="submitForm">
      <div class="form__element-form">
        <label class="form__label">Название</label>
        <el-input 
          v-model="form.name" 
          placeholder="Введите название типа домена"
          class="form__input"
          :maxlength="255"
          show-word-limit
          @input="enableAutoTransliteration">
        </el-input>
      </div>

      <div class="form__element-form">
        <label class="form__label">Значение</label>
        <el-input 
          v-model="form.value" 
          placeholder="Введите значение типа домена (английскими буквами)"
          class="form__input"
          :maxlength="255"
          show-word-limit
          @input="disableAutoTransliteration">
        </el-input>
      </div>
    </form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">Отмена</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">Сохранить</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { transliterationMixin } from '~/utils/transliteration';

export default {
  name: 'ModalFormUpdateType',
  mixins: [transliterationMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    domainType: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: false,
      form: {
        id: null,
        name: '',
        value: ''
      }
    }
  },
  mounted() {
    this.setupAutoTransliteration('form.name', 'form.value');
    if (this.visible && this.domainType) {
      this.loadFormData();
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        this.$nextTick(() => {
          this.loadFormData();
        });
      }
    },
    domainType: {
      handler(newVal) {
        if (newVal && this.visible) {
          this.$nextTick(() => {
            this.loadFormData();
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.dialogVisible = false;
      this.resetForm();
      this.$emit('close');
    },

    resetForm() {
      this.form = {
        id: null,
        name: '',
        value: ''
      };
      this.disableAutoTransliteration();
    },

    loadFormData() {
      if (this.domainType && this.domainType.id) {
        this.form = {
          id: this.domainType.id,
          name: this.domainType.name || '',
          value: this.domainType.value || ''
        };
      }
    },

    submitForm() {
      if (!this.form.name.trim()) {
        this.$message.error('Введите название типа домена');
        return;
      }

      if (!this.form.value.trim()) {
        this.$message.error('Введите значение типа домена');
        return;
      }

      if (!this.form.id) {
        this.$message.error('Не указан ID типа домена');
        return;
      }

      this.loading = true;
      
      this.postMethod('domaintypes.update', {
        id: this.form.id,
        name: this.form.name.trim(),
        value: this.form.value.trim()
      })
      .then(() => {
        this.loading = false;
        this.closeModal();
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.form__element-form {
  margin-bottom: 20px;
}

.form__label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form__input {
  width: 100%;
}
</style>