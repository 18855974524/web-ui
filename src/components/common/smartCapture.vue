<template>
  <div id="smart-capture" class="common-smart-capture">
    <div :id="id" class="sc">
    </div>
  </div>
</template>

<script>
  // 智能检测组件
  // 当需要重新初始化智能验证组件时 调用组件的 init 方法
  // 弹框盾牌刮不出原因是 父辈元素 transform 影响
  export default {
    data() {
      return {
        sc:undefined
      }
    },
    props:{
      id:{
        default:'sc'
      }
    },
    methods:{
      init(){
        let that = this;
        // let scWraperDom = document.querySelector(`#${this.id} #SM_BTN_WRAPPER_1`);
        // scWraperDom&&scWraperDom.remove();
        document.getElementById(this.id).innerHTML = '';
        this.sc = new smartCaptcha({
          renderTo: `#${this.id}`,
          width: 320,
          height: 42,
          default_txt: this.$t('smartCaptcha.clickButtonToValidate'),
          success_txt: this.$t('smartCaptcha.ValidateSuccess'),
          fail_txt: this.$t('smartCaptcha.ValidateErrorToRefresh'),
          scaning_txt: this.$t('smartCaptcha.noopsyche'),
          success: function(data) {
            that.$emit('success',data);
          },
          error:function(err){
            console.log(err);
          }
        });
        this.sc.init();
      },
    },
    mounted(){
      this.init();
    }
  }
</script>

<style lang="scss" type="text/scss">
  #smart-capture {
    .sm-txt{
      color: #888888;
    }
    .sm-btn-success .sm-txt {
      color: #01bf8f;
    }
    .sm-btn{
      border:1px solid #eaeaea;
      border-radius:5px;
    }
    &.common-smart-capture{
      width:100%;
      padding:0;
      height:44px;
      .sc{
        /* width:100%; */
        padding:0;
        height:44px;
        margin-top:0;
        margin-left:0;
        background:#f5f5f5;
      }
    }
  }
</style>
