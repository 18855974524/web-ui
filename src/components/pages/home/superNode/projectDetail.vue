<template>
  <div class="projectDetail">
    <div class="center">
      <div class="tab">
        <span @click="toSuperNodeList">{{$t("superNode.projectList")}}</span>
        <span>></span>
        <span class="span2">{{$t("superNode.projectDetail")}}</span>
      </div>
      <div class="projectDetailTop">
        <div class="detailImg">
          <img :src="getImg(data.imageId)" />
        </div>
        <div class="projectDetailTopRight">
          <div class="title">
            <span class="span1">{{data.name}}</span>
            <a :href="data.whiteaper" target="_blank" class="span2">{{$t("superNode.seeWhite")}}</a><!--查看白皮书-->
            <a :href="data.official" target="_blank" class="span2" style="margin-right:50px;" >{{$t("superNode.toAct")}}</a>
          </div>
          <p>{{data.intro}}</p>
        </div>
      </div>
      <div class="projectDetailCenter">
        <p class="title">{{data.name}}</p>
        <p class="content" v-html="data.detail"></p>
      </div>
      <div class="projectDetailBottom">
        <div class="Title">
          <span>{{$t("superNode.nodeRecommending")}}</span>
          <a href="###" target="_blank">{{$t("superNode.whatNodeStar")}}</a>
        </div>
        <div class="nodeBox">

          <div class="eachNodeBox" v-for="(item,index) in data.starNodes" :key=index @click="toNodeDetail(item)">
            <div class="imgBox">
              <img :src="getImg(item.imageId)" />
            </div>
            <p>{{item.name}}</p>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../../../libs/api'
  import util from '../../../../libs/util'
  export default {
    data() {
      return {
        data:{},
      }

    },
    mounted() {
      this.getList();
    },
    methods:{
      toSuperNodeList(){
        this.$router.push({name:'superNodeList'});
      },
       getList(){
        api.post('/Vote/GetCoinProjectRecord',this.$route.query).then((res)=>{
            console.log(res,1111);
            this.data = res.data.value;
            
        }).catch((err)=> {
            console.log("error")
        })
      },
      getImg(imgId){
        // console.log(util.ajax.defaults.baseURL,2222222222)
        return util.ajax.defaults.baseURL+"/image/"+imgId;
      },
      toNodeDetail(item){
        this.$router.push({name:'nodeDetail',query:{id:item.id}});
      }
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
.projectDetail{
  width:100%;
  background:rgba(18,23,46,1);
  padding:80px 0 80px 0;
  .center{
    // margin-top:80px;
    width:1200px;
    background:rgba(30,36,66,1);
    margin:0 auto;
    .tab{
      padding:56px 0 0 60px;
      span{
        font-size:18px;
        line-height:25px;
        color:rgba(255,255,255,0.7);
        cursor:pointer;
        &:hover{
          text-decoration: underline;
          color:rgba(201,147,62,1);
        }
      }
      .span2{
        color:rgba(201,147,62,1);
      }
    }
    .projectDetailTop{
      width:1080px;
      margin:60px 60px 0 60px;
      padding-bottom:60px;
      display:table;
      border-bottom:1px solid rgba(49,56,89,1);
      .detailImg{
        width:80px;
        height:80px;
        float:left;
        border-radius:8px;
        overflow:hidden;
        img{
          width:80px;
          height:80px;
          display:block;
        }
      }
      .projectDetailTopRight{
        float:left;
        width:970px;
        margin-left:30px;
        .title{
          width:100%;
          height:33px;
          .span1{
            float:left;
            color:rgba(255,255,255,1);
            line-height:33px;
            font-size:24px;
          }
          .span2{
            float:right;
            color:rgba(201,147,62,1);
            font-size:14px;
            cursor: pointer;
            margin-top:17px;
            &:hover{
              text-decoration: underline;
            }
          }
        }
        p{
          width:100%;
          font-size:14px;
          color:rgba(255,255,255,0.5);
          line-height:20px;
          margin-top:20px;
        }
      }
    }
    .projectDetailCenter{
        width:1080px;
        margin:60px 60px 0 60px;
        padding-bottom:60px;
        display:table;
        border-bottom:1px solid rgba(49,56,89,1);
        .title{
          width:100%;
          height:25px;
          line-height:25px;
          color:rgba(255,255,255,1);
          margin-top:40px;
        }
        .content{
          width:100%;
          font-size:14px;
          color:rgba(255,255,255,0.5);
          line-height:20px;
          margin-top:20px;
        }
    }
    .projectDetailBottom{
      width:1080px;
      margin:0 60px 0 60px;
      padding-bottom:60px;
      display:table;
      .Title{
        width:100%;
        margin-top:40px;
        display:table;
        span{
          float:left;
          font-size:18px;
          color:rgba(255,255,255,1);
          line-height:25px;
        }
        a{
          float:right;
          font-size:14px;
          color:rgba(201,147,62,1);
          line-height:20px;
          &:hover{
            text-decoration: underline;
          }
        }
      }
      .nodeBox{
        display:table;
        width:100%;
        margin-top:40px;
        .eachNodeBox{
          width:90px;
          float:left;
          cursor:pointer;
          .imgBox{
            width:72px;
            height:72px;
            margin:0 auto;
            background:rgba(49,56,89,1);
            border-radius:50%;
            overflow:hidden;
            img{
              width:72px;
              height:72px;
            }
          }
          p{
            margin-top:10px;
            width:100%;
            text-align:center;
            color:rgba(255,255,255,1);
            line-height:25px;
            font-size:18px;
          }
        }
      }
    }
  }
  
}
</style>
