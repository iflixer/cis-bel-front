<template>
  <el-dialog
    title="Создание типа домена"
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
          show-word-limit>
        </el-input>
      </div>

      <div class="form__element-form">
        <label class="form__label">Значение</label>
        <el-input 
          v-model="form.value" 
          placeholder="Введите значение типа домена (английскими буквами)"
          class="form__input"
          :maxlength="255"
          show-word-limit>
        </el-input>
      </div>
    </form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">Отмена</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">Создать</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalFormAddType',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: false,
      form: {
        name: '',
        value: ''
      }
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        this.resetForm();
      }
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
        name: '',
        value: ''
      };
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

      this.loading = true;
      
      this.postMethod('domaintypes.add', {
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