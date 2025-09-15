<template>
  <div class="main__content">

    <el-dialog
        :title="isEditing ? 'Редактировать гео-группу' : 'Создать гео-группу'"
        :visible.sync="modalVisible"
        :before-close="closeModal"
        width="900px">

      <el-form :model="geoGroupForm" :rules="formRules" ref="geoGroupForm" label-width="120px">
        <el-form-item label="Название" prop="name">
          <el-input v-model="geoGroupForm.name" placeholder="Введите название группы"></el-input>
        </el-form-item>

        <el-form-item label="Страны">
          <div class="country-transfer">
            <div class="transfer-panel">
              <div class="transfer-list">
                <div class="transfer-header">
                  <h4>Доступные страны</h4>
                  <span class="transfer-count">{{ availableCountries.length }}</span>
                </div>
                <div class="transfer-search">
                  <el-input
                      v-model="availableSearch"
                      placeholder="Поиск..."
                      size="small"
                      prefix-icon="el-icon-search"
                      clearable>
                  </el-input>
                </div>
                <div class="transfer-body">
                  <div
                      v-for="country in filteredAvailableCountries"
                      :key="'available-' + country.id"
                      :class="['transfer-item', { 'selected': selectedAvailableCountries.includes(country.id) }]"
                      @click="toggleAvailableSelection(country.id)">
                    <span class="country-name">{{ country.name }}</span>
                    <span class="country-code">({{ country.iso_code }})</span>
                  </div>
                </div>
              </div>

              <div class="transfer-buttons">
                <el-button
                    type="primary"
                    icon="el-icon-arrow-right"
                    size="small"
                    :disabled="selectedAvailableCountries.length === 0"
                    @click="addCountriesToGroup">
                </el-button>
                <el-button
                    type="primary"
                    icon="el-icon-arrow-left"
                    size="small"
                    :disabled="selectedAssignedCountries.length === 0"
                    @click="removeCountriesFromGroup">
                </el-button>
              </div>

              <div class="transfer-list">
                <div class="transfer-header">
                  <h4>Страны в группе</h4>
                  <span class="transfer-count">{{ assignedCountries.length }}</span>
                </div>
                <div class="transfer-search">
                  <el-input
                      v-model="assignedSearch"
                      placeholder="Поиск..."
                      size="small"
                      prefix-icon="el-icon-search"
                      clearable>
                  </el-input>
                </div>
                <div class="transfer-body">
                  <div
                      v-for="country in filteredAssignedCountries"
                      :key="'assigned-' + country.id"
                      :class="['transfer-item', { 'selected': selectedAssignedCountries.includes(country.id) }]"
                      @click="toggleAssignedSelection(country.id)">
                    <span class="country-name">{{ country.name }}</span>
                    <span class="country-code">({{ country.iso_code }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal">Отмена</el-button>
        <el-button type="primary" @click="saveGeoGroup" :loading="saving">
          {{ isEditing ? 'Обновить' : 'Создать' }}
        </el-button>
      </span>
    </el-dialog>

    <div class="content-site">
      <slot name="menu"></slot>
      <div>
        <slot name="header"></slot>
        <main>
          <div class="main">

            <section class="section">
              <div>
                <h2 class="section__title">{{ title }}</h2>

                <div class="section__title-buttons">
                  <div class="section__title-button" @click="createGeoGroup">
                    <i class="icon el-icon-plus"></i>
                    Создать группу
                  </div>
                </div>

              </div>
              <div class="section__content">

                <section class="articles">
                  <el-table
                      :data="geoGroupsList"
                      stripe
                      style="width: 100%"
                      v-loading="loading">

                    <el-table-column
                        prop="name"
                        label="Название группы"
                        min-width="200">
                    </el-table-column>

                    <el-table-column
                        prop="countries_count"
                        label="Количество стран"
                        width="150">
                    </el-table-column>

                    <el-table-column
                        label="Страны"
                        min-width="300">
                      <template slot-scope="scope">
                        <el-tag
                            v-for="country in (scope.row.countries || []).slice(0, 3)"
                            :key="country.id"
                            size="mini"
                            style="margin-right: 5px;">
                          {{ country.name }}
                        </el-tag>
                        <span v-if="scope.row.countries && scope.row.countries.length > 3">
                          и еще {{ scope.row.countries.length - 3 }}...
                        </span>
                      </template>
                    </el-table-column>

                    <el-table-column
                        label="Обновлено"
                        width="150">
                      <template slot-scope="scope">
                        {{ formatDate(scope.row.updated_at || scope.row.created_at) }}
                      </template>
                    </el-table-column>

                    <el-table-column
                        label="Действия"
                        width="120">
                      <template slot-scope="scope">
                        <div class="table__buttons">
                          <div class="table__button" @click="editGeoGroup(scope.row)" title="Редактировать">
                            <i class="el-icon-edit"></i>
                          </div>
                          <div class="table__button table__button--danger" @click="deleteGeoGroup(scope.row)"
                               title="Удалить">
                            <i class="el-icon-delete"></i>
                          </div>
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
export default {
  name: 'GeoGroupsPage',
  data() {
    return {
      title: 'Управление гео-группами',
      loading: false,
      saving: false,
      geoGroupsList: [],
      allCountries: [],
      modalVisible: false,
      isEditing: false,
      currentGeoGroupId: null,

      geoGroupForm: {
        name: ''
      },

      formRules: {
        name: [
          {required: true, message: 'Пожалуйста, введите название группы', trigger: 'blur'},
          {min: 2, max: 100, message: 'Длина должна быть от 2 до 100 символов', trigger: 'blur'}
        ]
      },

      selectedAvailableCountries: [],
      selectedAssignedCountries: [],
      assignedCountries: [],
      availableSearch: '',
      assignedSearch: ''
    };
  },

  computed: {
    availableCountries() {
      if (!this.allCountries || !Array.isArray(this.allCountries)) {
        return [];
      }

      if (this.isEditing && this.assignedCountries && Array.isArray(this.assignedCountries)) {
        return this.allCountries.filter(country =>
            !country.geo_group_id || this.assignedCountries.find(assigned => assigned.id === country.id)
        );
      }

      return this.allCountries.filter(country => !country.geo_group_id);
    },

    filteredAvailableCountries() {
      if (!this.availableSearch) {
        return this.availableCountries;
      }
      const search = this.availableSearch.toLowerCase();
      return this.availableCountries.filter(country =>
          country.name.toLowerCase().includes(search) ||
          country.iso_code.toLowerCase().includes(search)
      );
    },

    filteredAssignedCountries() {
      if (!this.assignedSearch) {
        return this.assignedCountries;
      }
      const search = this.assignedSearch.toLowerCase();
      return this.assignedCountries.filter(country =>
          country.name.toLowerCase().includes(search) ||
          country.iso_code.toLowerCase().includes(search)
      );
    }
  },

  async created() {
    this.loadGeoGroups();
    this.loadCountries();
  },

  methods: {
    async loadGeoGroups() {
      this.loading = true;
      try {
        const response = await this.getMethod('geogroups.get');
        this.geoGroupsList = response;
      } catch (error) {
        this.$message.error('Ошибка при загрузке гео-групп');
        console.error('Error loading geo groups:', error);
      } finally {
        this.loading = false;
      }
    },

    async loadCountries() {
      try {
        const response = await this.getMethod('geogroups.countries');
        this.allCountries = response;
      } catch (error) {
        this.$message.error('Ошибка при загрузке списка стран');
        console.error('Error loading countries:', error);
      }
    },

    createGeoGroup() {
      this.isEditing = false;
      this.currentGeoGroupId = null;
      this.geoGroupForm = {name: ''};
      this.assignedCountries = [];
      this.selectedAvailableCountries = [];
      this.selectedAssignedCountries = [];
      this.availableSearch = '';
      this.assignedSearch = '';
      this.modalVisible = true;
    },

    editGeoGroup(geoGroup) {
      this.isEditing = true;
      this.currentGeoGroupId = geoGroup.id;
      this.geoGroupForm = {name: geoGroup.name};
      this.assignedCountries = [...geoGroup.countries];
      this.selectedAvailableCountries = [];
      this.selectedAssignedCountries = [];
      this.availableSearch = '';
      this.assignedSearch = '';
      this.modalVisible = true;
    },

    closeModal() {
      this.modalVisible = false;
      this.$refs.geoGroupForm.resetFields();
    },

    toggleAvailableSelection(countryId) {
      const index = this.selectedAvailableCountries.indexOf(countryId);
      if (index > -1) {
        this.selectedAvailableCountries.splice(index, 1);
      } else {
        this.selectedAvailableCountries.push(countryId);
      }
    },

    toggleAssignedSelection(countryId) {
      const index = this.selectedAssignedCountries.indexOf(countryId);
      if (index > -1) {
        this.selectedAssignedCountries.splice(index, 1);
      } else {
        this.selectedAssignedCountries.push(countryId);
      }
    },

    addCountriesToGroup() {
      const countriesToAdd = this.allCountries.filter(country =>
          this.selectedAvailableCountries.includes(country.id)
      );

      this.assignedCountries = [...this.assignedCountries, ...countriesToAdd];
      this.selectedAvailableCountries = [];
    },

    removeCountriesFromGroup() {
      this.assignedCountries = this.assignedCountries.filter(country =>
          !this.selectedAssignedCountries.includes(country.id)
      );
      this.selectedAssignedCountries = [];
    },

    async saveGeoGroup() {
      this.$refs.geoGroupForm.validate(async (valid) => {
        if (!valid) return;

        this.saving = true;
        try {
          const data = {
            name: this.geoGroupForm.name,
            country_ids: this.assignedCountries.map(country => country.id)
          };

          let response;
          if (this.isEditing) {
            data.id = this.currentGeoGroupId;
            response = await this.postMethod('geogroups.update', data);
          } else {
            response = await this.postMethod('geogroups.create', data);
          }

          if (response.status === 'success') {
            this.$message.success(response.message);
            this.closeModal();
            this.loadGeoGroups();
          } else {
            this.$message.error(response.message || 'Произошла ошибка');
          }
        } catch (error) {
          this.$message.error('Ошибка при сохранении гео-группы');
          console.error('Error saving geo group:', error);
        } finally {
          this.saving = false;
        }
      });
    },

    deleteGeoGroup(geoGroup) {
      this.$confirm(
          `Вы действительно хотите удалить группу "${geoGroup.name}"? Страны будут отвязаны от группы.`,
          'Подтверждение удаления',
          {
            confirmButtonText: 'Удалить',
            cancelButtonText: 'Отмена',
            type: 'warning'
          }
      ).then(async () => {
        try {
          const response = await this.postMethod('geogroups.delete', {id: geoGroup.id});

          if (response.status === 'success') {
            this.$message.success(response.message);
            this.loadGeoGroups();
          } else {
            this.$message.error(response.message || 'Произошла ошибка при удалении');
          }
        } catch (error) {
          this.$message.error('Ошибка при удалении гео-группы');
          console.error('Error deleting geo group:', error);
        }
      }).catch(() => {
      });
    },

    formatDate(dateString) {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          return 'Неверная дата';
        }

        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Ошибка даты';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.country-transfer {
  margin-top: 10px;

  .transfer-panel {
    display: flex;
    gap: 20px;
    align-items: stretch;
    justify-content: center;

    .transfer-list {
      flex: 1;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      display: flex;
      flex-direction: column;

      .transfer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        border-bottom: 1px solid #ebeef5;
        background: #fafafa;

        h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .transfer-count {
          font-size: 12px;
          color: #909399;
          background: #e1e4e8;
          padding: 2px 6px;
          border-radius: 10px;
        }
      }

      .transfer-search {
        padding: 10px 15px;
        border-bottom: 1px solid #ebeef5;
      }

      .transfer-body {
        flex: 1;
        max-height: 300px;
        overflow-y: auto;

        .transfer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 15px;
          cursor: pointer;
          border-bottom: 1px solid #f5f7fa;
          transition: background-color 0.2s;

          &:hover {
            background: #f5f7fa;
          }

          &.selected {
            background: #ecf5ff;
            color: #409eff;
          }

          .country-name {
            font-size: 13px;
            flex: 1;
          }

          .country-code {
            font-size: 11px;
            color: #909399;
            margin-left: 10px;
          }
        }
      }
    }

    .transfer-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-self: center;
      justify-content: center;
      align-items: center;

      .el-button {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}</style>