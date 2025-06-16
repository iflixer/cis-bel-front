<template>
  <div class="form-main">
    <div class="form-in">
      <h1><a href="/">CDNHub</a></h1>
      <p>Восстановление пароля</p>
      <input type="email" class="form-control" name="email" v-model="email" placeholder="E-mail">
      <button :class="{dis: starFlag}" v-on:click="onForgotPassword()">Восстановить</button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'ForgotPassword',
    data: () => ({
      email: '',
    }),
    computed: {
      starFlag() { return this.email == '' },
    },
    methods: {
      onForgotPassword(){
        if (this.email == '') {
          this.$notify.error({ title: 'Ошибка', message: 'Введите ваш E-mail', customClass: 'messages-ui' });
          return;
        }

        const {email} = this;
        this.userForgotPassword({email}).then(() => {
          this.$router.go();
        });

        this.email = '';
      },

      ...mapActions([
        'userForgotPassword'
      ])
    }
  }
</script>

<style lang='scss' scoped>
  @import "~/assets/scss/LoginForm";
</style>