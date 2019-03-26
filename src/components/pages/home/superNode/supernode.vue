<template>
  <div>
    <div class="main-container">
      <div id="main">
          <router-view></router-view>
      </div>
    </div>
    <v-footer class="main-width"></v-footer>
  </div>
</template>
<script>
  import Footer from '../../../common/footer'
  import api from '../../../../libs/api'
  export default {
    data() {
      return {
        msg: '这是首页',
      
      }

    },
    mounted() {
    },
    created(){
     
    },
    computed:{
     
    },
    watch:{

    },
    methods:{},
    components:{
      'v-footer':Footer,
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>

</style>
