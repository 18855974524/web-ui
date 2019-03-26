<template>
  <div class="countryBox pingFangSC-regular">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
         <!--<svg class="icon NationalFlag" aria-hidden="true">-->
           <!--<use :xlink:href="`#icon-${selectCountry.shortName}`"></use>-->
         <!--</svg>-->
         <span :class="`NationalFlag ${selectCountry.shortName}`">
          </span>
        <div class="addIMG">+</div>
        <div class="contryCode pingFangSC-medium">
          {{phoneCode}}
        </div>
        <i class="iconfont icon-az-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <div class="searchBox">
          <input type="text" class="search" v-model="searchMess" :placeholder="$t('country.enterCountryCodePhoneCode')"
                 @keyup="searchPhoOrCode"/>
          <i class="el-icon-search" style="float:right;margin-top:8px;"></i>
        </div>
        <div class="searchEndBox">
          <el-dropdown-item class="eachCounty" :key=index v-for="(item,index) in countyList">
            <div class="eachCountryTab pingFangSC-regular" @click="eackClick(item)">
              <!--<svg class="icon flagImg" aria-hidden="true">-->
                <!--<use :xlink:href="`#icon-${item.shortName}`"></use>-->
              <!--</svg>-->
              <span :class="`flagImg ${item.shortName}`">
              </span>
              <span class="CName"> {{item.countryName}}</span>
              <span class="Ccode" v-if="item.phoneCode.length==0">0000</span>
              <span class="Ccode" v-if="item.phoneCode.length==1">000{{item.phoneCode}}</span>
              <span class="Ccode" v-if="item.phoneCode.length==2">00{{item.phoneCode}}</span>
              <span class="Ccode" v-if="item.phoneCode.length==3">0{{item.phoneCode}}</span>
              <span class="Ccode" v-if="item.phoneCode.length==4">{{item.phoneCode}}</span>
            </div>

          </el-dropdown-item>
          <div class="noCountry" v-if="countyList.length==0">
            {{ $t("country.noCountry") }}
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>

    <div class="PhoneBox">
      <div class="lineVer"></div>
      <el-input type="text" v-model="phoneNumber" :placeholder="$t('country.phoneNumber') " class="phoneNumber"
                @blur="init"/>
    </div>
  </div>
</template>

<script>
  import api from '../../libs/api'

  /***@augments
   * 初始化传进来的值
   * json: {
          shortName: "PT",//初始化传进来的国家简称
          phoneNumber: "123123",//初始化传进来的手机号码
        }
   选中国家，传出去的是：
   countryEmit = {
            phoneNumber:手机号码,
            phoneCode:国家代码,
            shortName:国家简称
        }

   */
  export default {
    props: ["parentCountry"],
    data() {
      return {
        selectCountry: "",
        phoneCode: "",
        phoneNumber: "",
        searchMess: "",
        countyList: [],
        countyAllList: [],
        shortName: "",
      }
    },
    mounted() {
      this.getCounty();
    },
    watch: {
      language(val, oldVal) {
        if (val != oldVal) {
          this.getFlag();
        }
      }
    },
    computed: {
      language() {
        return this.$store.state.user.language;
      }
    },
    methods: {
      getFlag() {
        let phoneCode = "";

        if (this.parentCountry) {
          this.shortName = this.parentCountry.shortName;
          for (let i = 0; i < this.countyAllList.length; i++) {
            if (this.countyAllList[i].shortName == this.shortName) {
              phoneCode = this.countyAllList[i].phoneCode;
            }
          }
          this.selectCountry = parentCountry.shortName;
        } else {
          let shortName = "";
          if (this.$store.state.user.language == "cn") {//中国
            phoneCode = "86";
            shortName = "CN";
          } else if (this.$store.state.user.language == "ko") {//韩国
            phoneCode = "82";
            shortName = "KR";
          } else if (this.$store.state.user.language == "ja") {//日本
            phoneCode = "81";
            shortName = "JP";
          } else if (this.$store.state.user.language == "ru") {//德国
            phoneCode = "49";
            shortName = "DE";
          } else {//都是美国
            phoneCode = "01";
            shortName = "US";
          }
          this.selectCountry = {phoneCode, shortName};
        }
        if (phoneCode.length == 0) {
          this.phoneCode = "0000";
        } else if (phoneCode.length == 1) {
          this.phoneCode = "0" + phoneCode;
        } else if (phoneCode.length == 2) {
          this.phoneCode = "00" + phoneCode;
        } else if (phoneCode.length == 3) {
          this.phoneCode = "0" + phoneCode;
        } else if (phoneCode.length == 4) {
          this.phoneCode = phoneCode;
        }

      },
      getCounty() {
        let that = this;
        api.post('/Country/GetList', null).then((res) => {
          that.countyList = res.data.value;
          that.countyAllList = res.data.value;
          for (let i = 0; i < that.countyAllList.length; i++) {
            if (that.countyAllList[i].phoneCode.length == 0) {
              that.countyAllList[i].phoneCode = "0000";
            } else if (that.countyAllList[i].phoneCode.length == 1) {
              that.countyAllList[i].phoneCode = "000" + that.countyAllList[i].phoneCode;
            } else if (that.countyAllList[i].phoneCode.length == 2) {
              that.countyAllList[i].phoneCode = "00" + that.countyAllList[i].phoneCode;
            } else if (that.countyAllList[i].phoneCode.length == 3) {
              that.countyAllList[i].phoneCode = "0" + that.countyAllList[i].phoneCode;
            } else if (that.countyAllList[i].phoneCode.length == 4) {
              that.countyAllList[i].phoneCode = that.countyAllList[i].phoneCode;
            }
          }
          this.getFlag();
          // this.init();
        }).catch((err) => {
          console.log(err);
        })
      },
      searchPhoOrCode() {
        let searchMessage = this.searchMess.toUpperCase();//文字
        let array = this.countyAllList.filter((item) => {
          return item.phoneCode.indexOf(searchMessage) > -1 || item.countryName.toUpperCase().indexOf(searchMessage) > -1;
        })
        let array2 = array.sort((a, b) => {
          return (a.phoneCode.indexOf(searchMessage) - b.phoneCode.indexOf(searchMessage)) ||
            (a.countryName.toUpperCase().indexOf(searchMessage) - b.countryName.toUpperCase().indexOf(searchMessage));
        })
        this.countyList = array2;

      },
      eackClick(item) {
        this.selectCountry = item;
        if (item.phoneCode.length == 0) {
          this.phoneCode = "0000";
        } else if (item.phoneCode.length == 1) {
          this.phoneCode = "0" + item.phoneCode;
        } else if (item.phoneCode.length == 2) {
          this.phoneCode = "00" + item.phoneCode;
        } else if (item.phoneCode.length == 3) {
          this.phoneCode = "0" + item.phoneCode;
        } else if (item.phoneCode.length == 4) {
          this.phoneCode = item.phoneCode;
        }
        this.searchMess = "";
        this.countyList = this.countyAllList;
        let countryEmit = {
          phoneNumber: this.phoneNumber,
          phoneCode: parseInt(this.phoneCode),
          shortName: item.shortName
        }
        this.$emit("country", countryEmit);
      },
      init() {
        let countryEmit = {
          phoneNumber: this.phoneNumber,
          phoneCode: parseInt(this.phoneCode),
          shortName: this.shortName
        }
        this.$emit("country", countryEmit);
      },
      initPhone(){
        this.phoneNumber = "";
      }
    },

  }
</script>

<style lang="scss" type="text/scss" scoped>
  .countryBox {
    position: relative;
    height: 44px;
    background: #f5f5f5;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border: 1px solid #eaeaea;
    width: 320px;
    &.error-country {
      border-color: $--color-danger;
    }

    .el-dropdown {
      float: left;
      height:44px;
      width: 320px;
      .el-dropdown-link {
        width: 119px;
        height: 44px;
        cursor: pointer;
        display: block;
        &:focus {
          outline: none;
        }
        .NationalFlag {
          float: left;
          width: 30px;
          height: 20px;
          margin: 12px 0 0 8px;
          background-image:url('../../assets/img/flags@2x.png');
          background-size: auto 20px;
          &:focus {
            outline: none;
          }
        }
        .addIMG {
          float: left;
          // margin:11px 0 0 6px;
          height: 44px;
          text-align: center;
          line-height: 44px;
          width: 10px;
          margin-left: 5px;
          font-size: 14px;
        }
        i {
          color: #D5D5D5;
          float: left;
          // margin-top:13px;
          // margin-left:3px;
          margin-left: 5px;
          width: 25px;
          height: 44px;
          line-height: 46px;
          text-align: center;
          &:focus {
            outline: none;
          }
        }
      }
    }
  }

  .PhoneBox {
    position: absolute;
    width: 212px;
    height: 44px;
    background: #f5f5f5;
    left: 106px;
    top: 0;
    font-size: 14px;

  }

  .phoneNumber {
    float: left;
    // margin-left: 6px;
    width: 185px;
    height: 20px;
    // margin-top: 11px;
    background: #F5F5F5;
    border: none;
    margin-top: 0px;
    // border-left: 1px solid #E5E5E5;
    text-indent: 8px;
    &:focus {
      outline: none;
    }
  }

  .lineVer {
    float: left;
    height: 20px;
    margin-top: 12px;
    width: 10px;
    border-right: 1px solid #E5E5E5;
  }

  .contryCode {
    float: left;
    height: 44px;
    width: 30px;
    line-height: 44px;
    border: none;
    &:focus {
      outline: none;
    }
  }

  .searchBox {
    background: #FAFAFA;
    width: 300px;
    height: 32px;
    margin: 0 0 5px 10px;
    background: rgba(245, 245, 245, 1);
    border-radius: 4px;
    .el-icon-search {
      float: right;
      background: rgba(245, 245, 245, 1);
      color: #B2B2B2;
      margin-left: 5px;
      margin-top: 8px;
    }
    .search {
      float: right;
      background: rgba(245, 245, 245, 1);
      display: block;
      width: 279px;
      height: 25px;
      text-indent: 8px;
      border: none;
      font-size: 12px;
      margin-top: 4px;
      &:focus {
        outline: none;
      }
    }
  }

  .searchEndBox {
    width: 320px;
    max-height: 300px;
    min-height:90px;
    width: 100%;
    overflow: auto;
    position: relative;
    .eachCounty {
      height: 30px;
      cursor: pointer;
      color: #333333;
      &:hover {
        background: #eee;
        color: #333333;
      }

    }
  }

  .eachCounty .flagImg {
    display: block;
    width: 30px;
    height: 20px;
    margin-top: 5px;
    float: left;
    background-image:url('../../assets/img/flags@2x.png');
    background-size: auto 20px;
  }

  .eachCounty .CName {
    float: left;
    line-height: 30px;
    margin-left: 10px;
    font-size: 12px;
  }

  .eachCounty .Ccode {
    float: right;
    line-height: 30px;
    font-size: 12px;
    // margin-right: 10px;
  }

  .el-popper[x-placement^="bottom"][data-v-656cd815] {
    width: 320px !important;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    -moz-box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
  }

  .eachCountryTab {
    width: 100%;
    height: 100%;
  }

  .noCountry {
    text-align: center;
    color: gray;
    font-size: 12px;
    position:absolute;
    left:0;
    top:30px;
    width:100%;
    height:30px;
    text-align:center;
  }

  ::-webkit-input-placeholder { /*WebKit browsers*/
    font-size: 12px;
    color:rgba(178,178,178,1);
  }

  .el-dropdown-menu__item {
    padding: 0 11px;
  }

</style>
<style>
  .PhoneBox .phoneNumber input.el-input__inner {
    /* margin-top: -9px!important; */
    border: none !important;
  }

  .PhoneBox .phoneNumber input.el-input__inner:focus {
    border: none !important;
    outline: none !important;
    background: #F5F5F5 !important;
  }
/* ///////滚动轴///////////////////////////// */
  .searchEndBox::-webkit-scrollbar {
    width: 10px; /*对垂直流动条有效*/
    height: 60px; /*对水平流动条有效*/
}
/*定义滚动条的轨道颜色、内阴影及圆角*/
  .searchEndBox::-webkit-scrollbar-track{
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
    background-color: white;
    border-radius: 3px;
}
/*定义滑块颜色、内阴影及圆角*/
  .searchEndBox::-webkit-scrollbar-thumb{
    border-radius: 7px;
    -webkit-box-shadow: inset 0 0 6px rgba(229,229,229,1);
    background-color: #E8E8E8;
}
/*定义两端按钮的样式*/
  .searchEndBox::-webkit-scrollbar-button {
    background-color:white;
}
/*定义右下角汇合处的样式*/
  .searchEndBox::-webkit-scrollbar-corner {
    background:white;
}
/* ///////滚动轴///////////////////////////// */
</style>
