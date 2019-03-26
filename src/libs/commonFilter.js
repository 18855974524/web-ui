export default function (arr,query,id) {
  let checkAdult= function (arrItem){
    return arrItem[id].toLocaleLowerCase().indexOf(query.toLocaleLowerCase())>-1
  }
  /*var multip = function(currentValue,index,arr,thisValue) {
    return currentValue.id.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())>-1?currentValue.id.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()):-1
  }*/
  let sort = function (a,b) {
    return a[id].indexOf(query.toLocaleLowerCase())-b[id].indexOf(query.toLocaleLowerCase())
  }
  return arr.filter(checkAdult).sort(sort)
}
