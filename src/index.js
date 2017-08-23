let colors = require('./color'),
  readline = require('readline'),
  http = require('http')

const API_KEY = "12780783456d4c4580e4024167a47f6d",
  RESPONSE_TYPE = {
    TEXT: 100000,
    LINK: 200000,
    NEWS: 302000,
    COOKBOOK: 308000
  }

function initChat() {
  let welcomeMessage = '请开始你的表演'
  Array.prototype.forEach.call(welcomeMessage, (item) => {
    colors.colorLog('--------', item, '--------')
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let name = ''

  rl.question('> 阁下尊姓大名? ', (answer) => {
    console.log(`用户的输入： ${answer}`);
    name = answer
    colors.colorLog('开始你的提问！')
    chat()
  })

  function chat() {
    rl.question('>请输入你的问题：', (query) => {
      if (!query) {
        colors.colorLog('阁下请慢走')
        process.exit(0)
      }
      let req = http.request({
        hostname: 'www.tuling123.com',
        path: '/openapi/api',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          colors.colorLog(handleRequest(data))
          chat()
        })
      })

      req.write(JSON.stringify({
        "key": API_KEY,
        "info": query,
        "userid": name
      }))

      req.end()

    })
  }

  function handleRequest(data) {
    let res = JSON.parse(data)
    switch (res.code) {
      case RESPONSE_TYPE.TEXT:
        return res.text
      case RESPONSE_TYPE.LINK:
        return `${res.text}:${res.url}`
        // case RESPONSE_TYPE.NEWS:
        //   let listInfo = ''
        //     (res.list || []).forEach((item) => {
        //       listInfo += `\n文章：${item.article}\n来源：${item.source}\n链接：${item.detailurl}`
        //     })
        //   return `${res.text}\n${listInfo}`
      default:
        return res.text
    }
  }
}

module.exports = initChat