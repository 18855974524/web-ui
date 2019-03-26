<template>
  <div class="projectDetail">
    <div class="center">
      <div class="tab">
        <span @click="toSuperNodeList">{{$t("superNode.projectList")}}</span>
        <span>></span>
        <span class="span2">{{$t("superNode.nodeDetail")}}</span>
      </div>

      <div class="projectDetailTop">
        <div class="imgBox">
          <img :src="getImg(data.imageId)" />
        </div>
        <div class="title">{{data.name}}</div>
        <a href="###" target="_blank" >{{$t("superNode.whatNodeStar")}}</a>
      </div>

      <div class="projectDetailCenter">
        <p class="title">{{$t("superNode.institutionalIntroduction")}}</p>
        <p class="detail" v-html="data.intro"></p>
      </div>

      <div class="projectDetailBottom">
        <p class="title">{{$t("superNode.recommendedProjects")}}</p>

        <div class="eachNode" v-for="(item,index) in data.projects" :key=index>
          <div class="imgBox">
            <img :src="getImg(item.imageId)" />
          </div>
          <div class="detailRight">
            <p class="title">{{item.name}}</p>
            <p class="detail">{{item.intro}}</p>
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
        api.post('/Vote/GetStarNode',this.$route.query).then((res)=>{
            console.log(res,1111);
            this.data = res.data.value;
            
        }).catch((err)=> {
            console.log("error")
        })
      },
      getImg(imgId){
        console.log(util.ajax.defaults.baseURL,2222222222)
        return util.ajax.defaults.baseURL+"/image/"+imgId;
      },
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
.projectDetail{
  width:100%;
  background:rgba(18,23,46,1);
  padding:80px 0 80px 0;
  .center{
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
      margin:0 auto;
      padding:60px 0 60px 0;
      border-bottom:1px solid rgba(49,56,89,1);
      display:table;
      .imgBox{
        width:80px;
        height:80px;
        float:left;
        border-radius:42px;
        overflow:hidden;
        background:rgba(49,56,89,1);
        img{
          width:80px;
          height:80px;
        }
      }
      .title{
        font-size:24px;
        color:rgba(255,255,255,1);
        line-height:33px;
        float:left;
        margin:26px 0 0 30px;
      }
      a{
        float:right;
        font-size:14px;
        color:rgba(201,147,62,1);
        line-height:20px;
        margin-top:30px;
        &:hover{
          text-decoration: underline;
        }
      }
    }
    .projectDetailCenter{
       width:1080px;
       margin:0 auto;
       padding:40px 0 60px 0;
       border-bottom:1px solid rgba(49,56,89,1);
       display:table;
       .title{
          font-size:18px;
          color:rgba(255,255,255,1);
          line-height:25px;
       }
       .detail{
         margin-top:20px;
          font-size:14px;
          color:rgba(255,255,255,0.5);
          line-height:20px;
       }
    }
    .projectDetailBottom{
       width:1080px;
       margin:0 auto;
       padding:40px 0 60px 0;
       display:table;
       .title{
          font-size:18px;
          color:rgba(255,255,255,1);
          line-height:25px;
       }
       .eachNode{
         width:100%;
         display:table;
         margin-top:40px;
         .imgBox{
           float:left;
           width:64px;
           height:64px;
           border-radius:10px;
           overflow:hidden;
           img{
             width:64px;
             height:64px;
           }
         }
         .detailRight{
           float:left;
           margin-left:20px;
           width:996px;
           .title{
              font-size:20px;
              color:rgba(255,255,255,1);
              line-height:28px;
           }
           .detail{
              width:100%;
              font-size:14px;
              color:rgba(255,255,255,0.5);
              line-height:20px;
              margin-top:10px;
           }
         }
       }
    }

    
  }
  
}
</style>
