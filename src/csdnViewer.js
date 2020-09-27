const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname,'.././template/info.json')
let baseUrl = ''
baseUrl =  JSON.parse(fs.readFileSync(filePath,'utf-8')).baseUrl //读取个人主页地址

class Viewer {
    constructor() {
        this.List = []
    }
    getUrl(){
        return new Promise((resolve, reject) => {
            let _this = this
            superagent
                .get(baseUrl)
                .then(res => {
                    const $ = cheerio.load(res.text)
                    let list = $('.article-item-box')
                    list.each(function (){
                        let href = $(this).find('a').attr('href')
                        _this.List.push(href)
                    })
                    /*console.log(_this.List)*/
                    /*resolve(_this.List)*/
                    resolve()
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }
    visit(){
        this.List.forEach(href => {
            /*console.log(href)*/
            superagent
                .get(href)
                .then(() => {
                    console.log('success')
                }).catch((err) => {
                console.log(err)
            })
        })
    }
}

let View = new Viewer()
let timer = 5000 //每五秒访问一次

View.getUrl().then(() => { //方法一
    setInterval(()=>{
        View.visit()
    },timer)
})



/*async function func() {  //方法二
    let res = await View.getUrl()
    View.visit()
}
func()*/
