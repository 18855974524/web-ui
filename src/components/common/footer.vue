<template>
  <div class="footer">
   <div class="footerBox">
     <div class="footerLeft">
       <img src="../../assets/img/az-pt-logo.svg" class="logo" />
       <p>{{ $t("footer.footerMess") }}</p>
     </div>
     <div class="eachUl appDown">
       <div class="ulTitle">{{ $t("footer.downloadAbout") }}</div>
        <!-- <ul>
          <li><i class="icon-pingguo"></i>&nbsp;{{ $t("footer.iOSApp") }}</li>
          <li><i class="icon-android"></i> {{ $t("footer.androidApp") }}</li>
        </ul> -->
        <ul>
          <li><i class="icon-pingguo"></i>&nbsp;
            <el-tooltip class="item itemss" effect="dark" content="Coming Soon" placement="top">
              <span>{{ $t("footer.iOSApp") }}</span>
            </el-tooltip>
          </li>
          <li><i class="icon-android"></i>&nbsp;
            <el-tooltip class="item itemss" effect="dark" content="Coming Soon" placement="top">
              <span>{{ $t("footer.androidApp") }}</span>
            </el-tooltip>
          </li>
        </ul>


     </div>
     <div class="eachUl">
       <div class="ulTitle">{{ $t("footer.officialCommunity") }}</div>
        <ul>
          <li><a target="_blank" href="https://www.facebook.com/AZEX_Official-1664888580231141/"><i class="icon-facebook"></i> {{ $t("footer.facebook") }}</a></li>
          <li><a target="_blank" href="https://t.me/AZEXofficial " ><i class="icon-telegram"></i>&nbsp;{{ $t("footer.telegram") }}</a></li>
          <li><a target="_blank" href="https://twitter.com/AZEXofficial"><i class="icon-tuitetwitter43"></i>&nbsp;{{ $t("footer.twitter") }}</a></li>
          <li><a target="_blank" href="https://weibo.com/u/6567597708"><i class="icon-weibo"></i>&nbsp;{{ $t("footer.weibo") }}</a></li>
        </ul>
     </div>
     <div class="eachUl">
       <div class="ulTitle">{{ $t("footer.aboutUs") }}</div>
        <ul>
          <li><a target="_blank" :href="`https://support.azex.io/hc/${ZenDisklan}/articles/360005420014`">{{ $t("footer.platformIntrod") }}</a></li>
          <li><a target="_blank" :href="`https://support.azex.io/hc/${ZenDisklan}/articles/360005418274`">{{ $t("footer.contactus") }}</a></li>
        </ul>
     </div>
     <div class="eachUl">
       <div class="ulTitle">{{ $t("footer.customerService") }}</div>
        <ul>
          <li><a target="_blank" :href="`https://support.azex.io/hc/${ZenDisklan}/categories/360000459134`" >{{ $t("footer.news") }}</a></li>
          <li><a target="_blank" :href="`https://support.azex.io/hc/${ZenDisklan}`" >{{ $t("footer.helps") }}</a></li>
          <li><a target="_blank" :href="`https://support.azex.io/hc/${ZenDisklan}/articles/360005258694`" >{{ $t("footer.apply") }}</a></li>
          <li><a target="_blank" href="https://github.com/AZEXIO/APIDocument" >{{ $t("footer.apiText") }}</a></li>
        </ul>
     </div>
   </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  computed:{
    ZenDisklan(){
      return this.$store.state.user.language=='en'?'en-us':this.$store.state.user.language=='cn'?'zh-cn':'en-us'
    },
  },
  methods:{
  }
}
</script>

<style scoped>
.footer{
  height:257px;
  width:100%;
  background:#1D2026;
  padding: 0 10px;
  box-sizing: border-box;
}
.footerBox{
  width:1200px;
  margin:0 auto;
  padding-top:30px;
  overflow: hidden;
  color:#F0F2F6;
}
.footerLeft{
  float:left;
}
.footerLeft p{
  color:rgba(255,255,255,0.7);
  font-family: PingFang-SC-Medium
}
.eachUl{
  float:right;
  font-size:14px;
  color:rgba(255,255,255,0.70);
  margin-left:50px;
  font-family: PingFang-SC-Regular;
}
.eachUl .ulTitle{
  color:#C9933E;
  padding:0 10px 20px 0;
  font-family: PingFang-SC-Medium;
}
ul{
  list-style:none;
}
ul li{
  line-height:40px;
  cursor: pointer;
}
ul li:hover{
  color:rgba(255,255,255,1);
}
ul li:hover i{
  color:rgba(255,255,255,1);
}
ul li img{
  float:left;
  margin-top:10px;
}
ul li i{
  font-size: 16px;
}
.appDown ul li{
  color:rgba(255,255,255,0.3);
}
.appDown ul li:hover i{
  color:rgba(255,255,255,0.3);
}
/* ul li img */
@media (max-width: 1200px){
  .footerBox{
    width:100%;
  }
}

</style>
