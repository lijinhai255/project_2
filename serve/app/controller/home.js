'use strict';

const Controller = require('egg').Controller;
const request = require('request');
const BaseController = require("./base")
let firstObj = {}
let secondObj = {}
var cheerio = require("cheerio")
class HomeController extends BaseController {
  async index() {
    // console.log("jll12121")
    const { ctx } = this;
    // console.log(this)
    const dataMap = new Map();
    new Promise((resolve, reject) => {
      request('https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference', function (error, response, body) {
        const $ = cheerio.load(body);//  整个body 的前端选择器
        // console.log($("#关键字索引")[0].next.children[2].children[0].children,"12121")
        // 定于方法 用于获取关键词索引
        firstObj = getKeyword($("#关键字索引")[0].next.children[2].children[0].children)
        // 定义方法 用于获取选择 
        secondObj = getSelectorFn($("#选择器")[0], $)
        // 定义方法 用于 获取 概念 

        // $(".article")[0].children.map((item, index) => {
        //   // console.log(item,index);
        //   // if (index >= 7 && index % 2 === 1) {
        //   let SaveData = mapData(item, index)
        //   // console.log(SaveData,"name-name")
        //   resolve(SaveData)

        // })
      });
    }).then((data) => {
      // console.log(data,"data")
    })
    this.success("1212")
  }
  async getDataCss() {
    // // const newData = result.slice(0,100)

    // // console.log(result,"result")
    // let keyValue = result.keys()
    // let finalData = []
    // // console.log(keyValue,"keyValue")
    // let k = 0
    // for (const item of result.entries()) {
    //   // console.log(item,"key")
    //   let obj = {
    //     label: item[0],
    //     name: item[0],
    //     children: item[1],
    //     id: k++
    //   }
    //   finalData.push(obj)
    // }
    // let newData = finalData.splice(5)
    // // console.log(finalData,"finalData-finalData")
    // let obj = {
    //   id: '200000004',
    //   label: 'CSS',
    //   name: "CSS",
    //   children: [...newData]
    // }

    this.success(JSON.stringify(obj))
  }
  async getDataCssMum() {
    // let keyValue = result.keys()
    // let rsult = []
    // // console.log(keyValue,"1121")
    // for (const iterator of keyValue) {
    //   // console.log(iterator,"iterator-rsult")

    //   rsult.push(iterator)
    // }
    // console.log(firstObj,"KeywordsObj-KeywordsObj",secondObj)
    // console.log(rsult,"rsult-rsult")
    let newArr = [firstObj, secondObj]
    this.success(JSON.stringify(newArr))
  }
  async getContentFn() {
    const { ctx } = this
    const _this = this
    console.log(ctx.request.body.url, "ctx-ctx")
    const data = await getContn(ctx)
    console.log(data,"data")
    if (data) {
      this.success(data)
    }
  }
}
async function getContn(ctx) {
  return new Promise((resolve, reject) => {
    request(`https://developer.mozilla.org${ctx.request.body.url}`, function (error, response, body) {
      // console.log(body,"body")
      // console.log(this,"this")
      const $ = cheerio.load(body);
      // console.log($(".article"),"12312")
      const result = parseContent($(".article")[0],$)
      // console.log(result)
      // $(".article")[0].children.map((item,index)=>{//获取article 的子级
      //   // if(index===2){
      //   console.log(item.name,index)
      //   parseContent()


      //   // }
      // })
      resolve(result)
    })
  }).then((data) => {
    // console.log(data,"data-data")

    return data
  })
}
// 定义方法  用于解析 内容
function parseContent(DomArr,$) {
  let content = {
    label: "主要内容",
    children: []
  }
  // console.log(DomArr.children,"DomArr")
  // 先解析 第一个主要内容 div
  DomArr.children&&DomArr.children.map((item, index) => {
    let firstContent = []

    if (index === 0) { //  第一个div 进行处理 
      let obj = {
        label:"主要内容",
        content:""
      }
      // console.log(cheerio.html($('.article div p')))
      obj.content = cheerio.html($('.article'))
      content.children.push(obj)
      // item.children.map((ite, inde) => {
      //   if (ite.name) {
      //     if (inde === 2 && ite.name === "p") { // p 标签
      //       console.log(ite.children, inde)
      //       ite.children.map((it, ind) => {
      //         console.log(it.name,ind)
      //       })




      //     }
      //   }
      // })
    }
  })
  return content
}
// 定义一个方法 用于获取 目录
function getKeyword(DomArr) {
  let obj = {
    label: "关键词索引",
    value: "关键词索引",
    children: []
  }
  let children = []
  // console.log(DomArr,"DomArr")
  DomArr.map((item, index) => {
    // console.log(item,"item")
    let obj = {}
    if (item.name === "ul") {
      let obj = {}
      // console.log(item.prev.children[0].data,"item-item")
      obj.label = item.prev.children[0].data;
      // li 
      let childrenArr = []
      // console.log(item.children, "item",)
      item.children.map((it, id) => {
        let childobj = {}
        // console.log(it.children[0].attribs.href,id)
        childobj.href = it.children[0].attribs.href;
        childobj.label = it.children[0].attribs.href.substring(20);
        childobj.name = it.children[0].attribs.href.substring(20);
        childrenArr.push(childobj)
      })
      // console.log(childrenArr,"obj-obj")
      obj.children = childrenArr
      children.push(obj)
    }
  })
  obj.children = [...children]
  // console.log(obj, "children-children")
  return obj
}
// 定义一个方法用于获取 选择器
function getSelectorFn(DomArr, $) {
  let obj = {
    label: DomArr.attribs.id,
    href: DomArr.children[0].next.attribs.href,
    children: []
  }
  let arr = ["基本选择器", "组合选择器", "伪类", "伪元素"]
  // console.log($("#基本选择器")[0].next.children[0].children,"12121")
  // 获取 基本选择器 内容
  let baseSelect = {
    label: "基本选择",
    children: []
  }
  let children = []
  // console.log($("#基本选择器")[0].next.children[0].children)
  $("#基本选择器")[0].next.children[0].children.map((item, idx) => {
    // console.log(item,idx)
    item.children && item.children.map((it, id) => {
      if (it.name === "a") {
        let childObj = {}
        // console.log(it.next.next.children[0].data,"2")
        childObj.label = it.children[0].data, id
        childObj.href = it.attribs.href
        childObj.code = it.next.next.children[0].data
        children.push(childObj)
      }
    })
  })
  baseSelect.children = [...children]
  // console.log(baseSelect,"baseSelect-baseSelect")
  // 组合选择器
  let composeSelect = {
    label: "组合选择器",
    children: []
  }
  let composeChild = []
  $("#组合选择器")[0].next.children[0].children.map((item, idx) => {
    // console.log(item,idx)
    item.children && item.children.map((it, id) => {
      if (it.name === "a") {
        let childObj = {}
        console.log(it.next.next.children[0].data, "2")
        childObj.label = it.children[0].data, id
        childObj.href = it.attribs.href
        childObj.code = it.next.next.children[0].data
        composeChild.push(childObj)
      }
    })
  })
  composeSelect.children = [...composeChild]
  // 伪类选择器
  let pseudoSelect = {
    label: "伪类",
    children: []
  }
  let pseudoChildren = []
  // console.log( $("#伪类")[0].next.children[0].children,"next.children[0]")
  $("#伪类")[0].next.children[0].children.map((item, idx) => {
    // console.log(item,idx)
    item.children && item.children.map((it, id) => {
      if (it.name === "li") {
        if (it.children[0] && it.children[0].name === "a") {
          let childObj = {}
          // console.log(it.children[0]&&it.children[0].children[0].children[0].data,"it-name")
          childObj.href = it.children[0].attribs.href
          childObj.label = it.children[0].children[0].children[0].data
          // console.log(it.next.next.children[0].data,"2")
          // childObj.label = it.children[0].data,id
          // childObj.href = it.attribs.href
          // childObj.code = it.next.next.children[0].data
          pseudoChildren.push(childObj)
        }
      }
      // if(it.name==="a"){
      //   let childObj = {}
      //   console.log(it.next.next.children[0].data,"2")
      //   childObj.label = it.children[0].data,id
      //   childObj.href = it.attribs.href
      //   childObj.code = it.next.next.children[0].data
      //   pseudoChildren.push(childObj)
      // }
    })
  })
  pseudoSelect.children = [...pseudoChildren]
  // console.log(pseudoSelect,"pseudoSelect-pseudoSelect")
  // 获取 伪元素
  let pseudoElement = {
    label: "伪元素",
    children: []
  }
  let pseudoElementChild = []
  // console.log($("#伪元素")[0].next.children[0].children,"next.children[0]")
  $("#伪元素")[0].next.children[0].children.map((item, index) => {
    // console.log(item.name)
    if (item.name && item.name === "ul") {
      // console.log(item.children,"item.children-item.children")
      item.children.map((it, idx) => {
        // console.log(it.name,idx)
        it.children && it.children.map((ite, id) => {
          let obj = {}
          if (ite.name === "a") {
            // console.log(it.children[0].children[0].children[0].data,id)
            obj.label = it.children[0].children[0].children[0].data, id;
            obj.href = it.children[0].attribs.href;
            obj.code = it.children[1] && it.children[2].attribs.title
            // console.log(it.children[0].attribs.href,id)
            // console.log(it.children[1]&&it.children[2].attribs.title,id)
            pseudoElementChild.push(obj)
          }
          // console.log(ite.,id)
        })
      })
    }
    // if(item)
  })
  pseudoElement.children = [...pseudoElementChild]
  // console.log(pseudoElement,"pseudoElement-pseudoElement")
  obj.children.push(baseSelect)
  obj.children.push(composeSelect)
  obj.children.push(pseudoSelect)
  obj.children.push(pseudoElement)
  return obj
}


async function mapData(parentData, index) {
  // let obj = {
  //   targetname:parentData.children[0].name
  //   children:[]
  // }
  // console.log(parentData.name,"parentData.name-parentData.name")
  // if (parentData.name === "div") {
  //   // console.log(parentData,"parentData-parentData")
  //     mapChildren(parentData.children)
  //     return result
  //   // return parentData.prev && parentData.prev.attribs.id
  // }
  if (parentData.name === "h2" || parentData.name === "h3") {
    // console.log(parentData.children[0].name,"parentData-parentData",parentData.children[0].attribs)
    // console.log("parentData-parentData",parentData.children[0].parent.next.children)
    // parentData.children[0].parent.next.children.map((item,index)=>{
    //   console.log(item,index)
    // })
    // mapChildren(parentData.children)
    // return result
    // return parentData.prev && parentData.prev.attribs.id
  }

}
const result = new Map()
async function mapChildren(item) {
  // console.log(result, "result-result")
  if (item) {
    item.map((it, idx) => {
      // console.log(it)

      if (it.name === "a") {
        let obj = {}
        // console.log(it,1234543)
        // obj.children.push(it.attribs.href)
        if (it.children[0].data) {
          obj.label = it.children[0].data
          obj.name = it.children[0].data
          obj.href = it.attribs.href
          obj.value = it.attribs.href
          obj.id = getNowDate()
          result.set(it.children[0].data, [obj])
        }
        // else {
        //   // console.log(it.attribs.href, it.children[0].data)
        //   obj.href = it.attribs.href;
        //   obj.label = it.attribs.href.substring(20);
        //   obj.name = it.attribs.href.substring(20);
        //   obj.value = it.attribs.href
        //   obj.id = getNowDate()
        //   let firSt = it.attribs.href.substring(20).slice(0,1)
        //   if(result.has(firSt)){
        //     let res = result.get(firSt)
        //     res.push(obj)
        //     // console.log(newMap.get(firSt),"newMap")
        //     result.set(firSt,res)
        //   }else{
        //     result.set(firSt,[obj])
        //   }
        // }
        // result.push(obj)
      }
      // if (it.children) {
      //     mapChildren(it.children)
      // }
    })
  } else {
    // console.log("元素不存在")
  }
  function getNowDate() {
    var myDate = new Date;
    var year = myDate.getFullYear(); //获取当前年
    var mon = myDate.getMonth() + 1; //获取当前月
    var date = myDate.getDate(); //获取当前日
    var hours = myDate.getHours(); //获取当前小时
    var minutes = myDate.getMinutes(); //获取当前分钟
    var seconds = myDate.getSeconds(); //获取当前秒
    var now = `${year}${mon}${date}${hours}${minutes}${seconds}`;
    return now;
  }
}
module.exports = HomeController;
