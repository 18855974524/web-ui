<template>
  <div class="index">
    <div class="container">
      <v-header></v-header>
      <router-view class="sub-page"></router-view>
    </div>
  </div>
</template>

<script>
import Header from '../common/header'
import Market from '../common/MarketOrder/marketorder'
import {mapActions,mapGetters} from 'vuex';
export default {
  components:{
    'v-header':Header,
    Market,
  },
  data () {
    return {
    }
  },
  computed:{// 计算属性的 getter
  },
  created(){
    this.asyncSetCoinPrecision();
  },
  mounted(){
    
  },
  methods:{
    ...mapActions(['asyncSetCoinPrecision'])
  }
}
</script>
<style>
.index{
  width:100%;
  height:100%;
}
.container{
  width:100%;
  height:100%;
  float:left;
}
.sub-page{
  height:100%;
}
.footer{
  height:257px;
  width:100%;
  background:#1D1D1D;
}
</style>
