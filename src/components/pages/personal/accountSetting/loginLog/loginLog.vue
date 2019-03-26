<template>
  <div>
      <top-bar :title="$t('loginLog.loginLog') "></top-bar>
      <div class="loginLogPage">
          <table  border="0" cellpadding="0" cellspacing="0" class="normalTable">
              <thead>
                  <tr>
                      <td>{{ $t("loginLog.time") }}</td>
                      <td>{{ $t("loginLog.loginAdress") }}</td>
                      <td>{{ $t("loginLog.machion") }}</td>
                      <td>{{ $t("loginLog.loginIp") }}</td>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item,index) in arrayList" :key=index>
                      <td>{{item.createTime|dateTime}}</td>
                      <td>{{item.city?item.city:$t('loginLog.notKnow')}} </td>
                      <td>
                          <span v-if="item.audience==0"><i class="iconfont icon-az-icon-login-"></i>&nbsp;{{ $t("loginLog.webpage") }}</span>
                          <span v-if="item.audience==1"><i class="iconfont icon-az-icon-phone-"></i>&nbsp;{{ $t("loginLog.app") }}</span>
                      </td>
                      <td>{{item.ipAddress}} </td>
                  </tr>
              </tbody>
              <tfooter v-if="listLoading">
                <tr>
                    <td colspan="4">{{item.city?item.city:$t('loginLog.noMessNow')}}</td>
                </tr>
              </tfooter>
          </table>
          <div v-show="!listLoading" class="pages">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="page.currPage"  :page-sizes="[10,10,15, 20]" :page-size="page.pageSize"
                    layout="prev, pager, next"  :total="page.total">
                </el-pagination>
            </div>
      </div>
  </div>
</template>

<script>
import api from '../../../../../libs/api'
import topBar from '../topBar'
  export default {
    components:{
        topBar
    },
    data() {
      return {
        listLoading:false,
        arrayList:[],
        page:{
            total:null,//z总页数 null
            currPage: 1,//当前页
            pageSize: 10,//一页显示个数
        }
      }
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            let par = {
              "pageIndex":this.page.currPage,//10
              "pageSize":this.page.pageSize,//(1-1)*10
            };
            api.post('/User/GetLoginLogPageList',par).then((res)=>{
                if(res.data.value.totalItems==0){
                    this.listLoading = true;
                }else{
                    this.listLoading = false;
                }
                console.log(res.data.value);
                this.page.total = res.data.value.totalItems;
                this.arrayList = res.data.value.items;
            }).catch((err)=> {})
        },
        handleSizeChange(val){ //操作分页
            this.page.pageSize = val;//每页条数
            this.getList(); //重新请求一次
        },
        handleCurrentChange(val) {
            this.page.currPage = val; //当前页码
            this.getList();
        },
    },
    mounted(){
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.loginLogPage{
    width:1200px;
    overflow:hidden;
    margin:0 auto;
    margin-top:20px;
    margin-bottom:60px;
    background:white;
    border-radius: 6px;
    padding-bottom:20px;

}
.pages{
    // margin:0 auto;
    width:100%;
    height:50px;
    padding-top:20px;
    // display:table-cell;
    // vertical-align: middle;
}


</style>
