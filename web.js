const $ = require('./jquery-3.4.1.js')
const webview = $('#sq688').get(0)
$('#btn-pan').click(() => {
  webview.loadURL('https://pan.baidu.com')
})

$('#btn-sq688').click(() => {
  webview.loadURL('https://www.sq688.com')
})
