<template>

</template>

<script>
  import api from '../../../libs/api'
  export default {
    data(){
      return{
        arr:[],
        Login:false,
        isSecVerification:false
      }
    },
    created(){
      this.$nextTick(()=> {
        this.Login = this.$store.state.user.isLogin,
          this.isSecVerification = this.$store.state.user.isSecVerification
        this.getUrl()
        console.log()
        if (this.getUrl().indexOf('isZendesk') > -1) {
          //从zdsk 跳转过来
          if (this.Login) {
            api.post('/Support/ZenDeskSSO', {return_to: `https://support.azex.io/hc/${this.$store.state.user.language==='cn'?'zh-cn':'en-us'}/`})
              .then((res) => {
                window.location.href = res.data.value;
              })
              .catch((err) => {
                window.location.href = `https://support.azex.io/hc/${this.$store.state.user.language==='cn'?'zh-cn':'en-us'}/`;
              })
          } else {
            this.$router.push({name: 'login', query: {LoginToZendesk: true}});
          }
          return;
        }
        if (this.Login && this.isSecVerification) {
          //从交易平台跳转过来
          api.post('/Support/ZenDeskSSO', {return_to: this.$route.query.url})
            .then((res) => {
              console.log(res)
              window.location.href = res.data.value;
            })
            .catch((err) => {
              window.location.href = this.$route.query.url;
            })
        } else {
          window.location.href = this.$route.query.url;
        }
      })
    },
    methods:{
      getUrl(){
        console.log(location.search,window.location.href)
          let url = location.search||window.location.href; //获取url中"?"符后的字串
          if (url.indexOf("?") != -1) {    //判断是否有参数
            let str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            this.arr = str.split("=");   //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
            //alert(strs[1]);          //直接弹出第一个参数 （如果有多个参数 还要进行循环的）
          }
        return this.arr[1];
      }
    }
  }
</script>

<style scoped>

</style>
