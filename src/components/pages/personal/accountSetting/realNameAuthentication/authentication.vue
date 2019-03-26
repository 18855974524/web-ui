<template>
  <div class="authen-box">
    <top-bar :title="$t('authentication.authentication')"></top-bar>
    <div class="content">
      <div class="title">
        <p>{{$t('authentication.FinishAuthentication')}}</p>
      </div>
      <div class="FirStep">
        <p><span>{{$t('authentication.FirstStep')}}</span>&nbsp; {{$t('authentication.FillAuthentication')}}</p>
        <div class="FormBox">
          <el-form ref="form" :model="MyForm" label-width="150px" :rules="MyFormRules">
            <el-form-item :label="$t('authentication.LastName')" prop="LastName">
              <el-input v-model="MyForm.LastName" :placeholder="$t('authentication.InputLastname')" style="background: #F5F5F5;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authentication.FirName')" prop="FirName">
              <el-input v-model="MyForm.FirName" :placeholder="$t('authentication.InputFirname')" style="background: #F5F5F5;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authentication.CountryOrLocal')" prop="phoneCode">
              <el-select :filter-method="commonSearch1"  filterable v-model="MyForm.phoneCode" :placeholder="$t('authentication.InputCountryOrLocal')" style="width: 301px;background: #F5F5F5;">
                <el-option v-for="(item, index) in countryArr"
                           :label="item.countryName"
                           :value="item.phoneCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('authentication.IDcardType')" prop="IDcardType">
              <el-radio-group v-model="MyForm.IDcardType" @change="RadioChange" size="medium" fill="#EAEAEA">
                <el-radio border label="3" style="width: 145px;background: #F5F5F5;border-radius: 4px;" :disabled="ProtectionBool">{{$t('authentication.Protection')}}</el-radio>
                <el-radio border label="1" style="width: 145px;background: #F5F5F5;border-radius: 4px;" fill="1px solid #EAEAEA" :disabled="IDcardBool">{{$t('authentication.IDcard')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('authentication.IdcardNum')" prop="ProtectionCard" v-if="protectionShow">
              <el-input v-model="MyForm.ProtectionCard" :placeholder="$t('authentication.InputIdcardNum')" style="background: #F5F5F5 !important;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authentication.IdcardNum')" prop="IDcard" v-if="IdCardShow">
              <el-input v-model="MyForm.IDcard" :maxlength="18" :placeholder="$t('authentication.InputIdcardNum')" style="background: #F5F5F5 !important;"></el-input>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div class="SecStep">
        <p><span>{{$t('authentication.SecStep')}}</span>&nbsp; {{$t('authentication.UpdateImg')}}</p>
        <div class="uploadImg" v-if="IdCardShow">
          <div class="FrontPhoto">
            <span>{{$t('authentication.IdcardFrontImg')}}</span>
            <el-upload
              :action="action"
              :multiple="false"
              :on-success="handleSuccess1"
              :on-error="handleError"
              :on-progress="handleProgress1"
              :before-upload="beforeAvatarUpload"
              :headers="headers"
              :data="{index:0}"
              :show-file-list="false"
              name="image"
              class="upload-demo1">
              <div class="IFather"><i class="iconfont icon-az-icon-upload- uploadIcon" v-if="IdcardImg1"></i><i class="iconfont icon-az-icon-re-upload uploadIcon" v-if="SuccessIdcardImg1"></i></div>
              <img :src="dialogImageUrl1" alt="" class="FirImg">
              <div class="zhefuceng" v-if="progress1 !== 0">
                <el-progress type="circle" :percentage="progress1" v-if="progress1 !== 0 && !Faild1" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!isSuccess1 ? '#C9933E' : ''" :status="isSuccess1 ? 'success' : ''"></el-progress>
                <el-progress type="circle" :percentage="progress1" v-if="progress1 !== 0 && Faild1" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!Faild1 ? '#C9933E' : ''" :status="Faild1 ? 'exception' : ''"></el-progress>
              </div>
            </el-upload>

          </div>
          <div class="BackPhoto">
            <span>{{$t('authentication.IdcardBackImg')}}</span>
            <el-upload
              :action="action"
              :multiple="false"
              :on-success="handleSuccess2"
              :before-upload="beforeUploadID2"
              :on-error="handleError"
              :on-progress="handleProgress2"
              :headers="headers"
              :show-file-list="false"
              :data="{index:1}"
              name="image"
              class="upload-demo2">
              <div class="IFather"><i class="iconfont icon-az-icon-upload- uploadIcon" v-if="IdcardImg2"></i><i class="iconfont icon-az-icon-re-upload uploadIcon" v-if="SuccessIdcardImg2"></i></div>
              <img :src="dialogImageUrl2" alt="" class="SecImg">
              <div class="zhefuceng" v-if="progress2 !== 0">
                <el-progress type="circle" :percentage="progress2" v-if="progress2 !== 0 && !Faild2" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!isSuccess2 ? '#C9933E' : ''" :status="isSuccess2 ? 'success' : ''"></el-progress>
                <el-progress type="circle" :percentage="progress2" v-if="progress2 !== 0 && Faild2" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!Faild2 ? '#C9933E' : ''" :status="Faild2 ? 'exception' : ''"></el-progress>
              </div>
            </el-upload>
          </div>
          <div class="AZEXPhoto">
            <span>{{$t('authentication.HandIdcard')}}</span>
            <el-upload
              :action="action"
              :multiple="false"
              :on-success="handleSuccess3"
              :on-error="handleError"
              :before-upload="beforeUploadID3"
              :on-progress="handleProgress3"
              :headers="headers"
              :data="{index:2}"
              name="image"
              :show-file-list="false"
              class="upload-demo3">
              <div class="IFather"><i class="iconfont icon-az-icon-upload- uploadIcon" v-if="IdcardImg3"></i><i class="iconfont icon-az-icon-re-upload uploadIcon" v-if="SuccessIdcardImg3"></i></div>
              <img :src="dialogImageUrl3" alt="" class="ThiImg">
              <div class="zhefuceng"  v-if="progress3 !== 0">
                <el-progress type="circle" :percentage="progress3" v-if="progress3 !== 0 && !Faild3" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!isSuccess3 ? '#C9933E' : ''" :status="isSuccess3 ? 'success' : ''"></el-progress>
                <el-progress type="circle" :percentage="progress3" v-if="progress3 !== 0 && Faild3" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!Faild3 ? '#C9933E' : ''" :status="Faild3 ? 'exception' : ''"></el-progress>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="protection" v-if="protectionShow">
          <div class="FrontPhoto">
            <span>{{$t('authentication.UploadProctionFront')}}</span>
            <el-upload
              :action="action"
              :multiple="false"
              :on-success="possportSuccess1"
              :on-error="handleError"
              :before-upload="beforeAvatarUpload"
              :on-progress="possportProgress1"
              :headers="headers"
              :show-file-list="false"
              :data="{index:0}"
              name="image"
              class="upload-demo1">
              <div class="IFather"><i class="iconfont icon-az-icon-upload- uploadIcon" v-if="IdcardImg1"></i><i class="iconfont icon-az-icon-re-upload uploadIcon" v-if="SuccessIdcardImg1"></i></div>
              <img :src="possportUrl1" alt="" class="FirImg">
              <div class="zhefuceng" v-if="progress1 !== 0">
                <el-progress type="circle" :percentage="progress1" v-if="progress1 !== 0 && !Faild1" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!isSuccess1 ? '#C9933E' : ''" :status="isSuccess1 ? 'success' : ''"></el-progress>
                <el-progress type="circle" :percentage="progress1" v-if="progress1 !== 0 && Faild1" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!Faild1 ? '#C9933E' : ''" :status="Faild1 ? 'exception' : ''"></el-progress>
              </div>
            </el-upload>
          </div>
          <div class="BackPhoto">
            <span>{{$t('authentication.UploadProtionCon')}}</span>
            <el-upload
              :action="action"
              :multiple="false"
              :on-success="possportSuccess2"
              :on-error="handleError"
              :on-progress="possportProgress2"
              :before-upload="beforeUploadpossport2"
              :data="{index:1}"
              :headers="headers"
              name="image"
              :show-file-list="false"
              class="upload-demo2">
              <div class="IFather"><i class="iconfont icon-az-icon-upload- uploadIcon" v-if="IdcardImg2"></i><i class="iconfont icon-az-icon-re-upload uploadIcon" v-if="SuccessIdcardImg2"></i></div>
              <img :src="possportUrl2" alt="" class="SecImg">
              <div class="zhefuceng" v-if="progress2 !== 0">
                <el-progress type="circle" :percentage="progress2" v-if="progress2 !== 0 && !Faild2" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!isSuccess2 ? '#C9933E' : ''" :status="isSuccess2 ? 'success' : ''"></el-progress>
                <el-progress type="circle" :percentage="progress2" v-if="progress2 !== 0 && Faild2" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!Faild2 ? '#C9933E' : ''" :status="Faild2 ? 'exception' : ''"></el-progress>
              </div>
            </el-upload>
          </div>
          <div class="AZEXPhoto">
            <span>{{$t('authentication.HandIdcard')}}</span>
            <el-upload
              :action="action"
              :multiple="false"
              :on-success="possportSuccess3"
              :on-error="handleError"
              :on-progress="possportProgress3"
              :data="{index:2}"
              :before-upload="beforeUploadpossport3"
              :headers="headers"
              name="image"
              :show-file-list="false"
              class="upload-demo3">
              <div class="IFather"><i class="iconfont icon-az-icon-upload- uploadIcon" v-if="IdcardImg3"></i><i class="iconfont icon-az-icon-re-upload uploadIcon" v-if="SuccessIdcardImg3"></i></div>
              <img :src="possportUrl3" alt="" class="ThiImg">
              <div class="zhefuceng" v-if="progress3 !== 0">
                <el-progress type="circle" :percentage="progress3" v-if="progress3 !== 0 && !Faild3" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!isSuccess3 ? '#C9933E' : ''" :status="isSuccess3 ? 'success' : ''"></el-progress>
                <el-progress type="circle" :percentage="progress3" v-if="progress3 !== 0 && Faild3" style="position: absolute;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);" :color="!Faild3 ? '#C9933E' : ''" :status="Faild3 ? 'exception' : ''"></el-progress>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="btnDiv">
          <el-button type="primary" class="SubApplications" @click="SubApplications">{{$t('authentication.SubmitReq')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import api from '../../../../../libs/api';
  import commonFilter from '../../../../../libs/commonFilter';
  import util from '../../../../../libs/util'
  import topBar from '../topBar'
  import VueCookies from 'vue-cookie'
    export default {
      name: "authentication",
      data() {
        return {
          MyForm:{
            LastName: "",
            FirName: "",
            phoneCode: "",
            IDcardType: "3",
            IDcard: "",
            ProtectionCard:""
          },
          countryName:"",
          IdCardShow:false,
          protectionShow:true,
          action: `${util.ajax.defaults.baseURL}${"/User/UploadCertificationImage"}`,
          headers: { Authorization:`Bearer ${this.$store.state.user.token||JSON.parse(VueCookies.get('token'))}` },
          countryArr: [],
          countryArr1:[],
          progress1: 0,
          progress2: 0,
          progress3: 0,
          isSuccess1:false,
          isSuccess2:false,
          isSuccess3:false,
          Faild1:false,
          Faild2:false,
          Faild3:false,
          IDcardBool:false,
          ProtectionBool:false,
          dialogImageUrl1:"../../../../../static/img/IdCard/az-pt-IDcard-1.svg",
          dialogImageUrl2:"../../../../../static/img/IdCard/az-pt-IDcard-2.svg",
          dialogImageUrl3:"../../../../../static/img/IdCard/az-pt-IDcard-3.svg",
          possportUrl1:"../../../../../static/img/IdCard/az-pt-passport-1.svg",
          possportUrl2:"../../../../../static/img/IdCard/az-pt-passport-2.svg",
          possportUrl3:"../../../../../static/img/IdCard/az-pt-passport-3.png",
          imagesIDcard:[false,false,false],
          imagesPossport:[],
          IdcardImg1:true,
          IdcardImg2:true,
          IdcardImg3:true,
          indexNum1:"",
          indexNum2:"",
          indexNum3:"",
          SuccessIdcardImg1:false,
          SuccessIdcardImg2:false,
          SuccessIdcardImg3:false,
          dialogVisible1:false,
          bfArr:[],
          MyFormRules:{
            FirName:[
              {required:true, message: this.$t('authentication.InputTrueFirName'), trigger:'blur'}
            ],
            LastName:[
              {required:true, message:this.$t('authentication.InputTrueLastName'), trigger:'blur'}
            ],
            phoneCode:[
              {required:true, message: this.$t('authentication.SelectCountry'), trigger: 'change'}
            ],
            IDcardType:[
              {required:true, message: this.$t('authentication.ChoiceType'), trigger: 'change'}
            ],
            ProtectionCard:[
              {required:true, message: this.$t('authentication.InputCardNum'), trigger:'blur'}
            ],
            IDcard:[
              {required:true, message: this.$t('authentication.InputCardNum'), trigger:'blur'},
              {min: 18, max: 18, message: this.$t('authentication.InputCardNum'), trigger: 'blur'}
            ]
          }
        }
      },
      components:{
          topBar
      },
      mounted(){
        api.post("/Country/GetList", null)
          .then((res) => {
            this.countryArr = res.data.value;
            this.countryArr1= res.data.value;
            this.bfArr = res.data.value;
          })
          .catch((err)=>{
            console.log(err);
          })
        setTimeout(()=>{
          if(this.$store.state.user.language == 'cn'){
            this.MyForm.IDcardType = '1';
            this.IdCardShow = true;
            this.protectionShow = false;
          }else {
            this.MyForm.IDcardType = '3';
            this.protectionShow = true;
            this.IdCardShow = false;
          }
        },300)
      },
      // watch:{
      //   dateMess(item){
      //     return item;
      //   }
      // },
      methods:{
        commonSearch1: async function(query){
          //自定义搜索方法
          if (query !== '') {
            this.sortCountry(query);
            console.log('country', this.countryArr);
          } else {
            this.countryArr = this.countryArr1;
            this.MyForm.phoneCode="";
          }
        },
        sortCountry(query){
          this.countryArr = [];
          this.MyForm.phoneCode=query;
          let query1 = query;
          let query2 = query;
          let arr = [];
          for(let i = 0;i < this.bfArr.length;i++){
            query1 = query1.substring(0,1).toUpperCase() + query1.substring(1).toLowerCase();
              if(query1 == this.bfArr[i].countryName.slice(0,query.length)){
                this.countryArr.push(this.bfArr[i]);
              }
            for(let j = 1;j < this.bfArr[i].countryName.length;j++){
              if(query2 == this.bfArr[i].countryName.substr(j, query2.length)){
                if(this.countryArr.indexOf(this.bfArr[i]) > -1 || arr.indexOf(this.bfArr[i]) > -1){
                  console.log('continue了');
                    continue;
                }
                console.log('没重复的');
                arr.push(this.bfArr[i]);
              }
            }
            if (i == this.bfArr.length - 1){
              this.countryArr = this.countryArr.concat(arr);
              console.log(arr,111111111);
            }
          }

        },
        //上传成功
        handleSuccess1(data){
          this.ProtectionBool = true;
          if(!data.isOk){
            this.Faild1 = true;
            return;
          }
          this.imagesIDcard[0] = 1;
          this.isSuccess1 = true;
          setTimeout(()=>{
            this.progress1 = 0;
            this.SuccessIdcardImg1 = true;
          },800);
        },
        getCountryName(){
        },
        // 上传中
        handleProgress1(event, file){
          this.Faild1 = false;
          this.isSuccess1 = false;
          this.IdcardImg1 = false;
          this.dialogImageUrl1 = file.url;
          this.progress1 = event.percent;
        },
        //上传成功
        handleSuccess2(data){
          this.ProtectionBool = true;
          if(!data.isOk){
            this.Faild2 = true;
            return;
          }
          this.imagesIDcard[1] = 2;
          this.isSuccess2 = true;
          setTimeout(()=>{
            this.progress2 = 0;
            this.SuccessIdcardImg2 = true;
          },800);
        },
        // 上传中
        handleProgress2(progress,file){
          this.Faild2 = false;
          this.IdcardImg2 = false;
          this.isSuccess2 = false;
          this.progress2 = progress.percent;
          this.dialogImageUrl2 = file.url;
        },
        //上传成功
        handleSuccess3(data){
          this.ProtectionBool = true;
          if(!data.isOk){
            this.Faild3 = true;
            return;
          }
          this.imagesIDcard[2] = 3;
          this.isSuccess3 = true;
          setTimeout(()=>{
            this.SuccessIdcardImg3 = true;
            this.progress3 = 0;
          },800);

        },
        // 上传中
        handleProgress3(progress,file){
          this.Faild3 = false;
          this.IdcardImg3 = false;
          this.isSuccess3 = false;
          this.progress3 = progress.percent;
          this.dialogImageUrl3 = file.url;
        },
        //上传失败
        handleError(error){
          console.log(error);
        },
        possportSuccess3(data){
          this.IDcardBool = true;
          if(!data.isOk){
            this.Faild3 = true;
            return;
          }
          this.imagesIDcard[2] = 1;
          this.isSuccess3 = true;
          setTimeout(()=>{
            this.SuccessIdcardImg3 = true;
            this.progress3 = 0;
          },800);
        },
        possportSuccess1(data){
          this.IDcardBool = true;
          if(!data.isOk){
            this.Faild1 = true;
            return;
          }
          this.imagesIDcard[0] = 1;
          this.isSuccess1 = true;
          setTimeout(()=>{
            this.SuccessIdcardImg1 = true;
            this.progress1 = 0;
          },800);
        },
        possportSuccess2(data){
          this.IDcardBool = true;
          if(!data.isOk){
            this.Faild2 = true;
            return;
          }
          this.imagesIDcard[1] = 1;
          this.isSuccess2 = true;
          setTimeout(()=>{
            this.SuccessIdcardImg2 = true;
            this.progress2 = 0;
          });
        },
        possportProgress1(progress,file){
          this.Faild1 = false;
          this.isSuccess1 = false;
          this.progress1 = progress.percent;
          this.IdcardImg1 = false;
          this.possportUrl1 = file.url;

        },
        possportProgress2(progress,file){
          this.Faild2 = false;
          this.progress2 = progress.percent;
          this.isSuccess2 = false;
          this.IdcardImg2 = false;
          this.possportUrl2 = file.url;
        },
        possportProgress3(progress,file){
          this.Faild3 = false;
          this.progress3 = progress.percent;
          this.isSuccess3 = false;
          this.IdcardImg3 = false;
          this.possportUrl3 = file.url;
        },
        RadioChange(){
          if(this.MyForm.IDcardType == "1"){
            this.IdCardShow = true;
            this.protectionShow = false;
          }else if (this.MyForm.IDcardType == "3") {
            this.protectionShow = true;
            this.IdCardShow = false;
          }
        },
        SubApplications(){
          for (let i = 0;i < this.countryArr1.length;i++){
            if(this.MyForm.phoneCode == this.countryArr1[i].phoneCode){
              this.countryName = this.countryArr1[i].countryName;
            }
          }
          console.log(this.countryName);
          let UserInfoApplyCertificationInput = {
            cerDataInfo:{
              countryCode: this.MyForm.phoneCode,
              countryName:this.countryName,
              certType: this.MyForm.IDcardType,
              cardNumber: this.MyForm.IDcardType == 1?this.MyForm.IDcard:this.MyForm.ProtectionCard,
              firstName: this.MyForm.FirName,
              lastName: this.MyForm.LastName,
            }
          };

          if(!UserInfoApplyCertificationInput.cerDataInfo.lastName){
            this.$message({showClose:true, message:this.$t('authentication.InputYourLastname'), type:'error'});
            return
          }
          if(!UserInfoApplyCertificationInput.cerDataInfo.firstName){
            this.$message({showClose:true, message: this.$t('authentication.InputYourName'), type:'error'});
            return
          }
          if(!UserInfoApplyCertificationInput.cerDataInfo.countryName){
            this.$message({showClose:true, message:this.$t('authentication.SelectCountry'), type:'error'});
            return
          }
          if(!UserInfoApplyCertificationInput.cerDataInfo.cardNumber){
            this.$message({showClose:true, message:this.$t('authentication.InputCardNum'), type:'error'});
            return
          }
          if(this.MyForm.IDcardType == "1"){
            if(!/^[0-9]{17}([0-9]|X|x)$/.test(this.MyForm.IDcard)){
              this.$message({showClose:true, message:this.$t('authentication.IDcardWrong'), type:'error'});
              return;
            }
          }
          for (let i = 0; i < this.imagesIDcard.length; i++) {
            if(!this.imagesIDcard[i]){
              this.$message({showClose:true, message:this.$t('authentication.UploadImg'), type:'error'});
              return
            }
          }

          api.post('/User/ApplyCertification',UserInfoApplyCertificationInput)
            .then((res)=>{
              this.$message({showClose:true, message:this.$t('authentication.authenticationSuccess'), type:'success'});
                  this.$store.dispatch('getUser',res.data.value);
                  this.$router.push({name:'accountSettingHome'});
            })
            .catch((err)=>{
              console.log(err);
            });
        },
        beforeAvatarUpload(file) {
          const isLt2M = file.size / 1024 / 1024 < 4;

          if (file.type.indexOf('image/') == -1) {
            this.$message({ message:this.$t('myUpload.imageFormatErr'),showClose:true, type:'error'});
            return false;
          }
          if (!isLt2M) {
            this.$message({showClose:true, message:this.$t('authentication.NotMoreFourMB'), type:'error'});
            return false;
          }
        },
        beforeUploadID2(file) {
          const isLt2M = file.size / 1024 / 1024 < 4;

          if (file.type.indexOf('image/') == -1) {
            this.$message({ message:this.$t('myUpload.imageFormatErr'),showClose:true, type:'error'});
            return false;
          }
          if (!isLt2M) {
            this.$message({showClose:true, message:this.$t('authentication.NotMoreFourMB'), type:'error'});
            return false;
          }
        },
        beforeUploadID3(file) {
          const isLt2M = file.size / 1024 / 1024 < 4;

          if (file.type.indexOf('image/') == -1) {
            this.$message({ message:this.$t('myUpload.imageFormatErr'),showClose:true, type:'error'});
            return false;
          }
          if (!isLt2M) {
            this.$message({showClose:true, message:this.$t('authentication.NotMoreFourMB'), type:'error'});
            return false;
          }
        },
        beforeUploadpossport2(file) {
          const isLt2M = file.size / 1024 / 1024 < 4;

          if (file.type.indexOf('image/') == -1) {
            this.$message({ message:this.$t('myUpload.imageFormatErr'),showClose:true, type:'error'});
            return false;
          }
          if (!isLt2M) {
            this.$message({showClose:true, message:this.$t('authentication.NotMoreFourMB'), type:'error'});
            return false;
          }
        },
        beforeUploadpossport3(file) {
          const isLt2M = file.size / 1024 / 1024 < 4;

          if (file.type.indexOf('image/') == -1) {
            this.$message({ message:this.$t('myUpload.imageFormatErr'),showClose:true, type:'error'});
            return false;
          }
          if (!isLt2M) {
            this.$message({showClose:true, message:this.$t('authentication.NotMoreFourMB'), type:'error'});
            return false;
          }
        },

      },
    }

</script>
<style>
  .authen-box .el-progress--circle .el-progress__text {
    color: #C9933E;
  }
 </style>
<style lang="scss" type="text/scss" scoped>

  .authen-box {
    background: rgb(242,242,242);
    border: 0px;
    .content {
      width: 1200px;
      margin: 50px auto 0;
      padding-bottom: 100px;
      background: #FFFFFF;
      .title {
        height: 64px;
        border-bottom: 1px solid #E5E5E5;
        line-height: 64px;
        p {
          font-size: 16px;
          color: #888888;
          font-family: PingFang-SC-Medium;
          margin-left: 20px;
          font-weight: bold;
        }
      }
      .FirStep {
        p {
          font-size: 13px;
          color: #888888;
          margin: 20px 20px 0 20px;
          span {
            color: #C9933E;
          }
        }
        .FormBox {
          margin: 20px auto;
          width: 450px;
        }
      }
      .SecStep {
        p {
          font-size: 13px;
          color: #888888;
          margin: 40px 20px 0 20px;
          span {
            color: #C9933E;
          }
        }
      }
      .uploadImg {
        width: 360px;
        margin: 20px auto;
        text-align: center;
        div {
          span {
            font-size: 14px;
            color: #888888;
          }
        }
        .upload-demo1 {
          position: relative;
          img {
            max-height: 100%;
            max-width: 100%;
            vertical-align: middle;
          }
          .IFather {
            width: 48px;
            height: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            border-radius: 50%;
            .uploadIcon {
              line-height: 48px;
              color: #E1AA55;
              font-size: 48px;
            }
          }
        }
        .upload-demo2 {
          position: relative;
          img {
            max-height: 100%;
            max-width: 100%;
            vertical-align: middle;
          }
          .IFather {
            width: 48px;
            height: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            border-radius: 50%;
            .uploadIcon {
              line-height: 48px;
              color: #E1AA55;
              font-size: 48px;
            }
          }
        }
        .upload-demo3 {
          position: relative;
          img {
            max-height: 100%;
            max-width: 100%;
            vertical-align: middle;
          }
          .IFather {
            width: 48px;
            height: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            border-radius: 50%;
            .uploadIcon {
              line-height: 48px;
              color: #E1AA55;
              font-size: 48px;
            }
          }
        }
        .FrontPhoto {
          margin-top: 34.3px;
          .upload-demo1 {
            margin-top: 13px;
            border: 1px dashed #D5D5D5;
            border-radius: 4px;
            &:hover .IFather .uploadIcon {
              background: rgba(201, 147, 62, 0.1);
              border-radius: 50%;
              overflow: hidden;
            }
          }
        }
        .BackPhoto {
          margin-top: 34px;
          .upload-demo2 {
            margin-top: 13px;
            border: 1px dashed #D5D5D5;
            border-radius: 4px;
            &:hover .IFather .uploadIcon {
              background: rgba(201, 147, 62, 0.1);
              border-radius: 50%;
              overflow: hidden;
            }
          }

        }
        .AZEXPhoto {
          margin: 34px 0;
          .upload-demo3 {
            margin-top: 13px;
            border: 1px dashed #D5D5D5;
            border-radius: 4px;
            &:hover .IFather .uploadIcon {
              background: rgba(201, 147, 62, 0.1);
              border-radius: 50%;
              overflow: hidden;
            }
          }

        }
      }
      .protection {
        width: 360px;
        margin: 20px auto;
        text-align: center;
        div {
          span {
            font-size: 14px;
            color: #888888;
          }
        }
        .upload-demo1 {
          position: relative;
          border: 1px dashed #D5D5D5;
          border-radius: 4px;
          img {
            max-height: 100%;
            max-width: 100%;
            vertical-align: middle;
          }
          .IFather {
            width: 48px;
            height: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            border-radius: 50%;
            .uploadIcon {
              line-height: 48px;
              color: #E1AA55;
              font-size: 48px;
            }
          }
        }
        .upload-demo2 {
          position: relative;
          border: 1px dashed #D5D5D5;
          border-radius: 4px;
          img {
            max-height: 100%;
            max-width: 100%;
            vertical-align: middle;
          }
          .IFather {
            width: 48px;
            height: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            border-radius: 50%;
            .uploadIcon {
              line-height: 48px;
              color: #E1AA55;
              font-size: 48px;
            }
          }
        }
        .upload-demo3 {
          position: relative;
          border: 1px dashed #D5D5D5;
          border-radius: 4px;
          img {
            max-height: 100%;
            max-width: 100%;
            vertical-align: middle;
          }
          .IFather {
            width: 48px;
            height: 48px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            border-radius: 50%;
            .uploadIcon {
              line-height: 48px;
              color: #E1AA55;
              font-size: 48px;
            }
          }
        }
        .FrontPhoto {
          margin-top: 34.3px;
          .upload-demo1 {
            margin-top: 13px;
            position: relative;
            &:hover .IFather .uploadIcon {
              background: rgba(201, 147, 62, 0.1);
              border-radius: 50%;
              overflow: hidden;
            }
          }

        }
        .BackPhoto {
          margin-top: 34px;
          .upload-demo2 {
            margin-top: 13px;
            position: relative;
            &:hover .IFather .uploadIcon {
              background: rgba(201, 147, 62, 0.1);
              border-radius: 50%;
              overflow: hidden;
            }
          }

        }
        .AZEXPhoto {
          margin: 34px 0;
          .upload-demo3 {
            margin-top: 13px;
            position: relative;
            &:hover .IFather .uploadIcon {
              background: rgba(201, 147, 62, 0.1);
              border-radius: 50%;
              overflow: hidden;
            }
          }

        }
      }
      .btnDiv {
        width: 320px;
        margin: 0 auto;
        .SubApplications {
          width: 320px;
          height: 44px;
          /*margin: 0 auto;*/
        }
      }

    }
  }
  .zhefuceng{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.8;
  }
</style>
