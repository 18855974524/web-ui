<template>
  <div class="mining main-width">
    <div class="main-container">
      <div class="bg-main">
        <div class="tab-bar main-view-panel-width">
          <ul>
            <li>
              <router-link :to="{name:'tradeMining'}">{{$t("tradeMining.title")}}</router-link>
            </li>
            <li>
              <router-link :to="{name:'myMining'}">{{$t("myMining.title")}}</router-link>
            </li>
          </ul>
        </div>
        <router-view class="main-view-panel-width"></router-view>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import Vfooter from '../../common/footer'
  export default {
    data() {
      return {}
    },
    components:{
      'v-footer':Vfooter
    },
    methods: {},
  }
</script>

<style lang="scss" type="text/scss">
  .app{
    .mining{
      background-color:#1A2233;
      min-height: 100%;
      height:auto;
      .main-container{
        overflow: auto;
        padding-top:60px;
        padding-bottom:20px;
      }
      .bg-main{
        background-image: url("../../../assets/img/mining/bg.png");
        background-size: 1920px 400px;
        background-repeat: no-repeat;
        width:100%;
        background-position:top ;
        padding-top:56px;
        ul{
          margin-bottom:40px;
          overflow: hidden;
          li{
            float: left;
            margin-right:80px;
            a {
              display: inline-block;
              height: 44px;
              line-height:28px;
              color:#F0F2F6;
              font-size:24px;
              &.router-link-exact-active{
                color: $--color-primary;
                border-bottom:2px solid $--color-primary;
              }
            }

          }
        }
      }
      .card{
        background:#fff;
        border-radius:6px;
        padding:40px 0;
        margin-bottom:20px;
        box-sizing: border-box;
        &.card-row{
          height:174px;
          display: flex;
          justify-content: space-between;
          .card-column{
            box-sizing: border-box;
            border-left:1px solid #e5e5e5;
            padding-left:60px;
            padding-right:20px;
            box-sizing: border-box;
            .p-title{
              font-size:14px;
              color:#8D95A6;
              margin-bottom:30px;
            }
            .p-value{
              font-size:24px;
              color:#333740;
              &.primary-text{
                font-size:30px;
              }
            }
            &.primary-text-div{
              width:440px;
            }
          }
        }
        &.card-table{
          padding:0;
          overflow: hidden;
          p{
            text-align: center;
          }
          .tab{
            display: inline-block;
            width:200px;
            text-align: center;
            margin:20px 20px 20px 0;
            height:40px;
            line-height:40px;
            color:#8D95A6;
            cursor: pointer;
            &.active{
              background:linear-gradient(90deg,rgba(242,187,109,1),rgba(217,159,65,1));
              border-radius:20px;
              color:#fff;
            }
          }
          .el-table{
            td,
            th{
              border: none;
              padding:12px 0;
              .cell{
                line-height:20px;
                padding:0 20px;
              }
              &:first-child{
                .cell{
                  padding-left:60px;
                }
              }
              &:last-child{
                .cell{
                  padding-right:60px;
                }
              }
            }
            thead{
              tr{
                color:#BAC2D1;
                font-size:12px;
              }
            }
            tbody{
              td{
                color:#333740;
                font-size:14px;
              }
            }
            &:before{
              display: none;

            }
            .el-table__body tr:nth-child(odd) td{
              background-color:#f7f7f7;
            }
          }
        }
      }
      .tra-min{
        .card-column{
          width:380px;
        }
      }
      .my-min{
        .card-column{
          width:300px;
        }
        .el-input--prefix{
          height:40px;
          width:190px;
          ::-webkit-input-placeholder {
            color: #BAC2D1;
          }
          :-moz-placeholder {
            color: #BAC2D1;
          }
          ::-moz-placeholder {
            color: #BAC2D1;
          }
          :-ms-input-placeholder {
            color: #BAC2D1;
          }
          i{
            color: #BAC2D1;
          }
          .el-input__inner{
            border-color:#DADEE6;
            height:40px;
            padding-left:34px;
          }
        }
      }
    }
  }
</style>
