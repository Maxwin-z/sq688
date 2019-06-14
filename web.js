const {ipcRenderer} = require('electron')
const $ = require('./jquery-3.4.1.js')
const webview = $('#sq688').get(0)

function setNavigationStatus() {
  console.log('<>', webview.canGoBack(), webview.canGoForward())
  $('#btn-back').attr('disabled', !webview.canGoBack())
  $('#btn-forward').attr('disabled', !webview.canGoForward())
}

$('#btn-devtools').click(() => {
  webview.openDevTools()
})

$('#btn-pan').click(() => {
  webview.loadURL('https://pan.baidu.com')
})

$('#btn-sq688').click(() => {
  webview.loadURL('https://www.sq688.com')
})

$('#btn-back').click(() => {
  webview.goBack()
})

$('#btn-forward').click(() => {
  webview.goForward()
})

$('#btn-songlist').click(function() {
  if ($(this).text() === 'Hidden') {
    $(this).text('Show')
    $('#songlist').hide()
  } else {
    $(this).text('Hidden')
    $('#songlist').show()
  }
})

webview.addEventListener('dom-ready', () => {
  console.log('ready')
})

webview.addEventListener('did-navigate', () => {
  console.log('did-navigate')
  setNavigationStatus()
})

webview.addEventListener('new-window', (e) => {
  webview.loadURL(e.url)
})

ipcRenderer.on('songlist', (event, args) => {
  console.log(event, args)
})
