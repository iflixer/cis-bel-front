<template>
  <div class="form-main">
    <div class="form-in">
      <h1><a href="/">FlixCDN</a></h1>
      <p>Регистрация</p>

      <input type="text" class="form-control" name="login" v-model="login" placeholder="Логин">
      <input type="email" class="form-control" name="email" v-model="email" placeholder="E-mail">
      <input type="text" class="form-control" name="contact_telegram" v-model="contact_telegram" placeholder="Telegram (для обратной связи)">
      <input type="password" class="form-control" v-model="password" placeholder="Пароль">
      <input type="password" class="form-control" v-model="passwordConfirm" placeholder="Повторите пароль">

      <button :class="{dis: starFlag}" v-on:click="onRegistr()">Зарегистрироваться</button>

      <a href="/login">Войти</a>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Registration',
    data: () => ({
      login: '',
      password: '',
      email: '',
      contact_telegram: '',

      passwordConfirm: ''
    }),
    computed: {
      starFlag(){ return this.password != this.passwordConfirm || this.password == '' || this.contact_telegram == ''},
    },
    methods: {
      onRegistr(){
        if(this.starFlag){
          this.$notify.error({ title: 'Ошибка', message: 'Заполните все обязательные поля', customClass: 'messages-ui' });
          return;
        }

        const {login, password, email, contact_telegram} = this;
        this.userRegistr({login, password, email, contact_telegram}).then(() => {
          this.$router.go();
        });
      },

      ...mapActions([
        'userRegistr'
      ])
    }
  }
</script>

<style lang='scss' scoped>
  @import "~/assets/scss/LoginForm";
</style>