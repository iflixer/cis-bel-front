<template>
  <el-dialog
    title="Создать тег"
    :visible.sync="visible"
    :before-close="close"
    width="500px">
    
    <el-form :model="form" :rules="rules" ref="tagForm" label-width="120px">
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
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">Отмена</el-button>
      <el-button type="primary" @click="submitForm">Создать</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalFormAddTag',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        value: ''
      },
      rules: {
        name: [
          { required: true, message: 'Пожалуйста, введите название тега', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'Пожалуйста, введите значение тега', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          this.postMethod('domaintags.add', {
            name: this.form.name,
            value: this.form.value
          }).then(() => {
            this.resetForm();
            this.close();
          }).catch(error => {
            console.log(error);
          });
        }
      });
    },
    
    resetForm() {
      this.form = {
        name: '',
        value: ''
      };
      if (this.$refs.tagForm) {
        this.$refs.tagForm.resetFields();
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
        this.resetForm();
      }
    }
  }
}
</script>
