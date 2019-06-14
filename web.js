const $ = require('./jquery-3.4.1.js')
const webview = $('#sq688').get(0)

let songs = [] // save selected songs

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

$('#btn-download').click(async () => {
  download()
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

webview.addEventListener('ipc-message', ({channel, args}) => {
  if (channel === 'songlist') {
    songs = args[0]
    const lis = songs.map((song) => $('<li>').text(song.name))
    $('#songlist')
      .html('')
      .append($('<ul>').append(lis))

    $('#btn-download').text(`Download(${songs.length})`)
  }
})

function download() {
  return new Promise((resolve, reject) => {
    webview.loadURL('https://www.sq688.com/download/15707.html')
  })
}
