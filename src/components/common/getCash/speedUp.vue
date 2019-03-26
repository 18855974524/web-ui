<template>
  <div class="easyWarning">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
        <p class="dialogTitle">{{ $t("speedUp.currencySpeed") }}</p>

        <p class="withdrawl">
            <span>{{ $t("speedUp.formalities") }}&nbsp;&nbsp;</span>
            <span class="withdrawlCash">{{withdrawl}} </span>
            <span>{{withdrawlCashs}} </span>
        </p>

        <div class="line-box">
            <div class="LeftLine line" :class="{colorbg:color.color1}"></div>
            <div class="rightLine line" :class="{colorbg:color.color2}"></div>
      <!-- :class="{colorbg:color2}" -->
            <div class="curet curet1"  @click="colorFn1"></div>
            <div class="curet curet2" :class="{colorbg:color.color3}" @click="colorFn2"></div>
            <div class="curet curet3" :class="{colorbg:color.color4}" @click="colorFn3"></div>

            <div class="speedMess speedMess1" :class="{color:color.color5}" @click="colorFn1">{{ $t("speedUp.normal") }}</div>
            <div class="speedMess speedMess2" :class="{color:color.color6}" @click="colorFn2">{{ $t("speedUp.fast") }}</div>
            <div class="speedMess speedMess3" :class="{color:color.color7}" @click="colorFn3">{{ $t("speedUp.faster") }}</div>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sureFn">{{ $t("speedUp.sure") }}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
//简单的弹框提醒
  export default {
    data() {
      return {
        backSpeed:1,//传给父级的
        backSpeed2:1,//该处用来转换的
        color:{
          color1:false,
          color2:false,
          color3:false,
          color4:false,
          color5:true,
          color6:false,
          color7:false,
        },
        dialogVisible:false,
        withdrawlCashs:"",//手续单位
        withdrawl:"",//手续费
        withdrawl2:"",//（用来转换的 ）手续费

      }
    },
    methods:{

      init(par){
        console.log(par);
        this.backSpeed = 1;
        this.color={
          color1:false,
          color2:false,
          color3:false,
          color4:false,
          color5:true,
          color6:false,
          color7:false,
        }
        this.dialogVisible = true;
        this.withdrawl = par.number;
        this.withdrawlCashs = par.unit;
        this.withdrawl2 = par.number;
        // this.withdrawl = "99999";
        // this.withdrawl2 = "99999";
        // this.withdrawlCashs = "BTC";

        if(par.speed == "speedIconColor1"){
          this.backSpeed2 = 1;
          this.backSpeed = 1;
          this.color.color1=false;
          this.color.color2=false;
          this.color.color3=false;
          this.color.color4=false;
          this.color.color5=true;
          this.color.color6=false;
          this.color.color7=false;
        }else if(par.speed == "speedIconColor2"){
          this.backSpeed2 = 2;
          this.backSpeed = 2;
          this.color.color1=true;
          this.color.color2=false;
          this.color.color3=true;
          this.color.color4=false;
          this.color.color5=false;
          this.color.color6=true;
          this.color.color7=false;

        }else if(par.speed == "speedIconColor3"){
          this.backSpeed2 = 3;
          this.backSpeed = 3;
          this.color.color1=true;
          this.color.color2=true;
          this.color.color3=true;
          this.color.color4=true;
          this.color.color5=false;
          this.color.color6=false;
          this.color.color7=true;
        }

      },
      colorFn1(){
        if(this.backSpeed2 == 1){
          this.withdrawl = this.withdrawl2;
        }else if(this.backSpeed2 == 2){
          this.withdrawl = this.withdrawl2/2;
        }else if(this.backSpeed2 == 3){
          this.withdrawl = this.withdrawl2/3;
        }
        this.backSpeed = 1;
        this.color.color1=false;
        this.color.color2=false;
        this.color.color3=false;
        this.color.color4=false;
        this.color.color5=true;
        this.color.color6=false;
        this.color.color7=false;

      },
      colorFn2(){
        if(this.backSpeed2 == 1){
          this.withdrawl = this.withdrawl2*2;
        }else if(this.backSpeed2 == 2){
          this.withdrawl = this.withdrawl2;
        }else if(this.backSpeed2 == 3){
          this.withdrawl = this.withdrawl2/3*2;
        }
        this.backSpeed = 2;
        this.color.color1=true;
        this.color.color2=false;
        this.color.color3=true;
        this.color.color4=false;
        this.color.color5=false;
        this.color.color6=true;
        this.color.color7=false;

      },
      colorFn3(){
        if(this.backSpeed2 == 1){
          this.withdrawl = this.withdrawl2*3;
        }else if(this.backSpeed2 == 2){
          this.withdrawl = this.withdrawl2/2*3;
        }else if(this.backSpeed2 == 3){
          this.withdrawl = this.withdrawl2;
        }
        this.backSpeed = 3;
        this.color.color1=true;
        this.color.color2=true;
        this.color.color3=true;
        this.color.color4=true;
        this.color.color5=false;
        this.color.color6=false;
        this.color.color7=true;

      },
      sureFn(){
        this.dialogVisible = false;
        let tospeedMess = {
            withdrawl:this.withdrawl,
            backSpeed:this.backSpeed
        }
        this.$emit("getSpeedChild",tospeedMess);
      }

    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
 .easyWarning{
   font-family: PingFang-SC-Medium;
     .dialogTitle{
         position: absolute;
         width:100%;
         top:10px;
         left:0;
         text-align: center;
         z-index: -1;
         font-size:16px;
         color:#333333;
     }
     .withdrawl{
         margin-top:20px;
         font-size:12px;
         color:#888888;
     }
     .withdrawlCash{
         color:#333333;
     }
     .line-box{
       width:100%;
       height:40px;
       margin-top:20px;
      //  background:skyblue;
       position: relative;
     }
     .line{
       margin-top:5px;
       float:left;
       width:50%;
       height:6px;
       background:#B2B2B2;
     }
     .curet{
       position: absolute;
       background:#B2B2B2;
       width:10px;
       height:10px;
       border-radius: 50%;
       cursor: pointer;
       top:3px;
     }
     .curet1{
       background:#C9933E;
       left:-2px;
     }
     .curet2{
       left:170px;
     }
     .curet3{
       left:340px;
     }
     .speedMess{
       position: absolute;
       color:#B2B2B2;
       top:15px;
       cursor: pointer;
     }
     .speedMess1{
       left:-5px;
     }
     .speedMess2{
       left:170px;
     }
     .speedMess3{
       width:30px;
       left:330px;
     }
     .colorbg{
       background:#C9933E;
     }
     .color{
       color:#C9933E;
     }


 }
</style>
