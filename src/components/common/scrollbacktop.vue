<template>
  <div class="scrollBacktop" @click.prevent.stop="backtop" v-show="scrollCurrent>300?true:false">
    <i class="el-icon-arrow-up"></i>
  </div>
</template>

<script>
  export default {
    name:'scrollbacktop',
    data(){
      return{
        scrollCurrent:0
      }
    },
    created(){
      this.initscroll()
    },
    methods:{
      backtop() {
        this.smoothscroll()
      },
      smoothscroll(){
        var that=this;
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
          window.requestAnimationFrame(that.smoothscroll);
          window.scrollTo (0,currentScroll - (currentScroll/5));
        }else {
          return
        }
      },
      initscroll(){
        var that=this;
        var doc=document.getElementsByTagName('body')[0]
        doc.onscroll=function () {
          that.scrollCurrent=(document.documentElement.scrollTop || document.body.scrollTop)
        }
      }
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  .scrollBacktop{
    width:44px;
    height:40px;
    background:rgba(51,55,64,1);
    opacity: 0.8;
    border-radius: 4px ;
    text-align: center;
    position:fixed;
    bottom:100px;
    left: calc(50% + 620px);
    &:hover{
      cursor: pointer;
      background-color: $--color-primary;
      opacity: 1;
    }
    i{
      line-height: 40px;
      font-size: 16px;
      color:#F0F2F6;
    }
  }
  @media only screen and (max-width: 1300px) {
   .scrollBacktop{
     display: none;
   }


  }
</style>
