<template>
    <div class="depositManage">
      <router-view></router-view>
      <v-footer></v-footer>
    </div>
</template>

<script>
    import VFooter from '../../../common/footer'
    export default {
        name: "index",
        components:{
          VFooter
        }
    }
</script>

<style scoped>

</style>
