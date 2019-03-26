<template>
  <div class="index">
    <div class="container">
      <div class="main-container">
          <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components:{

  },
  data () {
    return {
      msg: '这是首页',
    }
  },
  created(){ //初始化加载
  },
  computed:{// 计算属性的 getter

  },
  methods:{

  }
}
</script>
<style scoped>
.index{
  width:100%;
 /* height:calc(100% - 64px);*/
  height:100%;
  background:url(../../../assets/img/background2.png) no-repeat center center;
  background-size:cover;
}
.container{
  width:100%;
  height:100%;
  float:left;
}
</style>

