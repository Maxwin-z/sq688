const $ = require('./jquery-3.4.1.js')
const webview = $('#sq688').get(0)

let songs = [] // save selected songs

function sleep(t) {
  return new Promise((rs) => {
    setTimeout(rs, t)
  })
}

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
  /*
  const pans = []
  for (let i = 0; i < songs.length; ++i) {
    pans.push(await download(songs[i].id))
  }
  console.log('get pans', pans)
  */
  save2pan()
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

function download(id) {
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      reject('timeout')
      doClean()
    }, 100000 * 1000)

    let webview = document.createElement('webview')
    $(webview).css({
      position: 'fixed',
      top: '100px',
      left: 0,
      width: '500px',
      height: '500px',
      border: '1px solid red'
    })
    webview.setAttribute('disablewebsecurity', true)
    webview.setAttribute('preload', './preload_sq_download.js')
    webview.setAttribute('src', `https://www.sq688.com/download/${id}.html`)
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools()
    })
    webview.addEventListener('ipc-message', ({channel, args}) => {
      if (channel === 'pan_info') {
        clearTimeout(timeoutTimer)
        resolve(args[0])
        doClean()
      }
    })
    document.body.appendChild(webview)
    function doClean() {
      document.body.removeChild(webview)
      webview = null
    }
  })
}

function save2pan() {
  const pan = {
    password: 'dj3p',
    url: 'https://pan.baidu.com/s/1dL9wduE6mx3r4h64ucVSSA'
  }
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      reject('timeout')
      doClean()
    }, 100000 * 1000)

    let webview = document.createElement('webview')
    $(webview).css({
      position: 'fixed',
      top: '100px',
      left: 0,
      width: '500px',
      height: '500px',
      border: '1px solid red'
    })
    webview.setAttribute('disablewebsecurity', true)
    webview.setAttribute('preload', './preload_pan.js')
    webview.setAttribute('src', pan.url)
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools()
      webview.executeJavaScript(`getPassword('${pan.password}')`)
    })
    webview.addEventListener('ipc-message', ({channel, args}) => {
      if (channel === 'pan_info') {
        clearTimeout(timeoutTimer)
        resolve(args[0])
      }
    })
    document.body.appendChild(webview)
    function doClean() {
      document.body.removeChild(webview)
      webview = null
    }
  })
}
