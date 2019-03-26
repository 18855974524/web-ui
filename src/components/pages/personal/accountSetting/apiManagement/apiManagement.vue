<template>
<div>
    <top-bar :title="$t('apiManagement.apiManegement')"></top-bar>
  <div class="apiManagement">

    <div class="creatBox">
        <div class="top">
            <i class="icon-az-icon-API iconfont"></i>
            <span>{{ $t("apiManagement.creatManege") }} </span>
        </div>
        <div class="clear"></div>
        <div class="center">
            <el-form ref="form" :model="form" label-width="90px" label-position="right">
                <el-form-item :label="$t('apiManagement.apiName')">
                    <el-input v-model="form.apiName" :placeholder="$t('apiManagement.enterApiName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('apiManagement.apiLimit')">
                    <el-checkbox-group v-model="form.power">
                        <el-checkbox label="1" disabled>{{ $t("apiManagement.readMess") }}</el-checkbox>
                        <el-checkbox label="2">{{ $t("apiManagement.buyAndBuy") }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('apiManagement.isTrueTime')">
                    <el-radio v-model="form.date" label="1">{{ $t("apiManagement.oneWeek") }}</el-radio>
                    <el-radio v-model="form.date" label="2">{{ $t("apiManagement.oneMonth") }}</el-radio>
                    <el-radio v-model="form.date" label="3">{{ $t("apiManagement.threeMonth") }}</el-radio>
                </el-form-item>
                <el-form-item :label="$t('apiManagement.bingIp')">
                    <el-input v-model="form.adress" :placeholder="$t('apiManagement.enterIpAdress')" ></el-input>
                </el-form-item>
                <el-form-item class="deletIcon" :label="$t('apiManagement.bingIp')" v-for="(item,index) in formAdress" :key="index">
                    <el-input v-model="item.key" :placeholder="$t('apiManagement.enterIpAdress')" ></el-input>
                    <i class="el-icon-remove-outline" @click="deletAdress(index)"></i>
                </el-form-item>
                <el-form-item>
                    <div type="button" class="newAdress" @click="addAdress">
                        <span class="addImg">+</span><span>&nbsp;{{ $t("apiManagement.addBingAdress") }}</span>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="submitForm" :class="{bgGray:bgGray}" :loading="LoadingAdd" :disabled="addDisabled" @click="onSubmitValidate(onSubmit)">{{ $t("apiManagement.add") }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="detail">
            <div class="detailTop">{{ $t("apiManagement.apiCreatDetail") }}</div>
            <p>{{ $t("apiManagement.creatDetailOne") }}</p>
            <p>{{ $t("apiManagement.creatDetailTwo") }}</p>
            <p>{{ $t("apiManagement.creatDetailThree") }}</p>
            <p>{{ $t("apiManagement.creatDetailFour") }}</p>
        </div>
    </div>

    <div class="creatBox">
        <div class="top">
            <i class="icon-az-icon-setting iconfont"></i>
            <span>{{ $t("apiManagement.apiManegement") }}</span>
        </div>
        <div class="clear"></div>
        <div class="apiKeyTable">
            <table border="0" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <td class="firstTd">{{ $t("apiManagement.name") }}</td>
                        <td>{{ $t("apiManagement.limit") }}</td>
                        <td class="thirdTd">{{ $t("apiManagement.bindingAdress") }}</td>
                        <td>{{ $t("apiManagement.remainTime") }}</td>
                        <td>{{ $t("apiManagement.control") }}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableArray" :key=index>
                        <td class="firstTd">{{item.name}}</td>
                        <td>
                            <span v-for="(item1,index1) in item.openApiLimits" :key=index1 > {{item1==1?$t("apiManagement.readMess"):$t("apiManagement.buyAndBuy")}}</span>
                        </td>

                        <td class="thirdTd">
                            <span v-for="(item2,index2) in item.ips" :key=index2>
                                {{item2}}
                                <template v-if="index2!=(item.ips.length-1)" style="color:rgba(186,194,209,1);">/</template>
                            </span>
                        </td>
                        <td>{{getEndTime(item.expire)}}</td>
                        <td>
                            <i class="icon-az-icon-edit- iconfont" @click="editFn(item)"></i>&nbsp;
                            <i class="icon-az-icon-delete- iconfont" @click="deletFn(item)"></i>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="APIkeyTableArray">
                    <tr>
                        <td colspan="5">{{ $t("apiManagement.noMessNow") }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
    <!-- title="创建成功" -->
    <el-dialog  :visible.sync="dialogVisible" width="400px" append-to-body top="0" :closeOnClickModal="false">
        <div class="dialogTitle">{{ $t("apiManagement.creatSuccess") }}</div>
        <p>{{ $t("apiManagement.apiHasSuccessed") }}</p>
        <p class="p1">{{ $t("apiManagement.keepSaveJustOne") }}</p>
        <div class="keyName">{{ $t("apiManagement.APIKey") }}</div>
        <el-input v-model="dialogApiKey" readonly="readonly" class="input-with-select">
            <el-button slot="append"
                v-clipboard:copy="dialogApiKey"
                v-clipboard:success="copyAPIKey"
                v-clipboard:error="onError">
                <i  class="icon-azl-icon-copy iconfont" style="color:#C9933E;"></i>
            </el-button>
        </el-input>
        <div class="keyName">{{ $t("apiManagement.SecretKey") }}</div>
        <el-input  v-model="dialogSecretKey" readonly="readonly" class="input-with-select">
            <el-button slot="append"
                v-clipboard:copy="dialogSecretKey"
                v-clipboard:success="copySecretKey"
                v-clipboard:error="onError">
                <i  class="icon-azl-icon-copy iconfont" style="color:#C9933E;"></i>
            </el-button>
        </el-input>
        <el-button class="dialogSuccess dialogSuccess2"  @click="dialogVisible = false">{{ $t("apiManagement.complete") }}</el-button>

    </el-dialog>
    <!-- //////////////////////////////// -->
    <el-dialog :visible.sync="reWrite.reWriteAsync" width="400px" append-to-body top="0" :closeOnClickModal="false">
        <div class="dialogTitle">{{ $t("apiManagement.editApi") }}</div>
        <div class="keyName">{{ $t("apiManagement.apiName") }}</div>
        <el-input v-model="reWrite.APIName" >
        </el-input>
        <div class="rewriteAPI" :key="index" v-for="(item,index) in reWrite.reWriteArray">
            <div class="keyName">{{ $t("apiManagement.bingIp") }}{{index+1}}</div>
            <el-input  v-model="item.key" >
            </el-input>
            <i class="el-icon-remove-outline" @click="reWriteDeletAdress(index)"></i>
        </div>
        <div type="button" class="dialogAddNew" @click="dialogAddNew">
            <span class="addImg">+</span><span>&nbsp;{{ $t("apiManagement.addBingAdress") }}</span>
        </div>
        <el-button class="dialogSuccess dialogSuccess2" :class="{bgGray:reWrite.bg}" :disabled="reWrite.disabled"
        @click="saveEdit"  :loading="LoadingEdit">{{ $t("apiManagement.save") }}</el-button>

    </el-dialog>

   <google-verify ref="google"></google-verify> <!-- 谷歌验证 -->
   <email-verify ref="email"></email-verify> <!-- 邮箱验证 -->
    <phoneVerification ref="phonevalit"></phoneVerification> <!-- 手机验证 -->
  </div>
</div>
</template>

<script>
import api from '../../../../../libs/api'
import googleVerify from '../../../../common/googleVerify/index'
import emailVerify from '../../../../common/emailVerify/index'
import phoneVerification from '../../../../common/phoneVerification'

import topBar from '../topBar'
export default {
  components:{
      topBar,
      googleVerify,
      emailVerify,
      phoneVerification
  },
  data () {
    return {
        mess:"",
        LoadingAdd:false,
        LoadingEdit:false,
        id:"",
        bgGray:false,
        addDisabled:false,
        dialogApiKey:"",
        dialogSecretKey:"",
        formAdress:[],
        dialogVisible:false,
        APIkeyTableArray:false,
        tableArray:[],//表格的数据
        reWrite:{
            reWriteAsync:false,
            APIName:"",
            disabled:false,
            bg:false,
            reWriteArray:[]//{"key":"12"},{"key":"12"},{"key":"12"},{"key":"12"}
        },
        form:{
            apiName:"",
            power:["1"],
            adress:"",
            date:"3",
        },
        editValiteId:"",//修改中二次验证通过返回出来的id
        // deletValiteId:"",//删除中二次验证通过返回出来的id
        deletId:"",
        apisNotEmpty:[],
    }
  },
  created: function(){
      this.getApiList();
  },
  computed:{// 计算属性的 getter
    userInfo(){
        return this.$store.state.user.info;
    },
  },
  mounted() {
  },
  methods:{
      getApiList(){
        api.post('/User/GetOpenApi', null).then((res)=>{
            // console.log(res.data.value);
            this.tableArray = res.data.value;
            if(this.tableArray.length==0){
                this.APIkeyTableArray = true;//footer出现
            }else{
                this.APIkeyTableArray = false;
            }
        }).catch((err)=> {
            console.log("error")
        })
      },
      getEndTime(time){//剩余时间time是utc时间
        //this.FormatUtcDate(new Date())
        // let nowDay = new Date().getTime();
        let nowDay = new Date().getTime();//获取当前的utc毫秒数
        var date3 = time*1000 - nowDay; //时间差的毫秒数
        if(date3<0){
            return this.$t("apiManagement.hasLose");
        }

        var days=Math.floor(date3/(24*3600*1000));
        var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));
        var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000);
        if(days!=0){
            return days+this.$t("apiManagement.day")+(hours>9?hours:"0"+hours)+":"+(minutes>9?minutes:"0"+minutes)+":"+(seconds>9?seconds:"0"+seconds);
        }else{
            return (hours>9?hours:"0"+hours)+":"+(minutes>9?minutes:"0"+minutes)+":"+(seconds>9?seconds:"0"+seconds);
        }

      },
      addAdress(){
          this.formAdress.push({"key":""});
          if(this.formAdress.length>4){
              this.bgGray = true;
              this.addDisabled = true;
          }
      },
      deletAdress(index){
        this.formAdress.splice(index,1);
        if(this.formAdress.length<5){
            this.bgGray = false;
            this.addDisabled = false;
        }
      },
      onSubmit(result){//新增，二次验证完成之后执行的函数

          this.LoadingAdd = true;
              let nowData =new Date().getTime();//当前时间毫秒数
              let day = "";
              if(this.form.date==1){//一周
                day = (nowData+7*24*60*60*1000)/1000;
              }else if(this.form.date == 2){//一月
                day = (nowData+30*24*60*60*1000)/1000;
              }else if(this.form.date == 3){//三月
                day = (nowData+3*30*24*60*60*1000)/1000;
              }
              //ips
              let ips = [];
              if(this.form.adress.replace(/(^\s*)|(\s*$)/g, "")){
                  ips.push(this.form.adress);
              }
              for(let i=0;i<this.apisNotEmpty.length;i++){
                  ips.push(this.apisNotEmpty[i].key);
              }
            console.log(ips);
            let par = {
                "name": this.form.apiName,
                "expire": day,
                "ips": ips,
                "openApiLimits": this.form.power,
                "captchaId":result.data.value.captchaId
            }
            api.post('/User/AddOpenApi', par).then((res)=>{
                this.LoadingAdd = false;
                this.$message({showClose: true, message:  this.$t("apiManagement.addSuccessed"), type: 'success',});
                this.dialogSecretKey = res.data.value.secret;
                this.dialogApiKey = res.data.value.token;
                this.dialogVisible = true;

                this.form={
                    apiName:"",
                    power:["1"],
                    adress:"",
                    date:"3",
                }
                this.formAdress = [];
                this.getApiList();
            }).catch((err)=> {
                this.LoadingAdd = false;
                console.log("error")
            })
      },
      onSubmitValidate(){//判断验证，然后进行二次验证
          this.apisNotEmpty = [];
            for(let j=0;j<this.formAdress.length;j++){
                if(this.formAdress[j].key.replace(/(^\s*)|(\s*$)/g, "")){
                    this.apisNotEmpty.push(this.formAdress[j])
                }
            }
            for(let i=0;i<this.apisNotEmpty.length;i++){
                if(this.apisNotEmpty[i].key.length>15){
                    this.$message({showClose: true, message: this.$t("apiManagement.ipLengthlow16"),type: 'error'});
                    return;
                }
                if((/^[\.\d]+$/.test(this.apisNotEmpty[i].key)==false)&&(this.form.adress.replace(/(^\s*)|(\s*$)/g, "")!="")){
                    this.$message({showClose: true, message: this.$t("apiManagement.sureIpAdress"),type: 'error'});
                    return;
                }
            }
            if(this.form.adress.replace(/(^\s*)|(\s*$)/g, "").length>15){
                this.$message({showClose: true, message:this.$t("apiManagement.ipLengthlow16"),type: 'error'});
                return;
            }
            if((/^[\.\d]+$/.test(this.form.adress)==false)&&(this.form.adress.replace(/(^\s*)|(\s*$)/g, "")!="")){
                this.$message({showClose: true, message:  this.$t("apiManagement.sureIpAdress"),type: 'error'});
                    return;
            }

        //   if(!this.form.adress.replace(/(^\s*)|(\s*$)/g, "")&&this.apisNotEmpty.length==0){
        //        this.$message({showClose: true, message: '绑定地址必须填写一个！',type: 'error'});
        //   }else
          if(!this.form.apiName.replace(/(^\s*)|(\s*$)/g, "")){
              this.$message({showClose: true, message:  this.$t("apiManagement.enterApiName"),type: 'error'});
          }else if(this.form.apiName.replace(/(^\s*)|(\s*$)/g, "").length>15){
              this.$message({showClose: true, message:this.$t("apiManagement.apiNameTooLong"),type: 'error'});
          }else{
              this.validate(this.onSubmit);
            
          }
      },
      copyAPIKey(e){
        console.log('你刚刚复制: ' + e.text);
        this.$message({showClose: true, message: this.$t("apiManagement.copySuccess"), type: 'success'});
      },
      copySecretKey(e){
        console.log('你刚刚复制: ' + e.text)
        this.$message({showClose: true, message: this.$t("apiManagement.copySuccess"), type: 'success'});
      },
      onError(){
        this.$message({showClose: true, message:this.$t("apiManagement.copyError"), type: 'error'});
      },
      editFn(item){
          this.id = item.id;
          this.reWrite.reWriteArray=[];
          for(let i=0;i<item.ips.length;i++){
              this.reWrite.reWriteArray.push({"key":item.ips[i]})
          }
          this.reWrite.APIName = item.name;

          //二次验证
          this.validate(this.editFnAsync);
        

      },
      editFnAsync(result){//点击修改，二次认证返回的值 接受
          this.reWrite.reWriteAsync = true;
        this.editValiteId = result.data.value.captchaId
      },
      deletFn(item){
          this.deletId = "";
          this.deletId = item.id;
          this.$confirm(this.$t("apiManagement.sureToDelet"), this.$t("apiManagement.tittle"), {
            confirmButtonText: this.$t("apiManagement.confirm"),
            cancelButtonText: this.$t("apiManagement.cancel"),
            type: 'warning'
            }).then(() => {
                this.validate(this.deletFnAsync);
            }).catch(() => {});

      },
      deletFnAsync(result){//点击删除，二次认证返回的值 接受
            let par={
                "id":this.deletId,
                "captchaId": result.data.value.captchaId
            }
            api.post('/User/DeleteOpenApi', par).then((res)=>{
                this.$message({showClose: true,type: 'success',message: this.$t("apiManagement.deletSuccess")});
                this.getApiList();
            }).catch((err)=> {
                console.log("error")
            })
      },
      reWriteDeletAdress(index){//dialog删除
        this.reWrite.reWriteArray.splice(index,1);
        if(this.reWrite.reWriteArray.length<6){
            this.reWrite.disabled = false;
            this.reWrite.bg = false;
        }
        // if(this.reWrite.reWriteArray.length==0){
        //     this.reWrite.disabled = true;
        //     this.reWrite.bg = true;
        // }
      },
      dialogAddNew(){//dialog添加
        this.reWrite.reWriteArray.push({"key":""});
          if(this.reWrite.reWriteArray.length>5){
              this.reWrite.disabled = true;
              this.reWrite.bg = true;
          }else{
              this.reWrite.disabled = false;
              this.reWrite.bg = false;
          }
      },
      saveEdit(){
        if(!this.reWrite.APIName||!this.reWrite.APIName.replace(/(^\s*)|(\s*$)/g, "")){
            this.$message({showClose: true, message:  this.$t("apiManagement.apiNameNotEmpty"),type: 'error'});
        }else if(this.reWrite.APIName.replace(/(^\s*)|(\s*$)/g, "").length>16){
            this.$message({showClose: true, message:  this.$t("apiManagement.apiNameTooLong"),type: 'error'});
        }else{
                this.LoadingEdit = true;
                let arrayApis = [];
                for(let j=0;j<this.reWrite.reWriteArray.length;j++){
                    if(this.reWrite.reWriteArray[j].key.replace(/(^\s*)|(\s*$)/g, "")){
                        arrayApis.push(this.reWrite.reWriteArray[j].key)
                    }
                }
                for(let n=0;n<arrayApis.length;n++){
                    if(arrayApis[n].length>15){
                        this.LoadingEdit = false;
                        this.$message({showClose: true,type: 'error',message:  this.$t("apiManagement.ipTooLong")});
                        return;
                    }
                }
                let par={
                    name:this.reWrite.APIName,
                    id:this.id,
                    ips:arrayApis,
                    captchaId:this.editValiteId
                }
                api.post('/User/UpdateOpenApi', par).then((res)=>{
                    this.LoadingEdit = false;
                    this.$message({showClose: true,type: 'success',message: this.$t("apiManagement.editSuccess")});
                    this.reWrite.reWriteAsync = false;
                    this.getApiList();
                }).catch((err)=> {
                    this.LoadingEdit = false;
                    console.log("error")
                })
            // }

        }
      },
      validate(fn){//二次验证
        api.post('/User/SendOpenApiCaptcha').then((res)=>{
            if(this.userInfo.userOtpStatus === 1){//绑定谷歌谷歌
                this.$refs.google.open('/User/CheckOpenApiCaptcha',fn);
            }else if(this.userInfo.phoneNumber){//绑定手机
                this.$refs.phonevalit.open(this.userInfo.phoneNumber,"/User/SendOpenApiCaptcha",'/User/CheckOpenApiCaptcha',fn);
            }else if(this.userInfo.email){//绑定邮箱
                this.$refs.email.open(this.userInfo.email,"/User/SendOpenApiCaptcha",'/User/CheckOpenApiCaptcha',fn);
            }
        }).catch((err)=> {
            console.log("error")
        })

       
      }
   
  }
}
</script>
<style lang="scss" scoped>
.firstTd{
    display:block;
    max-width:130px!important;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.thirdTd{
    display:block;
    max-width:640px!important;
    word-wrap:break-word;
    min-width:300px;
    // span{
    //     display:block;
    //     float:left;
    // }
}
.dialogTitle{
    position: absolute;
    top:15px;
    left:150px;
    color:black;
    font-size:16px;
}
.apiManagement{
    width:1200px;
    padding-bottom:30px;
    margin:0 auto;
    font-family: PingFang-SC-Medium;
    .creatBox{
        padding:20px;
        background:white;
        margin-top:30px;
        width:1160px;
        // height:440px;
        display:table;
        padding-bottom: 20px;
        border-radius:4px;
        font-family: PingFang-SC-Medium;
        .top{
            // padding:20px 0 0 20px;
            img{
                float:left;
            }
            i{
                float:left;
                color:#C9933E;
                font-size:20px;
            }
            span{
                float:left;
                font-size:16px;
                margin-left:10px;
                color: #555555;
            }
        }
        .center{
            width:400px;
            float:left;
            margin-left:374px;
            .newAdress{
                width:311px;
                height:40px;
                border: 1px dashed #E5E5E5;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                color: #C9933E;
                line-height:37px;
                font-family: PingFang-SC-Regular;
                .addImg{
                    margin-left:10px;
                    font-size:20px;
                }
                &:hover{
                    border: 1px solid #C9933E;
                }
            }
            .deletIcon{
                position: relative;
            }
            .el-icon-remove-outline{
                color:#C9933E;
                position: absolute;
                right:-22px;
                top:14px;
                cursor: pointer;
            }

            // .bgGray{
            //     background:#F5F5F5;
            // }
        }
        .detail{
            float:left;
            width:280px;
            // margin-top:72px;
            background:#F8F8F8;
            margin-left:30px;
            padding:10px 20px 20px 20px;
            font-family: PingFang-SC-Regular;
            .detailTop{
                font-size: 13px;
                color: #888888;
                line-height:28px;
            }
            p{
                font-size: 12px;
                color: #888888;
                line-height:18px;
            }
        }

    }

    .apiKeyTable{
        width:100%;
        table{
            width:100%;
            margin-top:20px;
            border-collapse:separate;
            border-spacing:0 10px;
            thead{
                color:#B2B2B2;
                tr td{
                    line-height: 50px;
                    min-height:50px;
                    padding-left:8px;
                    font-size:14px;
                }
            }
            tbody{
                tr{
                    background:#F8F8F8;

                    td{
                        line-height: 50px;
                        color:#555555;
                        padding-left:8px;
                        font-size:14px;

                        i{
                            color:#C9933E;
                            cursor: pointer;
                        }

                    }
                }
            }
            tfoot{
                tr{
                    td{
                        line-height: 50px;
                        color:#B2B2B2;
                        text-align: center;
                    }
                }
            }
        }
    }

}
.el-button.bgGray{
    background:#f2f2f2!important;
    color: #d8d8d8!important;
    &:hover{
        background:#f2f2f2!important;
        color: #d8d8d8!important;
    }
}
.submitForm{
    width:311px;
    height:40px;
    border-radius: 4px;
    color:white!important;
    text-align:center;
    background:#C9933E!important;
    &:hover{
        background:#E1AA50!important;
        border:none;
    }
}
.dialogAddNew{
    width:316px;
    height:40px;
    border: 1px dashed #E5E5E5;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #C9933E;
    line-height:37px;
    margin:20px 0 0 18px;
    .addImg{
        margin-left:10px;
        font-size:20px;
    }
    &:hover{
        border: 1px solid #C9933E;
    }
}
.dialogSuccess2{
    width:317px!important;
}
.dialogSuccess{
    width:311px;
    height:40px;
    border-radius: 4px;
    color:white!important;
    text-align:center;
    background:#C9933E!important;
    margin-left:18px;
    margin-top:30px;
    &:hover{
       background:#E1AA55;
       color:white;
    }
}
.el-dialog .el-icon-remove-outline{
    color:#C9933E;
    cursor: pointer;
}
.el-dialog{
    font-family: PingFang-SC-Medium;
    p{
        font-size: 14px;
        text-align: center;
    }
    .p1{
        color: #FF8546;
    }

    .el-input{
        width:320px;
        margin-left:18px;
        font-family: OpenSans!important;
        background: #F5F5F5;
    }
    .keyName{
        margin-left:18px;
        margin-top:15px;
        line-height:20px;
        font-size: 12px;
        color: #888888;
    }
}
.el-input{
    font-family: OpenSans!important;
}
</style>
