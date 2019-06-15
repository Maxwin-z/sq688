const {app, BrowserWindow, BrowserView} = require('electron')

function createWindow() {
  let win = new BrowserWindow({
    width: 1800,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })

  win.loadFile('index.html')

  win.on('close', () => {
    win = null
  })
}

app.on('ready', createWindow)
