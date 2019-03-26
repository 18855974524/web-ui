<template>
  <div>
    <div class="top">
      <img src="../../../../assets/img/nodeBg.png" class="topBg"/>
      <div class="Title">{{title}}</div>
      <div class="btnBox">
        <el-button>{{$t("superNode.ApplicationCurrency")}}</el-button>
        <el-button>{{$t("superNode.RulesCoin")}}</el-button>
      </div>
    </div>
    <div class="center">
      <div class="centerBox">
        <div class="eachNode" v-for="(item,index) in list" :key=index >
          <div class="ImgBox">
            <img :src="getImg(item.imageId)" />
          </div>
          <div class="detailBox">
            <div class="detailTop">
              {{item.name}}
            </div>
            <div class="detailCenter" v-html="item.intro">
              <!-- {{item.intro}} -->
            </div>
            <div class="detailBottom">
              <div class="ProjectRecordsImgGroup">
                <div class="ProjectRecordsImg" v-for="(item2,index2) in item.starNodes" :key=index2 @click="toNodeDetail(item2)">
                  <img :src="getImg(item2.imageId)" >
                </div>
              </div>
              <div class="howMany">
                <span v-if="item.starNodes.length!=0">{{$t("superNode.wait")}}</span>
                {{item.starNodes.length}}
                {{$t("superNode.recommendation")}}
              </div>
              <div class="toDetail" @click="toDetail(item)">
                {{$t("superNode.seeDetail")}}
              </div>
            </div>
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
        title:"",
        data:{},
        list:[],
      
      }

    },
    mounted() {
      this.getList();
    },
    methods:{
      getList(){
        api.post('/Vote/GetVote').then((res)=>{
            console.log(res,1111);
            this.data = res.data.value;
            this.title = this.data.title;
            this.list = this.data.coinProjectRecords;
            
        }).catch((err)=> {
            console.log("error")
        })
      },
      getImg(imgId){
        // console.log(util.ajax.defaults.baseURL+"/image/"+imgId,2222222222)
        return util.ajax.defaults.baseURL+"/image/"+imgId;
      },
      toDetail(item){
        let par = {
              "voteId": this.data.id,
              "coinProjectRecordId": item.id,
              "projectId": item.coinProjectId
            }
        this.$router.push({name:'projectDetail',query:par});
      },
      toNodeDetail(item){
        this.$router.push({name:'nodeDetail',query:{id:item.id}});
      }
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
.top{
  width:100%;
  height:400px;
  position:relative;
  .topBg{
    width:100%;
    height:100%;
  }
  .Title{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:70px;
    font-size:50px;
    color:rgba(255,255,255,1);
    line-height:70px;
    margin-top:120px;
    text-align:center;
  }
  .btnBox{
    position:absolute;
    left:0;
    top:232px;
    width:100%;
    text-align:center;
    font-size:16px;
    .el-button{
      width:180px;
      height:48px;
      color:rgba(255,255,255,1);
      border:1px solid #c9933e;
      &:hover{
        color:rgba(255,255,255,1)!important;
        background:rgba(201,147,62,1);
      }
    }
  }
}
.center{
  width:100%;
  padding-bottom:80px;
  background:rgba(18,23,46,1);
  .centerBox{
    margin:0 auto;
    width:1200px;
    background:rgba(30,36,66,1);
  }
  .eachNode{
    width:100%;
    height:220px;
    .ImgBox{
      width:64px;
      height:64px;
      border-radius:8px;
      background:rgba(49,56,89,1);
      float:left;
      margin:64px 0 0 30px;
      overflow:hidden;
      img{
        width:64px;
      }
    }
    .detailBox{
      float:left;
      margin-left:20px;
      width:1056px;
      .detailTop{
        font-size:24px;
        color:rgba(255,255,255,1);
        line-height:33px;
        margin-top:60px;
      }
      .detailCenter{
        font-size:14px;
        color:rgba(255,255,255,0.5);
        line-height:30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .detailBottom{
        width:1056px;
        margin-top:20px;
        .ProjectRecordsImgGroup{
          float:left;
          cursor:pointer;
          .ProjectRecordsImg{
            width:36px;
            height:36px;
            background:rgba(49,56,89,1);
            border-radius:20px;
            overflow:hidden;
            float:left;
            margin-left:10px;
            img{
              width:100%;
              height:100%;
            }
          }
        }
        .howMany{
          float:left;
          color:rgba(255,255,255,1);
          line-height:34px;
          font-size:16px;
          margin-left:10px;
        }
        .toDetail{
          float:right;
          line-height:34px;
          font-size:16px;
          color:rgba(201,147,62,1);
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
