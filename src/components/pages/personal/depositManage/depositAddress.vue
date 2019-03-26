<template>
    <div class="depositAddress">
      <div class="depositwrap">
        <div class="addressTop">
          <h6>
            <i class="icon-az-icon-Addapiaddr"></i>
            <span>{{ $t("disposit.addnewAdd") }} </span>
          </h6>
          <el-form id="addressAddForm" :model="ruleForm" :rules="rules" ref="ruleForm">
            <ul>
            <li>
              <span>{{ $t("disposit.CurrencyInfo") }}</span>
              <div>
                <el-form-item  prop="currency">
                 <el-select v-model="ruleForm.currency" @change="needRest"  :filter-method="commonSearch1" filterable :placeholder="$t('disposit.selectCurrency')">
                   <el-option
                     v-for="item in options1"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                   </el-option>
                 </el-select>
                </el-form-item>
              </div>
            </li>
            <li>
              <span>{{ $t("disposit.addressName") }}</span>
              <div>
                <el-form-item  prop="addressName" ref="needRest1">
                  <el-input v-model="ruleForm.addressName"  :placeholder="$t('disposit.EnterAddressName')"></el-input>
                </el-form-item>
              </div>
            </li>
            <li :class="[hasRemarks?'addresshasRemarks':'noRemarks']">
              <span>{{ $t("disposit.MentionMoneyAddress") }}</span>
              <div>
                <el-form-item  prop="extractAddress" ref="needRest2">
                  <el-input v-model="ruleForm.extractAddress" :placeholder="$t('disposit.EnterTheCurrencyAddress')"></el-input>
                </el-form-item>
              </div>
            </li>
            <li v-show="hasRemarks" :class="[hasRemarks?'selfhasRemarks':'']">
              <span>{{ $t("disposit.NoteYards") }}</span>
              <div>
                <el-form-item  prop="remarksAddress" ref="needRest3">
                  <el-input v-model="ruleForm.remarksAddress" :placeholder="$t('disposit.EnterNoteYards')"></el-input>
                </el-form-item>
              </div>
            </li>
            <li>
              <span>&nbsp;</span>
             <div>
               <el-form-item  prop="region">
                <!--<el-button type="primary" :disabled="disabled"  @click.prevent.stop="addAddress(currency,addressName,extractAddress,remarksAddress)">{{ $t("disposit.addBtn") }}</el-button>-->
                <el-button type="primary" :disabled="disabled"  @click.prevent.stop="submitForm('ruleForm')">{{ $t("disposit.addBtn") }}</el-button>
               </el-form-item>
             </div>
            </li>
          </ul>
          </el-form>
        </div>
        <div class="addressCon">
          <h6>
            <i class="icon-az-icon-ApiAddress"></i>
            <span>{{ $t('disposit.AddressManagement') }}</span>
          </h6>
          <ul class="addressOutUl">
            <li class="outLiFirst">
              <span>{{ $t('disposit.currency') }}</span>
              <span>{{ $t('disposit.addressName') }}</span>
              <span>{{ $t('disposit.MentionMoneyAddress') }}</span>
              <span>{{ $t('disposit.NoteYards') }}</span>
              <span>{{ $t('disposit.operation') }}</span>
            </li>
            <ul class="scrollbar" :class="[addressList.length>5?'scroll-out-ul':'']" v-loading="loading">
              <li v-for="(item,index) in addressList" >
                <ul class="adrressInUl">
                  <li><b>{{currency.toUpperCase()}}</b></li>
                  <li><span>{{item.tag}}</span></li>
                  <li><span>{{item.address}}</span></li>
                  <li><span>{{item.memo}}</span></li>
                  <li><i class="el-icon-delete" @click.prevent.stop="openMaskMessage(item.id)"></i></li>
                </ul>
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
    import api from '../../../../libs/api'
    import commonFilter from '../../../../libs/commonFilter'
    export default {
        name: "deposit-address",
        data() {
          return{
            options: [],
            options1: [],
            addressList:[],
            loading:false,
            disabled:false,
            ischecked:true,
            hasRemarks:false,
            ruleForm: {
              currency: '',
              addressName: '',
              extractAddress: '',
              remarksAddress: ''
            },
            rules:{
              currency: [
                { required: true, message: this.$t('disposit.setCurrency'), trigger: 'change' }
              ],
              addressName: [
                { required: true, message: this.$t('disposit.setAddress'), trigger: 'blur' }
              ],
              extractAddress: [
                {required: true, message: this.$t('disposit.setExtAddress'), trigger: 'blur' }
              ],
              remarksAddress: [
                {message: this.$t('disposit.setRemarks'), trigger: 'blur'}
              ]
            }
          }
        },
      methods:{
         handleList(id,callback) {
          //api操作事物服务器删除
          //删除本地或者state数据
          //element 利用id 返回index，操作异步回掉函数，获取index，加速删除data数据获取
          var that=this
          return new Promise(function(resolve,reject){
            for(var i in that.addressList){
              if(that.addressList[i].id==id){
                resolve(callback(i))
              }
            }
          })
        },
        //智能排序
        commonSearch1: async function(query){
          //自定义搜索方法
          this.options1=this.options.slice()
          if (query !== '') {
            this.options1= commonFilter(this.options1,query,'value')
            /* console.log(result)*/
          } else {
            this.options1 = this.options.slice();
          }
        },
        handelOptions(sources,tartgets){
          //elementUI数据格式 对象操作Promise 异步处理，加速页面渲染效率
          return new Promise(function (resolve,reject) {
            for (let i in sources){
              var tempvalue={value:sources[i].id,label:sources[i].id.toUpperCase(),hasRemarks:sources[i].hasMemo}
              tartgets.splice(i,1,tempvalue)
            }
          })
        },
        deleteone(index){
          this.addressList.splice(index,1)
        },
        submitForm(ruleForm){
           var that=this
          this.$refs[ruleForm].validate((valid) => {
            console.log(valid)
            if (valid) {
              that.addAddress(that.ruleForm.currency,that.ruleForm.addressName,that.ruleForm.extractAddress,that.ruleForm.remarksAddress)
              //alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        addAddress(currency,addressName,extractAddress,remarksAddress){
              this.disabled=true;
              var ex_params={
                "currency": currency,
                "tag": addressName,
                "memo": remarksAddress,
                "address": extractAddress
              };
              this.AddNewCurrencyAddress(ex_params)
        },
        getItemInfo(index){
         return this.addressList[index].address
        },
        openMaskMessage(id) {
            if(!this.ischecked){return}
            this.handleList(id,this.getItemInfo).then((res)=>{
              this.$confirm(this.$t("disposit.isDelete")+' '+res+' ，'+this.$t("disposit.isGoOn"), this.$t("disposit.tipDelete"), {
                confirmButtonText: this.$t("disposit.confirm"),
                cancelButtonText: this.$t("disposit.cancel"),
                type: 'warning',
                lockScroll:true,
                customClass:'depositWrapper',
              }).then(() => {
                this.loading=true;
                this.DeleteCurrencyAddress({
                  "currency": this.currency,
                  "id": id
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t("disposit.cancelDelete")
                });
              });
            })
        },
        getAllcurrency(){
          //获取所有币种信息
          api.post('/Currency/GetCurrencyAddressInfos').then(res=>{
            if(res.data.isOk){
              //console.log(res.data.value)
              var recivedata=res.data.value
              //console.log(recivedata)
              this.handelOptions(recivedata,this.options)
              this.options1=this.options.slice()
              //console.log(this.options1)
            }
          }).catch((err)=>{
            console.log(err)
          })

        },
        getCurrencyBasicInfo(id){
           for(let i in this.options1){
             if(this.options1[i].value==id.id){
               this.hasRemarks=this.options1[i].hasMemo
             }
           }
          //获取币种基本信息
         /* this.hasRemarks=this.options1[id]*/
         /* api.post('/Currency/GetCurrencyBasicInfo',id).then((res)=>{
            if(res.data.isOk){
              var hasmo=res.data.value.hasMemo
              this.hasRemarks=hasmo
            }
          }).catch((err)=>{
            console.log(err)
          })*/
        },
        GetWithdrawlAddresses(params){
          //获取提币地址
          api.post('/User/GetWithdrawlAddresses',params).then((res)=>{
            //console.log(res,111111)
            if(res.data.isOk){
              this.addressList=res.data.value
              this.loading=false
            }
          }).catch((err)=>{
            console.log(err)
          })
        },
        AddNewCurrencyAddress(params){
          //增加新的提币地址
          var that = this
          api.post('/User/AddWithdrawlAddress',params).then((res)=>{
            //判断提币地址管理中，同一个币种的名称和地址不允许重复
           /* if(存在重复){
              this.$message({
                type: 'error',
                message: this.$t("disposit.hasAddress")
              });
              return
            }*/
            if(res.data.isOk){
              console.log(res)
              this.$message({
                type: 'success',
                message: this.$t("disposit.submitSuc")
              });
              this.GetWithdrawlAddresses({"currency": that.currency})
              let ruwrap=this.$refs.ruleForm;
             /* this.ruleForm.addressName=''
              this.ruleForm.extractAddress=''
              this.ruleForm.remarksAddress=''*/
              that.needRest()
              this.disabled=false;
            }
          }).catch((err)=>{
            console.log(err)
            this.$message({
              type: 'error',
              message: this.$t("disposit.sunmitErr")
            });
            this.disabled=false;
          })
        },
        needRest(){
          this.$refs.needRest1.resetField()
          this.$refs.needRest2.resetField()
          this.$refs.needRest3.resetField()
        },
        DeleteCurrencyAddress(params){
          //删除提币地址
          api.post('/User/DeleteWithdrawlAddress',params).then((res)=>{
            if(res.data.isOk){
              this.handleList(params.id,this.deleteone);
              this.ischecked=true;
              this.GetWithdrawlAddresses({"currency": this.currency})
              this.$message({
                type: 'success',
                message: this.$t("disposit.deleteSuc")
              });
            }
          }).catch((err)=>{
            console.log(err)
          })
        },
        initLanguage(){
          this.$store.dispatch('setLanguage', this.$store.state.user.language);
        }
      },
      created(){
        //this.initLanguage()
        this.rules.remarksAddress[0].required=this.hasRemarks
        this.getAllcurrency()
        this.$nextTick(function () {
         //数据到页面渲染的时间，可以操作DOM
        })
      },
      computed:{
        currency(){
          return this.ruleForm.currency
        }
      },
      watch:{
        currency(newval,oldval){
          this.addressList=[]
          this.loading=true
          this.GetWithdrawlAddresses({currency: newval})
          this.getCurrencyBasicInfo({id: newval})
        },
        hasRemarks(n,o){
          console.log(n)
          this.rules.remarksAddress[0].required=n
        }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped >
.depositAddress{
  height: calc(100% - 257px);
  background: $bg-color12;
  .depositwrap{
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    background: $bg-color12;
    margin-bottom: 60px;
    font-family:PingFang-SC-Medium;
    .addressTop{
      width: 100%;
      box-sizing:border-box;
      padding: 21px 20px;
      background: $font-color7;
      h6{
        font-weight: normal;
        margin-bottom: 20px;
        i{
          font-size: 20px;
          color: $--color-primary;
        }
        span{
          font-size: $large-fs;
          margin-left: 10px;
        }
      }
      #addressAddForm{
        .el-form-item{
          margin: 0px;
        }
      }
      ul{
        display: flex;
        justify-content: space-between;
        align-items: center;
        li{
          span{
            font-size: $extra-small-fs;
            margin-bottom: 5px;
            //display: inline-block;
          }
          >span{
            color: $font-color4;
            display: inline-block;
          }
          &:nth-child(1){
            width: 160px;
          }
          &:nth-child(2){
            width:220px ;
          }
          &.addresshasRemarks{
            width: 340px;
          }
          &.noRemarks{
            width: 570px;
          }
          &.selfhasRemarks{
            width: 220px;
          }
          &:last-child{
            width: 180px;
            button{
              width: 100%;
            }
          }
        }
      }
    }
    .addressCon{
      width: 100%;
      margin-top: 20px;
      box-sizing:border-box;
      padding: 21px 20px;
      background: $font-color7;
      h6{
        margin-bottom: 20px;
        font-weight: normal;
        i{
          font-size: 20px;
          color: $--color-primary;
        }
        span{
          font-size: $large-fs;
          margin-left: 10px;
        }
      }
      .addressOutUl{
        li{
          background: $bg-color12;
          margin-bottom: 10px;
        }
        .outLiFirst{
          display: flex;
          justify-content: space-between;
          align-items: center;
          background:$font-color7 ;
          margin-bottom: 0px;
          span{
            color: $font-color5;
            font-size: $medium-fs;
            margin-bottom: 10px;
            height: 20px;
            &:nth-child(1){
              width: 150px;
              text-indent: 20px;
            }
            &:nth-child(2){
              width: 220px;
            }
            &:nth-child(3){
              width: 480px;
            }
            &:nth-child(4){
              width: 240px;
            }
            &:last-child{
              width: 70px;
              text-align: center;
            }
          }
        }
        .scrollbar{
          height: 300px;
          .adrressInUl{
            display: flex;
            justify-content: space-between;
            align-items: center;
            li{
              height: 50px;
              line-height: 50px;
              margin-bottom: 0px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              b{
                color: $--color-primary;
                font-family:openSans-Semibold;
                font-size: $medium-fs;
                font-weight: normal;
              }
              span{
                color:$font-color2;
                font-size: $medium-fs;
                font-family:PingFang-SC-Medium;
                height: 20px;
              }
              i{
                cursor: pointer;
                color: $--color-primary;
                font-size: $medium-fs;
              }
              &:nth-child(1){
                width: 150px;
                text-indent: 20px;
                font-family: openSans-Semibold;
              }
              &:nth-child(2){
                width:220px;
              }
              &:nth-child(3){
                width:480px;
              }
              &:nth-child(4){
                width:240px;

              }
              &:last-child{
                width:70px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .depositWrapper{
    &.el-message-box{
      width: 398px;
      padding-bottom: 8px;
      .el-message-box__header{
        padding: 0px 20px;
        .el-message-box__title{
          text-align: center;
          line-height: 56px;
          span{
            font-size:16px;
            color: #333;
            font-family: "PingFang-SC";
          }
        }
        .el-message-box__headerbtn{
          .el-message-box__close{
            &.el-icon-close{
              color: #888;
            }
          }
        }
      }
      .el-message-box__content{
        min-height: 130px;
        .el-message-box__status{
          &.el-icon-warning{
            transform: translate3d(-50%,0,0);
            left: 50%;
            top: 30px;
          }
          &::before{
            font-size: 40px;
            color: #C9933E;
          }
          + .el-message-box__message{
            position: absolute;
            top: 100px;
            text-align: center;
            width:calc(100% - 30px);
            padding: 0;
          }
        }
      }
      .el-message-box__btns{
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        button{
          width: 120px;
          height: 40px;
          &:nth-child(2){
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
