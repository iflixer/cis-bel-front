<template>
  <div class="form-main">
    <div class="form-in">
      <h1><a href="/">FlixCDN</a></h1>
      <p>Смена пароля</p>
      <input type="password" class="form-control" v-model="password" placeholder="Новый пароль">
      <input type="password" class="form-control" v-model="passwordConfirm" placeholder="Повторите пароль">
      <button :class="{dis: starFlag}" v-on:click="onResetPassword()">Сменить</button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'ResetPassword',
    props: {
      email: {
        type: String,
        default: null
      },
      token: {
        type: String,
        default: null
      }
    },
    data: () => ({
      password: '',
      passwordConfirm: ''
    }),
    computed: {
      starFlag() { return this.password != this.passwordConfirm || this.password == '' },
    },
    methods: {
      onResetPassword(){
        if (!this.email || !this.token) {
          this.$notify.error({ title: 'Ошибка', message: 'Не верный адрес', customClass: 'messages-ui' });
          return;
        }

        if (this.starFlag) {
          this.$notify.error({ title: 'Ошибка', message: 'Пароли не совпадают', customClass: 'messages-ui' });
          return;
        }

        const {email, token, password} = this;
        this.userResetPassword({email, token, password}).then(() => {
          this.$router.push({ name: 'MainPage' });
        });

        this.password = '';
        this.passwordConfirm = '';
      },

      ...mapActions([
        'userResetPassword'
      ])
    }
  }
</script>

<style lang='scss' scoped>
  @import "~/assets/scss/LoginForm";
</style>