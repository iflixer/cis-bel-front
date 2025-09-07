<template>
  <div>
    <el-dialog
      title="Редактирование CDN"
      :visible.sync="formShow" 
      width="650px" 
      center>
      <el-row :gutter="20">
        <el-col :span="12">

          <div class="element-form" :class="{ 'element-form--error': validList[0].error }">
            <label for="" class="element-form__label">Хост <span class="element-form__label-req">*</span></label>
            <el-input v-model="editCdn.host" clearable></el-input>
          </div>

          <div class="element-form" :class="{ 'element-form--error': validList[1].error }">
            <label for="" class="element-form__label">Вес <span class="element-form__label-req">*</span></label>
            <el-input-number v-model="editCdn.weight" :min="0" :max="100" controls-position="right"></el-input-number>
          </div>

        </el-col>
        <el-col :span="12">

          <div class="element-form">
            <label for="" class="element-form__label">Статус</label>
            <div class="element-form__contener">
              <el-radio v-model="editCdn.active" :label="1">Активен</el-radio>
            </div>
            <div class="element-form__contener">
              <el-radio v-model="editCdn.active" :label="0">Неактивен</el-radio>
            </div>
          </div>

          <div class="element-form">
            <label for="" class="element-form__label">Комментарий</label>
            <el-input 
              v-model="editCdn.comment" 
              type="textarea" 
              :rows="3"
              placeholder="Описание или комментарий к CDN"
              clearable>
            </el-input>
          </div>
          
        </el-col>
      </el-row>
      
      <div class="cdn-info">
        <h4>Дополнительная информация</h4>
        <p><strong>ID:</strong> {{ editCdn.id }}</p>
        <p><strong>Имя узла:</strong> {{ editCdn.node_name || '—' }}</p>
        <p><strong>Последний отчет:</strong> {{ formatDate(editCdn.last_report) }}</p>
        <p><strong>Трафик TX:</strong> {{ editCdn.tx || 0 }} байт</p>
        <p><strong>Трафик RX:</strong> {{ editCdn.rx || 0 }} байт</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">Отмена</el-button>
        <el-button type="primary" @click="updateCdnSend()" :loading="saving">Сохранить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CDNEditModal',
  props: ['visible', 'cdn'],
  data: function(){
    return {
      editCdn: null,
      saving: false,
      validList: [
        { item: 'host', error: false, text: 'Незаполнен хост' },
        { item: 'weight', error: false, text: 'Незаполнен вес' }
      ],
      errorList: []
    }
  },

  computed: {
    formShow: {
      get() { 
        return this.visible; 
      },
      set(value) { 
        if(!value) this.$emit('close');
      }
    }
  },

  created: function () {
    this.editCdn = Object.assign({}, this.cdn);
    this.editCdn.active = parseInt(this.editCdn.active);
  },

  methods: {
    updateCdnSend: function(){
      this.errorList = [];

      for (let i = 0; i < this.validList.length; i++) {
        this.validList[i].error = false;
      }

      for (let i = 0; i < this.validList.length; i++) {
        const fieldValue = this.editCdn[this.validList[i].item];
        if (fieldValue === '' || fieldValue === null || fieldValue === undefined) {
          this.validList[i].error = true;
          this.errorList.push(this.validList[i].text);
        }
      }

      if (this.editCdn.weight < 0 || this.editCdn.weight > 100) {
        this.validList[1].error = true;
        this.errorList.push('Вес должен быть от 0 до 100');
      }

      if(this.errorList.length != 0){ 
        this.$message.error(this.errorList.join(', '));
        return; 
      }

      this.saving = true;

      this.postMethod('cdns.update', {
        id: this.editCdn.id,
        host: this.editCdn.host,
        weight: this.editCdn.weight,
        active: this.editCdn.active,
        comment: this.editCdn.comment || ''
      }).then(() => {
        this.saving = false;
        this.formShow = false;
        this.$message.success('CDN успешно обновлен');
      }).catch(error => {
        this.saving = false;
        this.$message.error('Ошибка при обновлении CDN');
      });
    },

    formatDate(dateString) {
      if (!dateString) return '—';
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.cdn-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  
  h4 {
    margin-bottom: 10px;
    color: #333;
    font-size: 14px;
  }
  
  p {
    margin: 5px 0;
    color: #666;
    font-size: 13px;
    
    strong {
      color: #333;
    }
  }
}

.element-form {
  margin-bottom: 15px;
  
  &--error {
    .element-form__label {
      color: #f56c6c;
    }
    
    .el-input__inner,
    .el-textarea__inner {
      border-color: #f56c6c;
    }
  }
}

.element-form__label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  
  &-req {
    color: #f56c6c;
  }
}

.element-form__contener {
  margin-bottom: 8px;
}
</style>