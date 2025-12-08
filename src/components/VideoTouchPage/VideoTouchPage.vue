<template>
  <div class="main__content">
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

                <div class="videotouch-form">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="form__element-form">
                        <label class="form__label">Тип контента</label>
                        <el-select
                          class="form__input"
                          v-model="form.contentType"
                          placeholder="Выберите тип"
                          style="width: 100%">
                          <el-option
                            v-for="item in contentTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20" style="margin-top: 20px;">
                    <el-col :span="12">
                      <div class="form__element-form">
                        <label class="form__label">Тип идентификатора</label>
                        <el-radio-group v-model="form.identifierType" size="small">
                          <el-radio-button label="imdb">IMDB ID</el-radio-button>
                          <el-radio-button label="kinopoisk">Kinopoisk ID</el-radio-button>
                          <el-radio-button label="vdb">VideoDB ID</el-radio-button>
                        </el-radio-group>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="form__element-form">
                        <label class="form__label">{{ identifierLabel }}</label>
                        <el-input
                          class="form__input"
                          v-model="form.identifier"
                          :placeholder="identifierPlaceholder"
                          clearable>
                        </el-input>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20" style="margin-top: 20px;">
                    <el-col :span="24">
                      <div class="form__element-form">
                        <label class="form__label">Обогащения</label>
                        <div class="enrichments-group">
                          <el-checkbox v-model="form.enrichments.kinopoisk">Kinopoisk</el-checkbox>
                          <el-checkbox v-model="form.enrichments.tmdb">TMDB</el-checkbox>
                          <el-checkbox v-model="form.enrichments.thetvdb">TheTVDB</el-checkbox>
                          <el-checkbox v-model="form.enrichments.fanart">Fanart</el-checkbox>
                          <el-checkbox v-model="form.enrichments.openai">OpenAI</el-checkbox>
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20" style="margin-top: 20px;">
                    <el-col :span="12">
                      <el-checkbox v-model="form.forceImport">Принудительный импорт скриншотов и субтитров</el-checkbox>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20" style="margin-top: 30px;">
                    <el-col :span="24">
                      <el-button
                        type="info"
                        @click="searchContent"
                        :loading="searchLoading"
                        :disabled="!isFormValid">
                        Поиск
                      </el-button>
                      <el-button
                        type="primary"
                        @click="syncContent"
                        :loading="syncLoading"
                        :disabled="!isFormValid">
                        Синхронизировать
                      </el-button>
                    </el-col>
                  </el-row>
                </div>

                <div v-if="searchResult" class="search-result" style="margin-top: 30px;">
                  <h3>Результат поиска</h3>
                  <el-card>
                    <div v-if="searchResult.status === 'found'">
                      <p><strong>VDB ID:</strong> {{ searchResult.content.vdb_id }}</p>
                      <p><strong>Название:</strong> {{ searchResult.content.title }}</p>
                      <p><strong>Русское название:</strong> {{ searchResult.content.ru_title }}</p>
                      <p><strong>IMDB ID:</strong> {{ searchResult.content.imdb_id }}</p>
                      <p><strong>Kinopoisk ID:</strong> {{ searchResult.content.kinopoisk_id }}</p>
                      <p><strong>Тип:</strong> {{ searchResult.content.type }}</p>
                      <p><strong>Медиа файлов:</strong> {{ searchResult.content.media_count }}</p>
                    </div>
                    <div v-else-if="searchResult.status === 'not_found'">
                      <el-alert
                        title="Контент не найден"
                        :description="searchResult.message"
                        type="warning"
                        :closable="false">
                      </el-alert>
                    </div>
                    <div v-else-if="searchResult.status === 'error'">
                      <el-alert
                        title="Ошибка"
                        :description="getErrorDescription(searchResult)"
                        type="error"
                        :closable="false">
                      </el-alert>
                    </div>
                  </el-card>
                </div>

                <div v-if="syncResult" class="sync-result" style="margin-top: 30px;">
                  <h3>Результат синхронизации</h3>
                  <el-card>
                    <div v-if="syncResult.status === 'success'">
                      <el-alert
                        title="Синхронизация выполнена успешно"
                        type="success"
                        :closable="false"
                        style="margin-bottom: 15px;">
                      </el-alert>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <h4>Контент</h4>
                          <p><strong>VDB ID:</strong> {{ syncResult.content.vdb_id }}</p>
                          <p><strong>Название:</strong> {{ syncResult.content.title }}</p>
                          <p><strong>Русское название:</strong> {{ syncResult.content.ru_title }}</p>
                        </el-col>
                        <el-col :span="12" v-if="syncResult.video">
                          <h4>Видео</h4>
                          <p><strong>ID:</strong> {{ syncResult.video.id }}</p>
                          <p><strong>Название:</strong> {{ syncResult.video.name }}</p>
                          <p><strong>Новое:</strong> {{ syncResult.video.is_new ? 'Да' : 'Нет' }}</p>
                          <p><strong>Обновлено:</strong> {{ syncResult.video.was_updated ? 'Да' : 'Нет' }}</p>
                        </el-col>
                      </el-row>

                      <h4 style="margin-top: 15px;">Статистика</h4>
                      <el-row :gutter="20">
                        <el-col :span="6">
                          <div class="stat-item">
                            <span class="stat-value">{{ syncResult.stats.new_videos }}</span>
                            <span class="stat-label">Новых видео</span>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="stat-item">
                            <span class="stat-value">{{ syncResult.stats.new_files || 0 }}</span>
                            <span class="stat-label">Новых файлов</span>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="stat-item">
                            <span class="stat-value">{{ syncResult.stats.files_processed }}</span>
                            <span class="stat-label">Файлов обработано</span>
                          </div>
                        </el-col>
                        <el-col :span="6">
                          <div class="stat-item">
                            <span class="stat-value">{{ syncResult.stats.enrichments_run }}</span>
                            <span class="stat-label">Обогащений</span>
                          </div>
                        </el-col>
                      </el-row>

                      <div v-if="syncResult.timings" style="margin-top: 15px;">
                        <p><strong>Время выполнения:</strong> {{ syncResult.timings.total_ms }} мс</p>
                      </div>
                    </div>

                    <div v-else-if="syncResult.status === 'not_found' || syncResult.status === 'no_media'">
                      <el-alert
                        :title="syncResult.status === 'not_found' ? 'Контент не найден' : 'Нет медиа файлов'"
                        :description="syncResult.message"
                        type="warning"
                        :closable="false">
                      </el-alert>
                    </div>

                    <div v-else-if="syncResult.status === 'error'">
                      <el-alert
                        title="Ошибка синхронизации"
                        :description="getErrorDescription(syncResult)"
                        type="error"
                        :closable="false">
                      </el-alert>
                    </div>
                  </el-card>

                  <div v-if="syncResult.logs && syncResult.logs.length > 0" style="margin-top: 20px;">
                    <el-collapse>
                      <el-collapse-item title="Журнал операций" name="logs">
                        <pre class="logs-content">{{ syncResult.logs.join('\n') }}</pre>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
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
import axios from 'axios';

export default {
  name: 'VideoTouchPage',

  data: () => ({
    form: {
      contentType: 'movie',
      identifierType: 'imdb',
      identifier: '',
      enrichments: {
        kinopoisk: true,
        tmdb: true,
        thetvdb: false,
        fanart: true,
        openai: false
      },
      forceImport: false
    },
    contentTypes: [
      { value: 'movie', label: 'Фильм' },
      { value: 'tvseries', label: 'Сериал' },
      { value: 'anime-tv-series', label: 'Аниме сериал' },
      { value: 'show-tv-series', label: 'Шоу' }
    ],
    searchLoading: false,
    syncLoading: false,
    searchResult: null,
    syncResult: null
  }),

  computed: {
    title() {
      return this.$router.currentRoute.meta.title;
    },
    identifierLabel() {
      switch (this.form.identifierType) {
        case 'imdb': return 'IMDB ID';
        case 'kinopoisk': return 'Kinopoisk ID';
        case 'vdb': return 'VideoDB ID';
        default: return 'ID';
      }
    },
    identifierPlaceholder() {
      switch (this.form.identifierType) {
        case 'imdb': return 'tt1234567';
        case 'kinopoisk': return '123456';
        case 'vdb': return '12345';
        default: return '';
      }
    },
    isFormValid() {
      return this.form.contentType && this.form.identifier.trim() !== '';
    }
  },

  methods: {
    getErrorDescription(result) {
      if (result.error) {
        return result.error;
      }
      if (result.errors && result.errors.length > 0) {
        return result.errors.join(', ');
      }
      return 'Неизвестная ошибка';
    },

    buildRequestData() {
      const data = {
        content_type: this.form.contentType,
        enrichments: this.form.enrichments,
        force_import: this.form.forceImport
      };

      switch (this.form.identifierType) {
        case 'imdb':
          data.imdb_id = this.form.identifier;
          break;
        case 'kinopoisk':
          data.kinopoisk_id = this.form.identifier;
          break;
        case 'vdb':
          data.vdb_id = this.form.identifier;
          break;
      }

      return data;
    },

    async searchContent() {
      this.searchLoading = true;
      this.searchResult = null;
      this.syncResult = null;

      try {
        const data = this.buildRequestData();
        const token = this.$store.state.user.token;

        const response = await axios.get('/api/videotouch/search', {
          params: data,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.searchResult = response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          this.searchResult = error.response.data;
        } else {
          this.searchResult = {
            status: 'error',
            error: error.message || 'Неизвестная ошибка'
          };
        }
      } finally {
        this.searchLoading = false;
      }
    },

    async syncContent() {
      this.syncLoading = true;
      this.syncResult = null;

      try {
        const data = this.buildRequestData();
        const token = this.$store.state.user.token;

        const response = await axios.post('/api/videotouch/sync', data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        this.syncResult = response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          this.syncResult = error.response.data;
        } else {
          this.syncResult = {
            status: 'error',
            error: error.message || 'Неизвестная ошибка'
          };
        }
      } finally {
        this.syncLoading = false;
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.videotouch-form {
  max-width: 800px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.enrichments-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.search-result,
.sync-result {
  max-width: 800px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #38cf99;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.logs-content {
  font-family: monospace;
  font-size: 12px;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
