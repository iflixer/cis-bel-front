<template>
  <div></div>
</template>

<script>
export default {
  name: 'TawkChat',
  data() {
    return {
      scriptLoaded: false
    }
  },
  computed: {
    isAuthenticated() {
      const token = this.$store.state.user.token;
      return token && token.trim() !== '';
    }
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.loadTawkScript();
      } else {
        this.removeTawkScript();
      }
    }
  },
  mounted() {
    if (this.isAuthenticated) {
      this.loadTawkScript();
    }
  },
  beforeDestroy() {
    this.removeTawkScript();
  },
  methods: {
    loadTawkScript() {
      if (this.scriptLoaded) return;

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const s1 = document.createElement('script');
      s1.async = true;
      s1.src='https://embed.tawk.to/69316ec652eff2197eb1a763/1jbkhhea4';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s1.id = 'tawk-script';
      document.head.appendChild(s1);

      this.scriptLoaded = true;
    },
    removeTawkScript() {
      const script = document.getElementById('tawk-script');
      if (script) script.remove();

      const tawkElements = document.querySelectorAll('[id^="tawk-"]');
      tawkElements.forEach(el => el.remove());

      const iframes = document.querySelectorAll('iframe[src*="tawk.to"]');
      iframes.forEach(el => el.remove());

      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;

      this.scriptLoaded = false;
    }
  }
}
</script>
