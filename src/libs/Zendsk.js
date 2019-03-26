let axios = require('axios')
class Zendsk{
  constructor() {
    //super();
    this.lang='';
    this.categories='';
    this.sections='';
    this.artices=''
  }
  updateLang(lang){
    this.lang=lang=='cn'?'zh-cn':'en-us';
    this.setCategories();
  }
  setCategories(){
    this.categories=`https://azexio.zendesk.com/api/v2/help_center/${this.lang}/categories`
  }
  setSections(id){
    this.sections=`https://azexio.zendesk.com/api/v2/help_center/${this.lang}/categories/${id}/sections.json`
  }
  setArtices(id){
    this.artices=`https://azexio.zendesk.com/api/v2/help_center/${this.lang}/sections/${id}/articles.json?sort_by=updated_at&sort_order=desc&per_page=3`
  }
  getData(){
    return new Promise((resolve,reject)=>{
      axios.get(this.categories).then(res=>{
       //console.log(res.data.categories[0].id)
        this.setSections(res.data.categories[0].id)
        axios.get(this.sections).then(res=>{
          let temp=res.data.sections[0].id
          this.setArtices(temp)
          axios.get(this.artices).then(res=>{
            res.data.moreId=temp
            resolve(res)
          }).catch(err=>{
            console.log(err)
          })
        })
      })
    })
  }
}
export default Zendsk
