<template>
  <el-dialog
    title="Редактировать тег"
    :visible.sync="visible"
    :before-close="close"
    width="500px">
    
    <el-form :model="form" :rules="rules" ref="tagUpdateForm" label-width="120px">
      <el-form-item label="Название" prop="name">
        <el-input v-model="form.name" placeholder="Введите название тега"></el-input>
      </el-form-item>
      
      <el-form-item label="Значение" prop="value">
        <el-input
          v-model="form.value"
          type="textarea"
          :rows="5"
          placeholder="Введите значение тега">
        </el-input>
      </el-form-item>
      
      <el-form-item label="Тип" prop="type">
        <el-select v-model="form.type" placeholder="Выберите тип тега" style="width: 100%">
          <el-option label="Domain Type" value="domain_type"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">Отмена</el-button>
      <el-button type="primary" @click="submitForm">Сохранить</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalFormUpdateTag',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tag: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: '',
        value: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите название тега', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'Пожалуйста, введите значение тега', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Пожалуйста, введите тип тега', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadTagData();
  },
  methods: {
    submitForm() {
      this.$refs.tagUpdateForm.validate((valid) => {
        if (valid) {
          this.postMethod('domaintags.update', {
            id: this.tag.id,
            name: this.form.name,
            value: this.form.value,
            type: this.form.type
          }).then(() => {
            this.close();
          }).catch(error => {
            console.log(error);
          });
        }
      });
    },
    
    loadTagData() {
      if (this.tag && this.tag.id) {
        this.form = {
          name: this.tag.name || '',
          value: this.tag.value || '',
          type: this.tag.type || 'domain_type'
        };
      }
    },
    
    resetForm() {
      this.form = {
        name: '',
        value: '',
        type: ''
      };
      if (this.$refs.tagUpdateForm) {
        this.$refs.tagUpdateForm.resetFields();
      }
    },
    
    close() {
      this.resetForm();
      this.$emit('close');
    }
  },
  
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadTagData();
      } else {
        this.resetForm();
      }
    },
    tag: {
      handler(newTag) {
        if (this.visible && newTag) {
          this.loadTagData();
        }
      },
      immediate: true
    }
  }
}
</script>
