<template>
  <div class="nodata">
    <div class="nodata-wrap">
      <img src="../../assets/img/nodata.png" alt="">
      <p v-if="nodata==0">{{$t('disposit.nodata')}}</p>
      <p v-if="nodata==1">{{$t('disposit.nodatacollect')}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "no-data-tip",
    data(){
      return{
      }
    },
    props:{
      nodata:{
        type:Number,
        default:0
        }
      },
    created(){
      //console.log(this.$t('disposit.nodata'))
    }
  }
</script>

<style scoped type="text/scss" lang="scss" rel="stylesheet/scss">
  .nodata{
    height: 433px;
    background-color: $--color-white;
    .nodata-wrap{
      text-align: center;
      padding-top:150px;
      img{
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
      }
      p{
        font-family: PingFang-SC-Regular;
        color: #888888;
        font-size: 12px;
      }
    }
  }
</style>
