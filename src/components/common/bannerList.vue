<template>
  <div class="bannerList">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in publicBanner.length">
          <ul>
            <li v-for="(i,ix) in publicBanner[index]" style="position: relative">
              <!--1是en  2是cn-->
              <a :href="i.href" target="_blank">
                <!--<div class="loadings" v-show="i.visibleNow">
                  <i class="el-icon-loading"></i>
                </div>-->
                <img  :src="`${baseUrl}/image/${i.imageId}`"  alt="">
                <!--<p class="bottomTitle">
                  {{i.name}}&lt;!&ndash;{{
                  $store.state.user.language=='cn'?
                  i.content[$store.state.user.language]? i.content[$store.state.user.language].title:i.content['en']?i.content['en'].title:'没有cn和zn':
                  $store.state.user.language=='en'?
                  i.content[$store.state.user.language]? i.content[$store.state.user.language].title:i.content['cn']?i.content['cn'].title:'没有cn和zn':'otherLanguage'
                  }}&ndash;&gt;</p>-->
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="tipbtn">
      <ul>
        <li v-show="publicBanner.length>1" v-for="(item,index) in publicBanner.length" :class="arrIndex==index?'active':''" @click.prevent.stop="sliesTo(index)"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css'
  import api from '../../libs/api'
  let mySwiper
  let mySwiperTimer=null
  export default {
    name: "banner-list",
    data(){
      return {
        arrIndex:0,
        loacData:[],
        bannerLimit:12,
        bannerChild:4,
        publicBanner:[],
        baseUrl:api.getBaseUrl().baseURL
      }
    },
    created(){
      this.getBanner()
    },
    mounted(){
    },
    methods:{
      activecurrent(index){
        if(index!=this.arrIndex){
          this.arrIndex=index
        }
      },
      sliesTo(index,speed,runback){
       if(index!=this.arrIndex){
         this.arrIndex=index
         mySwiper.slideToLoop(index)
       }
      },
      LoadImg(item,index,outIndex){
        //console.log(111)
        //item.visibleNow=false
        //console.log(this.publicBanner)
        this.publicBanner[outIndex][index].visibleNow=false
        //this.publicBanner[outIndex].splice(index,1,item)
        //console.log(item,index,outIndex)
      },
      initstart(){
        if(!mySwiper){
          var that = this;
          if(that.publicBanner.length>1){
            mySwiper = new Swiper('.swiper-container', {
              autoplay: {
                disableOnInteraction: false,
              },
              direction : 'vertical',
              height: 142,
              loop : true,
              delay: 3000,
            });
            mySwiper.on('slideChange', function () {
              that.arrIndex=this.realIndex
            });
          }else {
            mySwiper = new Swiper('.swiper-container', {
              autoplay: false,
              direction : 'vertical',
              height: 138,
              loop : true,
              delay: 3000,
            });
            mySwiper.on('slideChange', function () {
              that.arrIndex=this.realIndex
            });
          }
        }else {
          mySwiper=null
          this.initstart()
        }
      },
      getBanner(){
        api.post('/Banner/GetList',{bannerPlatform:1}).then((res)=>{
          this.loacData=res.data.value
          //console.log(this.loacData,'轮播图数据')
          //this.getimgids(this.loacData.concat(this.loacData.concat(this.loacData)))
          this.getimgids(this.loacData)

          mySwiperTimer=setTimeout(function () { this.initstart()}.bind(this),300)
        }).catch((err)=>{
          console.log(err)
        })
      },
      update(){
        mySwiper.update()
      },
      getTransition:async function(data){
        for(let i in data){
          var obj={}
          data[i]['visibleNow']=true;
          for(let j in data[i].content){
            if(data[i].content[j].lang==1){
              obj['en']=data[i].content[j]
            }else if(data[i].content[j].lang==2){
              obj['cn']=data[i].content[j]
            }
          }
          data[i].content=obj
        }
        return data
      },
      getimgids: async function(data){
        /**/
        this.getTransition(data).then(res=>{
          if(res.length>this.bannerLimit){
            this.publicBanner=new Array(this.bannerLimit/this.bannerChild)
            res=res.splice(this.bannerLimit)
            for(let i in res){
              if(typeof this.publicBanner[parseInt(i/this.bannerChild)]=='undefined'){
                this.publicBanner[parseInt(i/this.bannerChild)]=[]
              }
              this.publicBanner[parseInt(i/this.bannerChild)][i%this.bannerChild]=res[i]
            }
          }else {
            this.publicBanner=new Array(Math.ceil(res.length/this.bannerChild))
            for(let i in res){
              if(typeof this.publicBanner[parseInt(i/this.bannerChild)]=='undefined'){
                this.publicBanner[parseInt(i/this.bannerChild)]=[]
              }
              this.publicBanner[parseInt(i/this.bannerChild)][i%this.bannerChild]=res[i]
            }
          }
        })
        //console.log(this.publicBanner)
        return this.publicBanner
      },
    },
    computed:{
      contentId(){
        return this.$store.state.user.language==en?1:2
      }
    },
    watch:{
    },
    destroyed(){
      //console.log('destroyed')
      if(mySwiperTimer){
        clearTimeout(mySwiperTimer)
        mySwiper.destroy(false);
      }

    }
  }
</script>
<style scoped type="text/scss" lang="scss">
.bannerList{
  height: 140px;
  overflow: hidden;
  display: flex;
  .swiper-container{
    width: calc(100% - 25px);
    margin: 0;
    .swiper-wrapper{
      .swiper-slide{
        ul{
          display: flex;
          justify-content: flex-start;
          li{
            background-color: #D5D5D5;
            width: 275px;
            height: 140px;
            border-radius: 4px;
            margin-left: 25px;
            overflow: hidden;
            background-color: transparent;
            &:nth-child(1){
              margin-left: 0px;
            }
            a{
              display: inline-block;
              img{
                width: 275px;
                height: 142px;
                overflow: hidden;
                transition: all 0.3s linear;
              }
              &:hover{
                img{
                  transform: scale(1.1);
                }
                .bottomTitle{
                  display: block;
                }
              }
              .bottomTitle{
                color: white;
                position: absolute;
                bottom: 0px;
                width: 100%;
                text-align: center;
                background-color: rgba(0,0,0,0.5);
                display: none;
              }
              .loadings{
                width: 275px;
                height: 138px;
                text-align: center;
                i{
                  font-size: 50px;
                  line-height: 138px;
                }
              }
            }
          }
        }
      }
    }
  }
  .tipbtn{
    width: 25px;
    ul{
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content:center;
      align-items: center;
      height: 100%;
      li{
        width: 4px;
        height: 16px;
        background-color: rgba(255,255,255,0.2);
        cursor: pointer;
        border-radius: 2px;
        margin-bottom: 16px;
        &:last-child{
          margin-bottom: 0px;
        }
        &.active{
          background-color: rgba(201,147,62,1);
        }
      }
    }
  }
}
</style>
