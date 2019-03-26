<template>
  <div>
    <div class="personal main-container">
      <router-view></router-view>
    </div>
    <div class="footer">
      <v-footer class="main-width"></v-footer>
    </div>
  </div>
</template>

<script>
  import Footer from '../../common/footer'

  export default {
    data() {
      return {

      }
    },
    components: {
      'v-footer': Footer,
    },
    created(){
      if(!this.$store.state.user.info){
        this.$store.dispatch('getUser');
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .personal {
    background-color: $bg-color11;
  }
</style>
