<template>
  <div>
    <el-dialog
      title="Live статистика просмотров"
      :visible.sync="formShow"
      width="900px"
      center
      @open="onOpen"
      @closed="onClosed">

      <div class="live-controls">
        <el-select
          v-model="selectedDomainId"
          filterable
          placeholder="Выберите домен"
          @change="onDomainChange"
          style="width: 300px;">
          <el-option
            v-for="domain in domains"
            :key="domain.id"
            :label="domain.name"
            :value="domain.id">
          </el-option>
        </el-select>

        <div class="live-status" v-if="selectedDomainId">
          <span class="live-indicator" :class="{ active: refreshing }"></span>
          <span class="live-text">{{ refreshing ? 'Обновление...' : 'Авто-обновление каждые 10с' }}</span>
          <span class="live-count" v-if="total > 0">{{ total }} событий за час</span>
        </div>
      </div>

      <el-table
        :data="events"
        stripe
        max-height="450"
        v-loading="loadingEvents"
        style="width: 100%; margin-top: 15px;">
        <el-table-column
          prop="created_at"
          label="Время"
          width="170"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP адрес"
          width="150">
        </el-table-column>
        <el-table-column
          prop="domain_name"
          label="Домен"
          width="200">
        </el-table-column>
        <el-table-column
          prop="video_name"
          label="Видео"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>

      <div class="no-data-live" v-if="!loadingEvents && selectedDomainId && events.length === 0">
        <p>Нет событий за последний час</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">Закрыть</el-button>
        <el-button type="primary" @click="fetchLiveEvents" :loading="refreshing" :disabled="!selectedDomainId">Обновить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LiveStatsModal',
  props: ['visible'],
  data() {
    return {
      domains: [],
      selectedDomainId: null,
      events: [],
      total: 0,
      loadingEvents: false,
      refreshing: false,
      refreshInterval: null
    }
  },

  computed: {
    formShow: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.$emit('close');
      }
    }
  },

  beforeDestroy() {
    this.stopAutoRefresh();
  },

  methods: {
    onOpen() {
      this.loadDomains();
    },

    onClosed() {
      this.stopAutoRefresh();
      this.selectedDomainId = null;
      this.events = [];
      this.total = 0;
      this.domains = [];
    },

    async loadDomains() {
      try {
        const response = await this.postMethod('livestats.getDomains', {});
        if (response && response.domains) {
          this.domains = response.domains;
        }
      } catch (error) {
        this.$message.error('Ошибка загрузки доменов');
      }
    },

    onDomainChange() {
      this.stopAutoRefresh();
      this.events = [];
      this.total = 0;
      if (this.selectedDomainId) {
        this.fetchLiveEvents();
        this.startAutoRefresh();
      }
    },

    async fetchLiveEvents() {
      if (!this.selectedDomainId) return;

      this.refreshing = true;
      if (this.events.length === 0) {
        this.loadingEvents = true;
      }

      try {
        const response = await this.postMethod('livestats.getLive', {
          domain_id: this.selectedDomainId
        });
        if (response) {
          this.events = response.events || [];
          this.total = response.total || 0;
        }
      } catch (error) {
        this.$message.error('Ошибка загрузки событий');
      } finally {
        this.refreshing = false;
        this.loadingEvents = false;
      }
    },

    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.fetchLiveEvents();
      }, 10000);
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },

    formatTime(row, column, cellValue) {
      if (!cellValue) return '—';
      const date = new Date(cellValue);
      return date.toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.live-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.live-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67c23a;
  display: inline-block;

  &.active {
    animation: pulse 1s infinite;
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.live-text {
  color: #999;
}

.live-count {
  font-weight: 600;
  color: #409eff;
}

.no-data-live {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
